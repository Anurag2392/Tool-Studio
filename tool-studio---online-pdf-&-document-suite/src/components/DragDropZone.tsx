import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import { Upload, FileText, Trash2, Plus, CheckCircle2, FileUp, AlertCircle, Image as ImageIcon, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { UploadedFileItem } from '../types';
import { readFileAsArrayBuffer, getPdfPageCount } from '../lib/pdfEngine';
import { scanFileForVirusesAsync } from '../lib/virusScanner';
import { VirusScanOverlay, SecurityBadge } from './VirusScanStatus';
import { FileTypeIcon } from './FileTypeIcon';

interface DragDropZoneProps {
  files: UploadedFileItem[];
  onFilesAdded?: (newItems: UploadedFileItem[]) => void;
  onRemoveFile?: (id: string) => void;
  onClearAll?: () => void;
  onFilesChange?: (files: UploadedFileItem[]) => void;
  acceptTypes?: string;
  acceptedTypes?: string | string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  title?: string;
  subtitle?: string;
  label?: string;
  className?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  files = [],
  onFilesAdded,
  onRemoveFile,
  onClearAll,
  onFilesChange,
  acceptTypes,
  acceptedTypes,
  multiple = true,
  maxFiles = 30,
  maxSizeBytes = 100 * 1024 * 1024, // 100 MB default
  title,
  subtitle = 'Files stay safe on your device. Processed locally.',
  label,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanningFileName, setScanningFileName] = useState<string | null>(null);
  const [rejectionErrors, setRejectionErrors] = useState<string[]>([]);

  // Consolidate acceptTypes / acceptedTypes string
  const rawTypesStr = typeof acceptedTypes === 'string'
    ? acceptedTypes
    : Array.isArray(acceptedTypes)
    ? acceptedTypes.join(',')
    : acceptTypes || '.pdf,application/pdf';

  const effectiveTitle = title || label || 'Select files or drop documents here';

  // Convert MIME/extension prop string into react-dropzone Accept object dynamically
  const getAcceptObject = (typesStr: string): Accept => {
    if (!typesStr) {
      return {
        'application/pdf': ['.pdf'],
      };
    }

    const result: Accept = {};
    const tokens = typesStr.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);

    tokens.forEach((token) => {
      if (token.includes('pdf')) {
        result['application/pdf'] = ['.pdf'];
      }
      if (
        token.includes('image') ||
        token.includes('jpg') ||
        token.includes('jpeg') ||
        token.includes('png') ||
        token.includes('webp') ||
        token.includes('gif')
      ) {
        result['image/jpeg'] = ['.jpg', '.jpeg'];
        result['image/png'] = ['.png'];
        result['image/webp'] = ['.webp'];
        result['image/gif'] = ['.gif'];
      }
      if (token.includes('doc') || token.includes('word') || token.includes('msword')) {
        result['application/msword'] = ['.doc'];
        result['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
        result['text/plain'] = ['.txt'];
      }
      if (token.includes('xls') || token.includes('excel') || token.includes('spreadsheet') || token.includes('csv')) {
        result['application/vnd.ms-excel'] = ['.xls'];
        result['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
        result['text/csv'] = ['.csv'];
      }
      if (token.includes('ppt') || token.includes('powerpoint') || token.includes('presentation')) {
        result['application/vnd.ms-powerpoint'] = ['.ppt'];
        result['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = ['.pptx'];
      }
      if (token.includes('html') || token.includes('htm')) {
        result['text/html'] = ['.html', '.htm'];
      }
      if (token.includes('txt') || token.includes('text')) {
        result['text/plain'] = ['.txt'];
      }
    });

    if (Object.keys(result).length === 0) {
      // If tokens didn't match known presets, create custom extension matchers
      tokens.forEach((token) => {
        if (token.startsWith('.')) {
          result[`application/x-${token.slice(1)}`] = [token];
        }
      });
    }

    if (Object.keys(result).length === 0) {
      result['application/pdf'] = ['.pdf'];
    }

    return result;
  };

  const getFormatBadgeText = () => {
    const lower = rawTypesStr.toLowerCase();
    if (lower.includes('xls') || lower.includes('excel') || lower.includes('spreadsheet') || lower.includes('csv')) {
      return 'XLSX, XLS, CSV';
    }
    if (lower.includes('doc') || lower.includes('word') || lower.includes('msword')) {
      return 'DOCX, DOC, TXT';
    }
    if (lower.includes('ppt') || lower.includes('powerpoint')) {
      return 'PPTX, PPT';
    }
    if (lower.includes('html') || lower.includes('htm')) {
      return 'HTML, HTM';
    }
    if (lower.includes('image') || lower.includes('jpg') || lower.includes('png') || lower.includes('webp')) {
      return 'JPG, PNG, WEBP';
    }
    return 'PDF Document';
  };

  const handleRemoveFile = (id: string) => {
    if (onRemoveFile) {
      onRemoveFile(id);
    } else if (onFilesChange) {
      onFilesChange(files.filter((f) => f.id !== id));
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else if (onFilesChange) {
      onFilesChange([]);
    }
  };

  const processAcceptedFiles = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsProcessing(true);
    setRejectionErrors([]);

    const newItems: UploadedFileItem[] = [];
    const scanAlerts: string[] = [];

    for (const file of acceptedFiles) {
      setScanningFileName(file.name);
      try {
        const buffer = await readFileAsArrayBuffer(file);

        // 1. Run Automated Virus & Payload Scan
        const scanResult = await scanFileForVirusesAsync(buffer, file.name, file.type);

        if (!scanResult.isClean) {
          scanAlerts.push(
            `🛡️ VIRUS SECURITY ALERT: "${file.name}" was blocked! ${scanResult.details}`
          );
          continue; // Block infected or spoofed file
        }

        let pageCount = 1;
        if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
          pageCount = await getPdfPageCount(buffer);
        }

        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          sizeBytes: file.size,
          arrayBuffer: buffer,
          pageCount,
          previewUrl,
          virusScan: scanResult,
        });
      } catch (err) {
        // Quiet file read error
      }
    }

    if (scanAlerts.length > 0) {
      setRejectionErrors((prev) => [...prev, ...scanAlerts]);
    }

    if (newItems.length > 0) {
      if (onFilesAdded) {
        onFilesAdded(newItems);
      } else if (onFilesChange) {
        onFilesChange([...files, ...newItems]);
      }
    }
    setScanningFileName(null);
    setIsProcessing(false);
  }, [onFilesAdded, onFilesChange, files]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errors: string[] = [];
    fileRejections.forEach((rejection) => {
      const fileName = rejection.file.name;
      rejection.errors.forEach((err) => {
        if (err.code === 'file-invalid-type') {
          errors.push(`"${fileName}" has an invalid file format. Please upload supported documents (${getFormatBadgeText()}).`);
        } else if (err.code === 'file-too-large') {
          errors.push(`"${fileName}" exceeds maximum allowed file size (${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB).`);
        } else if (err.code === 'too-many-files') {
          errors.push(`Too many files selected. Maximum allowed is ${maxFiles} files.`);
        } else {
          errors.push(`"${fileName}": ${err.message}`);
        }
      });
    });
    setRejectionErrors(errors);
  }, [rawTypesStr, maxSizeBytes, maxFiles]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDropAccepted: processAcceptedFiles,
    onDropRejected,
    accept: getAcceptObject(rawTypesStr),
    multiple,
    maxFiles,
    maxSize: maxSizeBytes,
  } as any);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Upload Drop Zone Box powered by react-dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
          isDragReject
            ? 'border-red-500 bg-red-50/95 ring-8 ring-red-500/20 shadow-2xl shadow-red-500/20 scale-[1.03]'
            : isDragAccept || isDragActive
            ? 'border-emerald-500 bg-gradient-to-br from-emerald-100/90 via-teal-50 to-emerald-50/90 ring-8 ring-emerald-500/30 shadow-2xl shadow-emerald-500/25 scale-[1.03]'
            : 'border-slate-300/80 bg-slate-50/70 hover:border-emerald-500 hover:bg-emerald-50/20 hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/10'
        }`}
      >
        <input {...getInputProps()} />

        {/* Animated Radial Pulse Backdrop during active file drag */}
        {isDragActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-400/20 to-emerald-500/10 animate-pulse pointer-events-none" />
        )}

        {/* Active Drag Target Floating Highlighting Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md rounded-3xl p-6 text-white text-center animate-in zoom-in-95 fade-in duration-200 border-2 border-emerald-400">
            <div className="relative mb-3">
              <div className="absolute -inset-4 rounded-full bg-emerald-400/30 animate-ping" />
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl relative z-10 animate-bounce ${
                isDragReject ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-emerald-500 text-slate-950 shadow-emerald-500/50 scale-110'
              }`}>
                {isDragReject ? <AlertCircle size={40} className="stroke-[2.5]" /> : <FileUp size={40} className="stroke-[2.5]" />}
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-300">
              {isDragReject ? 'Unsupported Format' : 'Drop Files to Upload Instantly!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 font-semibold max-w-sm">
              {isDragReject ? 'Please select supported files.' : 'Release cursor to process files locally in browser'}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-xs font-mono font-bold text-emerald-200 shadow-xs">
              <Sparkles size={14} className="text-emerald-300 animate-pulse" />
              <span>100% Private Client-Side Conversion</span>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          
          {/* Dynamic Animated Icon Badge */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
              isDragReject
                ? 'bg-red-600 text-white shadow-red-500/30 animate-bounce'
                : isDragActive
                ? 'bg-emerald-600 text-white shadow-emerald-500/40 scale-125'
                : 'bg-emerald-600 text-white shadow-emerald-500/25 group-hover:shadow-emerald-500/40'
            }`}
          >
            {isProcessing ? (
              <span className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isDragReject ? (
              <AlertCircle size={32} className="stroke-[2.2]" />
            ) : isDragActive ? (
              <CheckCircle2 size={32} className="stroke-[2.2] animate-pulse" />
            ) : (
              <FileUp size={32} className="stroke-[2.2] group-hover:-translate-y-0.5 transition-transform" />
            )}
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-2xl tracking-tight">
              {isDragReject
                ? 'Unsupported File Type'
                : isDragActive
                ? 'Drop Files Now to Upload'
                : effectiveTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto font-medium">
              {isDragReject
                ? 'Some files dropped are not supported in this tool zone.'
                : subtitle}
            </p>
          </div>

          {/* Action Trigger Pill Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`px-6 py-2.5 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                isDragReject
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 group-hover:scale-105'
              }`}
            >
              <Upload size={16} /> Choose Documents
            </button>
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">
              or drag and drop files here
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
            <span className="bg-slate-200/80 px-2 py-0.5 rounded-md text-slate-700">
              {getFormatBadgeText()}
            </span>
            <span>•</span>
            <span>Up to {(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB per file</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">100% Private Local Processing</span>
          </div>

        </div>
      </div>

      {/* Live Virus & Payload Scanning Overlay */}
      {isProcessing && (
        <VirusScanOverlay
          fileName={scanningFileName || 'Uploaded Document'}
          isScanning={isProcessing}
        />
      )}

      {/* Validation / Rejection Error Banner */}
      {rejectionErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>File Validation Notice ({rejectionErrors.length})</span>
            </div>
            <button
              onClick={() => setRejectionErrors([])}
              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <ul className="list-disc list-inside text-xs text-red-700 space-y-1 pl-1">
            {rejectionErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                Uploaded Documents ({files.length})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                {...getRootProps()}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add More Files
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs transition-colors group"
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <div className="shrink-0">
                    {item.previewUrl ? (
                      <div className="w-9 h-9 rounded-lg border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                        <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <FileTypeIcon fileName={item.name} mimeType={item.file?.type} showBadgeText={true} />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{formatSize(item.sizeBytes)}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        {item.pageCount ? `${item.pageCount} page(s)` : 'Document'}
                      </span>
                      {item.virusScan && (
                        <SecurityBadge scanResult={item.virusScan} compact={true} />
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  title="Remove file"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
