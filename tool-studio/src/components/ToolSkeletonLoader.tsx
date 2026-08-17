import React from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, FileText, Layers, Lock, Cpu, Settings } from 'lucide-react';

interface ToolSkeletonLoaderProps {
  toolName?: string;
  onBack?: () => void;
  showAppShellSkeleton?: boolean;
}

export const ToolSkeletonLoader: React.FC<ToolSkeletonLoaderProps> = ({
  toolName,
  onBack,
  showAppShellSkeleton = true,
}) => {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-200">
      
      {/* APP-SHELL SKELETON HEADER BAR */}
      {showAppShellSkeleton && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Dashboard</span>
            </button>
            <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-7 w-24 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-7 w-24 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-black px-2.5">
              <ShieldCheck size={12} className="mr-1" />
              <span>ISOLATED</span>
            </div>
            <div className="h-7 w-7 bg-slate-200 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* WORKSPACE LAYOUT WITH SIDEBAR + CENTRAL TOOL CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SKELETON SIDEBAR */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="h-4 w-24 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-3 w-8 bg-slate-100 rounded-md animate-pulse" />
            </div>

            {/* Tool Category List Skeleton */}
            <div className="space-y-2">
              {[
                { icon: Layers, w: 'w-28' },
                { icon: FileText, w: 'w-32' },
                { icon: Lock, w: 'w-24' },
                { icon: Cpu, w: 'w-36' },
                { icon: Settings, w: 'w-20' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <item.icon size={15} className="text-slate-400 shrink-0" />
                  <div className={`h-3.5 ${item.w} bg-slate-200 rounded-md animate-pulse`} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Security Badge Skeleton */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck size={14} />
              <span>Anonymous Mode Ready</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-md animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-800 rounded-md animate-pulse" />
          </div>
        </div>

        {/* CENTRAL SKELETON WORKSPACE */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Tool Title & Summary Skeleton */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Sparkles size={24} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-4 w-3/4 max-w-md bg-slate-100 rounded-md animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main Drag & Drop Zone Skeleton */}
          <div className="border-2 border-dashed border-slate-300 bg-slate-50/80 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center space-y-4 text-center min-h-[260px] relative overflow-hidden">
            {/* Shimmer line */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />

            <div className="w-16 h-16 rounded-2xl bg-slate-200/80 animate-pulse flex items-center justify-center text-slate-400 shadow-inner">
              <FileText size={28} className="text-slate-400" />
            </div>

            <div className="space-y-2 w-full max-w-sm mx-auto">
              <div className="h-5 w-56 bg-slate-200 rounded-lg animate-pulse mx-auto" />
              <div className="h-3.5 w-44 bg-slate-200/60 rounded-md animate-pulse mx-auto" />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <div className="h-10 w-36 bg-emerald-500/30 rounded-xl animate-pulse" />
              <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Action / Settings Options Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-3 w-48 bg-slate-100 rounded-md animate-pulse" />
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
              <div className="h-4 w-28 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-3 w-40 bg-slate-100 rounded-md animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
