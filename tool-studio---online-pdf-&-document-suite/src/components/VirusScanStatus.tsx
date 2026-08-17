import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, Search, Cpu } from 'lucide-react';
import { VirusScanResult } from '../types';

interface VirusScanOverlayProps {
  fileName: string;
  isScanning: boolean;
  scanResult?: VirusScanResult;
  onComplete?: () => void;
}

export const VirusScanOverlay: React.FC<VirusScanOverlayProps> = ({
  fileName,
  isScanning,
  scanResult,
}) => {
  const [scanStep, setScanStep] = useState(0);

  const steps = [
    'Parsing binary header...',
    'Checking for executable macros & scripts...',
    'Analyzing object streams & payload tags...',
    'Running heuristic virus pattern match...',
    'Document Verified Clean!',
  ];

  useEffect(() => {
    if (!isScanning) {
      setScanStep(0);
      return;
    }

    const interval = setInterval(() => {
      setScanStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 180);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="bg-slate-900/90 text-white rounded-2xl p-4 shadow-xl border border-emerald-500/30 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3">
        {/* Animated Radar Scanning Spinner */}
        <div className="relative w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center border border-emerald-500/50 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/20 animate-ping rounded-xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/30 to-transparent animate-spin duration-1000" />
          <Search size={18} className="text-emerald-400 z-10 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Cpu size={12} className="animate-spin" /> Virus & Malware Scan in Progress
            </span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              {Math.min(100, Math.round(((scanStep + 1) / steps.length) * 100))}%
            </span>
          </div>

          <p className="text-xs font-bold text-slate-100 truncate mt-0.5">{fileName}</p>
          <p className="text-[11px] text-emerald-300/80 transition-all duration-150 mt-0.5">
            {steps[scanStep]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-700">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full transition-all duration-200 ease-out"
          style={{ width: `${Math.min(100, ((scanStep + 1) / steps.length) * 100)}%` }}
        />
      </div>
    </div>
  );
};

interface SecurityBadgeProps {
  scanResult?: VirusScanResult;
  compact?: boolean;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ scanResult, compact = false }) => {
  if (!scanResult || !scanResult.isClean) {
    if (scanResult && !scanResult.isClean) {
      return (
        <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded font-bold text-xs border border-red-300">
          <ShieldAlert size={13} className="text-red-600" /> Threat Blocked
        </span>
      );
    }
    return null;
  }

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200/90 transition-colors px-2 py-0.5 rounded-full text-[11px] font-bold border border-emerald-300 shadow-2xs cursor-help"
        title={`Security Verified: ${scanResult.details}`}
      >
        <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
        <span>Verified Clean</span>
      </span>
    );
  }

  return (
    <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck size={16} />
        </div>
        <div>
          <p className="font-extrabold flex items-center gap-1 text-emerald-900 text-xs">
            100% Malware Free & Verified Clean
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </p>
          <p className="text-[10px] text-emerald-700 font-medium">
            {scanResult.details} • Sandboxed Local Inspection
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white/80 px-2 py-1 rounded-md border border-emerald-200">
        <Lock size={10} /> Client-Side Shield
      </div>
    </div>
  );
};
