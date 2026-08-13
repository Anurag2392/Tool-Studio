import React, { useState } from 'react';
import { Stamp, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UploadedFileItem, WatermarkOptions } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { watermarkPdf, downloadBytesAsFile } from '../../lib/pdfEngine';

interface WatermarkToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const WatermarkTool: React.FC<WatermarkToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#dc2626');
  const [opacity, setOpacity] = useState(0.25);
  const [position, setPosition] = useState<WatermarkOptions['position']>('center');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFile = files[0];

  const handleApplyWatermark = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const opts: WatermarkOptions = {
        type: 'text',
        text: watermarkText,
        fontSize,
        color,
        opacity,
        position,
        rotationAngle: 45,
      };
      const bytes = await watermarkPdf(selectedFile.arrayBuffer, opts);
      downloadBytesAsFile(bytes, `watermarked_${selectedFile.name}`);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error applying watermark: ' + err.message);
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
          <Stamp size={20} className="text-red-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Add Watermark to PDF</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF File to Watermark"
          subtitle="Add text watermark overlay with opacity and position controls."
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min={20}
                max={90}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min={0.05}
                max={0.9}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
              >
                <option value="center">Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleApplyWatermark}
              disabled={isProcessing}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Stamp size={18} /> Apply Watermark & Download
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
