import React from 'react';
import { CheckCircle2, Download, RotateCcw, X, Sparkles } from 'lucide-react';

interface ProcessedToastNotificationProps {
  isVisible: boolean;
  fileName: string;
  downloadUrl: string | null;
  onDownload?: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const ProcessedToastNotification: React.FC<ProcessedToastNotificationProps> = ({
  isVisible,
  fileName,
  downloadUrl,
  onReset,
  onClose,
}) => {
  if (!isVisible || !downloadUrl) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full px-4 animate-in slide-in-from-top-5 duration-300 pointer-events-auto">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 space-y-3 relative overflow-hidden">
        {/* Accent Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-white">File Processed Successfully!</h4>
                <span className="text-[10px] font-extrabold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                  READY
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-[220px] font-medium" title={fileName}>
                {fileName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action Buttons: Download & Convert Another */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={downloadUrl}
            download={fileName}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Download Output</span>
          </a>

          <button
            onClick={onReset}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <RotateCcw size={14} className="text-slate-400" />
            <span>Convert another</span>
          </button>
        </div>
      </div>
    </div>
  );
};
