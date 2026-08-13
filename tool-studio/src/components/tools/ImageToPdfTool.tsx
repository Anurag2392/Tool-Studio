import React, { useState } from 'react';
import { Image, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DragDropZone } from '../DragDropZone';
import { convertImagesToPdf, downloadBytesAsFile } from '../../lib/pdfEngine';
import { UploadedFileItem } from '../../types';

interface ImageToPdfToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const ImageToPdfTool: React.FC<ImageToPdfToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const rawImageFiles = files.map((item) => item.file);
      const bytes = await convertImagesToPdf(rawImageFiles);
      downloadBytesAsFile(bytes, 'images_converted.pdf');
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error converting images to PDF: ' + err.message);
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
          <Image size={20} className="text-blue-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Convert JPG & PNG Images to PDF</h2>
        </div>
      </div>

      <DragDropZone
        files={files}
        acceptTypes="image/jpeg,image/png,image/jpg,image/webp"
        multiple={true}
        onFilesAdded={(items) => setFiles((prev) => [...prev, ...items])}
        onRemoveFile={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        onClearAll={() => setFiles([])}
        title="Select Images to Convert to PDF"
        subtitle="Upload JPG, PNG, or WEBP photos to combine into PDF pages."
      />

      {files.length > 0 && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Image size={18} /> Convert Images to PDF
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
