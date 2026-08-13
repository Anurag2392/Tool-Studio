import React, { useState } from 'react';
import { Hash, Download, ArrowLeft } from 'lucide-react';
import { UploadedFileItem, PageNumberOptions } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { addPageNumbersToPdf, downloadBytesAsFile } from '../../lib/pdfEngine';

interface PageNumbersToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const PageNumbersTool: React.FC<PageNumbersToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [position, setPosition] = useState<PageNumberOptions['position']>('bottom-center');
  const [format, setFormat] = useState<PageNumberOptions['format']>('page_of_total');
  const [startPage, setStartPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFile = files[0];

  const handleAddPageNumbers = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const opts: PageNumberOptions = {
        position,
        format,
        startPage,
        prefix: 'Page',
        fontSize: 10,
        color: '#333333',
      };
      const bytes = await addPageNumbersToPdf(selectedFile.arrayBuffer, opts);
      downloadBytesAsFile(bytes, `numbered_${selectedFile.name}`);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error adding page numbers: ' + err.message);
    } finally {
      setIsProcessing(false);
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
          <Hash size={20} className="text-slate-800" />
          <h2 className="text-xl font-extrabold text-slate-900">Add Page Numbers to PDF</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF File for Page Numbers"
          subtitle="Add header/footer page numbers in custom formats."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{selectedFile.name}</h4>
              <p className="text-xs text-slate-500">{selectedFile.pageCount} page(s)</p>
            </div>
            <button onClick={() => setFiles([])} className="text-xs text-red-600 font-bold hover:underline cursor-pointer">
              Change File
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="page_of_total">Page X of Y</option>
                <option value="number">1, 2, 3...</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Start Numbering On Page</label>
              <input
                type="number"
                min={1}
                max={selectedFile.pageCount || 10}
                value={startPage}
                onChange={(e) => setStartPage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleAddPageNumbers}
              disabled={isProcessing}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Hash size={18} /> Add Numbers & Download
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
