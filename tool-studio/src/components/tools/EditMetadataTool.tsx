import React, { useState, useEffect } from 'react';
import { Tag, Download, ArrowLeft, CheckCircle2, ShieldCheck, FileText, User, BookOpen, Key, Cpu, Sparkles, RefreshCw } from 'lucide-react';
import { UploadedFileItem } from '../../types';
import { DragDropZone } from '../DragDropZone';
import { readPdfMetadata, updatePdfMetadata, downloadBytesAsFile, PdfMetadataInfo } from '../../lib/pdfEngine';
import { BatchProcessor } from '../BatchProcessor';
import { SecurityBadge } from '../VirusScanStatus';

interface EditMetadataToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export const EditMetadataTool: React.FC<EditMetadataToolProps> = ({ onBack, onSuccessAction }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [metadata, setMetadata] = useState<PdfMetadataInfo>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
  });
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedFile = files[0];

  // Load existing metadata whenever selected file changes
  useEffect(() => {
    if (!selectedFile) {
      setMetadata({
        title: '',
        author: '',
        subject: '',
        keywords: '',
        creator: '',
        producer: '',
      });
      setIsSuccess(false);
      return;
    }

    let isMounted = true;
    setIsLoadingMetadata(true);

    readPdfMetadata(selectedFile.arrayBuffer)
      .then((data) => {
        if (isMounted) {
          setMetadata({
            title: data.title || selectedFile.name.replace(/\.pdf$/i, ''),
            author: data.author || '',
            subject: data.subject || '',
            keywords: data.keywords || '',
            creator: data.creator || 'Tool Studio PDF Editor',
            producer: data.producer || 'pdf-lib (https://pdf-lib.js.org)',
            creationDate: data.creationDate,
            modificationDate: data.modificationDate,
            pageCount: data.pageCount || selectedFile.pageCount,
          });
        }
      })
      .catch(() => {
        // Quiet handling
      })
      .finally(() => {
        if (isMounted) setIsLoadingMetadata(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFile]);

  // Handler for single file save
  const handleSaveMetadata = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    setIsSuccess(false);

    try {
      const updatedBytes = await updatePdfMetadata(selectedFile.arrayBuffer, {
        title: metadata.title,
        author: metadata.author,
        subject: metadata.subject,
        keywords: metadata.keywords,
        creator: metadata.creator,
        producer: metadata.producer,
      });

      downloadBytesAsFile(updatedBytes, `metadata_${selectedFile.name}`);
      setIsSuccess(true);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      alert('Failed to update PDF metadata: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for batch processing
  const processSingleBatchItem = async (
    item: UploadedFileItem,
    onProgress: (pct: number) => void
  ) => {
    onProgress(30);
    const updatedBytes = await updatePdfMetadata(item.arrayBuffer, {
      title: metadata.title || item.name.replace(/\.pdf$/i, ''),
      author: metadata.author,
      subject: metadata.subject,
      keywords: metadata.keywords,
      creator: metadata.creator || 'Tool Studio PDF Editor',
      producer: metadata.producer || 'pdf-lib Engine',
    });
    onProgress(100);

    return {
      resultBuffer: updatedBytes.buffer,
      resultName: `metadata_${item.name}`,
    };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> All Tools
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Tag size={18} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Edit PDF Metadata</h2>
            <p className="text-xs text-slate-500">View and modify PDF Title, Author, Subject, Keywords, and Creator properties.</p>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <DragDropZone
          files={files}
          multiple={true}
          onFilesAdded={(items) => setFiles(items)}
          onRemoveFile={() => setFiles([])}
          onClearAll={() => setFiles([])}
          title="Select PDF file to edit metadata"
          subtitle="Inspect and update PDF tags, author credits, title indexing, and document properties."
        />
      ) : files.length > 1 ? (
        /* Batch Metadata Editor Mode */
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-400">
                  <Tag size={18} /> Batch Metadata Configurator ({files.length} Files Selected)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Configure global metadata attributes to apply across all selected PDF documents.
                </p>
              </div>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-red-400 font-bold hover:underline cursor-pointer"
              >
                Clear Batch
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={metadata.author}
                  onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                  placeholder="e.g., Jane Doe, Legal Department"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Description</label>
                <input
                  type="text"
                  value={metadata.subject}
                  onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                  placeholder="e.g., Q3 Financial Report 2026"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={metadata.keywords}
                  onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                  placeholder="e.g., Finance, Audit, Confidential"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Creator / Application</label>
                <input
                  type="text"
                  value={metadata.creator}
                  onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                  placeholder="e.g., Tool Studio PDF Publisher"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <BatchProcessor
            files={files}
            toolName="Edit Metadata"
            processSingleItem={processSingleBatchItem}
            onComplete={() => {
              if (onSuccessAction) onSuccessAction();
            }}
          />
        </div>
      ) : (
        /* Single File Inspector & Editor */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* File Overview Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                PDF
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm truncate max-w-xs">{selectedFile.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{(selectedFile.sizeBytes / 1024).toFixed(1)} KB</span> •
                  <span>{selectedFile.pageCount || metadata.pageCount || 1} page(s)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {selectedFile.virusScan && <SecurityBadge scanResult={selectedFile.virusScan} compact={true} />}
              <button
                onClick={() => setFiles([])}
                className="text-xs text-slate-600 font-bold hover:text-red-600 cursor-pointer transition-colors px-2 py-1 rounded bg-slate-200/60 hover:bg-slate-200"
              >
                Change File
              </button>
            </div>
          </div>

          {isLoadingMetadata ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw size={24} className="animate-spin mx-auto text-emerald-600" />
              <p className="text-xs font-bold text-slate-600">Reading PDF document properties & metadata tags...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Form Metadata Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Document Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <FileText size={14} className="text-emerald-600" /> Document Title
                  </label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="Enter document title..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                  <p className="text-[11px] text-slate-500">Displayed in browser title bars, PDF viewer tabs, and search engines.</p>
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <User size={14} className="text-blue-600" /> Author / Organization
                  </label>
                  <input
                    type="text"
                    value={metadata.author}
                    onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                    placeholder="e.g., John Smith, Acme Corp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-amber-600" /> Subject / Category
                  </label>
                  <input
                    type="text"
                    value={metadata.subject}
                    onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                    placeholder="e.g., Annual Financial Audit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Key size={14} className="text-purple-600" /> Keywords (Comma separated tags)
                  </label>
                  <input
                    type="text"
                    value={metadata.keywords}
                    onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                    placeholder="e.g., report, 2026, finance, confidential, audit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Creator */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Cpu size={14} className="text-teal-600" /> Creator Application
                  </label>
                  <input
                    type="text"
                    value={metadata.creator}
                    onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                    placeholder="e.g., Microsoft Word, Tool Studio"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Producer */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" /> PDF Producer Engine
                  </label>
                  <input
                    type="text"
                    value={metadata.producer}
                    onChange={(e) => setMetadata({ ...metadata, producer: e.target.value })}
                    placeholder="e.g., pdf-lib engine"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Advanced Properties Inspector Badge */}
              {(metadata.creationDate || metadata.modificationDate) && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-extrabold text-slate-800 text-xs mb-1">Document Timestamps Inspector</p>
                  {metadata.creationDate && (
                    <p className="flex justify-between">
                      <span className="text-slate-500">Created:</span>
                      <span className="font-mono font-semibold text-slate-800">{metadata.creationDate}</span>
                    </p>
                  )}
                  {metadata.modificationDate && (
                    <p className="flex justify-between">
                      <span className="text-slate-500">Last Modified:</span>
                      <span className="font-mono font-semibold text-slate-800">{metadata.modificationDate}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Metadata modifications stay 100% private in browser memory.</span>
                </div>

                <button
                  onClick={handleSaveMetadata}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Saving Metadata...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Saved & Downloaded!
                    </>
                  ) : (
                    <>
                      <Download size={16} /> Save & Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
