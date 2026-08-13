import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Megaphone } from 'lucide-react';
import { PdfToolMeta } from '../types';
import { useAdSense } from '../hooks/useAdSense';
import { ADSENSE_CONFIG } from '../config/adsense';

interface SeoContentSectionProps {
  tool: PdfToolMeta;
  publisherId?: string;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  tool,
  publisherId = ADSENSE_CONFIG.publisherId,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { adRef: topAdRef, adProps: topAdProps } = useAdSense({
    client: publisherId,
    slot: ADSENSE_CONFIG.slots.contentTop,
    format: 'auto',
    responsive: true,
  });

  const { adRef: midAdRef, adProps: midAdProps } = useAdSense({
    client: publisherId,
    slot: ADSENSE_CONFIG.slots.contentMid,
    format: 'fluid',
    responsive: true,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="mt-16 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xs">
      
      {/* Content Top Ad Unit */}
      <div className="my-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          <Megaphone size={12} className="text-emerald-600" /> Content Ad Unit (AdSense Responsive)
        </div>
        <ins ref={topAdRef} {...topAdProps} />
      </div>

      {/* Step by Step Guide */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to {tool.name} Online Step by Step
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Follow these quick steps to process your documents securely in Tool Studio with zero software installation required.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {(tool?.steps || []).map((stepText, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                0{idx + 1}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {stepText}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About Tool Description */}
      <div className="space-y-3 pt-6 border-t border-slate-100">
        <h3 className="text-xl font-bold text-slate-900">
          About {tool?.name || 'Tool'} in Tool Studio
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {tool?.longDesc || ''}
        </p>
      </div>

      {/* In-Article Content Ad Slot */}
      <div className="pt-4 border-t border-slate-100">
        <ins ref={midAdRef} {...midAdProps} />
      </div>

      {/* Frequently Asked Questions Accordion */}
      {tool?.faq && (tool.faq?.length || 0) > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle size={20} className="text-emerald-600" /> Frequently Asked Questions ({tool?.name || 'Tool'})
          </h3>

          <div className="space-y-2">
            {(tool?.faq || []).map((faqItem, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 text-xs sm:text-sm hover:text-emerald-600 cursor-pointer"
                  >
                    <span>{faqItem.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 bg-white">
                      {faqItem.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
