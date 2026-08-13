import React, { useState, useEffect } from 'react';
import { History, Download, Trash2, Clock, Sparkles, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { getRecentFiles, clearRecentFiles, RecentProcessedFile } from '../lib/recentFiles';
import { FileTypeIcon } from './FileTypeIcon';

interface RecentFilesModuleProps {
  onSelectTool?: (toolId: string) => void;
  className?: string;
}

export const RecentFilesModule: React.FC<RecentFilesModuleProps> = ({
  onSelectTool,
  className = '',
}) => {
  const [recentFiles, setRecentFiles] = useState<RecentProcessedFile[]>([]);

  const loadFiles = () => {
    setRecentFiles(getRecentFiles());
  };

  useEffect(() => {
    loadFiles();

    const handleUpdate = () => {
      loadFiles();
    };

    window.addEventListener('tool_studio_recent_files_updated', handleUpdate);
    return () => {
      window.removeEventListener('tool_studio_recent_files_updated', handleUpdate);
    };
  }, []);

  if (recentFiles.length === 0) {
    return null;
  }

  const handleClear = () => {
    clearRecentFiles();
    setRecentFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'File ready';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatTime = (ts: number) => {
    const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hour(s) ago`;
  };

  return (
    <div className={`bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold border border-emerald-500/20 shadow-2xs">
            <History size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-2">
              <span>Recent Files Session History</span>
              <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                Last {recentFiles.length} Processed
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Quickly access or re-download your recently converted documents.</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
          title="Clear recent files history"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recentFiles.map((file) => (
          <div
            key={file.id}
            className="p-3.5 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl transition-all duration-200 flex flex-col justify-between space-y-3 group hover:shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <FileTypeIcon fileName={file.name} fileType={file.fileType} showBadgeText={true} />
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <Clock size={11} /> {formatTime(file.timestamp)}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-800 text-xs truncate" title={file.name}>
                {file.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200/60 font-semibold text-slate-700">
                  {file.toolName}
                </span>
                <span>{formatSize(file.sizeBytes)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              {file.downloadUrl ? (
                <a
                  href={file.downloadUrl}
                  download={file.downloadFileName || file.name}
                  className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Download size={13} /> Re-download File
                </a>
              ) : onSelectTool ? (
                <button
                  onClick={() => onSelectTool(file.toolId)}
                  className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight size={13} /> Open {file.toolName}
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Complete
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
