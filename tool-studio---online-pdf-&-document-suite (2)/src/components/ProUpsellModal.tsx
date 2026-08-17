import React from 'react';
import { Sparkles, Zap, ShieldCheck, CheckCircle2, ArrowRight, Crown, X, Rocket } from 'lucide-react';

interface ProUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
  onOpenPhonePe?: () => void;
  title?: string;
  subtitle?: string;
}

export const ProUpsellModal: React.FC<ProUpsellModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
  onOpenPhonePe,
  title = "Free Limit Reached! Upgrade to Pro to Continue",
  subtitle = "You have used your 3 free tools for today. Get 24-hour instant access for just ₹19 or upgrade to Pro for unlimited processing.",
}) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (onOpenPhonePe) {
      onOpenPhonePe();
    } else if (onOpenPricing) {
      onOpenPricing();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-800 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Background Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-xs">
            <Crown size={14} className="text-amber-400" />
            <span>DAILY FREE LIMIT: 3/3 TOOLS USED</span>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>

        {/* Quick 1-Day Pass Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 rounded-2xl border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wide flex items-center gap-1">
              <Sparkles size={12} className="fill-amber-300" /> Instant 24-Hour Pass
            </div>
            <div className="text-2xl font-black text-white mt-0.5">₹19 <span className="text-xs font-semibold text-emerald-200">/ 24 Hours</span></div>
            <p className="text-[11px] text-emerald-200">Unlimited tools for 1 full day ($0.25 USD)</p>
          </div>
          <button
            onClick={() => {
              handleUpgrade();
              onClose();
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all transform hover:scale-105 cursor-pointer shrink-0"
          >
            Get Pass (₹19)
          </button>
        </div>

        {/* Pro Features Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/70 flex items-start gap-2.5">
            <Zap size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-white">10x Speed Boost</h4>
              <p className="text-[11px] text-slate-400 leading-tight">Dedicated GPU & CPU cloud workers</p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/70 flex items-start gap-2.5">
            <Sparkles size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-white">Up to 500MB Files</h4>
              <p className="text-[11px] text-slate-400 leading-tight">Batch process unlimited documents</p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/70 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-white">100% Ad-Free</h4>
              <p className="text-[11px] text-slate-400 leading-tight">Clean interface & VIP support 24/7</p>
            </div>
          </div>

          <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700/70 flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-white">Smart OCR & AI</h4>
              <p className="text-[11px] text-slate-400 leading-tight">High accuracy text extraction</p>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="text-xs text-slate-400">Full Subscription:</div>
            <div className="text-emerald-400 font-extrabold text-base">
              ₹299 <span className="text-xs font-semibold text-slate-400">/ month</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs transition-colors cursor-pointer w-1/2 sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleUpgrade();
                onClose();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 w-1/2 sm:w-auto"
            >
              <Rocket size={15} />
              <span>All Plans</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
