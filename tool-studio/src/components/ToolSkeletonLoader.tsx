import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface ToolSkeletonLoaderProps {
  toolName?: string;
  onBack?: () => void;
}

export const ToolSkeletonLoader: React.FC<ToolSkeletonLoaderProps> = ({ toolName, onBack }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full animate-in fade-in duration-200">
      {/* Top Header Navigation Bar Placeholder */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 text-slate-600 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-emerald-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Tool Hero Title Skeleton */}
      <div className="space-y-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-100 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Drag-and-Drop Upload Area Skeleton */}
      <div className="border-2 border-dashed border-slate-300 bg-slate-50/80 rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 text-center min-h-[260px] relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />

        <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
          <Sparkles size={28} className="text-slate-300" />
        </div>

        <div className="space-y-2 w-full max-w-sm mx-auto">
          <div className="h-5 w-56 bg-slate-200 rounded-lg animate-pulse mx-auto" />
          <div className="h-3.5 w-40 bg-slate-200/70 rounded-md animate-pulse mx-auto" />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <div className="h-10 w-36 bg-emerald-200/60 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Utility Settings Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-3 w-48 bg-slate-100 rounded-md animate-pulse" />
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-3 w-40 bg-slate-100 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Pro Advantage Banner Placeholder Skeleton */}
      <div className="p-6 bg-slate-900 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 bg-slate-800 rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-emerald-900/60 rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-full max-w-lg bg-slate-800 rounded-md animate-pulse" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-5 w-24 bg-slate-800 rounded-md animate-pulse" />
          <div className="h-9 w-36 bg-emerald-600/80 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};
