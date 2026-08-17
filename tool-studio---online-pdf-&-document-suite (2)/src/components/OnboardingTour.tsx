import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, 
  Search, 
  Crown, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  ShieldCheck
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetId: string;
  mobileTargetId?: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  position?: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'navigation',
    targetId: 'tour-navigation',
    mobileTargetId: 'tour-category-navigation',
    title: 'Explore 50+ Document Tools',
    description: 'Quickly access curated document categories: PDF Merge, Split, Compress, AI Summarizer, OCR, Image Suite, and 50+ built-in financial calculators.',
    icon: Compass,
    badge: 'Step 1 of 3 • Navigation',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    position: 'bottom',
  },
  {
    id: 'search',
    targetId: 'tour-search-bar',
    title: 'Instant Tool Search',
    description: 'Find any tool in milliseconds. Type keywords like "compress", "sign", "word to pdf", "watermark", or "calculator" to filter immediately.',
    icon: Search,
    badge: 'Step 2 of 3 • Search Bar',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    position: 'bottom',
  },
  {
    id: 'pro-upgrade',
    targetId: 'tour-pro-button',
    title: 'Daily Free Limits & Pro Upgrade',
    description: 'Enjoy 3 free document actions daily. Upgrade anytime with PhonePe / UPI starting at just ₹19 for 1-Day Unlimited Pro Pass with zero ads.',
    icon: Crown,
    badge: 'Step 3 of 3 • Pro & Limits',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'toolstudio_onboarding_completed_v1';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhonePe?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onOpenPhonePe,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Update element rect calculation
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !currentStep) return;

    let targetElement = document.getElementById(currentStep.targetId);
    
    // Fallback to mobile target if primary is not visible/present
    if ((!targetElement || targetElement.offsetParent === null) && currentStep.mobileTargetId) {
      targetElement = document.getElementById(currentStep.mobileTargetId);
    }

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      // Scroll into view if out of bounds
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );

      if (!isInViewport) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      setTargetRect(targetElement.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    // Small delay to allow layout shifts and scrolling
    const timer = setTimeout(() => {
      updateTargetPosition();
    }, 120);

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isOpen, currentStepIndex, updateTargetPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleDismiss();
      if (currentStep.id === 'pro-upgrade' && onOpenPhonePe) {
        // Optional quick trigger
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const IconComponent = currentStep.icon;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* SEMI-TRANSPARENT BACKDROP OVERLAY */}
      <div 
        onClick={handleDismiss}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-opacity duration-300 animate-in fade-in"
      />

      {/* HIGHLIGHT SPOTLIGHT BOX */}
      {targetRect && (
        <div
          className="absolute transition-all duration-300 pointer-events-none rounded-2xl ring-4 ring-emerald-400 ring-offset-4 ring-offset-slate-900 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse"
          style={{
            top: `${Math.max(8, targetRect.top + window.scrollY - 6)}px`,
            left: `${Math.max(8, targetRect.left + window.scrollX - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        />
      )}

      {/* STEP CARD POPOVER / DIALOG */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-6">
        <div
          ref={cardRef}
          className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200"
        >
          
          {/* Header Row with Badge & Dismiss */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${currentStep.badgeColor}`}>
                {currentStep.badge}
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X size={16} />
            </button>
          </div>

          {/* Title and Icon */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
              <IconComponent size={22} className="text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Feature Highlight Pill */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>100% Client-Side Private • Zero File Upload to Server</span>
          </div>

          {/* Progress Indicators & Navigation Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-6 bg-emerald-600'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Back & Next Actions */}
            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{isLastStep ? 'Get Started' : 'Next'}</span>
                {isLastStep ? <CheckCircle2 size={14} className="text-emerald-400" /> : <ArrowRight size={14} />}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

/**
 * Hook to automatically prompt tour for first-time visitors
 */
export const useOnboardingTour = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(STORAGE_KEY);
      if (!hasCompleted) {
        // Small delay so initial render finishes cleanly
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const restartTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
  };

  return {
    showTour,
    restartTour,
    closeTour,
  };
};
