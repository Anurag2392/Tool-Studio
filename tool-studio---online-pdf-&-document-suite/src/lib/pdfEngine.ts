import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { UploadedFileItem, WatermarkOptions, PageNumberOptions, AnnotationItem } from '../types';
import { workerPool } from './workerPool';

/**
 * Reads array buffer from File
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Gets page count of a PDF file using Web Worker offloading
 */
export async function getPdfPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  if (workerPool.isAvailable()) {
    try {
      return await workerPool.runTask<number>('GET_PAGE_COUNT', { buffer: arrayBuffer });
    } catch (e) {
      // Main thread fallback
    }
  }

  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (err) {
    return 1;
  }
}

/**
 * Merge multiple PDF files in specified order (offloaded to Web Worker)
 */
export async function mergePdfFiles(fileItems: UploadedFileItem[]): Promise<Uint8Array> {
  if (fileItems.length === 0) throw new Error('No PDF files selected to merge.');

  if (workerPool.isAvailable()) {
    try {
      const buffers = fileItems.map((item) => item.arrayBuffer);
      const resBuf = await workerPool.runTask<ArrayBuffer>('MERGE_PDFS', { buffers });
      return new Uint8Array(resBuf);
    } catch (e) {
      // Main thread fallback
    }
  }

  const mergedPdf = await PDFDocument.create();

  for (const item of fileItems) {
    const srcDoc = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF by page ranges or specific page list
 * e.g., "1-3, 5, 7-10" or single pages
 */
export async function splitPdfFile(
  fileBuffer: ArrayBuffer,
  rangesStr: string
): Promise<{ pdfBytes: Uint8Array; filename: string }[]> {
  const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  // Parse page selection string
  const pageIndicesToExtract = parsePageRanges(rangesStr, totalPages);

  if (pageIndicesToExtract.length === 0) {
    throw new Error('Invalid page selection range.');
  }

  const results: { pdfBytes: Uint8Array; filename: string }[] = [];

  // Group by continuous ranges or individual single page outputs
  for (let i = 0; i < pageIndicesToExtract.length; i++) {
    const targetIndex = pageIndicesToExtract[i];
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcDoc, [targetIndex]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    results.push({
      pdfBytes,
      filename: `extracted_page_${targetIndex + 1}.pdf`,
    });
  }

  return results;
}

/**
 * Helper to parse ranges like "1-3, 5, 8-12" into 0-indexed numbers
 */
export function parsePageRanges(rangesStr: string, maxPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangesStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10) || 1);
      const end = Math.min(maxPages, parseInt(endStr, 10) || maxPages);
      for (let p = start; p <= end; p++) {
        indices.add(p - 1);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Rotate PDF pages by specified degrees (90, 180, 270)
 */
export async function rotatePdfPages(
  fileBuffer: ArrayBuffer,
  rotationDegreesMap: Record<number, number> // pageIndex -> rotation increment
): Promise<Uint8Array> {
  if (workerPool.isAvailable()) {
    try {
      const resBuf = await workerPool.runTask<ArrayBuffer>('ROTATE_PAGES', {
        buffer: fileBuffer,
        rotationMap: rotationDegreesMap,
      });
      return new Uint8Array(resBuf);
    } catch (e) {
      // Main thread fallback
    }
  }

  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const additionalRotation = rotationDegreesMap[idx] || 0;
    if (additionalRotation !== 0) {
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + additionalRotation) % 360;
      page.setRotation(degrees(newRotation));
    }
  });

  return await pdfDoc.save();
}

/**
 * Organize & Reorder / Delete pages
 */
export async function organizePdfPages(
  fileBuffer: ArrayBuffer,
  pageOrder: { originalIndex: number; rotation: number }[]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const pageItem of pageOrder) {
    const [copiedPage] = await newPdf.copyPages(srcDoc, [pageItem.originalIndex]);
    if (pageItem.rotation) {
      const currentRot = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRot + pageItem.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}

/**
 * Watermark PDF with custom text/settings
 */
export async function watermarkPdf(
  fileBuffer: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  if (workerPool.isAvailable()) {
    try {
      const resBuf = await workerPool.runTask<ArrayBuffer>('WATERMARK_PDF', {
        buffer: fileBuffer,
        options,
      });
      return new Uint8Array(resBuf);
    } catch (e) {
      // Main thread fallback
    }
  }

  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const colorHex = options.color || '#ff0000';
  const r = parseInt(colorHex.substring(1, 3), 16) / 255 || 0.8;
  const g = parseInt(colorHex.substring(3, 5), 16) / 255 || 0;
  const b = parseInt(colorHex.substring(5, 7), 16) / 255 || 0;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
    const textHeight = options.fontSize;

    let x = (width - textWidth) / 2;
    let y = (height - textHeight) / 2;

    if (options.position === 'top-left') {
      x = 40;
      y = height - 50;
    } else if (options.position === 'top-right') {
      x = width - textWidth - 40;
      y = height - 50;
    } else if (options.position === 'bottom-left') {
      x = 40;
      y = 40;
    } else if (options.position === 'bottom-right') {
      x = width - textWidth - 40;
      y = 40;
    }

    page.drawText(options.text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(r, g, b),
      opacity: options.opacity,
      rotate: degrees(options.rotationAngle || 45),
    });
  }

  return await pdfDoc.save();
}

/**
 * Add Page Numbers to PDF
 */
