import React, { useState } from 'react';
import { Scissors, Download, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { splitPdfFile, downloadBytesAsFile } from '../../lib/pdfEngine';

interface SplitToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const SplitTool: React.FC<SplitToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [rangeInput, setRangeInput] = useState('1');
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResults, setSplitResults] = useState<{ pdfBytes: Uint8Array; filename: string }[] | null>(null);

  const selectedFile = files[0];

  const handleSplit = async () => {
    if (!selectedFile) return;
    setIsSplitting(true);
    try {
      const results = await splitPdfFile(selectedFile.arrayBuffer, rangeInput);
      setSplitResults(results);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error splitting PDF: ' + err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft size={16} /> All Tools
        </button>
        <div className="flex items-center gap-2">
          <Scissors size={20} className="text-amber-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Split & Extract PDF Pages</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => {
            setFiles(items);
            if (items[0] && items[0].pageCount) {
              setRangeInput(`1-${Math.min(items[0].pageCount, 3)}`);
            }
          }}
          onRemoveFile={() => {
            setFiles([]);
            setSplitResults(null);
          }}
          onClearAll={() => {
            setFiles([]);
            setSplitResults(null);
          }}
          title="Select 1 PDF file to split"
          subtitle="Extract specific pages or custom range intervals."
        />
      ) : !splitResults ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedFile.name}</h4>
                <p className="text-xs text-slate-500">{selectedFile.pageCount} total pages</p>
              </div>
            </div>
            <button
              onClick={() => {
                setFiles([]);
                setSplitResults(null);
              }}
              className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
            >
              Change File
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Specify Page Range to Extract (e.g. 1-3, 5, 8)
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <p className="text-xs text-slate-500">
              Use commas for individual pages and hyphens for continuous page ranges.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSplit}
              disabled={isSplitting}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              {isSplitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Extracting Pages...
                </>
              ) : (
                <>
                  <Scissors size={18} /> Split PDF Now
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-2xl">PDF Split Complete!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Extracted {splitResults.length} page segment(s) successfully.
            </p>
          </div>

          <div className="space-y-2 max-w-md mx-auto pt-2">
            {splitResults.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl text-xs"
              >
                <span className="font-bold text-slate-800">{item.filename}</span>
                <button
                  onClick={() => downloadBytesAsFile(item.pdfBytes, item.filename)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setSplitResults(null);
                setFiles([]);
              }}
              className="text-xs font-bold text-slate-700 hover:underline cursor-pointer"
            >
              Split Another File
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
