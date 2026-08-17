import React, { useState } from 'react';
import {
  ScanText,
  FileText,
  ArrowLeft,
  Copy,
  Check,
  Download,
  Sparkles,
  Search,
  RefreshCw,
  FileCode,
  Table,
  Layers,
  Globe,
  Settings2,
  FileSpreadsheet,
  Zap,
  Info
} from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';

interface OcrToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

type OcrPreset = 'structured-markdown' | 'full-text' | 'form-json' | 'ocr-cleanup';

export const OcrTool: React.FC<OcrToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [preset, setPreset] = useState<OcrPreset>('structured-markdown');
  const [language, setLanguage] = useState<string>('Auto-Detect');
  const [engine, setEngine] = useState<'fast' | 'precision' | 'deep'>('precision');
  const [extractTables, setExtractTables] = useState<boolean>(true);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'preview'>('formatted');
  const [processTime, setProcessTime] = useState<number | null>(null);

  const selectedFile = files[0];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRunOcr = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setOcrResult(null);
    const startTime = Date.now();

    try {
      const base64Data = await convertFileToBase64(selectedFile.file);
      const mimeType = selectedFile.file.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png');

      const response = await fetch('/api/gemini/vision-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: mimeType,
          filename: selectedFile.name,
          preset: preset,
          language: language,
          engine: engine,
          extractTables: extractTables,
          customPrompt: customPrompt,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setOcrResult(data.result || 'No text detected in document.');
      setProcessTime(Math.round((Date.now() - startTime) / 100) / 10);

      if (onSuccessAction) {
        onSuccessAction();
      }
    } catch (err: any) {
      alert('AI Vision OCR Error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!ocrResult) return;
    navigator.clipboard.writeText(ocrResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!ocrResult) return;
    const element = document.createElement('a');
    const file = new Blob([ocrResult], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}_ocr_extracted.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadMd = () => {
    if (!ocrResult) return;
    const element = document.createElement('a');
    const file = new Blob([ocrResult], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}_ocr_extracted.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = async () => {
    if (!ocrResult) return;
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const fontSize = 11;
      const margin = 50;
      let y = height - margin;

      // Header
      page.drawText(`OCR Extracted Document - ${selectedFile?.name || 'Document'}`, {
        x: margin,
        y: y,
        size: 14,
        font: font,
        color: rgb(0.1, 0.1, 0.2),
      });

      y -= 25;
      page.drawLine({
        start: { x: margin, y: y },
        end: { x: width - margin, y: y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });

      y -= 20;

      // Wrap lines
      const cleanText = ocrResult.replace(/```markdown|```json|```/g, '');
      const lines = cleanText.split('\n');

      let currentPage = page;

      for (const line of lines) {
        if (y < margin + 20) {
          currentPage = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }

        // Simple text chunking
        const truncatedLine = line.substring(0, 85);
        currentPage.drawText(truncatedLine, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });

        y -= 16;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${selectedFile?.name.replace(/\.[^/.]+$/, '')}_clean_text.pdf`;
      link.click();
    } catch (e: any) {
      alert('Error generating PDF download: ' + e.message);
    }
  };

  const wordCount = ocrResult ? ocrResult.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = ocrResult ? ocrResult.length : 0;
  const lineCount = ocrResult ? ocrResult.split('\n').length : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to All Tools
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <ScanText size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm">AI Vision OCR Text Extractor</h2>
            <p className="text-[10px] text-slate-500">Extract editable text & tables from scanned PDFs</p>
          </div>
        </div>

        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
          <Sparkles size={12} /> High-Precision Vision Engine
        </span>
      </div>

      {/* Main Upload or Result Interface */}
      {!ocrResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Upload Zone */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-purple-600" /> Upload Scanned Document or Image
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">PDF, PNG, JPG, WEBP</span>
              </div>

              <DragDropZone
                files={files}
                onFilesChange={(newFiles) => setFiles(newFiles)}
                acceptedTypes={['application/pdf', 'image/png', 'image/jpeg', 'image/webp']}
                maxFiles={1}
                label="Drop scanned PDF document or image here"
              />

              {selectedFile && (
                <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 truncate max-w-[220px] sm:max-w-[300px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {(selectedFile.sizeBytes / (1024 * 1024)).toFixed(2)} MB • Ready for Vision OCR
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* How AI Vision OCR Works */}
            <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Zap size={16} /> How AI Vision OCR Works
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike basic legacy OCR engines, our AI Vision Engine inspects the full visual layout of scanned PDFs. It preserves heading hierarchies, complex multi-column table structures, lists, and low-contrast handwritten notes with unmatched accuracy.
              </p>
            </div>
          </div>

          {/* OCR Configuration Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Settings2 size={16} className="text-purple-600" /> OCR Engine Options
              </h3>

              {/* Active Engine Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Active Processing Engine</label>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEngine('fast')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      engine === 'fast'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Fast Neural Engine</div>
                      <div className="text-[10px] text-slate-500">Quick text extraction for clean documents</div>
                    </div>
                    {engine === 'fast' && <Check size={14} className="text-purple-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEngine('precision')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      engine === 'precision'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">High-Precision Engine</div>
                      <div className="text-[10px] text-slate-500">Preserves tables, columns & formatting</div>
                    </div>
                    {engine === 'precision' && <Check size={14} className="text-purple-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEngine('deep')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      engine === 'deep'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">Deep Analysis Engine</div>
                      <div className="text-[10px] text-slate-500">For low contrast, handwriting & scanned forms</div>
                    </div>
                    {engine === 'deep' && <Check size={14} className="text-purple-600" />}
                  </button>
                </div>
              </div>

              {/* Extraction Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Extraction Preset Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreset('structured-markdown')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      preset === 'structured-markdown'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs flex items-center gap-1.5 font-bold">
                      <Table size={14} className="text-purple-600 shrink-0" /> Markdown
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Tables & Headings</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreset('full-text')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      preset === 'full-text'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs flex items-center gap-1.5 font-bold">
                      <FileText size={14} className="text-purple-600 shrink-0" /> Plain Text
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Clean Reading Flow</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreset('form-json')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      preset === 'form-json'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs flex items-center gap-1.5 font-bold">
                      <FileCode size={14} className="text-purple-600 shrink-0" /> Form JSON
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Key-Value & Fields</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreset('ocr-cleanup')}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      preset === 'ocr-cleanup'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs flex items-center gap-1.5 font-bold">
                      <Layers size={14} className="text-purple-600 shrink-0" /> Deep & Notes
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Stamps & Handwriting</p>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe size={14} className="text-purple-600" /> Document Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="Auto-Detect">Auto-Detect Multi-Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Chinese">Chinese (Simplified / Traditional)</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>

              {/* Table extraction checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="extractTables"
                  checked={extractTables}
                  onChange={(e) => setExtractTables(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="extractTables" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Reconstruct and align tables automatically
                </label>
              </div>

              {/* Custom Prompt Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Custom Extraction Instructions</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Extract invoice numbers and total dollar amounts, or transcribe hand-written signature notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
                />
              </div>

              {/* Submit OCR Button */}
              <button
                onClick={handleRunOcr}
                disabled={!selectedFile || isProcessing}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  !selectedFile || isProcessing
                    ? 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20 active:scale-[0.99]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing Gemini Vision OCR...</span>
                  </>
                ) : (
                  <>
                    <ScanText size={16} />
                    <span>Run Gemini Vision OCR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* OCR Result Output View */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Result Banner & Actions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  <Check size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    OCR Text Extracted Successfully
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span>📄 {selectedFile?.name}</span>
                    <span>• {wordCount} Words</span>
                    <span>• {charCount} Chars</span>
                    {processTime && <span>• Processed in {processTime}s</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setOcrResult(null);
                    setFiles([]);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw size={14} /> New Document
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-purple-200"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>

                <button
                  onClick={handleDownloadMd}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Download .MD
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Download .TXT
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>

            {/* View Tabs & Search Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => setActiveTab('formatted')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'formatted'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Formatted Reading View
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'raw'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Raw Text Code
                </button>
              </div>

              {/* Search in OCR result */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in extracted text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Main Extracted Text Display */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm min-h-[400px]">
            {activeTab === 'formatted' ? (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 font-sans text-slate-800">
                {ocrResult.split('\n\n').map((paragraph, idx) => {
                  if (searchQuery && !paragraph.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }
                  return (
                    <div key={idx} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                      {paragraph.startsWith('#') ? (
                        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-1">
                          {paragraph.replace(/^#+\s*/, '')}
                        </h3>
                      ) : paragraph.startsWith('|') ? (
                        <pre className="bg-slate-900 text-emerald-400 p-3 rounded-2xl overflow-x-auto font-mono text-[11px] leading-snug">
                          {paragraph}
                        </pre>
                      ) : (
                        <p className="whitespace-pre-wrap">{paragraph}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <pre className="bg-slate-900 text-purple-300 p-5 rounded-2xl overflow-x-auto font-mono text-xs leading-relaxed border border-slate-800 select-all">
                {ocrResult}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
