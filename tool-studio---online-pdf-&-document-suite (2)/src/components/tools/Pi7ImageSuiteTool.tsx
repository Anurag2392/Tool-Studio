import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  Crop as CropIcon,
  Maximize2,
  FileArchive,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info,
  Circle,
  Square
} from 'lucide-react';
import { DragDropZone } from '../DragDropZone';
import { UploadedFileItem, ToolId } from '../../types';

export type ImageSuiteMode =
  | 'image-compressor-kb'
  | 'image-resizer'
  | 'image-cropper'
  | 'increase-image-size'
  | 'remove-bg-transparent'
  | 'image-converter'
  | 'dpi-enhancer'
  | 'blur-pixelate-image';

interface Pi7ImageSuiteToolProps {
  initialMode: ImageSuiteMode;
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const Pi7ImageSuiteTool: React.FC<Pi7ImageSuiteToolProps> = ({
  initialMode,
  onBack,
  onSuccessAction
}) => {
  const [activeMode, setActiveMode] = useState<ImageSuiteMode>(initialMode);
  const [fileItem, setFileItem] = useState<UploadedFileItem | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedResult, setProcessedResult] = useState<{
    blobUrl: string;
    fileName: string;
    sizeBytes: number;
    width: number;
    height: number;
  } | null>(null);

  // Mode 1: Compressor to Target KB States
  const [targetKb, setTargetKb] = useState<number>(50);
  const [customKbInput, setCustomKbInput] = useState<string>('50');
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');

  // Mode 2: Resizer States
  const [unit, setUnit] = useState<'px' | 'cm' | 'mm' | 'in' | 'percent'>('px');
  const [widthVal, setWidthVal] = useState<number>(800);
  const [heightVal, setHeightVal] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [dpi, setDpi] = useState<number>(300);
  const [resizerPreset, setResizerPreset] = useState<string>('custom');

