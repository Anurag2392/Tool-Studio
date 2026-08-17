import React, { useState } from 'react';
import { Crown, Check, Zap, ShieldCheck, Sparkles, Star, Clock } from 'lucide-react';
import { UserPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan: UserPlan;
  onOpenPhonePe: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  userPlan,
  onOpenPhonePe,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-10 shadow-2xl space-y-8 border border-slate-200 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Crown size={14} className="text-amber-500 fill-amber-500" />
            <span>Tool Studio Pro Plans</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Unlock Unlimited PDF Power & Tools
          </h2>

          <p className="text-xs sm:text-sm text-slate-600">
            Free users get <strong className="text-emerald-700">3 free tools per day</strong>. Upgrade for 24-hour instant access or full monthly/annual subscriptions with zero limits & ad-free speed.
          </p>
        </div>

        {/* Pricing Cards - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Free Plan Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-lg">Free Plan</h3>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">Current</span>
              </div>

              <div>
                <span className="text-3xl font-black text-slate-900">₹0</span>
                <span className="text-xs text-slate-500 font-medium"> / forever</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>3 Tools per Day</strong> free limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Access to all 50+ document tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Standard processing speed</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center font-bold">✕</span>
                  <span>Ad-supported clean interface</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Continue Free
            </button>
          </div>

          {/* 1 Day Pro Pass Card */}
          <div className="relative bg-emerald-900/90 text-white border-2 border-emerald-400/90 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="absolute -top-3.5 right-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles size={12} className="fill-slate-950" /> 1-Day Pass (₹19)
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                  1-Day Pro Pass <Clock size={16} className="text-amber-300" />
                </h3>
              </div>

              <div>
                <span className="text-4xl font-black text-amber-300">₹19</span>
                <span className="text-xs text-emerald-200 font-medium"> / 24 hours ($0.25)</span>
                <p className="text-[11px] text-emerald-200 mt-1 font-medium">Instant 24-hour pass for quick document tasks!</p>
              </div>

              <ul className="space-y-2.5 text-xs text-emerald-100">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-amber-300 shrink-0" />
                  <strong className="text-white">24 Hours Unlimited Tools</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-amber-300 shrink-0" />
                  <strong className="text-white">Zero Daily Limits</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-amber-300 shrink-0" />
                  <span>100% Ad-Free Experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-amber-300 shrink-0" />
                  <span>Priority Fast Server Processing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPhonePe();
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-400/20 transition-transform active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap size={16} className="fill-slate-950" /> Get 1-Day Pass (₹19)
            </button>
          </div>

          {/* Full Pro Monthly / Annual Card */}
          <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-2 border-emerald-500/80 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="absolute -top-3.5 right-4 bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star size={12} className="fill-white" /> Pro Monthly & Annual
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-lg flex items-center gap-1.5">
                  Tool Studio Pro <Crown size={16} className="text-amber-400 fill-amber-400" />
                </h3>
              </div>

              {/* Cycle Toggle */}
              <div className="flex items-center bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer ${
                    billingCycle === 'annual' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Annual (Save 33%)
                </button>
              </div>

              <div>
                <span className="text-3xl font-black text-white">
                  {billingCycle === 'annual' ? '₹2,999' : '₹299'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {' '} / {billingCycle === 'annual' ? 'yr ($39 USD)' : 'mo ($4.99 USD)'}
                </span>
                {billingCycle === 'annual' && (
                  <div className="mt-1 text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 inline-block">
                    🎟️ Code <span className="font-mono underline">YEAR10</span> = ₹2,699/yr
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <strong className="text-white">Unlimited Document Processing</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Unlimited Gemini AI Chat & OCR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>100% Ad-Free Clean Interface</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Priority 24/7 Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPhonePe();
              }}
              className="w-full py-3.5 bg-[#5f259f] hover:bg-[#4d1d84] text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-purple-900/20 transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={16} /> Pay via PhonePe & Upgrade
            </button>
          </div>

        </div>

        {/* Footer Guarantee */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 pt-2 border-t border-slate-100 font-medium">
          <ShieldCheck size={16} className="text-[#5f259f]" />
          <span>PhonePe Instant activation (UPI, Cards, NetBanking, PhonePe Wallet) • Non-refundable subscription policy</span>
        </div>

      </div>
    </div>
  );
};
