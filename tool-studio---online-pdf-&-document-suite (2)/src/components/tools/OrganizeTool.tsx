import React, { useState } from 'react';
import { LayoutGrid, Download, ArrowLeft, RotateCw, Trash2, CheckCircle2 } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { organizePdfPages, downloadBytesAsFile } from '../../lib/pdfEngine';

interface OrganizeToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const OrganizeTool: React.FC<OrganizeToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [pagesList, setPagesList] = useState<{ id: string; originalIndex: number; rotation: number }[]>([]);
  const [isOrganizing, setIsOrganizing] = useState(false);

  const selectedFile = files[0];

  const handleFileAdded = (items: UploadedFileItem[]) => {
    setFiles(items);
    if (items[0]) {
      const count = items[0].pageCount || 1;
      const initialPages = Array.from({ length: count }, (_, i) => ({
        id: `pg-${i}`,
        originalIndex: i,
        rotation: 0,
      }));
      setPagesList(initialPages);
    }
  };

  const rotatePage = (idx: number) => {
    const updated = [...pagesList];
    updated[idx].rotation = (updated[idx].rotation + 90) % 360;
    setPagesList(updated);
  };

  const deletePage = (idx: number) => {
    setPagesList(pagesList.filter((_, i) => i !== idx));
  };

  const handleSaveOrganized = async () => {
    if (!selectedFile || pagesList.length === 0) return;
    setIsOrganizing(true);
    try {
      const bytes = await organizePdfPages(selectedFile.arrayBuffer, pagesList);
      downloadBytesAsFile(bytes, `organized_${selectedFile.name}`);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Error organizing PDF pages: ' + err.message);
    } finally {
      setIsOrganizing(false);
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
          <LayoutGrid size={20} className="text-rose-600" />
          <h2 className="text-xl font-extrabold text-slate-900">Organize & Reorder Pages</h2>
        </div>
      </div>

      {!selectedFile ? (
        <DragDropZone
          files={files}
          multiple={false}
          onFilesAdded={handleFileAdded}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF to Organize Pages"
          subtitle="Visual page thumbnails to reorder, delete, or rotate pages."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{selectedFile.name}</h4>
              <p className="text-xs text-slate-500">{pagesList.length} pages remaining</p>
            </div>
            <button
              onClick={handleSaveOrganized}
              disabled={isOrganizing || pagesList.length === 0}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isOrganizing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Download size={14} /> Export Organized PDF
                </>
              )}
            </button>
          </div>

          {/* Visual Page Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pagesList.map((pg, idx) => (
              <div
                key={pg.id}
                className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all space-y-2 relative group"
              >
                <div
                  style={{ transform: `rotate(${pg.rotation}deg)` }}
                  className="h-32 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center transition-transform"
                >
                  <span className="text-xs font-black text-slate-400">Page {pg.originalIndex + 1}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-slate-700">#{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => rotatePage(idx)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                      title="Rotate page"
                    >
                      <RotateCw size={14} />
                    </button>
                    <button
                      onClick={() => deletePage(idx)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer"
                      title="Delete page"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