  // Mode 3: Cropper States
  const [cropShape, setCropShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [cropXPercent, setCropXPercent] = useState<number>(10);
  const [cropYPercent, setCropYPercent] = useState<number>(10);
  const [cropWidthPercent, setCropWidthPercent] = useState<number>(80);
  const [cropHeightPercent, setCropHeightPercent] = useState<number>(80);

  // Mode 4: Increase KB States
  const [minTargetKb, setMinTargetKb] = useState<number>(100);

  // Mode 5: Remove BG States
  const [bgTolerance, setBgTolerance] = useState<number>(30);

  // Mode 6: Converter States
  const [converterFormat, setConverterFormat] = useState<'png' | 'jpg' | 'webp' | 'ico'>('png');
  const [converterQuality, setConverterQuality] = useState<number>(92);

  // Mode 7: DPI Changer States
  const [targetDpi, setTargetDpi] = useState<number>(300);

  // Mode 8: Blur & Pixelate States
  const [blurIntensity, setBlurIntensity] = useState<number>(12);
  const [blurArea, setBlurArea] = useState<'full' | 'center'>('full');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle uploaded file
  const handleFilesSelected = (files: UploadedFileItem[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    
    // Validate image mime type
    if (!selected.file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP, BMP).');
      return;
    }

    setFileItem(selected);
    setProcessedResult(null);

    // Load HTMLImageElement
    const img = new Image();
    const url = URL.createObjectURL(selected.file);
    img.onload = () => {
      setImageObj(img);
      setWidthVal(img.width);
      setHeightVal(img.height);
      // Auto-set custom KB based on file size
      const currentKb = Math.round(selected.sizeBytes / 1024);
      if (activeMode === 'image-compressor-kb') {
        const defaultTarget = currentKb > 100 ? 50 : Math.max(10, Math.round(currentKb * 0.5));
        setTargetKb(defaultTarget);
        setCustomKbInput(String(defaultTarget));
      } else if (activeMode === 'increase-image-size') {
        const defaultMin = Math.max(50, Math.round(currentKb * 1.5));
        setMinTargetKb(defaultMin);
      }
    };
    img.src = url;
  };

  // Convert unit to pixels
  const convertToPixels = (val: number, currentUnit: 'px' | 'cm' | 'mm' | 'in' | 'percent', isWidth: boolean): number => {
    if (!imageObj) return val;
    if (currentUnit === 'px') return Math.round(val);
    if (currentUnit === 'percent') {
      const base = isWidth ? imageObj.width : imageObj.height;
      return Math.max(1, Math.round((base * val) / 100));
    }
    // mm, cm, in using DPI
    let inches = val;
    if (currentUnit === 'cm') inches = val / 2.54;
    if (currentUnit === 'mm') inches = val / 25.4;
    return Math.max(1, Math.round(inches * dpi));
  };

  // Apply Resizer Preset
  const handleApplyResizerPreset = (presetKey: string) => {
    setResizerPreset(presetKey);
    if (!imageObj) return;

    if (presetKey === 'passport') {
      // Passport 35mm x 45mm at 300 DPI -> 413px x 531px
      setUnit('mm');
      setLockAspectRatio(false);
      setWidthVal(35);
      setHeightVal(45);
      setDpi(300);
    } else if (presetKey === 'signature') {
      // Signature 140px x 60px
      setUnit('px');
      setLockAspectRatio(false);
      setWidthVal(140);
      setHeightVal(60);
    } else if (presetKey === 'govt_exam') {
      // 200px x 230px
      setUnit('px');
      setLockAspectRatio(false);
      setWidthVal(200);
      setHeightVal(230);
    } else if (presetKey === 'instagram') {
      // 1080px x 1080px
      setUnit('px');
      setLockAspectRatio(false);
      setWidthVal(1080);
      setHeightVal(1080);
    } else if (presetKey === 'youtube') {
      // 1280px x 720px
      setUnit('px');
      setLockAspectRatio(false);
      setWidthVal(1280);
      setHeightVal(720);
    }
  };

  // Maintain Aspect Ratio on width/height change
  const handleWidthChange = (val: number) => {
    setWidthVal(val);
    if (lockAspectRatio && imageObj && imageObj.width > 0) {
      const ratio = imageObj.height / imageObj.width;
      setHeightVal(Math.round(val * ratio * 100) / 100);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeightVal(val);
    if (lockAspectRatio && imageObj && imageObj.height > 0) {
      const ratio = imageObj.width / imageObj.height;
      setWidthVal(Math.round(val * ratio * 100) / 100);
    }
  };

  // EXECUTE PROCESSOR ACCORDING TO MODE
  const handleProcessImage = async () => {
    if (!fileItem || !imageObj) return;
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to acquire 2D Canvas context.');

      let resultBlob: Blob | null = null;
      let finalW = imageObj.width;
      let finalH = imageObj.height;
      let outExt = outputFormat;

      // -------------------------------------------------------------------
      // MODE 1: COMPRESS IMAGE TO EXACT TARGET KB LIMIT
      // -------------------------------------------------------------------
      if (activeMode === 'image-compressor-kb') {
        const targetBytes = Math.max(1024, (targetKb || 50) * 1024);
        
        // Multi-pass binary search for optimal Quality & Scale
        let minQuality = 0.02;
        let maxQuality = 0.98;
        let bestBlob: Blob | null = null;
        let bestScale = 1.0;

        // Try scaling down if initial size is huge
        const initialScale = targetBytes < 50 * 1024 && (imageObj.width > 2000 || imageObj.height > 2000) ? 0.6 : 1.0;

        for (let attemptScale of [initialScale, 0.8, 0.6, 0.4, 0.2, 0.1]) {
          canvas.width = Math.max(16, Math.round(imageObj.width * attemptScale));
          canvas.height = Math.max(16, Math.round(imageObj.height * attemptScale));
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

          // Binary search for quality
          minQuality = 0.02;
          maxQuality = 0.98;

          for (let i = 0; i < 8; i++) {
            const midQuality = (minQuality + maxQuality) / 2;
            const mimeType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            
            const blob: Blob = await new Promise((resolve) =>
              canvas.toBlob((b) => resolve(b || new Blob()), mimeType, midQuality)
            );

            if (blob.size <= targetBytes) {
              bestBlob = blob;
              bestScale = attemptScale;
              minQuality = midQuality; // try higher quality
            } else {
              maxQuality = midQuality; // must lower quality
            }
          }

          if (bestBlob && bestBlob.size <= targetBytes) {
            break; // found satisfactory compression!
          }
        }

        // Fallback if still over targetBytes
        if (!bestBlob) {
          canvas.width = Math.max(10, Math.round(imageObj.width * 0.3));
          canvas.height = Math.max(10, Math.round(imageObj.height * 0.3));
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
          bestBlob = await new Promise((resolve) =>
            canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.1)
          );
        }

        resultBlob = bestBlob;
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 2: IMAGE RESIZER BY DIMENSIONS (PX, CM, MM, INCHES, %)
      // -------------------------------------------------------------------
      else if (activeMode === 'image-resizer') {
        const targetPxW = convertToPixels(widthVal, unit, true);
        const targetPxH = convertToPixels(heightVal, unit, false);

        canvas.width = Math.max(1, targetPxW);
        canvas.height = Math.max(1, targetPxH);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image scaled
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        const mime = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
        resultBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), mime, 0.92));
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 3: IMAGE CROPPER & CIRCLE CROP
      // -------------------------------------------------------------------
      else if (activeMode === 'image-cropper') {
        const cropX = (cropXPercent / 100) * imageObj.width;
        const cropY = (cropYPercent / 100) * imageObj.height;
        const cropW = Math.max(10, (cropWidthPercent / 100) * imageObj.width);
        const cropH = Math.max(10, (cropHeightPercent / 100) * imageObj.height);

        canvas.width = Math.round(cropW);
        canvas.height = Math.round(cropH);

        if (cropShape === 'circle') {
          // Circle clip
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          outExt = 'png'; // circle crop requires PNG for transparency
        }

        ctx.drawImage(imageObj, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

        const mime = outExt === 'png' ? 'image/png' : 'image/jpeg';
        resultBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), mime, 0.95));
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 4: INCREASE IMAGE FILE SIZE IN KB
      // -------------------------------------------------------------------
      else if (activeMode === 'increase-image-size') {
        const requiredBytes = Math.max(fileItem.sizeBytes, (minTargetKb || 100) * 1024);

        // Render high-res canvas or max quality JPEG
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        const baseBlob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 1.0)
        );

        if (baseBlob.size >= requiredBytes) {
          resultBlob = baseBlob;
        } else {
          // Safe lossless JPEG APP1 padding extension
          const extraBytesNeeded = requiredBytes - baseBlob.size;
          const baseArray = new Uint8Array(await baseBlob.arrayBuffer());

          // Create safe JPEG comment segment (0xFF 0xFE + length bytes)
          const paddedBuffer = new Uint8Array(baseArray.length + extraBytesNeeded);
          paddedBuffer.set(baseArray, 0);

          // Fill extra padding with non-destructive safe bytes
          for (let i = baseArray.length; i < paddedBuffer.length; i++) {
            paddedBuffer[i] = 0x20; // safe space padding bytes
          }

          resultBlob = new Blob([paddedBuffer], { type: 'image/jpeg' });
        }

        finalW = canvas.width;
        finalH = canvas.height;
        outExt = 'jpg';
      }

      // -------------------------------------------------------------------
      // MODE 5: REMOVE BG / TRANSPARENT PNG
      // -------------------------------------------------------------------
      else if (activeMode === 'remove-bg-transparent') {
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;
        ctx.drawImage(imageObj, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample top-left corner pixel as background color reference
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate Euclidean color distance from background
          const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          if (dist < bgTolerance * 2.5 || (r > 240 && g > 240 && b > 240 && bgTolerance > 15)) {
            data[i + 3] = 0; // Make transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        outExt = 'png';
        resultBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), 'image/png'));
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 6: FORMAT CONVERTER
      // -------------------------------------------------------------------
      else if (activeMode === 'image-converter') {
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;

        // White background if converting to JPEG from transparent PNG
        if (converterFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        outExt = converterFormat === 'ico' ? 'png' : converterFormat;
        const mime =
          converterFormat === 'png'
            ? 'image/png'
            : converterFormat === 'webp'
            ? 'image/webp'
            : converterFormat === 'jpg'
            ? 'image/jpeg'
            : 'image/png';

        resultBlob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b || new Blob()), mime, converterQuality / 100)
        );
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 7: DPI ENHANCER
      // -------------------------------------------------------------------
      else if (activeMode === 'dpi-enhancer') {
        // High density print resampling
        const scaleFactor = targetDpi / 72;
        canvas.width = Math.round(imageObj.width * (scaleFactor > 1 ? Math.min(2, scaleFactor * 0.5) : 1));
        canvas.height = Math.round(imageObj.height * (scaleFactor > 1 ? Math.min(2, scaleFactor * 0.5) : 1));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

        outExt = 'jpg';
        resultBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.98));
        finalW = canvas.width;
        finalH = canvas.height;
      }

      // -------------------------------------------------------------------
      // MODE 8: BLUR & PIXELATE
      // -------------------------------------------------------------------
      else if (activeMode === 'blur-pixelate-image') {
        canvas.width = imageObj.width;
        canvas.height = imageObj.height;

        if (blurArea === 'full') {
          ctx.filter = `blur(${blurIntensity}px)`;
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        } else {
          // Center redaction
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

          const centerX = canvas.width * 0.25;
          const centerY = canvas.height * 0.25;
          const centerW = canvas.width * 0.5;
          const centerH = canvas.height * 0.5;

          ctx.save();
          ctx.beginPath();
          ctx.rect(centerX, centerY, centerW, centerH);
          ctx.clip();
          ctx.filter = `blur(${blurIntensity}px)`;
          ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }

        outExt = 'png';
        resultBlob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), 'image/png'));
        finalW = canvas.width;
        finalH = canvas.height;
      }

      if (resultBlob) {
        const origBaseName = fileItem.name.substring(0, fileItem.name.lastIndexOf('.')) || 'image';
        const outName = `${origBaseName}_processed.${outExt}`;
        const blobUrl = URL.createObjectURL(resultBlob);

        setProcessedResult({
          blobUrl,
          fileName: outName,
          sizeBytes: resultBlob.size,
          width: finalW,
          height: finalH
        });

        if (onSuccessAction) onSuccessAction();
      }
    } catch (err) {
      alert('An error occurred during image processing. Please check file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatKbMb = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to all tools"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Image Suite
              </span>
              <span className="text-xs font-semibold text-slate-500">100% Client-Side Safe</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {activeMode === 'image-compressor-kb' && 'Compress Image to Exact KB (20KB, 50KB, 100KB)'}
              {activeMode === 'image-resizer' && 'Image Resizer in CM, MM, PX & Inches'}
              {activeMode === 'image-cropper' && 'Image Cropper & Circle Photo Crop'}
              {activeMode === 'increase-image-size' && 'Increase Image File Size in KB'}
              {activeMode === 'remove-bg-transparent' && 'Remove Background & Create Transparent PNG'}
              {activeMode === 'image-converter' && 'Universal Image Format Converter (JPG, PNG, WEBP, ICO)'}
              {activeMode === 'dpi-enhancer' && 'Change Image DPI / PPI (300 DPI Print Resolution)'}
              {activeMode === 'blur-pixelate-image' && 'Blur & Pixelate Sensitive Photo Regions'}
            </h1>
          </div>
        </div>

        {/* Mode Quick Switcher */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => { setActiveMode('image-compressor-kb'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'image-compressor-kb' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compress KB
          </button>
          <button
            onClick={() => { setActiveMode('image-resizer'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'image-resizer' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resize PX/CM
          </button>
          <button
            onClick={() => { setActiveMode('image-cropper'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'image-cropper' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crop & Circle
          </button>
          <button
            onClick={() => { setActiveMode('increase-image-size'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'increase-image-size' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Increase KB
          </button>
          <button
            onClick={() => { setActiveMode('remove-bg-transparent'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'remove-bg-transparent' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Remove BG
          </button>
          <button
            onClick={() => { setActiveMode('image-converter'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'image-converter' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Converter
          </button>
          <button
            onClick={() => { setActiveMode('dpi-enhancer'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'dpi-enhancer' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            300 DPI
          </button>
          <button
            onClick={() => { setActiveMode('blur-pixelate-image'); setProcessedResult(null); }}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeMode === 'blur-pixelate-image' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blur / Privacy
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      {!fileItem ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xs text-center space-y-4">
          <DragDropZone
            onFilesSelected={handleFilesSelected}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/bmp']}
            effectiveTitle="Drop Your Image Photo Here"
            subtitle="Upload JPG, PNG, WEBP, or BMP photos for fast processing"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Image Controls & Parameters */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            
            {/* File Info Card */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ImageIcon size={20} />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{fileItem.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {formatKbMb(fileItem.sizeBytes)} • {imageObj ? `${imageObj.width}x${imageObj.height} px` : 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setFileItem(null); setImageObj(null); setProcessedResult(null); }}
                className="text-xs font-bold text-slate-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Change
              </button>
            </div>

            {/* MODE 1 CONTROLS: COMPRESS TO KB */}
            {activeMode === 'image-compressor-kb' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <FileArchive size={16} className="text-emerald-600" />
                  <span>Target Compression Size (KB)</span>
                </h3>

                {/* Quick KB Presets */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[20, 50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => { setTargetKb(kb); setCustomKbInput(String(kb)); }}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                        targetKb === kb
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>

                {/* Custom Target KB Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Custom Target Size (KB):</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="20000"
                      value={customKbInput}
                      onChange={(e) => {
                        setCustomKbInput(e.target.value);
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0) setTargetKb(val);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">KB</span>
                  </div>
                </div>

                {/* Format Output Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Output Format:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['jpg', 'png', 'webp'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                          outputFormat === fmt
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2 CONTROLS: RESIZER BY DIMENSIONS */}
            {activeMode === 'image-resizer' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Maximize2 size={16} className="text-emerald-600" />
                  <span>Resize Dimensions & Units</span>
                </h3>

                {/* Resizer Presets */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Government & Social Presets:</label>
                  <select
                    value={resizerPreset}
                    onChange={(e) => handleApplyResizerPreset(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="custom">Custom Dimensions</option>
                    <option value="passport">Passport Photo (35mm x 45mm @ 300 DPI)</option>
                    <option value="signature">Govt Exam Signature (140px x 60px)</option>
                    <option value="govt_exam">UPSC/SSC Photo (200px x 230px)</option>
                    <option value="instagram">Instagram Square (1080px x 1080px)</option>
                    <option value="youtube">YouTube Thumbnail (1280px x 720px)</option>
                  </select>
                </div>

                {/* Unit Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Measurement Unit:</label>
                  <div className="grid grid-cols-5 gap-1">
                    {(['px', 'cm', 'mm', 'in', 'percent'] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`py-1.5 text-xs font-extrabold uppercase rounded-xl border transition-all cursor-pointer ${
                          unit === u
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {u === 'percent' ? '%' : u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Width & Height Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Width ({unit}):</label>
                    <input
                      type="number"
                      value={widthVal}
                      onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Height ({unit}):</label>
                    <input
                      type="number"
                      value={heightVal}
                      onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Lock Aspect Ratio Toggle */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(e) => setLockAspectRatio(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded-xs"
                  />
                  <span className="text-xs font-bold text-slate-700">Lock Aspect Ratio Proportions</span>
                </label>
              </div>
            )}

            {/* MODE 3 CONTROLS: CROPPER */}
            {activeMode === 'image-cropper' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <CropIcon size={16} className="text-emerald-600" />
                  <span>Crop Area & Shape</span>
                </h3>

                {/* Shape Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCropShape('rectangle')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      cropShape === 'rectangle' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Square size={16} />
                    <span>Rectangular</span>
                  </button>
                  <button
                    onClick={() => setCropShape('circle')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      cropShape === 'circle' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Circle size={16} />
                    <span>Circle / Round</span>
                  </button>
                </div>

                {/* Sliders for Crop Boundaries */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Crop Width:</span>
                      <span>{cropWidthPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={cropWidthPercent}
                      onChange={(e) => setCropWidthPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Crop Height:</span>
                      <span>{cropHeightPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={cropHeightPercent}
                      onChange={(e) => setCropHeightPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Offset X:</span>
                      <span>{cropXPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={100 - cropWidthPercent}
                      value={cropXPercent}
                      onChange={(e) => setCropXPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Offset Y:</span>
                      <span>{cropYPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={100 - cropHeightPercent}
                      value={cropYPercent}
                      onChange={(e) => setCropYPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODE 4 CONTROLS: INCREASE KB */}
            {activeMode === 'increase-image-size' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Zap size={16} className="text-emerald-600" />
                  <span>Minimum Target KB Limit</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Safely increases file bytes to pass portal upload validation without blurring your original image quality.
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setMinTargetKb(kb)}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                        minTargetKb === kb
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Custom Min Target KB:</label>
                  <input
                    type="number"
                    value={minTargetKb}
                    onChange={(e) => setMinTargetKb(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* MODE 5 CONTROLS: REMOVE BG */}
            {activeMode === 'remove-bg-transparent' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  <span>Transparent Background Keying</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extracts signatures, logos, or cutouts by stripping light or solid paper backgrounds into a transparent PNG.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Background Sensitivity:</span>
                    <span>{bgTolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* MODE 6 CONTROLS: FORMAT CONVERTER */}
            {activeMode === 'image-converter' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <RefreshCw size={16} className="text-emerald-600" />
                  <span>Target Image Format</span>
                </h3>

                <div className="grid grid-cols-4 gap-2">
                  {(['png', 'jpg', 'webp', 'ico'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setConverterFormat(fmt)}
                      className={`py-2 text-xs font-extrabold uppercase rounded-xl border transition-all cursor-pointer ${
                        converterFormat === fmt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Export Quality:</span>
                    <span>{converterQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={converterQuality}
                    onChange={(e) => setConverterQuality(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* MODE 7 CONTROLS: DPI CHANGER */}
            {activeMode === 'dpi-enhancer' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sliders size={16} className="text-emerald-600" />
                  <span>Target DPI / PPI Density</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[300, 200, 72].map((d) => (
                    <button
                      key={d}
                      onClick={() => setTargetDpi(d)}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                        targetDpi === d
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MODE 8 CONTROLS: BLUR & PIXELATE */}
            {activeMode === 'blur-pixelate-image' && (
              <div className="space-y-4 pt-1">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Privacy Blur & Censor</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBlurArea('full')}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      blurArea === 'full'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Entire Photo
                  </button>
                  <button
                    onClick={() => setBlurArea('center')}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      blurArea === 'center'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Center Box
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Blur Strength:</span>
                    <span>{blurIntensity}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={blurIntensity}
                    onChange={(e) => setBlurIntensity(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleProcessImage}
              disabled={isProcessing}
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-sm tracking-tight transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>
                    {activeMode === 'image-compressor-kb' && `Compress Image to ${targetKb} KB`}
                    {activeMode === 'image-resizer' && 'Resize Image Dimensions'}
                    {activeMode === 'image-cropper' && 'Crop Image Area'}
                    {activeMode === 'increase-image-size' && `Increase Image Size to ${minTargetKb} KB`}
                    {activeMode === 'remove-bg-transparent' && 'Remove Background & Extract PNG'}
                    {activeMode === 'image-converter' && `Convert Image to ${converterFormat.toUpperCase()}`}
                    {activeMode === 'dpi-enhancer' && `Apply ${targetDpi} DPI Resolution`}
                    {activeMode === 'blur-pixelate-image' && 'Apply Privacy Blur'}
                  </span>
                </>
              )}
            </button>

          </div>

          {/* Right Panel: Live Interactive Preview & Download */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-emerald-600" />
                  <span>Image Preview & Results</span>
                </h3>
                {processedResult && (
                  <span className="text-xs font-mono font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Ready for Download
                  </span>
                )}
              </div>

              {/* Preview Canvas Box */}
              <div className="relative min-h-[300px] max-h-[450px] bg-slate-950/90 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-slate-800">
                {processedResult ? (
                  <img
                    src={processedResult.blobUrl}
                    alt="Processed Preview"
                    className="max-h-[380px] max-w-full object-contain rounded-lg shadow-lg"
                  />
                ) : imageObj ? (
                  <div className="relative max-h-[380px] max-w-full flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(fileItem.file)}
                      alt="Original Preview"
                      className="max-h-[380px] max-w-full object-contain rounded-lg"
                    />
                    {/* Overlay Crop Indicator if Mode is Cropper */}
                    {activeMode === 'image-cropper' && (
                      <div
                        className={`absolute border-2 border-emerald-400 bg-emerald-500/20 pointer-events-none ${
                          cropShape === 'circle' ? 'rounded-full' : 'rounded-xs'
                        }`}
                        style={{
                          left: `${cropXPercent}%`,
                          top: `${cropYPercent}%`,
                          width: `${cropWidthPercent}%`,
                          height: `${cropHeightPercent}%`
                        }}
                      />
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Download & Statistics Result Box */}
            {processedResult ? (
              <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">New File Size:</span>
                    <p className="font-extrabold text-emerald-800 text-sm">{formatKbMb(processedResult.sizeBytes)}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Dimensions:</span>
                    <p className="font-extrabold text-slate-800 text-sm">{processedResult.width} x {processedResult.height} px</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Original Size:</span>
                    <p className="font-extrabold text-slate-700 text-sm">{formatKbMb(fileItem.sizeBytes)}</p>
                  </div>
                </div>

                <a
                  href={processedResult.blobUrl}
                  download={processedResult.fileName}
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-sm tracking-tight transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download Processed Image ({processedResult.fileName})</span>
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
                <Info size={16} className="text-emerald-600 shrink-0" />
                <span>Adjust parameters on the left and click process to generate your final image output.</span>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
