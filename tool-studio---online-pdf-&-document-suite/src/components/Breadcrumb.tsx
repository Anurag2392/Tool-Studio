import React, { useEffect } from 'react';
import { ChevronRight, Home, Wrench, Shield, FileText, Settings, Sparkles } from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsList';
import { ToolId } from '../types';

interface BreadcrumbProps {
  currentToolId: ToolId | null;
  onSelectTool: (id: ToolId | null) => void;
  categoryFilter?: string | null;
  onSelectCategory?: (cat: string | null) => void;
  customPageName?: string | null;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentToolId,
  onSelectTool,
  categoryFilter,
  onSelectCategory,
  customPageName,
}) => {
  const activeTool = currentToolId ? TOOLS_LIST.find((t) => t.id === currentToolId) : null;

  // Map Category code to Human Label
  const getCategoryLabel = (catCode?: string): string => {
    switch (catCode) {
      case 'popular':
        return 'Popular PDF Tools';
      case 'organize-split':
        return 'Organize & Split';
      case 'edit-convert':
        return 'Edit & Convert';
      case 'ai-tools':
        return 'AI Document Suite';
      case 'security-sign':
        return 'Security & Sign';
      case 'calculators':
        return 'Calculators Suite';
      default:
        return 'PDF Utility Tools';
    }
  };

  const categoryName = activeTool
    ? getCategoryLabel(activeTool.category)
    : categoryFilter
    ? getCategoryLabel(categoryFilter)
    : null;

  // Dynamic Schema.org JSON-LD BreadcrumbList Injector
  useEffect(() => {
    let scriptTag = document.getElementById('jsonld-breadcrumb') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonld-breadcrumb';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tool-studio.in/',
      },
    ];

    if (categoryName) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `https://tool-studio.in/#category-${activeTool?.category || categoryFilter || 'all'}`,
      });
    }

    if (activeTool) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: activeTool.name,
        item: `https://tool-studio.in/#tool-${activeTool.id}`,
      });
    } else if (customPageName) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: customPageName,
        item: `https://tool-studio.in/#page-${customPageName.toLowerCase().replace(/\s+/g, '-')}`,
      });
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };

    scriptTag.textContent = JSON.stringify(jsonLd);
  }, [currentToolId, activeTool, categoryName, categoryFilter, customPageName]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-sm text-xs font-medium text-slate-600 mb-6 flex items-center flex-wrap gap-1.5 transition-all"
    >
      {/* Home Link */}
      <button
        onClick={() => onSelectTool(null)}
        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 cursor-pointer"
        aria-label="Navigate back to Home"
      >
        <Home className="w-3.5 h-3.5 text-emerald-600" />
        <span>Home</span>
      </button>

      {/* Category Level if active */}
      {categoryName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {activeTool ? (
            <button
              onClick={() => {
                onSelectTool(null);
                if (onSelectCategory && activeTool.category) {
                  onSelectCategory(activeTool.category);
                }
              }}
              className="text-slate-600 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 py-0.5 cursor-pointer"
            >
              {categoryName}
            </button>
          ) : (
            <span className="text-slate-900 font-bold px-1 py-0.5 bg-slate-100 rounded">
              {categoryName}
            </span>
          )}
        </>
      )}

      {/* Tool Level if active */}
      {activeTool && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-flex items-center gap-1">
            <Wrench className="w-3 h-3 text-emerald-600" />
            {activeTool.name}
          </span>
        </>
      )}

      {/* Custom Page Name if active */}
      {!activeTool && customPageName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
            {customPageName}
          </span>
        </>
      )}
    </nav>
  );
};
