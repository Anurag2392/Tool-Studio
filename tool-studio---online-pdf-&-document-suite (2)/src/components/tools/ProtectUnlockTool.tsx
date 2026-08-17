import React, { useState } from 'react';
import { Lock, Unlock, Download, ArrowLeft, ShieldCheck } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { protectPdf, unlockPdf, downloadBytesAsFile } from '../../lib/pdfEngine';

interface ProtectUnlockToolProps {
  mode: 'protect' | 'unlock';
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const ProtectUnlockTool: React.FC<ProtectUnlockToolProps> = ({ mode, onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFile = files[0];

  const handleAction = async () => {
    if (!selectedFile || !password) return;
    setIsProcessing(true);

    try {
      if (mode === 'protect') {
        const bytes = await protectPdf(selectedFile.arrayBuffer, password);
        downloadBytesAsFile(bytes, `protected_${selectedFile.name}`);
      } else {
        const bytes = await unlockPdf(selectedFile.arrayBuffer, password);
        downloadBytesAsFile(bytes, `unlocked_${selectedFile.name}`);
      }
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Security Operation Error: ' + err.message);
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
          {mode === 'protect' ? <Lock size={20} className="text-red-600" /> : <Unlock size={20} className="text-emerald-600" />}
          <h2 className="text-xl font-extrabold text-slate-900">
            {mode === 'protect' ? 'Protect PDF with Password' : 'Unlock Encrypted PDF'}
          </h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title={mode === 'protect' ? 'Select PDF File to Protect' : 'Select Protected PDF File to Unlock'}
          subtitle={mode === 'protect' ? 'Set password protection.' : 'Remove password restriction.'}
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

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {mode === 'protect' ? 'Set Document Password' : 'Enter Password to Unlock'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleAction}
              disabled={isProcessing || !password}
              className={`px-8 py-3 text-white font-extrabold rounded-xl text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                mode === 'protect' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              {isProcessing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : mode === 'protect' ? (
                <>
                  <Lock size={18} /> Encrypt & Download PDF
                </>
              ) : (
                <>
                  <Unlock size={18} /> Unlock & Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
