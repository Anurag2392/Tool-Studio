import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image as ImageIcon, 
  FileCode, 
  FileCheck 
} from 'lucide-react';
import { detectFileType } from '../lib/recentFiles';

interface FileTypeIconProps {
  fileName?: string;
  mimeType?: string;
  fileType?: 'pdf' | 'word' | 'excel' | 'ppt' | 'image' | 'text' | 'other';
  size?: number;
  className?: string;
  showBadgeText?: boolean;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  fileName = '',
  mimeType = '',
  fileType,
  size = 18,
  className = '',
  showBadgeText = false,
}) => {
  const type = fileType || (mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')
    ? 'pdf'
    : mimeType.includes('word') || mimeType.includes('doc') || fileName.toLowerCase().match(/\.(docx?|txt)$/)
    ? 'word'
    : mimeType.includes('sheet') || mimeType.includes('excel') || fileName.toLowerCase().match(/\.(xlsx?|csv)$/)
    ? 'excel'
    : mimeType.includes('presentation') || mimeType.includes('powerpoint') || fileName.toLowerCase().match(/\.(pptx?)$/)
    ? 'ppt'
    : mimeType.includes('image') || fileName.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)$/)
    ? 'image'
    : detectFileType(fileName));

  switch (type) {
    case 'word':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/80 font-bold shrink-0 ${className}`}>
          <FileText size={size} className="text-blue-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">WORD</span>}
        </div>
      );
    case 'excel':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold shrink-0 ${className}`}>
          <FileSpreadsheet size={size} className="text-emerald-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">EXCEL</span>}
        </div>
      );
    case 'ppt':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/80 font-bold shrink-0 ${className}`}>
          <Presentation size={size} className="text-amber-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">PPT</span>}
        </div>
      );
    case 'image':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 font-bold shrink-0 ${className}`}>
          <ImageIcon size={size} className="text-purple-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">IMAGE</span>}
        </div>
      );
    case 'pdf':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200/80 font-bold shrink-0 ${className}`}>
          <FileText size={size} className="text-red-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">PDF</span>}
        </div>
      );
    default:
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold shrink-0 ${className}`}>
          <FileCheck size={size} className="text-slate-600 shrink-0" />
          {showBadgeText && <span className="text-[10px] tracking-wide font-extrabold uppercase">DOC</span>}
        </div>
      );
  }
};
