import React, { useRef, useState } from 'react';
import { PenTool, Download, ArrowLeft, CheckCircle2, Type, Upload, Eraser } from 'lucide-react';
import { UploadedFileItem, AnnotationItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { applyAnnotationsToPdf, downloadBytesAsFile } from '../../lib/pdfEngine';

interface SignToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const SignTool: React.FC<SignToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('John Doe');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const selectedFile = files[0];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSignatureDataUrl(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureDataUrl(null);
  };

  const generateTypeSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = 'italic 32px Georgia, serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(typedName || 'Signature', 20, 60);
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const handleApplySignature = async () => {
    if (!selectedFile || !signatureDataUrl) return;
    setIsSigning(true);

    try {
      const annotations: AnnotationItem[] = [
        {
          id: 'sig-1',
          type: 'signature',
          pageIndex: 0,
          x: 180,
          y: 520,
          width: 180,
          height: 60,
          imageDataUrl: signatureDataUrl,
        },
      ];

      const bytes = await applyAnnotationsToPdf(selectedFile.arrayBuffer, annotations);
      downloadBytesAsFile(bytes, `signed_${selectedFile.name}`);
      setIsPlaced(true);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error signing PDF: ' + err.message);
    } finally {
      setIsSigning(false);
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
          <PenTool size={20} className="text-indigo-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Sign PDF & Legal e-Signature</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF Document to Sign"
          subtitle="Draw or type your signature and place it on contract pages."
        />
      ) : !isPlaced ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Create Your E-Signature</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSignatureType('draw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  signatureType === 'draw' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSignatureType('type')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  signatureType === 'type' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Type Signature
              </button>
            </div>
          </div>

          {signatureType === 'draw' ? (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 relative flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                  title="Clear pad"
                >
                  <Eraser size={16} />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center">Draw with mouse or touchscreen inside the signature pad</p>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Enter full name..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold"
              />
              <button
                onClick={generateTypeSignature}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Generate Script Signature
              </button>
            </div>
          )}

          {/* Signature Preview & Placement */}
          {signatureDataUrl && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-center space-y-3">
              <span className="text-xs font-bold text-indigo-800 uppercase">Signature Preview Stamp</span>
              <div className="bg-white p-2 rounded-xl border border-indigo-200 inline-block">
                <img src={signatureDataUrl} alt="Signature preview" className="max-h-16 mx-auto" />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleApplySignature}
              disabled={!signatureDataUrl || isSigning}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSigning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing Document...
                </>
              ) : (
                <>
                  <PenTool size={18} /> Sign & Download PDF
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
            <h3 className="font-black text-slate-900 text-2xl">PDF Document Signed!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Your electronic signature has been stamped onto the document.
            </p>
          </div>
          <button
            onClick={() => {
              setIsPlaced(false);
              setFiles([]);
            }}
            className="px-5 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Sign Another Document
          </button>
        </div>
      )}

    </div>
  );
};
