export type ToolId = 
  | 'merge'
  | 'split'
  | 'compress'
  | 'edit'
  | 'ai-summarize'
  | 'protect'
  | 'unlock'
  | 'rotate'
  | 'watermark'
  | 'page-numbers'
  | 'organize'
  | 'sign'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'ocr'
  | 'crop'
  | 'flatten'
  | 'grayscale'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'excel-to-pdf'
  | 'ppt-to-pdf'
  | 'html-to-pdf'
  | 'pdf-to-excel'
  | 'pdf-to-ppt'
  | 'pdf-to-pdfa'
  | 'metadata'
  | 'youtube-keywords'
  | 'alt-text-writer'
  | 'extract-images'
  | 'bates-numbering'
  | 'n-up'
  | 'deskew'
  | 'repair'
  | 'redact'
  | 'compare'
  | 'pdf-to-zip'
  | 'scan-to-pdf'
  | 'resize-pdf'
  | 'blank-pages'
  | 'forms'
  | 'alternate-mix'
  | 'image-compressor-kb'
  | 'image-resizer'
  | 'image-cropper'
  | 'increase-image-size'
  | 'remove-bg-transparent'
  | 'image-converter'
  | 'dpi-enhancer'
  | 'blur-pixelate-image'
  | 'calculators'
  | 'calculator-emi'
  | 'calculator-sip'
  | 'calculator-income-tax'
  | 'calculator-gst'
  | 'calculator-age'
  | 'calculator-percentage'
  | 'calculator-bmi'
  | 'calculator-home-loan'
  | 'calculator-fd'
  | 'calculator-salary'
  | 'calculator-ppf'
  | 'calculator-compound-interest'
  | 'calculator-epf'
  | 'calculator-gratuity'
  | 'calculator-nps'
  | 'calculator-hra'
  | 'calculator-cagr'
  | 'calculator-ctc-inhand'
  | 'calculator-unit-converter'
  | 'calculator-word-counter'
  | 'calculator-lumpsum'
  | 'calculator-swp'
  | 'calculator-rd'
  | 'calculator-loan'
  | 'calculator-car-loan'
  | 'calculator-personal-loan'
  | 'calculator-retirement'
  | 'calculator-inflation'
  | 'calculator-roi'
  | 'calculator-tds'
  | 'calculator-loan-eligibility'
  | 'calculator-calorie'
  | 'calculator-bmr'
  | 'calculator-cgpa'
  | 'calculator-currency'
  | 'calculator-doc-page-spine'
  | 'calculator-pdf-size'
  | 'calculator-dpi-print'
  | 'calculator-reading-time'
  | 'calculator-font-px-rem'
  | 'calculator-char-byte-size'
  | 'calculator-pdf-grid'
  | 'calculator-book-royalty'
  | 'calculator-image-ram'
  | 'calculator-text-readability'
  | 'calculator-paper-weight'
  | 'calculator-margin-trim'
  | 'calculator-doc-scan-time'
  | 'calculator-ocr-time'
  | 'calculator-ebook-size';

export type ToolCategory = 'all' | 'popular' | 'edit-convert' | 'organize-split' | 'security' | 'other-scans' | 'ai-tools' | 'calculators';

export interface PdfToolMeta {
  id: ToolId;
  name: string;
  shortDesc: string;
  longDesc: string;
  category: ToolCategory;
  iconName: string;
  isPopular?: boolean;
  isAi?: boolean;
  isNew?: boolean;
  badge?: string;
  seoTitle: string;
  seoKeywords: string[];
  faq: { question: string; answer: string }[];
  steps: string[];
}

export interface VirusScanResult {
  isClean: boolean;
  threatLevel: 'clean' | 'low' | 'high' | 'critical';
  details: string;
  virusName?: string;
  magicHeader: string;
  scannedAt: string;
  signaturesChecked: number;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  arrayBuffer: ArrayBuffer;
  pageCount?: number;
  previewUrl?: string;
  virusScan?: VirusScanResult;
}

export type BatchItemStatus = 'queued' | 'scanning' | 'processing' | 'completed' | 'failed';

export interface BatchItemState {
  id: string;
  fileItem: UploadedFileItem;
  status: BatchItemStatus;
  progressPercent: number; // 0 to 100
  resultBuffer?: ArrayBuffer;
  resultName?: string;
  resultBlobUrl?: string;
  errorMessage?: string;
  processedSizeBytes?: number;
  processingTimeMs?: number;
}

export interface PdfPageInfo {
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270
  selected?: boolean;
  thumbnailUrl?: string;
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
  rotationAngle: number;
}

export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center';
  startPage: number;
  format: 'number' | 'page_of_total' | 'custom';
  prefix: string;
  fontSize: number;
  color: string;
}

export interface AnnotationItem {
  id: string;
  type: 'text' | 'draw' | 'shape' | 'signature' | 'highlight';
  pageIndex: number;
  x: number;
  y: number;
  text?: string;
  fontSize?: number;
  color?: string;
  path?: { x: number; y: number }[]; // For freehand drawing
  width?: number;
  height?: number;
  imageDataUrl?: string;
}

export interface UserPlan {
  isPro: boolean;
  planName: 'Free' | '1 Day Pro Pass' | 'Pro Monthly' | 'Pro Annual';
  dailyLimitUsed: number;
  dailyLimitMax: number;
  proExpiryDate?: number;
}

export interface AdConfig {
  enabled: boolean;
  publisherId: string;
  headerSlot: string;
  sidebarSlot: string;
  inFeedSlot: string;
  simulatedImpressions: number;
  simulatedClicks: number;
  simulatedEarningsUsd: number;
}

export interface SeoMetaData {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  schemaJsonLd: object;
}
