import React, { useState } from 'react';
import { Combine, Download, ArrowLeft, ArrowUp, ArrowDown, FileText, CheckCircle2 } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { mergePdfFiles, downloadBytesAsFile } from '../../lib/pdfEngine';
import { saveRecentFile } from '../../lib/recentFiles';
import { SalesAdvisorPitch } from '../SalesAdvisorPitch';

interface MergeToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
  onOpenPricing?: () => void;
  onOpenPhonePe?: () => void;
}

export const MergeTool: React.FC<MergeToolProps> = ({ onBack, onSuccessAction, onOpenPricing, onOpenPhonePe }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null);

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[newIndex];
    newFiles[newIndex] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 1) return;
    setIsMerging(true);
    try {
      const bytes = await mergePdfFiles(files);
      setMergedPdfBytes(bytes);

      saveRecentFile({
        name: files.length > 1 ? `merged_${files.length}_files.pdf` : files[0].name,
        toolId: 'merge',
        toolName: 'Merge PDF',
        sizeBytes: bytes.byteLength,
        fileType: 'pdf',
      });

      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error merging PDFs: ' + err.message);
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (mergedPdfBytes) {
      downloadBytesAsFile(mergedPdfBytes, 'merged_document.pdf');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft size={16} /> All Tools
        </button>
        <div className="flex items-center gap-2">
          <Combine size={20} className="text-red-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Merge PDF Files</h2>
        </div>
      </div>

      {/* Upload Zone */}
      <DragDropZone
        files={files}
        onFilesAdded={(items) => setFiles((prev) => [...prev, ...items])}
        onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        onClearAll={() => {
          setFiles([]);
          setMergedPdfBytes(null);
        }}
        title="Select PDF files to merge"
        subtitle="Combine multiple PDFs in custom sequence."
      />

      {/* File Sequence Ordering List */}
      {files.length > 0 && !mergedPdfBytes && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Reorder Merge Sequence ({files.length} Files)
          </h3>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.pageCount || 1} pages</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    disabled={idx === files.length - 1}
                    onClick={() => moveFile(idx, 'down')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleMerge}
              disabled={isMerging}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              {isMerging ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <Combine size={18} /> Merge PDF Files
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Merged Success State */}
      {mergedPdfBytes && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-2xl">PDF Merge Complete!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Your files have been merged cleanly into a single document.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Download size={18} /> Download Merged PDF
            </button>
            <button
              onClick={() => {
                setMergedPdfBytes(null);
                setFiles([]);
              }}
              className="px-5 py-3.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Merge Another File
            </button>
          </div>
        </div>
      )}

      {/* Pro Value Advantage Pitch */}
      <div className="pt-4">
        <SalesAdvisorPitch onOpenPricing={onOpenPricing} onOpenPhonePe={onOpenPhonePe} />
      </div>

    </div>
  );
};
