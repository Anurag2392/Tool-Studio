/**
 * Web Worker Task Dispatcher and Thread Pool Manager
 * Offloads CPU-bound PDF operations and Malware Scans to background worker threads.
 */

type PendingResolver = {
  resolve: (data: any) => void;
  reject: (err: Error) => void;
};

class WorkerPoolManager {
  private worker: Worker | null = null;
  private pendingTasks = new Map<string, PendingResolver>();
  private taskIdCounter = 0;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      if (typeof window !== 'undefined' && window.Worker) {
        this.worker = new Worker(
          new URL('../workers/pdfWorker.ts', import.meta.url),
          { type: 'module' }
        );

        this.worker.onmessage = (e: MessageEvent) => {
          const { id, success, result, error } = e.data;
          const pending = this.pendingTasks.get(id);
          if (pending) {
            this.pendingTasks.delete(id);
            if (success) {
              pending.resolve(result);
            } else {
              pending.reject(new Error(error || 'Worker task failed'));
            }
          }
        };

        this.worker.onerror = () => {
          // Quiet worker error handling
        };
      }
    } catch (e) {
      this.worker = null;
    }
  }

  public runTask<T>(type: string, payload: any, transferables?: Transferable[]): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Worker not available'));
        return;
      }

      const id = `task_${++this.taskIdCounter}_${Date.now()}`;
      this.pendingTasks.set(id, { resolve, reject });

      try {
        if (transferables && transferables.length > 0) {
          this.worker.postMessage({ id, type, payload }, transferables);
        } else {
          this.worker.postMessage({ id, type, payload });
        }
      } catch (err: any) {
        this.pendingTasks.delete(id);
        reject(err);
      }
    });
  }

  public isAvailable(): boolean {
    return this.worker !== null;
  }
}

export const workerPool = new WorkerPoolManager();
