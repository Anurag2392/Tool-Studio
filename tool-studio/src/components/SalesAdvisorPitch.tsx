import React from 'react';
import { Sparkles, Zap, ShieldCheck, CheckCircle2, ArrowRight, Crown } from 'lucide-react';

interface SalesAdvisorPitchProps {
  onOpenPricing?: () => void;
  onOpenPhonePe?: () => void;
  variant?: 'banner' | 'card' | 'inline';
  className?: string;
}

export const SalesAdvisorPitch: React.FC<SalesAdvisorPitchProps> = ({
  onOpenPricing,
  onOpenPhonePe,
  className = '',
}) => {
  const handleUpgrade = () => {
    if (onOpenPhonePe) {
      onOpenPhonePe();
    } else if (onOpenPricing) {
      onOpenPricing();
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-5 animate-in fade-in duration-300 ${className}`}>
      
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Pro Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Crown size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-100">Tool Studio Pro Features</h4>
              <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PRO ADVANTAGE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Elevate document processing for high volume workflows</p>
          </div>
        </div>
      </div>

      {/* Message & Benefits */}
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          <strong className="text-white">Need faster speed & unlimited file limits?</strong> Upgrade to <span className="text-emerald-400 font-extrabold underline underline-offset-4 decoration-emerald-500/50">Tool Studio Pro</span> to unlock dedicated cloud servers and advanced tools.
        </p>

        {/* Pro Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-medium">
            <Zap size={16} className="text-amber-400 shrink-0" />
            <span><strong className="text-white">10x Speed Boost</strong> on dedicated GPU/CPU</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-medium">
            <Sparkles size={16} className="text-emerald-400 shrink-0" />
            <span><strong className="text-white">Unlimited Batch Size</strong> (500MB max per file)</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-medium">
            <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
            <span><strong className="text-white">100% Ad-Free</strong> & VIP Support 24/7</span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-200 font-medium">
            <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
            <span><strong className="text-white">Smart Vision OCR</strong> & Document Intelligence</span>
          </div>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="text-xs">
          <span className="text-slate-400">Pro Plan: </span>
          <span className="text-emerald-400 font-extrabold text-sm sm:text-base">₹299/mo</span>
          <span className="text-slate-400 text-[11px]"> ($4.99/mo)</span>
        </div>

        <button
          onClick={handleUpgrade}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105 cursor-pointer flex items-center gap-1.5"
        >
          <Crown size={15} />
          <span>Upgrade to Pro Now</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