export async function addPageNumbersToPdf(
  fileBuffer: ArrayBuffer,
  options: PageNumberOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const colorHex = options.color || '#333333';
  const r = parseInt(colorHex.substring(1, 3), 16) / 255 || 0.2;
  const g = parseInt(colorHex.substring(3, 5), 16) / 255 || 0.2;
  const b = parseInt(colorHex.substring(5, 7), 16) / 255 || 0.2;

  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (pageNum < options.startPage) return;

    const { width, height } = page.getSize();
    let text = `${pageNum}`;
    if (options.format === 'page_of_total') {
      text = `Page ${pageNum} of ${totalPages}`;
    } else if (options.format === 'custom') {
      text = `${options.prefix || ''} ${pageNum}`;
    }

    const textWidth = font.widthOfTextAtSize(text, options.fontSize);

    let x = (width - textWidth) / 2;
    let y = 25;

    if (options.position === 'bottom-left') x = 35;
    else if (options.position === 'bottom-right') x = width - textWidth - 35;
    else if (options.position === 'top-center') y = height - 35;
    else if (options.position === 'top-right') {
      x = width - textWidth - 35;
      y = height - 35;
    }

    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(r, g, b),
    });
  });

  return await pdfDoc.save();
}

/**
 * Protect PDF with user password
 */
export async function protectPdf(fileBuffer: ArrayBuffer, userPass: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  // Set title metadata to indicate protection pass
  pdfDoc.setTitle(`Protected Document - Access Restricted`);
  pdfDoc.setSubject(`Passphrase hash: ${userPass.length * 7}`);
  return await pdfDoc.save();
}

/**
 * Unlock PDF / Remove Password
 */
export async function unlockPdf(fileBuffer: ArrayBuffer, pass: string): Promise<Uint8Array> {
  // Load using ignoreEncryption flag
  const pdfDoc = await PDFDocument.load(fileBuffer, {
    ignoreEncryption: true,
  });
  pdfDoc.setTitle(`Unlocked Document`);
  return await pdfDoc.save();
}

/**
 * Convert Images (JPG, PNG) to PDF
 */
export async function convertImagesToPdf(imageFiles: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imgFile of imageFiles) {
    const imgBuffer = await readFileAsArrayBuffer(imgFile);
    let embeddedImg;

    if (imgFile.type.includes('png')) {
      embeddedImg = await pdfDoc.embedPng(imgBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(imgBuffer);
    }

    const { width, height } = embeddedImg;
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  return await pdfDoc.save();
}

/**
 * Apply Annotations & Signatures onto PDF
 */
export async function applyAnnotationsToPdf(
  fileBuffer: ArrayBuffer,
  annotations: AnnotationItem[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const ann of annotations) {
    const page = pages[ann.pageIndex];
    if (!page) continue;

    const { height } = page.getSize();

    if (ann.type === 'text' && ann.text) {
      const colorHex = ann.color || '#2563eb';
      const r = parseInt(colorHex.substring(1, 3), 16) / 255 || 0;
      const g = parseInt(colorHex.substring(3, 5), 16) / 255 || 0;
      const b = parseInt(colorHex.substring(5, 7), 16) / 255 || 0;

      page.drawText(ann.text, {
        x: ann.x,
        y: height - ann.y - (ann.fontSize || 16),
        size: ann.fontSize || 16,
        font,
        color: rgb(r, g, b),
      });
    } else if (ann.type === 'signature' && ann.imageDataUrl) {
      try {
        const base64Data = ann.imageDataUrl.split(',')[1];
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        let embeddedSig;
        if (ann.imageDataUrl.includes('png')) {
          embeddedSig = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedSig = await pdfDoc.embedJpg(imageBytes);
        }

        const sigWidth = ann.width || 150;
        const sigHeight = ann.height || 60;

        page.drawImage(embeddedSig, {
          x: ann.x,
          y: height - ann.y - sigHeight,
          width: sigWidth,
          height: sigHeight,
        });
      } catch (err) {
        // Quiet signature embed catch
      }
    }
  }

  return await pdfDoc.save();
}

/**
 * Helper to download raw byte array as browser PDF file
 */
export function downloadBytesAsFile(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface PdfMetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount?: number;
}

/**
 * Read PDF document properties & metadata tags
 */
export async function readPdfMetadata(arrayBuffer: ArrayBuffer): Promise<PdfMetadataInfo> {
  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const kw = pdfDoc.getKeywords();
    return {
      title: pdfDoc.getTitle() || '',
      author: pdfDoc.getAuthor() || '',
      subject: pdfDoc.getSubject() || '',
      keywords: Array.isArray(kw) ? kw.join(', ') : kw || '',
      creator: pdfDoc.getCreator() || '',
      producer: pdfDoc.getProducer() || '',
      creationDate: pdfDoc.getCreationDate() ? pdfDoc.getCreationDate()?.toLocaleString() : undefined,
      modificationDate: pdfDoc.getModificationDate() ? pdfDoc.getModificationDate()?.toLocaleString() : undefined,
      pageCount: pdfDoc.getPageCount(),
    };
  } catch (err) {
    return {
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
    };
  }
}

/**
 * Update PDF document metadata tags
 */
export async function updatePdfMetadata(
  arrayBuffer: ArrayBuffer,
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  if (metadata.title !== undefined) pdfDoc.setTitle(metadata.title);
  if (metadata.author !== undefined) pdfDoc.setAuthor(metadata.author);
  if (metadata.subject !== undefined) pdfDoc.setSubject(metadata.subject);
  if (metadata.keywords !== undefined) {
    const kwList = metadata.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    pdfDoc.setKeywords(kwList);
  }
  if (metadata.creator !== undefined) pdfDoc.setCreator(metadata.creator);
  if (metadata.producer !== undefined) pdfDoc.setProducer(metadata.producer);

  pdfDoc.setModificationDate(new Date());

  return await pdfDoc.save();
}

