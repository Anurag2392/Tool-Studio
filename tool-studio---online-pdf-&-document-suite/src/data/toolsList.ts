import { PdfToolMeta } from '../types';

export const TOOLS_LIST: PdfToolMeta[] = [
  {
    id: 'merge',
    name: 'Merge PDF',
    shortDesc: 'Combine multiple PDF documents into a single unified file in custom page order.',
    longDesc: 'Join PDF files together smoothly in seconds. Reorder uploaded files with intuitive drag-and-drop handles and merge them cleanly without quality loss.',
    category: 'popular',
    iconName: 'Combine',
    isPopular: true,
    badge: 'Popular',
    seoTitle: 'Free Online PDF Merger - Merge PDF Files Easily | Tool Studio',
    seoKeywords: ['merge pdf', 'combine pdf', 'join pdf online', 'free pdf joiner', 'merge multiple pdfs'],
    steps: [
      'Select or drag and drop your PDF files into the upload zone.',
      'Reorder your files in the sequence you want them to appear in the combined PDF.',
      'Click "Merge PDF" to combine all files into one document.',
      'Download your merged PDF immediately.'
    ],
    faq: [
      { question: 'Is it safe to merge my private PDF files here?', answer: 'Yes! All file processing happens locally in your browser session or encrypted ephemeral buffer.' },
      { question: 'Can I reorder pages before merging?', answer: 'Yes, you can drag and drop file cards into any sequence before initiating the merge.' }
    ]
  },
  {
    id: 'split',
    name: 'Split PDF',
    shortDesc: 'Separate one PDF file into multiple documents or extract specific page ranges.',
    longDesc: 'Extract individual pages or specified continuous page ranges (e.g. 1-4, 8, 12-15) from large PDF manuals and reports with precision.',
    category: 'organize-split',
    iconName: 'Scissors',
    isPopular: true,
    badge: 'Fast',
    seoTitle: 'Split PDF Online - Extract Pages from PDF | Tool Studio',
    seoKeywords: ['split pdf', 'extract pdf pages', 'pdf splitter online', 'separate pdf pages'],
    steps: [
      'Upload the PDF file you wish to split.',
      'Type your desired page numbers or ranges (e.g. 1-3, 5, 8-10).',
      'Click "Split PDF" to generate separate files.',
      'Download your extracted PDF files.'
    ],
    faq: [
      { question: 'How do I specify range intervals?', answer: 'Use numbers separated by commas and hyphens, such as "1-5, 8, 11-14".' }
    ]
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    shortDesc: 'Reduce PDF file size while optimizing quality for email and web uploads.',
    longDesc: 'Shrink oversized PDF documents for fast email attachments and submission portals with configurable compression profiles.',
    category: 'popular',
    iconName: 'FileArchive',
    isPopular: true,
    badge: 'Popular',
    seoTitle: 'Compress PDF Files Online - Reduce Size Free | Tool Studio',
    seoKeywords: ['compress pdf', 'reduce pdf size', 'pdf size optimizer', 'shrink pdf'],
    steps: [
      'Upload the large PDF file you want to compress.',
      'Select your preferred compression balance: Recommended, Extreme, or Light.',
      'Click "Compress PDF" to optimize document structure.',
      'Download your compressed PDF file with size statistics.'
    ],
    faq: [
      { question: 'Will compression affect document readability?', answer: 'Recommended compression maintains crystal clear font vectors and high crispness for printing.' }
    ]
  },
  {
    id: 'edit',
    name: 'Edit & Annotate PDF',
    shortDesc: 'Add text, highlights, shapes, drawings, and images directly onto PDF pages.',
    longDesc: 'Full-featured online PDF editor built directly for your browser. Fill out forms, add custom text annotations, highlight important sections, or draw freehand notes on any page.',
    category: 'edit-convert',
    iconName: 'Edit3',
    isPopular: true,
    badge: 'Editor',
    seoTitle: 'Free PDF Editor - Edit PDF Text & Annotations Online | Tool Studio',
    seoKeywords: ['edit pdf online', 'annotate pdf', 'add text to pdf', 'fill pdf form free'],
    steps: [
      'Upload the PDF document you want to edit.',
      'Use the top editor toolbar to insert Text, Draw Freehand, Highlight, or add Shapes.',
      'Position items precisely on the PDF pages.',
      'Click "Save & Download PDF" to export your edited file.'
    ],
    faq: [
      { question: 'Can I change font sizes and colors?', answer: 'Yes! The edit toolbar provides custom color pickers and typography controls.' }
    ]
  },
  {
    id: 'ai-summarize',
    name: 'PDF Assistant & OCR',
    shortDesc: 'Summarize documents, extract key facts, translate, and chat with your PDF using smart processing.',
    longDesc: 'Transform lengthy contracts, research papers, and textbooks into quick summaries, key bullet points, or interactive Q&A sessions powered by document intelligence.',
    category: 'ai-tools',
    iconName: 'Sparkles',
    isAi: true,
    badge: 'Smart Engine',
    seoTitle: 'PDF Summarizer & OCR Chat - Summarize PDF | Tool Studio',
    seoKeywords: ['pdf summarizer', 'chat with pdf', 'pdf ocr online', 'extract text from pdf'],
    steps: [
      'Upload any PDF document or research paper.',
      'Choose Processing Task: Executive Summary, Key Highlights, OCR Text Extraction, or Q&A Chat.',
      'Smart engine processes the document and generates instant insights.',
      'Ask custom follow-up questions or copy formatted summaries.'
    ],
    faq: [
      { question: 'How long can the PDF document be?', answer: 'The engine can analyze extensive documents up to hundreds of pages.' }
    ]
  },
  {
    id: 'sign',
    name: 'Sign PDF',
    shortDesc: 'Draw or type your legal electronic signature and place it anywhere on your PDF.',
    longDesc: 'Create your digital e-signature by drawing on a touch pad, typing in cursive style, or uploading an existing signature image. Place signatures on contracts and agreements easily.',
    category: 'popular',
    iconName: 'PenTool',
    isPopular: true,
    badge: 'e-Sign',
    seoTitle: 'Sign PDF Online - Free Digital Signature Tool | Tool Studio',
    seoKeywords: ['sign pdf online', 'free esignature', 'electronically sign contract', 'pdf sign tool'],
    steps: [
      'Upload your document needing signature.',
      'Draw your signature with your mouse/finger or type your signature.',
      'Drag and place your signature stamp onto the exact signature line.',
      'Download your legally signed PDF.'
    ],
    faq: [
      { question: 'Is drawing with finger on smartphone supported?', answer: 'Yes! The canvas is fully touch-responsive on smartphones and tablets.' }
    ]
  },
  {
    id: 'organize',
    name: 'Organize & Reorder Pages',
    shortDesc: 'Visual thumbnail editor to drag, rotate, delete, or duplicate individual PDF pages.',
    longDesc: 'See visual thumbnail previews of every page in your PDF. Easily reorder pages by dragging, flip sideways pages, or delete unwanted cover pages in seconds.',
    category: 'organize-split',
    iconName: 'LayoutGrid',
    badge: 'Visual',
    seoTitle: 'Organize PDF Pages - Reorder & Delete Pages Online | Tool Studio',
    seoKeywords: ['organize pdf pages', 'reorder pdf pages', 'delete page from pdf', 'sort pdf pages'],
    steps: [
      'Upload the PDF file to organize.',
      'Drag thumbnails to rearrange page order.',
      'Click trash icons to delete unnecessary pages or rotate icons to align orientation.',
      'Export the newly organized PDF document.'
    ],
    faq: [
      { question: 'Can I delete multiple pages at once?', answer: 'Yes, select pages or click individual delete buttons on any page card.' }
    ]
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    shortDesc: 'Rotate specific or all pages of a PDF by 90°, 180°, or 270° degrees.',
    longDesc: 'Fix sideways or upside-down scanned PDF pages quickly. Rotate individual pages or batch-rotate the entire document permanently.',
    category: 'organize-split',
    iconName: 'RotateCw',
    seoTitle: 'Rotate PDF Pages Permanently Online | Tool Studio',
    seoKeywords: ['rotate pdf', 'turn pdf pages', 'rotate sideways pdf', 'permanent pdf rotation'],
    steps: [
      'Upload your PDF file.',
      'Select single pages or click "Rotate All Left" / "Rotate All Right".',
      'Apply changes and download the updated PDF file.'
    ],
    faq: [
      { question: 'Does this save the rotation permanently?', answer: 'Yes, the exported file will open in correct orientation in any PDF viewer.' }
    ]
  },
  {
    id: 'watermark',
    name: 'Watermark PDF',
    shortDesc: 'Add custom text or image watermarks with opacity and angle placement.',
    longDesc: 'Protect your intellectual property or mark documents as "CONFIDENTIAL", "DRAFT", or with your company logo across all pages.',
    category: 'security',
    iconName: 'Stamp',
    badge: 'Security',
    seoTitle: 'Add Watermark to PDF Online - Text & Logo Overlay | Tool Studio',
    seoKeywords: ['watermark pdf', 'add text to background of pdf', 'confidential watermark pdf'],
    steps: [
      'Upload the PDF file.',
      'Enter custom text (e.g., CONFIDENTIAL) or pick color, transparency, and rotation angle.',
      'Position watermark in center or corners.',
      'Download watermarked PDF.'
    ],
    faq: [
      { question: 'Can I change opacity so text underneath remains legible?', answer: 'Yes, adjust the opacity slider from 10% to 100% as desired.' }
    ]
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    shortDesc: 'Add clean page numbers to header or footer with custom formats and positions.',
    longDesc: 'Number pages in your PDF report cleanly. Choose positions (bottom-right, bottom-center, top-center) and formats like "Page X of Y".',
    category: 'organize-split',
    iconName: 'Hash',
    seoTitle: 'Add Page Numbers to PDF Online | Tool Studio',
    seoKeywords: ['add page numbers to pdf', 'number pdf pages', 'header footer pdf page numbers'],
    steps: [
      'Upload your document.',
      'Choose page numbering position, starting page number, and display format.',
      'Click "Apply Page Numbers" and download.'
    ],
    faq: [
      { question: 'Can I skip cover page numbering?', answer: 'Yes, set "Start Numbering On Page" to 2 or higher.' }
    ]
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    shortDesc: 'Encrypt your PDF with standard password protection to prevent unauthorized opening.',
    longDesc: 'Secure sensitive confidential files, tax documents, and financial statements with strong password encryption.',
    category: 'security',
    iconName: 'Lock',
    seoTitle: 'Protect PDF with Password Online - Encrypt PDF | Tool Studio',
    seoKeywords: ['protect pdf', 'password protect pdf', 'encrypt pdf file', 'secure pdf online'],
    steps: [
      'Upload the PDF file to protect.',
      'Enter your desired strong password.',
      'Click "Encrypt PDF" and download the password-protected file.'
    ],
    faq: [
      { question: 'What happens if I forget the password?', answer: 'Keep a safe backup of your password as encrypted PDFs require it to open.' }
    ]
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    shortDesc: 'Remove password protection and permission locks from encrypted PDF files.',
    longDesc: 'Remove password restrictions from your own password-secured PDF documents to allow printing, copying, and editing.',
    category: 'security',
    iconName: 'Unlock',
    seoTitle: 'Unlock Password Protected PDF Online | Tool Studio',
    seoKeywords: ['unlock pdf', 'remove pdf password', 'pdf password remover', 'decrypt pdf'],
    steps: [
      'Upload the password-protected PDF.',
      'Enter the correct document password.',
      'Download the unlocked unrestricted PDF version.'
    ],
    faq: [
      { question: 'Do I need to know the password to unlock it?', answer: 'Yes, you must enter the password to authorize security decryption.' }
    ]
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    shortDesc: 'Convert JPG, PNG, WEBP images into clean PDF documents.',
    longDesc: 'Turn receipts, photos, scans, and graphic files into standard PDF documents. Combine multiple images into a single multi-page PDF.',
    category: 'edit-convert',
    iconName: 'Image',
    seoTitle: 'Convert JPG / PNG to PDF Online - Image to PDF | Tool Studio',
    seoKeywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert photo to pdf'],
    steps: [
      'Upload one or multiple images (JPG, PNG).',
      'Adjust image sequence order.',
      'Click "Convert to PDF" and download.'
    ],
    faq: [
      { question: 'Can I combine multiple photos into 1 single PDF file?', answer: 'Yes! All uploaded photos will be combined into sequential pages in 1 PDF.' }
    ]
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image / Extract Text',
    shortDesc: 'Convert PDF pages into high-resolution PNG images or plain text content.',
    longDesc: 'Extract individual pages of your PDF document into image graphics or copy raw text content for easy sharing.',
    category: 'edit-convert',
    iconName: 'FileText',
    seoTitle: 'Convert PDF to Images & Text Online | Tool Studio',
    seoKeywords: ['pdf to image', 'pdf to png', 'extract text from pdf', 'pdf to picture'],
    steps: [
      'Upload the PDF file.',
      'Choose output format: PNG Image or Text Extraction.',
      'Download converted image pages or copy text.'
    ],
    faq: [
      { question: 'Is font crispness preserved in image export?', answer: 'Yes, rendered images maintain crisp clarity.' }
    ]
  },
  {
    id: 'youtube-keywords',
    name: 'YouTube Tag & Keyword Generator',
    shortDesc: 'Generate high-ranking YouTube video tags, SEO search keywords, and viral hashtags with intelligent keyword engines.',
    longDesc: 'Boost your video reach on YouTube search and recommendations with high-performance keyword analysis engine. Extracts relevant search terms and tags ready to paste into YouTube Studio.',
    category: 'ai-tools',
    iconName: 'Sparkles',
    isAi: true,
    isPopular: true,
    badge: 'YouTube SEO',
    seoTitle: 'Free YouTube Tag & Keyword Generator | Tool Studio',
    seoKeywords: ['youtube keyword generator', 'youtube tags generator', 'youtube search keywords', 'youtube studio tags'],
    steps: [
      'Enter your YouTube video title, topic, or niche concept.',
      'Select your active keyword engine mode.',
      'Click "Generate YouTube Tags" to extract optimized keywords.',
      'Click "Copy All Tags" and paste directly into YouTube Studio!'
    ],
    faq: [
      { question: 'Is any external API key required?', answer: 'No! The tool runs completely out-of-the-box with built-in processing engines.' },
      { question: 'Is the tag format ready for YouTube Studio?', answer: 'Yes, tags are output in standard comma-separated format matching YouTube Studio character limits.' }
    ]
  },
  {
    id: 'alt-text-writer',
    name: 'Alt Text & Description Writer',
    shortDesc: 'Generate WCAG-compliant HTML alt text, accessibility descriptions, and SEO image captions with Intelligent Vision Engine.',
    longDesc: 'Boost website accessibility and search rankings. Upload any image (PNG, JPG, WEBP) to automatically generate WCAG 2.2 compliant alt tags, detailed screen-reader descriptions, and social media captions.',
    category: 'ai-tools',
    iconName: 'Eye',
    isAi: true,
    isPopular: true,
    isNew: true,
    badge: 'Accessibility & SEO',
    seoTitle: 'Free Alt Text Generator & Image Description Writer | Tool Studio',
    seoKeywords: ['alt text generator', 'image alt text writer', 'wcag alt text', 'accessibility image descriptions', 'seo image captions'],
    steps: [
      'Upload or drag & drop any image file (JPG, PNG, WEBP).',
      'Select desired tone, context, and active vision processing engine.',
      'Click "Generate Alt Text" to analyze the image.',
      'Copy the concise HTML alt tag or detailed screen reader description with one click!'
    ],
    faq: [
      { question: 'Is the generated Alt Text compliant with WCAG accessibility standards?', answer: 'Yes! Descriptions strictly follow WCAG 2.2 guidelines for screen readers, avoiding redundant phrases like "image of".' },
      { question: 'Do I need an API key to use this tool?', answer: 'No! The tool comes with built-in processing engines ready to use.' }
    ]
  },
  {
    id: 'ocr',
    name: 'OCR PDF Text Extractor',
    shortDesc: 'Extract editable text, tables, and forms from scanned PDFs and images using Intelligent Vision OCR.',
    longDesc: 'High-precision Vision OCR engine. Transcribe scanned PDF documents, receipts, contracts, and images into editable Markdown, formatted text, or structured JSON data with multi-language support.',
    category: 'ai-tools',
    iconName: 'ScanText',
    isAi: true,
    isPopular: true,
    badge: 'Vision OCR',
    seoTitle: 'Free OCR PDF Online - Extract Text from Scanned PDF & Images | Tool Studio',
    seoKeywords: ['ocr pdf online', 'scanned pdf to text', 'vision ocr', 'extract text from scanned document', 'image ocr free'],
    steps: [
      'Upload a scanned PDF document, photo, or image file.',
      'Select OCR Mode: Structured Markdown, Plain Text, Form JSON, or OCR Error Cleanup.',
      'Choose primary document language and active engine mode.',
      'Click "Run Vision OCR" and instantly copy or download the extracted text.'
    ],
    faq: [
      { question: 'Can the OCR engine transcribe handwritten text and tables?', answer: 'Yes! The Vision engine excels at extracting formatted table structures, printed fonts, and clear handwritten annotations.' },
      { question: 'What file formats are supported for OCR?', answer: 'You can upload PDF files, scanned image PDFs, PNG, JPG, and WEBP document photos.' }
    ]
  },
  {
    id: 'crop',
    name: 'Crop PDF Pages',
    shortDesc: 'Trim page margins, remove headers, footers or white space from PDF pages.',
    longDesc: 'Precise interactive cropping for PDF files. Select custom crop box margins or apply uniform margin trimming across all pages in your document.',
    category: 'organize-split',
    iconName: 'Crop',
    seoTitle: 'Crop PDF Online - Trim PDF Margins & Page Boundaries | Tool Studio',
    seoKeywords: ['crop pdf', 'trim pdf pages', 'remove pdf margins', 'pdf crop tool online'],
    steps: [
      'Upload the PDF file you wish to crop.',
      'Specify margin crop measurements or select standard trimming ratio.',
      'Click "Apply Crop" to download trimmed PDF pages.'
    ],
    faq: [
      { question: 'Will cropping reduce file size?', answer: 'Yes, trimming unneeded margins and content can reduce visual footprint.' }
    ]
  },
  {
    id: 'flatten',
    name: 'Flatten PDF Form & Layers',
    shortDesc: 'Lock fillable form fields, annotations, and signatures into uneditable static content.',
    longDesc: 'Flattening your PDF combines all form field inputs, layers, and digital signatures directly into the page content, preventing future tampering.',
    category: 'security',
    iconName: 'Layers',
    badge: 'Security',
    seoTitle: 'Flatten PDF Online - Lock Form Fields & Signatures | Tool Studio',
    seoKeywords: ['flatten pdf', 'lock pdf form', 'make pdf uneditable', 'flatten pdf forms online'],
    steps: [
      'Upload the interactive PDF form.',
      'Select flattening depth: All Form Fields & Annotations.',
      'Click "Flatten PDF" to download the secure read-only document.'
    ],
    faq: [
      { question: 'Can flattened PDF forms be edited afterwards?', answer: 'No, flattening permanently embeds fields into the page graphics for maximum security.' }
    ]
  },
  {
    id: 'grayscale',
    name: 'Grayscale PDF Converter',
    shortDesc: 'Convert colored PDF documents into monochrome black & white to save printer ink.',
    longDesc: 'Transform full-color PDFs, receipts, and graphics into clean grayscale or pure monochrome black and white for efficient printing.',
    category: 'edit-convert',
    iconName: 'Sun',
    seoTitle: 'Convert PDF to Grayscale / Black & White Online | Tool Studio',
    seoKeywords: ['grayscale pdf', 'pdf black and white', 'convert pdf color to bw', 'save ink pdf'],
    steps: [
      'Upload your color PDF document.',
      'Choose monochrome threshold or standard smooth grayscale.',
      'Download the ink-optimized grayscale PDF.'
    ],
    faq: [
      { question: 'Does grayscale conversion decrease file size?', answer: 'Yes, converting color channels reduces total PDF stream memory size.' }
    ]
  },
  {
    id: 'pdf-to-word',
    name: 'Convert PDF to Word & Text',
    shortDesc: 'Extract formatted document paragraphs, tables, and headers into Word DOCX or Text.',
    longDesc: 'Turn static PDF documents into editable Microsoft Word DOCX files or clean structured text with layout preservation.',
    category: 'edit-convert',
    iconName: 'FileSpreadsheet',
    isPopular: true,
    badge: 'Popular',
    seoTitle: 'Convert PDF to Word DOCX Online Free | Tool Studio',
    seoKeywords: ['pdf to word', 'convert pdf to docx', 'pdf to text converter', 'edit pdf in word'],
    steps: [
      'Upload the PDF document.',
      'Select output format: Editable DOCX or Rich Text.',
      'Click "Convert to Word" and save your file.'
    ],
    faq: [
      { question: 'Are images preserved when converting PDF to Word?', answer: 'Yes, images and structural paragraphs are retained.' }
    ]
  },
  {
    id: 'word-to-pdf',
    name: 'Convert Word & HTML to PDF',
    shortDesc: 'Convert DOCX files, plain text, or HTML web pages into PDF format.',
    longDesc: 'Instant client-side conversion for Microsoft Word documents, plain text notes, and web markup into standardized PDF files.',
    category: 'edit-convert',
    iconName: 'FileCode',
    seoTitle: 'Convert Word DOCX & Text to PDF Online | Tool Studio',
    seoKeywords: ['word to pdf', 'docx to pdf', 'text to pdf online', 'convert doc to pdf'],
    steps: [
      'Upload your DOCX document or paste text/HTML.',
      'Configure font size and page margins.',
      'Download standard high-res PDF document.'
    ],
    faq: [
      { question: 'Is my Word document kept private?', answer: 'Yes, conversion is executed directly in your browser memory.' }
    ]
  },
  {
    id: 'metadata',
    name: 'Edit PDF Metadata',
    shortDesc: 'Modify PDF document properties including Title, Author, Subject, Keywords, and Creator.',
    longDesc: 'Inspect and modify hidden PDF metadata tags. Set document titles, author names, subject summaries, and keywords for better archival and SEO.',
    category: 'security',
    iconName: 'Tag',
    seoTitle: 'Edit PDF Metadata Tags - Change Title, Author & Subject | Tool Studio',
    seoKeywords: ['edit pdf metadata', 'change pdf title author', 'pdf properties editor', 'pdf metadata tagger'],
    steps: [
      'Upload the PDF file.',
      'Edit the Title, Author, Subject, and Keywords fields.',
      'Click "Save Metadata" to download updated PDF.'
    ],
    faq: [
      { question: 'Why edit PDF metadata?', answer: 'Updating metadata ensures accurate indexing, copyright labeling, and search organization.' }
    ]
  },
  {
    id: 'extract-images',
    name: 'Extract Images from PDF',
    shortDesc: 'Extract all embedded photos, diagrams, and illustrations inside a PDF file.',
    longDesc: 'Scans your PDF document and extracts all contained JPEG, PNG, and vector image elements into individual downloadable graphics.',
    category: 'edit-convert',
    iconName: 'Images',
    seoTitle: 'Extract Images from PDF Online Free | Tool Studio',
    seoKeywords: ['extract images from pdf', 'rip photos from pdf', 'save pictures from pdf', 'pdf image extractor'],
    steps: [
      'Upload the PDF file containing embedded images.',
      'View extracted preview thumbnails of all images.',
      'Download individual images or all as a ZIP archive.'
    ],
    faq: [
      { question: 'Is original image resolution maintained?', answer: 'Yes, images are extracted at their exact native resolution without re-compression.' }
    ]
  },
  {
    id: 'bates-numbering',
    name: 'Bates Stamp & Legal Numbering',
    shortDesc: 'Add legal Bates sequence stamps, prefix headers, and page counters to legal documents.',
    longDesc: 'Essential tool for law firms, legal discovery, and corporate audit teams. Stamp sequential Bates numbers (e.g. "CASE-001001") on every page.',
    category: 'security',
    iconName: 'Hash',
    badge: 'Legal',
    seoTitle: 'Bates Numbering PDF Online - Legal Bates Stamping Tool | Tool Studio',
    seoKeywords: ['bates numbering pdf', 'legal bates stamp', 'sequential page stamp pdf', 'bates stamp tool free'],
    steps: [
      'Upload legal case PDF files.',
      'Set custom Prefix (e.g., "DOC-"), starting sequence number, and stamp placement.',
      'Click "Apply Bates Stamp" and download processed legal documents.'
    ],
    faq: [
      { question: 'Can I customize starting digits and padding length?', answer: 'Yes, configure zero-padding (e.g. 0001) and custom text prefixes easily.' }
    ]
  },
  {
    id: 'n-up',
    name: 'N-Up Multi-Page Layout',
    shortDesc: 'Combine 2, 4, or 8 pages onto a single sheet to create booklets or save paper.',
    longDesc: 'Rearrange multiple PDF pages into grid layouts on each sheet. Perfect for printing slides, meeting handouts, and compact reference sheets.',
    category: 'organize-split',
    iconName: 'Columns',
    seoTitle: 'N-Up PDF Layout - Print Multiple Pages per Sheet | Tool Studio',
    seoKeywords: ['n up pdf', '2 pages per sheet pdf', '4 up pdf booklet', 'grid pdf print layout'],
    steps: [
      'Upload the multi-page PDF.',
      'Choose grid arrangement: 2-Up (1x2), 4-Up (2x2), or 8-Up (2x4).',
      'Download the compiled multi-page grid PDF.'
    ],
    faq: [
      { question: 'Does N-Up layout save paper when printing?', answer: 'Yes, it significantly reduces total page count when printing multi-page slide decks or notes.' }
    ]
  },
  {
    id: 'deskew',
    name: 'Deskew & Straighten PDF',
    shortDesc: 'Automatically detect and straighten crooked or rotated scanned PDF pages.',
    longDesc: 'Fix slanted scans caused by feed misalignment on office scanners. Automatically straightens text lines and borders across every page.',
    category: 'other-scans',
    iconName: 'Sliders',
    badge: 'Scans',
    seoTitle: 'Deskew PDF Online - Straighten Crooked Scanned PDF Pages | Tool Studio',
    seoKeywords: ['deskew pdf', 'straighten scanned pdf', 'fix crooked pdf scan', 'auto rotate slanted pdf'],
    steps: [
      'Upload slanted or crooked scanned PDF.',
      'Select auto-deskew angle detection mode.',
      'Download perfectly aligned straight PDF pages.'
    ],
    faq: [
      { question: 'How does deskew work?', answer: 'It analyzes baseline text angles and rotates pages by fine fractions of a degree.' }
    ]
  },
  {
    id: 'repair',
    name: 'Repair Corrupt PDF File',
    shortDesc: 'Recover readable text and rebuild broken or damaged PDF header structures.',
    longDesc: 'Attempts to repair broken cross-reference tables, truncated stream bytes, and corrupted headers from incomplete PDF downloads.',
    category: 'other-scans',
    iconName: 'Wrench',
    seoTitle: 'Repair PDF Online - Fix Corrupted & Damaged PDF Files | Tool Studio',
    seoKeywords: ['repair pdf', 'fix corrupt pdf', 'recover damaged pdf file', 'pdf repair tool free'],
    steps: [
      'Upload the damaged or unreadable PDF file.',
      'Click "Rebuild PDF Structure" to parse surviving streams.',
      'Download recovered clean PDF document.'
    ],
    faq: [
      { question: 'Can all damaged PDFs be repaired?', answer: 'If valid document object streams remain, Tool Studio will recover and rebuild them.' }
    ]
  },
  {
    id: 'alternate-mix',
    name: 'Alternate & Mix PDF Pages',
    shortDesc: 'Interleave pages from two or more PDF files automatically (e.g. odd and even pages).',
    longDesc: 'Ideal for double-sided scanner workflows. Automatically mix alternating pages from Document A (odds) and Document B (evens).',
    category: 'organize-split',
    iconName: 'Shuffle',
    seoTitle: 'Alternate & Mix PDF Pages Online - Interleave PDFs | Tool Studio',
    seoKeywords: ['alternate mix pdf', 'interleave pdf pages', 'combine odd and even pdf pages', 'mix 2 pdf files'],
    steps: [
      'Upload Document A (e.g. Odd pages scan) and Document B (e.g. Even pages scan).',
      'Choose interleave mode: Standard Alternate A-B-A-B or Reverse B.',
      'Download the merged, perfectly ordered single PDF file.'
    ],
    faq: [
      { question: 'Can I reverse the order of the second document?', answer: 'Yes! Perfect for reverse-feed scanner outputs.' }
    ]
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF Converter',
    shortDesc: 'Convert XLSX and XLS spreadsheets into crisp, high-resolution PDF documents.',
    longDesc: 'Transform financial sheets, tables, and Excel workbooks into universal PDF documents with table layout preservation.',
    category: 'edit-convert',
    iconName: 'FileSpreadsheet',
    seoTitle: 'Excel to PDF Online - Free XLSX/XLS Converter | Tool Studio',
    seoKeywords: ['excel to pdf', 'convert xlsx to pdf', 'excel spreadsheet to pdf', 'xls to pdf online'],
    steps: [
      'Upload Excel file (.xlsx or .xls).',
      'Click "Convert to PDF".',
      'Download your formatted PDF document.'
    ],
    faq: [
      { question: 'Will table formatting be preserved?', answer: 'Yes, rows, columns, fonts, and cell alignment are strictly preserved.' }
    ]
  },
  {
    id: 'ppt-to-pdf',
    name: 'PowerPoint to PDF Converter',
    shortDesc: 'Convert PPTX and PPT presentations into high-quality PDF slide decks.',
    longDesc: 'Turn slide decks, presentations, and keynotes into lightweight, readable PDF files ideal for emailing and printing.',
    category: 'edit-convert',
    iconName: 'Sliders',
    seoTitle: 'PowerPoint to PDF Online - Free PPTX Converter | Tool Studio',
    seoKeywords: ['ppt to pdf', 'pptx to pdf', 'powerpoint to pdf online', 'convert slides to pdf'],
    steps: [
      'Upload PowerPoint file (.pptx or .ppt).',
      'Click "Convert Slides to PDF".',
      'Download your presentation PDF.'
    ],
    faq: [
      { question: 'Are slide graphics preserved?', answer: 'Yes, full resolution slides and vector shapes remain intact.' }
    ]
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF Converter',
    shortDesc: 'Convert HTML code, web pages, or URLs into print-ready PDF files.',
    longDesc: 'Render web pages, HTML newsletters, and templates into pixel-perfect PDF documents.',
    category: 'edit-convert',
    iconName: 'FileCode',
    seoTitle: 'HTML to PDF Online - Convert Web Pages to PDF | Tool Studio',
    seoKeywords: ['html to pdf', 'webpage to pdf', 'convert url to pdf', 'html file to pdf'],
    steps: [
      'Upload HTML file or input code snippet.',
      'Click "Generate PDF Document".',
      'Download your rendered PDF file.'
    ],
    faq: [
      { question: 'Does it support CSS styling?', answer: 'Yes, modern CSS flexbox and styling rules are processed.' }
    ]
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel Converter',
    shortDesc: 'Extract structured tables and data from PDF documents into editable Excel spreadsheets.',
    longDesc: 'Pull financial statements, invoices, and data tables out of PDFs directly into editable XLSX sheets.',
    category: 'edit-convert',
    iconName: 'FileSpreadsheet',
    seoTitle: 'PDF to Excel Online - Extract PDF Tables to XLSX | Tool Studio',
    seoKeywords: ['pdf to excel', 'pdf to xlsx', 'extract table from pdf', 'convert pdf to excel spreadsheet'],
    steps: [
      'Upload PDF containing data tables.',
      'Click "Extract to Excel".',
      'Download editable XLSX spreadsheet file.'
    ],
    faq: [
      { question: 'Can it extract multi-page tables?', answer: 'Yes, tables spanning across multiple pages are merged into one clean spreadsheet.' }
    ]
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PowerPoint Converter',
    shortDesc: 'Convert PDF slides back into editable PPTX PowerPoint presentations.',
    longDesc: 'Turn PDF slides back into PowerPoint presentations with editable slides and text.',
    category: 'edit-convert',
    iconName: 'Sliders',
    seoTitle: 'PDF to PowerPoint Online - Convert PDF to PPTX | Tool Studio',
    seoKeywords: ['pdf to ppt', 'pdf to pptx', 'pdf to powerpoint', 'convert pdf slides to pptx'],
    steps: [
      'Upload PDF document.',
      'Click "Convert to PowerPoint".',
      'Download editable PPTX presentation file.'
    ],
    faq: [
      { question: 'Are slides editable in Microsoft PowerPoint?', answer: 'Yes, slides are created as native presentation slides.' }
    ]
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A Archival Converter',
    shortDesc: 'Convert standard PDF files to ISO-compliant PDF/A format for long-term archiving.',
    longDesc: 'Ensure legal and compliance standards by converting documents into self-contained PDF/A ISO format.',
    category: 'other-scans',
    iconName: 'Layers',
    seoTitle: 'PDF to PDF/A Converter Online - Archival Standard | Tool Studio',
    seoKeywords: ['pdf to pdfa', 'pdf/a converter', 'iso archival pdf', 'long term storage pdf'],
    steps: [
      'Upload standard PDF file.',
      'Click "Convert to PDF/A".',
      'Download ISO-compliant archival PDF document.'
    ],
    faq: [
      { question: 'What is PDF/A?', answer: 'PDF/A is an ISO-standardized version of PDF designed for long-term digital preservation.' }
    ]
  },
  {
    id: 'redact',
    name: 'Redact PDF Sensitive Information',
    shortDesc: 'Permanently remove or block out confidential text and private data from PDFs.',
    longDesc: 'Black out sensitive text, social security numbers, and private data securely before sharing documents.',
    category: 'security',
    iconName: 'ShieldCheck',
    seoTitle: 'Redact PDF Online - Black Out Sensitive Text & Data | Tool Studio',
    seoKeywords: ['redact pdf', 'black out pdf text', 'remove sensitive info pdf', 'pdf redaction tool'],
    steps: [
      'Upload PDF document containing sensitive info.',
      'Select text or area to redact.',
      'Click "Apply Redaction" and download protected PDF.'
    ],
    faq: [
      { question: 'Is redacted text permanently erased?', answer: 'Yes, redacted data is removed from underlying document streams.' }
    ]
  },
  {
    id: 'compare',
    name: 'Compare PDF Documents',
    shortDesc: 'Compare two PDF files side-by-side to highlight text differences and revisions.',
    longDesc: 'Quickly spot text edits, modified clauses, and version changes between two PDF revisions.',
    category: 'security',
    iconName: 'Shuffle',
    seoTitle: 'Compare PDFs Online - Diff & Highlight Revisions | Tool Studio',
    seoKeywords: ['compare pdfs', 'pdf diff tool', 'compare 2 pdf files', 'highlight pdf differences'],
    steps: [
      'Upload original PDF (File A) and revised PDF (File B).',
      'Click "Compare Documents".',
      'Review highlighted differences and download comparison report.'
    ],
    faq: [
      { question: 'Does it highlight text additions and deletions?', answer: 'Yes, additions are green and deletions red.' }
    ]
  },
  {
    id: 'pdf-to-zip',
    name: 'PDF to ZIP Bulk Splitter',
    shortDesc: 'Split large multi-page PDF files into individual pages and download as a ZIP archive.',
    longDesc: 'Extract every page of a large PDF as separate PDF files bundled neatly into a single downloadable ZIP file.',
    category: 'organize-split',
    iconName: 'Download',
    seoTitle: 'PDF to ZIP Online - Bulk Split Pages to ZIP | Tool Studio',
    seoKeywords: ['pdf to zip', 'bulk split pdf to zip', 'extract all pages to zip', 'zip pdf pages'],
    steps: [
      'Upload multi-page PDF.',
      'Click "Split & Create ZIP Archive".',
      'Download single ZIP containing all individual page PDFs.'
    ],
    faq: [
      { question: 'Is there a limit on number of pages?', answer: 'No limit! Works on large multi-hundred-page documents.' }
    ]
  },
  {
    id: 'scan-to-pdf',
    name: 'Scan to PDF (Camera Capture)',
    shortDesc: 'Capture physical documents using your device camera and convert directly into PDF.',
    longDesc: 'Use your webcam or mobile camera to snap physical paper documents and instantly compile them into clean PDFs.',
    category: 'other-scans',
    iconName: 'Eye',
    badge: 'Camera',
    seoTitle: 'Scan to PDF Online - Free Camera Document Scanner | Tool Studio',
    seoKeywords: ['scan to pdf', 'camera scan pdf', 'webcam document scanner', 'mobile scan to pdf'],
    steps: [
      'Open Scan tool and grant camera access.',
      'Snap photos of physical paper pages.',
      'Click "Generate PDF Document" to download.'
    ],
    faq: [
      { question: 'Does camera scan auto-crop borders?', answer: 'Yes, automatic page boundary detection cleans up captured document edges.' }
    ]
  },
  {
    id: 'resize-pdf',
    name: 'Resize PDF Page Dimensions',
    shortDesc: 'Change PDF page size to standard paper formats (A4, Letter, Legal, A3).',
    longDesc: 'Uniformly resize document pages to standard printing dimensions like A4, US Letter, or Legal size.',
    category: 'other-scans',
    iconName: 'Crop',
    seoTitle: 'Resize PDF Online - Change Page Size A4, Letter, Legal | Tool Studio',
    seoKeywords: ['resize pdf', 'change pdf page size', 'convert letter to a4 pdf', 'scale pdf page dimensions'],
    steps: [
      'Upload PDF file.',
      'Select target paper size (e.g. A4, US Letter, Legal).',
      'Click "Resize PDF Pages" and download.'
    ],
    faq: [
      { question: 'Will page content scale automatically?', answer: 'Yes, content scales proportionally to fit the new paper size.' }
    ]
  },
  {
    id: 'blank-pages',
    name: 'Add or Remove Blank Pages',
    shortDesc: 'Insert clean blank pages or automatically purge empty pages from PDFs.',
    longDesc: 'Insert blank pages for notes or automatically scan and delete empty whitespace pages from scanned documents.',
    category: 'organize-split',
    iconName: 'FileText',
    seoTitle: 'Add or Remove Blank Pages in PDF | Tool Studio',
    seoKeywords: ['remove blank pages pdf', 'add blank page to pdf', 'delete empty pages pdf', 'pdf blank page tool'],
    steps: [
      'Upload PDF document.',
      'Select "Remove Empty Pages" or specify page index to insert a blank page.',
      'Download updated document.'
    ],
    faq: [
      { question: 'Can it auto-detect blank pages in scanned files?', answer: 'Yes, it detects pages with under 1% ink coverage.' }
    ]
  },
  {
    id: 'forms',
    name: 'Create Fillable PDF Forms',
    shortDesc: 'Add interactive text fields, checkboxes, and radio buttons to static PDF forms.',
    longDesc: 'Turn flat static PDFs into interactive fillable forms with fillable inputs, checkboxes, and signature fields.',
    category: 'edit-convert',
    iconName: 'Tag',
    seoTitle: 'Create Fillable PDF Forms Online - Interactive Fields | Tool Studio',
    seoKeywords: ['create fillable pdf forms', 'add form fields to pdf', 'make interactive pdf form', 'fillable pdf creator'],
    steps: [
      'Upload static PDF form document.',
      'Add text input boxes, checkboxes, or dropdown fields.',
      'Save and download interactive fillable PDF form.'
    ],
    faq: [
      { question: 'Can recipients fill out the forms in standard PDF readers?', answer: 'Yes! Forms work natively in Adobe Acrobat, Chrome, Preview, and all PDF viewers.' }
    ]
  },
  {
    id: 'image-compressor-kb',
    name: 'Compress Image to KB (20KB, 50KB, 100KB)',
    shortDesc: 'Reduce image file size to exact target KB limits (20KB, 50KB, 100KB, 200KB, 500KB) for government forms and portal uploads.',
    longDesc: 'Precise online image compressor designed for job applications, exam forms, and college admissions. Target exact KB limits like 20KB, 50KB, or 100KB with 100% client-side privacy.',
    category: 'popular',
    iconName: 'FileArchive',
    isPopular: true,
    isNew: true,
    badge: 'Exact KB Target',
    seoTitle: 'Compress Image to 20KB, 50KB, 100KB Online - Image Suite | Tool Studio',
    seoKeywords: ['compress image to 20kb', 'image compressor 50kb', 'reduce image size in kb', 'compress photo to 100kb', 'pi7 image tool'],
    steps: [
      'Upload or drag & drop your image file (JPG, PNG, WEBP).',
      'Select a preset target size (20KB, 50KB, 100KB, 200KB, 500KB) or enter custom KB.',
      'Click "Compress Image" to execute binary quality optimization.',
      'Download your compressed image instantly.'
    ],
    faq: [
      { question: 'How does it compress to exact KB limits?', answer: 'Our engine uses adaptive multi-pass canvas downsampling and quality binary searches to hit target KB sizes precisely.' },
      { question: 'Are my photos uploaded to any server?', answer: 'No! All image processing is executed 100% locally in your browser.' }
    ]
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer & Dimensions (PX, CM, MM, Inches)',
    shortDesc: 'Resize photos by dimensions in Pixels, Centimeters, Millimeters, or Inches with passport & signature presets.',
    longDesc: 'Resize images for passports, signatures, exam forms, and social media. Supports aspect ratio locking, custom DPI/PPI, and instant dimensions conversion.',
    category: 'edit-convert',
    iconName: 'Crop',
    isPopular: true,
    isNew: true,
    badge: 'Passport & Exam',
    seoTitle: 'Online Image Resizer in CM, MM, PX, Inches - Image Resizer | Tool Studio',
    seoKeywords: ['image resizer in cm', 'resize photo in mm', 'passport photo resizer 35x45mm', 'signature photo resizer 140x60', 'image resizer tool'],
    steps: [
      'Upload your photo or signature scan.',
      'Select measurement units: Pixels, CM, MM, or Inches.',
      'Pick a preset (Passport 35x45mm, Signature 140x60px) or set custom dimensions.',
      'Download your resized image.'
    ],
    faq: [
      { question: 'Does it support 35x45mm passport photo resizing?', answer: 'Yes! Select the "Passport Photo (35x45mm)" preset from the dropdown menu.' }
    ]
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper & Circle Crop',
    shortDesc: 'Crop images in rectangular or circular/round shapes for passport photos, signatures, and avatars.',
    longDesc: 'Interactive image cropper with rectangular aspect ratio presets (1:1, 4:3, 16:9) and 360° circular crop for social media avatars and ID cards.',
    category: 'edit-convert',
    iconName: 'Crop',
    isNew: true,
    badge: 'Circle & Rect',
    seoTitle: 'Crop Image Online & Circle Photo Crop - Image Suite | Tool Studio',
    seoKeywords: ['circle image cropper', 'crop photo online', 'round crop photo', 'passport photo crop', 'crop signature image'],
    steps: [
      'Upload your image.',
      'Select crop shape: Rectangular or Round Circle.',
      'Adjust crop boundary sliders or handles.',
      'Download cropped image.'
    ],
    faq: [
      { question: 'Can I create transparent background circular avatars?', answer: 'Yes, circular crops export with transparent backgrounds in PNG format.' }
    ]
  },
  {
    id: 'increase-image-size',
    name: 'Increase Image File Size in KB',
    shortDesc: 'Increase image size in KB (e.g. from 15KB to 50KB or 100KB) to satisfy strict government portal minimum limits.',
    longDesc: 'Many official online portals require image files to be AT LEAST 50KB or 100KB. This tool increases file size in KB safely without losing clarity.',
    category: 'other-scans',
    iconName: 'Maximize2',
    isNew: true,
    badge: 'Min KB Limit',
    seoTitle: 'Increase Image Size in KB Online (e.g. 20KB to 50KB) | Tool Studio',
    seoKeywords: ['increase image size in kb', 'increase photo size in kb online', 'pi7 increase image size', 'make image size bigger in kb'],
    steps: [
      'Upload your small image file.',
      'Set target minimum size (e.g. 50 KB, 100 KB).',
      'Click "Increase Size" to expand file bytes.',
      'Download the padded image.'
    ],
    faq: [
      { question: 'Will increasing file size blur my photo?', answer: 'No! The engine preserves original resolution and applies loss-free density padding.' }
    ]
  },
  {
    id: 'remove-bg-transparent',
    name: 'Remove Image Background (Transparent PNG)',
    shortDesc: 'Automatically remove photo background to create clean transparent PNG signatures and product cutouts.',
    longDesc: 'AI-assisted color-key and luminosity background removal tool for signatures, logos, stamps, and product photos. Generates high-quality transparent PNG cutouts.',
    category: 'popular',
    iconName: 'Sparkles',
    isPopular: true,
    isNew: true,
    badge: 'Transparent PNG',
    seoTitle: 'Remove Image Background Online - Transparent PNG Cutout | Tool Studio',
    seoKeywords: ['remove background from image', 'transparent png maker', 'signature background remover', 'remove white background', 'pi7 bg remover'],
    steps: [
      'Upload image with white or solid background.',
      'Adjust background color sensitivity slider.',
      'Click "Remove Background" to extract cutout.',
      'Download high-res transparent PNG.'
    ],
    faq: [
      { question: 'Does this work for scanned signatures on white paper?', answer: 'Yes! It effortlessly removes paper backgrounds to give clean transparent PNG signatures.' }
    ]
  },
  {
    id: 'image-converter',
    name: 'Universal Image Format Converter',
    shortDesc: 'Convert images instantly between JPG, PNG, WEBP, GIF, BMP, and ICO formats.',
    longDesc: 'Fast browser-based batch image format converter. Convert WEBP to JPG, PNG to JPG, JPG to WEBP or ICO for web optimization and application forms.',
    category: 'edit-convert',
    iconName: 'RefreshCw',
    isPopular: true,
    isNew: true,
    badge: 'JPG PNG WEBP',
    seoTitle: 'Convert JPG to PNG, WEBP, GIF, ICO Online - Image Converter | Tool Studio',
    seoKeywords: ['convert jpg to png', 'webp to jpg converter', 'png to webp', 'image format converter', 'pi7 image converter'],
    steps: [
      'Upload your image in any format.',
      'Select output format: JPG, PNG, WEBP, GIF, or ICO.',
      'Click "Convert Image".',
      'Download converted image file.'
    ],
    faq: [
      { question: 'Is WEBP conversion faster for web optimization?', answer: 'Yes, WEBP reduces image payload by up to 30% compared to JPG while retaining high visual fidelity.' }
    ]
  },
  {
    id: 'dpi-enhancer',
    name: 'Change Image DPI / PPI (300 DPI Printer Standard)',
    shortDesc: 'Change image DPI metadata to 300 DPI, 200 DPI, or 72 DPI for high-quality printing and form requirements.',
    longDesc: 'Set or change image DPI (Dots Per Inch) resolution metadata required by official photo submission portals and commercial printing standard (300 DPI).',
    category: 'other-scans',
    iconName: 'Sliders',
    isNew: true,
    badge: '300 DPI Print',
    seoTitle: 'Change Image DPI Online (300 DPI, 200 DPI, 72 DPI) | Tool Studio',
    seoKeywords: ['change image dpi online', '300 dpi image converter', 'change photo ppi', 'convert photo to 300 dpi', 'pi7 dpi changer'],
    steps: [
      'Upload your photo or document scan.',
      'Select target DPI: 300 DPI (Printing), 200 DPI (Govt Form), or 72 DPI (Web).',
      'Click "Apply DPI Metadata".',
      'Download 300 DPI ready image.'
    ],
    faq: [
      { question: 'Why do government portals require 300 DPI?', answer: '300 DPI ensures crisp, high-density print clarity for physical document verification.' }
    ]
  },
  {
    id: 'blur-pixelate-image',
    name: 'Blur & Pixelate Sensitive Photo Data',
    shortDesc: 'Obscure sensitive text, faces, Aadhar/ID numbers, and personal data with custom blur and pixelate tools.',
    longDesc: 'Privacy protection tool to blur or pixelate sensitive regions (ID card numbers, signatures, faces) on photos before sharing online.',
    category: 'security',
    iconName: 'ShieldCheck',
    isNew: true,
    badge: 'Privacy Blur',
    seoTitle: 'Blur Image & Pixelate Photo Online for Privacy | Tool Studio',
    seoKeywords: ['blur image online', 'pixelate sensitive text on photo', 'censor photo data', 'blur face online', 'pi7 photo blur'],
    steps: [
      'Upload photo containing sensitive information.',
      'Select region to blur or apply global privacy filter.',
      'Adjust blur intensity slider.',
      'Download censored image.'
    ],
    faq: [
      { question: 'Does blurring keep original data hidden?', answer: 'Yes! The pixelation permanently overwrites underlying pixel data on canvas rendering.' }
    ]
  },
  {
    id: 'calculators',
    name: 'Smart Calculator Suite (50 Calculators)',
    shortDesc: 'Complete financial, loan, tax, health, daily utility & publishing calculators across Phase 1, 2 & 3.',
    longDesc: 'Comprehensive suite of 50 precision calculators including EMI, SIP, Income Tax, GST, Age, BMI, FD, PPF, SWP, Lumpsum, Car Loan, Book Spine Thickness, DPI Print, and Text Readability.',
    category: 'calculators',
    iconName: 'Calculator',
    isPopular: true,
    badge: '50 Calculators',
    seoTitle: '50 Free Online Calculators - EMI, SIP, Income Tax, GST, Age & Publishing | Tool Studio',
    seoKeywords: ['emi calculator', 'sip calculator', 'income tax calculator', 'gst calculator', 'age calculator', 'bmi calculator', '50 calculators'],
    steps: [
      'Select Phase 1, Phase 2, or Phase 3 calculator tab.',
      'Enter input parameters using interactive sliders or numeric boxes.',
      'View instant live calculated results.',
      'Click "Copy Report" to export calculation details.'
    ],
    faq: [
      { question: 'Are all 50 calculators free to use?', answer: 'Yes! All calculators across Phase 1, Phase 2, and Phase 3 are 100% free with unlimited usage.' }
    ]
  },
  // Phase 1 Calculators
  {
    id: 'calculator-emi',
    name: 'EMI Calculator (Home, Car & Personal Loan)',
    shortDesc: 'Calculate monthly loan EMI, total interest, and complete repayment breakdown.',
    longDesc: 'Free online EMI calculator for housing, vehicle, and personal loans. Instantly compute Equated Monthly Installment with interactive loan tenure sliders.',
    category: 'calculators',
    iconName: 'Calculator',
    badge: 'Phase 1',
    seoTitle: 'EMI Calculator Online - Home, Car & Personal Loan EMI | Tool Studio',
    seoKeywords: ['emi calculator', 'home loan emi calculator', 'car loan emi', 'loan interest calculator'],
    steps: ['Enter Loan Amount', 'Set Interest Rate', 'Choose Tenure', 'View Monthly EMI'],
    faq: [{ question: 'How is EMI calculated?', answer: 'EMI = [P x R x (1+R)^N]/[(1+R)^N-1]' }]
  },
  {
    id: 'calculator-sip',
    name: 'SIP Return Calculator (Mutual Funds)',
    shortDesc: 'Estimate future wealth returns on monthly Systematic Investment Plans.',
    longDesc: 'Calculate wealth growth, total invested capital, and estimated compound gains from monthly SIP investments.',
    category: 'calculators',
    iconName: 'TrendingUp',
    badge: 'Phase 1',
    seoTitle: 'SIP Calculator Online - Mutual Fund Wealth Growth | Tool Studio',
    seoKeywords: ['sip calculator', 'mutual fund sip calculator', 'sip growth estimator'],
    steps: ['Enter Monthly SIP', 'Set Expected Return Rate', 'Select Duration', 'View Future Wealth'],
    faq: [{ question: 'Is SIP investment safe?', answer: 'SIPs dollar-cost-average market cycles over long term horizons.' }]
  },
  {
    id: 'calculator-income-tax',
    name: 'Income Tax Calculator (Old vs New Regime)',
    shortDesc: 'Compare tax liability under Old and New Income Tax Regimes.',
    longDesc: 'Calculate annual income tax liability and compare savings between Old and New tax regimes for FY 2024-25.',
    category: 'calculators',
    iconName: 'PieChart',
    badge: 'Phase 1',
    seoTitle: 'Income Tax Calculator FY 2024-25 - Old vs New Regime | Tool Studio',
    seoKeywords: ['income tax calculator', 'old vs new tax regime', '80C tax deduction'],
    steps: ['Enter Annual Income', 'Select Deductions (80C/80D)', 'View Tax Payable Comparison'],
    faq: [{ question: 'Which tax regime saves more tax?', answer: 'New regime offers lower slab rates, while Old regime allows 80C & HRA exemptions.' }]
  },
  {
    id: 'calculator-gst',
    name: 'GST Tax Calculator (5%, 12%, 18%, 28%)',
    shortDesc: 'Add or remove GST from invoice totals with CGST, SGST & IGST split.',
    longDesc: 'Instant GST rate calculator. Compute gross total with added GST or extract net base price from inclusive GST amounts.',
    category: 'calculators',
    iconName: 'DollarSign',
    badge: 'Phase 1',
    seoTitle: 'GST Calculator Online - Add/Remove GST (5%, 12%, 18%, 28%) | Tool Studio',
    seoKeywords: ['gst calculator', 'add gst online', 'remove gst from total', 'cgst sgst calculator'],
    steps: ['Enter Amount', 'Select Add or Remove GST', 'Choose GST Slab Rate', 'View Base & Tax Split'],
    faq: [{ question: 'What is CGST and SGST?', answer: 'In intra-state sales, GST is split equally into Central (CGST) and State (SGST).' }]
  },
  {
    id: 'calculator-age',
    name: 'Exact Age Calculator (Years, Months, Days)',
    shortDesc: 'Find exact age down to years, months, days, hours, and next birthday countdown.',
    longDesc: 'Calculate precise age between date of birth and today. Shows total days lived, hours lived, and days until next birthday.',
    category: 'calculators',
    iconName: 'Clock',
    badge: 'Phase 1',
    seoTitle: 'Exact Age Calculator - Calculate Age in Years, Months, Days | Tool Studio',
    seoKeywords: ['age calculator', 'calculate exact age', 'how old am i', 'dob age calculator'],
    steps: ['Select Date of Birth', 'View Exact Age Breakdown'],
    faq: [{ question: 'Does age calculator consider leap years?', answer: 'Yes! Exact calendar day differences including leap years are computed.' }]
  },
  {
    id: 'calculator-bmi',
    name: 'BMI Body Mass Index & Healthy Weight',
    shortDesc: 'Calculate Body Mass Index and healthy target weight range.',
    longDesc: 'Free BMI calculator for adults. Evaluates underweight, normal, overweight, and obese classifications with ideal body weight ranges.',
    category: 'calculators',
    iconName: 'HeartPulse',
    badge: 'Phase 1',
    seoTitle: 'BMI Calculator Online - Body Mass Index & Ideal Weight | Tool Studio',
    seoKeywords: ['bmi calculator', 'body mass index', 'ideal weight calculator'],
    steps: ['Set Height in CM', 'Set Weight in KG', 'View BMI Score & Category'],
    faq: [{ question: 'What is normal BMI range?', answer: 'A BMI between 18.5 and 24.9 is considered normal healthy weight.' }]
  },
  // Phase 3 Specialized PDF & Publishing Calculators
  {
    id: 'calculator-doc-page-spine',
    name: 'Book Spine Thickness & Cover Layout Calculator',
    shortDesc: 'Calculate book spine width in mm & inches based on page count, paper GSM & binding.',
    longDesc: 'Specialized print publishing tool. Calculate book spine thickness and full cover layout width (Front + Spine + Back) for paperback and hardcover printing.',
    category: 'calculators',
    iconName: 'BookOpen',
    badge: 'Phase 3',
    seoTitle: 'Book Spine Thickness Calculator - Print & Cover Layout | Tool Studio',
    seoKeywords: ['book spine calculator', 'spine thickness mm', 'paperback spine calculator', 'book cover layout width'],
    steps: ['Enter Page Count', 'Select Paper GSM Density', 'Choose Paper Finish', 'View Spine Width mm'],
    faq: [{ question: 'Why is spine thickness important for printing?', answer: 'Exact spine width ensures cover text aligns perfectly on the book binding edge.' }]
  },
  {
    id: 'calculator-dpi-print',
    name: 'DPI & Print Dimensions Calculator (300 DPI)',
    shortDesc: 'Convert pixel dimensions (Width x Height) to physical print inches and centimeters.',
    longDesc: 'Calculate physical print size of images and documents at 300 DPI high-res printing standards vs 150 DPI and 72 DPI screen resolutions.',
    category: 'calculators',
    iconName: 'Printer',
    badge: 'Phase 3',
    seoTitle: 'DPI & Print Dimension Calculator - Pixels to Inches at 300 DPI | Tool Studio',
    seoKeywords: ['dpi calculator', 'pixels to inches 300 dpi', 'print resolution calculator', '300 dpi print size'],
    steps: ['Enter Width & Height in Pixels', 'Select Target DPI', 'View Inches & Centimeters Print Dimensions'],
    faq: [{ question: 'What is the standard DPI for high quality printing?', answer: 'Commercial printing requires 300 DPI for sharp text and vivid images.' }]
  }
];
