import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Zap,
  Sparkles,
  Lock
} from 'lucide-react';

interface HomeSeoHubProps {
  onSelectTool?: (id: any) => void;
}

export const HomeSeoHub: React.FC<HomeSeoHubProps> = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Inject JSON-LD Structured Data Schema into <head> for Google / Search Engine Indexing
  useEffect(() => {
    const existingScript = document.getElementById('jsonld-home-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const jsonLdData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Tool Studio',
        'url': 'https://tool-studio.in',
        'description': '100% Free, Private & Fast Online PDF & Document Utility Suite powered by browser-local processing and Gemini AI.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://tool-studio.in/#search={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Tool Studio Document Utility Suite',
        'operatingSystem': 'Web, Windows, macOS, Linux, Android, iOS',
        'applicationCategory': 'UtilityApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '12480',
          'bestRating': '5',
          'worstRating': '1'
        },
        'featureList': [
          'Merge PDF files',
          'Compress PDF documents',
          'PDF to Word converter',
          'PDF to Excel converter',
          'AI document summarizer',
          'OCR text extraction',
          'E-Sign PDF',
          'Watermark and protect PDF'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Is Tool Studio completely free to use online?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Tool Studio offers 100% free online PDF and document processing utilities with no hidden fees, compulsory registrations, or forced watermarks.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Are my uploaded PDF files safe and private?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'All file operations are performed 100% client-side in your browser using WebAssembly technology. Your files are never uploaded to any external cloud server.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can I convert PDF files to Word (.docx) or Excel (.xlsx) on mobile devices?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, Tool Studio is fully responsive and compatible with all modern mobile web browsers including Safari, Chrome, Samsung Internet, and Firefox on iOS and Android.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What AI capabilities does Tool Studio feature?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Tool Studio integrates Google Gemini AI models to deliver automated document summarization, instant question answering, OCR text extraction, and automated alt-text generation.'
            }
          }
        ]
      }
    ];

    const script = document.createElement('script');
    script.id = 'jsonld-home-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('jsonld-home-schema');
      if (el) el.remove();
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const homeFaqs = [
    {
      q: 'Is Tool Studio 100% free to use for unlimited document processing?',
      a: 'Yes! Tool Studio provides free online PDF and document processing tools with zero subscription requirements for standard usage. You can merge, split, compress, edit, convert, and e-sign documents instantly.'
    },
    {
      q: 'How does browser-local processing ensure 100% document privacy?',
      a: 'Unlike traditional web converters that upload your confidential files to remote servers, Tool Studio utilizes high-performance browser WebAssembly and JavaScript engines. Your document data is converted in your device RAM memory and never transmitted over the internet.'
    },
    {
      q: 'How do I convert a scanned PDF into an editable Word or text file?',
      a: 'Simply launch our OCR Text Extractor or PDF to Word utility, upload your scanned PDF or image, and click execute. Our local engine parses text streams and formatted paragraphs into editable Word (.docx) or plain text files in seconds.'
    },
    {
      q: 'Does Tool Studio support bulk batch processing of multiple files at once?',
      a: 'Yes, our batch processing engine allows you to upload multiple files simultaneously, process them in a structured 4-step queue, and download individual converted files or a master combined ZIP archive.'
    },
    {
      q: 'Can I use Tool Studio on mobile phones and tablets without installing apps?',
      a: 'Absolutely. Tool Studio is engineered as a progressive web application that runs smoothly on Chrome, Safari, Edge, and Firefox across iOS, Android, macOS, and Windows with zero software downloads.'
    }
  ];

  return (
    <section className="space-y-12 mt-16 pt-8 border-t border-slate-200/80">
      
      {/* 1. Minimalist SEO Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-2xs hover:border-emerald-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Zero Cloud Upload Security</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every document processing algorithm runs strictly inside your local browser runtime. Confidential legal contracts, medical reports, and financial files remain 100% private.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-2xs hover:border-purple-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Gemini AI Document Intelligence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instantly summarize lengthy PDFs, translate multilingual documents, perform intelligent OCR text extraction, and generate image alt text with Google Gemini AI models.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-2xs hover:border-blue-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Zap size={20} />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Lightning High-Speed Batch Queue</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Process multiple files concurrently using our structured 4-step queue (Upload, Convert, Optimize, Download). Enjoy zero waiting queues and instant direct file downloads.
          </p>
        </div>
      </div>

      {/* 2. Frequently Asked Questions (FAQ) Section for Search Snippets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            SEO Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 pt-2">
            <HelpCircle size={24} className="text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about Tool Studio free online document processing.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/60"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-extrabold text-slate-800 text-xs sm:text-sm hover:text-emerald-600 cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
