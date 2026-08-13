import JSZip from 'jszip';
import { BatchItemState, UploadedFileItem } from '../types';

export interface ProcessTaskOptions {
  concurrency?: number;
  onUpdate?: (items: BatchItemState[], globalPercent: number) => void;
  processSingleItem: (
    item: UploadedFileItem,
    onItemProgress: (pct: number) => void
  ) => Promise<{ resultBuffer: ArrayBuffer; resultName: string }>;
}

export class BatchProcessorQueue {
  private items: BatchItemState[] = [];
  private concurrency: number;
  private onUpdate?: (items: BatchItemState[], globalPercent: number) => void;
  private processSingleItem: (
    item: UploadedFileItem,
    onItemProgress: (pct: number) => void
  ) => Promise<{ resultBuffer: ArrayBuffer; resultName: string }>;
  private isRunning = false;
  private isPaused = false;

  constructor(fileItems: UploadedFileItem[], options: ProcessTaskOptions) {
    this.concurrency = options.concurrency || 3;
    this.onUpdate = options.onUpdate;
    this.processSingleItem = options.processSingleItem;

    this.items = fileItems.map((fileItem) => ({
      id: fileItem.id,
      fileItem,
      status: 'queued',
      progressPercent: 0,
    }));
  }

  public getItems(): BatchItemState[] {
    return this.items;
  }

  public notifyUpdate() {
    if (!this.onUpdate) return;
    const total = this.items.length;
    if (total === 0) {
      this.onUpdate([], 100);
      return;
    }

    const totalProgress = this.items.reduce((acc, curr) => acc + curr.progressPercent, 0);
    const globalPercent = Math.round(totalProgress / total);
    this.onUpdate([...this.items], globalPercent);
  }

  public async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;

    this.notifyUpdate();

    // Create a pool of workers up to concurrency
    const workers = Array.from({ length: this.concurrency }, () => this.workerLoop());
    await Promise.all(workers);

    this.isRunning = false;
    this.notifyUpdate();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.start();
    }
  }

  private async workerLoop() {
    while (this.isRunning && !this.isPaused) {
      const nextItem = this.items.find((i) => i.status === 'queued');
      if (!nextItem) break;

      nextItem.status = 'processing';
      nextItem.progressPercent = 10;
      this.notifyUpdate();

      const startTime = performance.now();

      try {
        const result = await this.processSingleItem(nextItem.fileItem, (itemProgress) => {
          nextItem.progressPercent = Math.min(95, Math.max(10, itemProgress));
          this.notifyUpdate();
        });

        const blob = new Blob([result.resultBuffer]);
        const blobUrl = URL.createObjectURL(blob);

        nextItem.status = 'completed';
        nextItem.progressPercent = 100;
        nextItem.resultBuffer = result.resultBuffer;
        nextItem.resultName = result.resultName;
        nextItem.resultBlobUrl = blobUrl;
        nextItem.processedSizeBytes = result.resultBuffer.byteLength;
        nextItem.processingTimeMs = Math.round(performance.now() - startTime);
      } catch (err: any) {
        nextItem.status = 'failed';
        nextItem.progressPercent = 0;
        nextItem.errorMessage = err?.message || 'Processing failed';
      }

      this.notifyUpdate();
    }
  }
}

/**
 * Packaging multiple processed files into a compressed ZIP file download
 */
export async function downloadBatchZip(
  items: BatchItemState[],
  zipFileName = 'Tool_Studio_Batch_Processed.zip'
): Promise<void> {
  const completedItems = items.filter((i) => i.status === 'completed' && i.resultBuffer && i.resultName);
  if (completedItems.length === 0) return;

  const zip = new JSZip();

  // Deduplicate file names if any duplicates exist in batch
  const nameMap = new Map<string, number>();

  completedItems.forEach((item) => {
    let name = item.resultName || `processed-${item.fileItem.name}`;
    if (nameMap.has(name)) {
      const count = nameMap.get(name)! + 1;
      nameMap.set(name, count);
      const extIdx = name.lastIndexOf('.');
      if (extIdx !== -1) {
        name = `${name.substring(0, extIdx)}_(${count})${name.substring(extIdx)}`;
      } else {
        name = `${name}_(${count})`;
      }
    } else {
      nameMap.set(name, 1);
    }

    zip.file(name, item.resultBuffer!);
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
