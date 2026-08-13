import React, { useState } from 'react';
import { Edit3, Type, Type as FontIcon, Pen, Highlighter, Save, Download, ArrowLeft, Trash2, Check } from 'lucide-react';
import { UploadedFileItem, AnnotationItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { applyAnnotationsToPdf, downloadBytesAsFile } from '../../lib/pdfEngine';

interface EditAnnotateToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const EditAnnotateTool: React.FC<EditAnnotateToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [activeMode, setActiveMode] = useState<'text' | 'draw' | 'select'>('text');
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [textInput, setTextInput] = useState('Confidential Document');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [fontSize, setFontSize] = useState(18);
  const [isSaving, setIsSaving] = useState(false);

  const selectedFile = files[0];

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeMode === 'text') {
      const newAnn: AnnotationItem = {
        id: `ann-${Date.now()}`,
        type: 'text',
        pageIndex: 0,
        x,
        y,
        text: textInput,
        fontSize,
        color: selectedColor,
      };
      setAnnotations([...annotations, newAnn]);
    }
  };

  const removeAnnotation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnnotations(annotations.filter((a) => a.id !== id));
  };

  const handleSaveAndDownload = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    try {
      const bytes = await applyAnnotationsToPdf(selectedFile.arrayBuffer, annotations);
      downloadBytesAsFile(bytes, `edited_${selectedFile.name}`);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error saving edited PDF: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft size={16} /> All Tools
        </button>
        <div className="flex items-center gap-2">
          <Edit3 size={20} className="text-blue-600" />
          <h2 className="text-xl font-extrabold text-slate-900">PDF Editor & Annotator</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF to Edit & Annotate"
          subtitle="Add text, annotations, highlights, and markings."
        />
      ) : (
        <div className="space-y-4">
          
          {/* Editor Control Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMode('text')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMode === 'text'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Type size={14} /> Add Text
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              {/* Text Input Control */}
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Text to insert..."
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden"
              />

              {/* Color Selector */}
              <div className="flex items-center gap-1">
                {['#2563eb', '#dc2626', '#16a34a', '#000000', '#d97706'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border border-white cursor-pointer ${
                      selectedColor === c ? 'ring-2 ring-slate-900 scale-110' : ''
                    }`}
                  ></button>
                ))}
              </div>

              {/* Font Size */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value={14}>14px</option>
                <option value={18}>18px</option>
                <option value={24}>24px</option>
                <option value={32}>32px</option>
              </select>
            </div>

            <button
              onClick={handleSaveAndDownload}
              disabled={isSaving}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Download size={14} /> Save & Download PDF
                </>
              )}
            </button>
          </div>

          {/* Interactive Document Preview Canvas */}
          <div className="bg-slate-100 rounded-3xl p-6 flex justify-center border border-slate-200 overflow-x-auto min-h-[500px]">
            <div
              onClick={handleCanvasClick}
              className="relative bg-white w-[595px] h-[700px] shadow-2xl rounded-xl p-8 border border-slate-200 cursor-crosshair select-none overflow-hidden"
            >
              {/* Document Mock Background Representation */}
              <div className="space-y-4 text-slate-300 pointer-events-none">
                <div className="h-6 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-100 rounded"></div>
                <div className="h-32 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-6"></div>
                <div className="h-4 w-full bg-slate-100 rounded mt-6"></div>
                <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
              </div>

              {/* Render User Annotations */}
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    left: `${ann.x}px`,
                    top: `${ann.y}px`,
                    color: ann.color,
                    fontSize: `${ann.fontSize}px`,
                  }}
                  className="absolute font-bold cursor-pointer group flex items-center gap-1 bg-white/70 px-1.5 py-0.5 rounded border border-dashed border-blue-400 hover:border-blue-600"
                >
                  <span>{ann.text}</span>
                  <button
                    onClick={(e) => removeAnnotation(ann.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 p-0.5"
                    title="Delete annotation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <div className="absolute bottom-4 right-4 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                Click anywhere on document to place text
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
