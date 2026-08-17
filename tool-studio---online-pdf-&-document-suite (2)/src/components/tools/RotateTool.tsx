import React, { useState } from 'react';
import { RotateCw, Download, ArrowLeft, RotateCcw } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { rotatePdfPages, downloadBytesAsFile } from '../../lib/pdfEngine';

interface RotateToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const RotateTool: React.FC<RotateToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [rotationDegrees, setRotationDegrees] = useState<number>(90);
  const [isRotating, setIsRotating] = useState(false);

  const selectedFile = files[0];

  const handleRotate = async () => {
    if (!selectedFile) return;
    setIsRotating(true);
    try {
      const pageCount = selectedFile.pageCount || 1;
      const rotMap: Record<number, number> = {};
      for (let i = 0; i < pageCount; i++) {
        rotMap[i] = rotationDegrees;
      }
      const bytes = await rotatePdfPages(selectedFile.arrayBuffer, rotMap);
      downloadBytesAsFile(bytes, `rotated_${selectedFile.name}`);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error rotating PDF: ' + err.message);
    } finally {
      setIsRotating(false);
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
          <RotateCw size={20} className="text-teal-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Rotate PDF Pages</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF File to Rotate"
          subtitle="Rotate sideways or upside-down pages by 90°, 180°, or 270°."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{selectedFile.name}</h4>
              <p className="text-xs text-slate-500">{selectedFile.pageCount} page(s)</p>
            </div>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
            >
              Change File
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Select Rotation Angle
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '90° Clockwise', deg: 90 },
                { label: '180° Flip', deg: 180 },
                { label: '270° Counter-Clockwise', deg: 270 },
              ].map((r) => (
                <button
                  key={r.deg}
                  onClick={() => setRotationDegrees(r.deg)}
                  className={`p-4 rounded-2xl border font-bold text-xs cursor-pointer ${
                    rotationDegrees === r.deg
                      ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleRotate}
              disabled={isRotating}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
            >
              {isRotating ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <RotateCw size={18} /> Rotate & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
