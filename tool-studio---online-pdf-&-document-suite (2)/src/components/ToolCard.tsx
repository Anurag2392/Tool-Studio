import React, { useMemo } from 'react';
import { 
  Combine, 
  Scissors, 
  FileArchive, 
  Edit3, 
  Sparkles, 
  PenTool, 
  LayoutGrid, 
  RotateCw, 
  Stamp, 
  Hash, 
  Lock, 
  Unlock, 
  Image, 
  FileText,
  ScanText,
  Crop,
  Layers,
  Sun,
  FileSpreadsheet,
  FileCode,
  FileSearch,
  Images,
  Tag,
  Columns,
  Sliders,
  Wrench,
  Shuffle,
  ArrowRight
} from 'lucide-react';
import { PdfToolMeta, ToolId } from '../types';
import { getToolTranslation } from '../data/translations';

interface ToolCardProps {
  tool: PdfToolMeta;
  onSelect: (id: ToolId) => void;
  langCode?: string;
}

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Combine,
  Scissors,
  FileArchive,
  Edit3,
  Sparkles,
  PenTool,
  LayoutGrid,
  RotateCw,
  Stamp,
  Hash,
  Lock,
  Unlock,
  Image,
  FileText,
  ScanText,
  Crop,
  Layers,
  Sun,
  FileSpreadsheet,
  FileCode,
  FileSearch,
  Images,
  Tag,
  Columns,
  Sliders,
  Wrench,
  Shuffle,
};

export const ToolCard: React.FC<ToolCardProps> = React.memo(({ tool, onSelect, langCode = 'en' }) => {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;
  const translated = useMemo(() => {
    return getToolTranslation(tool.id, tool.name, tool.shortDesc, langCode);
  }, [tool.id, tool.name, tool.shortDesc, langCode]);

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-emerald-500/80 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Top Badge */}
      {tool.badge && (
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
            tool.isAi
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : tool.isPopular
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {tool.badge}
        </span>
      )}

      <div>
        {/* Tool Icon */}
        <div
          className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${
            tool.isAi
              ? 'bg-purple-50 text-purple-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          <IconComponent size={24} className="stroke-[2.2]" />
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-slate-900 text-base mb-1.5 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
          {translated.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {translated.shortDesc}
        </p>
      </div>

      {/* Card Action Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-600">
        <span>Use Tool</span>
        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
});
