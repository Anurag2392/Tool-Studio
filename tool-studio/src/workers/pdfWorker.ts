import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { scanFileForViruses } from '../lib/virusScanner';

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent) => {
  const { id, type, payload } = e.data;

  try {
    if (type === 'SCAN_VIRUS') {
      const { buffer, fileName, mimeType } = payload;
      const result = await scanFileForViruses(buffer, fileName, mimeType);
      ctx.postMessage({ id, success: true, result });
    } else if (type === 'GET_PAGE_COUNT') {
      const { buffer } = payload;
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();
      ctx.postMessage({ id, success: true, result: pageCount });
    } else if (type === 'MERGE_PDFS') {
      const { buffers } = payload;
      const mergedPdf = await PDFDocument.create();
      for (const buf of buffers) {
        const srcDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const savedBytes = await mergedPdf.save();
      const resBuffer = savedBytes.buffer;
      ctx.postMessage({ id, success: true, result: resBuffer }, [resBuffer as ArrayBuffer]);
    } else if (type === 'ROTATE_PAGES') {
      const { buffer, rotationMap } = payload;
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      pages.forEach((page, idx) => {
        const rot = rotationMap[idx] || 0;
        if (rot !== 0) {
          const currentRot = page.getRotation().angle;
          page.setRotation(degrees((currentRot + rot) % 360));
        }
      });
      const savedBytes = await pdfDoc.save();
      const resBuffer = savedBytes.buffer;
      ctx.postMessage({ id, success: true, result: resBuffer }, [resBuffer as ArrayBuffer]);
    } else if (type === 'WATERMARK_PDF') {
      const { buffer, options } = payload;
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
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
      const savedBytes = await pdfDoc.save();
      const resBuffer = savedBytes.buffer;
      ctx.postMessage({ id, success: true, result: resBuffer }, [resBuffer as ArrayBuffer]);
    } else {
      throw new Error(`Unsupported task: ${type}`);
    }
  } catch (err: any) {
    ctx.postMessage({ id, success: false, error: err?.message || 'Worker processing error' });
  }
};
