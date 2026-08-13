export interface Translations {
  [key: string]: {
    [langCode: string]: string;
  };
}

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Hero & Header
  heroTitle: {
    en: 'Every tool you need to work with PDFs in one place',
    es: 'Todas las herramientas que necesitas para trabajar con PDF en un solo lugar',
    fr: 'Tous les outils dont vous avez besoin pour travailler avec des PDF au même endroit',
    de: 'Alle Werkzeuge, die Sie für die Arbeit mit PDFs benötigen, an einem Ort',
    hi: 'पीडीएफ के साथ काम करने के लिए आवश्यक सभी टूल्स एक ही स्थान पर',
    'zh-CN': '在一个地方提供您处理 PDF 所需的各种工具',
    'zh-TW': '在一個地方提供您處理 PDF 所需的各種工具',
    ar: 'كل أداة تحتاجها للعمل مع ملفات PDF في مكان واحد',
    ru: 'Все инструменты для работы с PDF в одном месте',
    pt: 'Todas as ferramentas que você precisa para trabalhar com PDFs em um só lugar',
    it: 'Tutti gli strumenti necessari per lavorare con i PDF in un unico posto',
    ja: 'PDFの作業に必要なすべてのツールが1か所に集結',
    ko: 'PDF 작업에 필요한 모든 도구를 한 곳에서',
    id: 'Setiap alat yang Anda butuhkan untuk bekerja dengan PDF di satu tempat',
    tr: 'PDF\'lerle çalışmak için ihtiyacınız olan her araç tek bir yerde',
    nl: 'Elke tool die u nodig hebt om met PDF\'s te werken op één plek',
    pl: 'Wszystkie narzędzia do pracy z plikami PDF w jednym miejscu',
    vi: 'Mọi công cụ bạn cần để làm việc với PDF ở một nơi',
    th: 'ทุกเครื่องมือที่คุณต้องการสำหรับการทำงานกับไฟล์ PDF ในที่เดียว',
    uk: 'Усі інструменти для роботи з PDF в одному місці',
    he: 'כל כלי שאתה צריך כדי לעבוד עם קבצי PDF במקום אחד',
  },
  heroSubtitle: {
    en: '100% Free, Secure & Fast PDF Converter, Editor, OCR & Smart Tools. No limits, directly in your browser.',
    es: '100% gratis, seguro y rápido. Convertidor, editor, OCR y herramientas inteligentes. Sin límites en tu navegador.',
    fr: '100% gratuit, sécurisé et rapide. Convertisseur, éditeur, OCR et outils intelligents. Sans limites dans votre navigateur.',
    de: '100% kostenlos, sicher & schnell. PDF-Konverter, Editor, OCR & Smart-Tools. Keine Limits, direkt im Browser.',
    hi: '100% मुफ़्त, सुरक्षित और तेज़ पीडीएफ कन्वर्टर, एडिटर, ओसीआर और स्मार्ट टूल्स। बिना किसी सीमा के।',
    'zh-CN': '100% 免费、安全且快速的 PDF 转换器、编辑器、OCR 和智能工具。没有限制，直接在您的浏览器中。',
    ar: 'أدوات تحرير وتحويل وتلخيص PDF مجانية ومؤمنة بنسبة 100% وبدون حدود مباشرة في متصفحك.',
    ru: '100% бесплатно, безопасно и быстро. Конвертер, редактор, OCR и смарт-инструменты прямо в браузере.',
    pt: '100% gratuito, seguro e rápido. Conversor, editor, OCR e ferramentas inteligentes. Sem limites, direto no navegador.',
  },
  searchPlaceholder: {
    en: 'Search 25+ PDF tools (e.g. merge, compress, OCR, sign)...',
    es: 'Buscar más de 25 herramientas de PDF (p. ej. unir, comprimir, OCR, firmar)...',
    fr: 'Rechercher plus de 25 outils PDF (ex: fusionner, mep, OCR, signer)...',
    de: 'Durchsuchen Sie 25+ PDF-Tools (z. B. Zusammenfügen, Komprimieren, OCR, Signieren)...',
    hi: '25+ पीडीएफ टूल्स खोजें (जैसे मर्ज, कंप्रेस, ओसीआर, साइन)...',
    'zh-CN': '搜索 25+ 个 PDF 工具（例如合并、压缩、OCR、签名）...',
    ar: 'ابحث في أكثر من 25 أداة PDF (مثل دمج، ضغط، OCR، توقيع)...',
    ru: 'Поиск из 25+ PDF-инструментов (например, объединение, сжатие, OCR, подпись)...',
    pt: 'Pesquise 25+ ferramentas PDF (ex: juntar, comprimir, OCR, assinar)...',
    it: 'Cerca oltre 25 strumenti PDF (es. unisci, comprimi, OCR, firma)...',
    ja: '25以上のPDFツールを検索（例：結合、微圧縮、OCR、署名）...',
  },
  selectLanguage: {
    en: 'Select language',
    es: 'Seleccionar idioma',
    fr: 'Choisir la langue',
    de: 'Sprache auswählen',
    hi: 'भाषा चुनें',
    'zh-CN': '选择语言',
    ar: 'اختر اللغة',
    ru: 'Выберите язык',
    pt: 'Selecionar idioma',
    it: 'Seleziona lingua',
    ja: '言語を選択',
  },
  allTools: {
    en: 'All Tools',
    es: 'Todas las herramientas',
    fr: 'Tous les outils',
    de: 'Alle Werkzeuge',
    hi: 'सभी टूल्स',
    'zh-CN': '所有工具',
    ar: 'جميع الأدوات',
    ru: 'Все инструменты',
    pt: 'Todas as ferramentas',
    it: 'Tutti gli strumenti',
    ja: 'すべてのツール',
  },
  popular: {
    en: '🔥 Popular',
    es: '🔥 Populares',
    fr: '🔥 Populaire',
    de: '🔥 Beliebt',
    hi: '🔥 लोकप्रिय',
    'zh-CN': '🔥 热门',
    ar: '🔥 الشائعة',
    ru: '🔥 Популярные',
    pt: '🔥 Populares',
    it: '🔥 Popolari',
    ja: '🔥 人気',
  },
  editConvert: {
    en: '✏️ Edit & Convert',
    es: '✏️ Editar y Convertir',
    fr: '✏️ Éditer & Convertir',
    de: '✏️ Bearbeiten & Konvertieren',
    hi: '✏️ एडिट और कन्वर्ट',
    'zh-CN': '✏️ 编辑与转换',
    ar: '✏️ تعديل وتحويل',
    ru: '✏️ Редактировать и конвертировать',
    pt: '✏️ Editar e Converter',
  },
  organizeSplit: {
    en: '✂️ Organize & Split',
    es: '✂️ Organizar y Dividir',
    fr: '✂️ Organiser & Diviser',
    de: '✂️ Organisieren & Teilen',
    hi: '✂️ व्यवस्थित और विभाजित करें',
    'zh-CN': '✂️ 组织与拆分',
    ar: '✂️ تنظيم وتقسيم',
    ru: '✂️ Организовать и разделить',
  },
  security: {
    en: '🔒 Security & Legal',
    es: '🔒 Seguridad y Legal',
    fr: '🔒 Sécurité & Juridique',
    de: '🔒 Sicherheit & Recht',
    hi: '🔒 सुरक्षा और कानूनी',
    'zh-CN': '🔒 安全与法律',
    ar: '🔒 الأمان والقانون',
    ru: '🔒 Безопасность и право',
  },
  otherScans: {
    en: '📄 Scans & Tools',
    es: '📄 Escaneos y Herramientas',
    fr: '📄 Scans & Outils',
    de: '📄 Scans & Tools',
    hi: '📄 स्कैन और उपकरण',
    'zh-CN': '📄 扫描与工具',
    ar: '📄 المسح والأدوات',
    ru: '📄 Сканы и инструменты',
  },
  aiTools: {
    en: '✨ Smart Document Suite',
    es: '✨ Suite de Documentos',
    fr: '✨ Suite de Documents',
    de: '✨ Smart Dokumente Suite',
    hi: '✨ स्मार्ट डॉक्यूमेंट सूट',
    'zh-CN': '✨ 智能文档套件',
    ar: '✨ جناح المستندات الذكية',
    ru: '✨ Смарт Документы Suite',
  },
  viewAll: {
    en: 'View All PDF Tools →',
    es: 'Ver todas las herramientas de PDF →',
    fr: 'Voir tous les outils PDF →',
    de: 'Alle PDF-Tools anzeigen →',
    hi: 'सभी पीडीएफ टूल्स देखें →',
    'zh-CN': '查看所有 PDF 工具 →',
    ar: 'عرض جميع أدوات PDF ←',
    ru: 'Посмотреть все PDF инструменты →',
  },
  upgradePro: {
    en: 'Pro Upgrade',
    es: 'Actualizar a Pro',
    fr: 'Passer à Pro',
    de: 'Pro Upgrade',
    hi: 'प्रो अपग्रेड',
    'zh-CN': '升级 Pro',
    ar: 'الترقية إلى برو',
    ru: 'Перейти на Pro',
  },
  login: {
    en: 'Login',
    es: 'Iniciar sesión',
    fr: 'Connexion',
    de: 'Anmelden',
    hi: 'लॉग इन',
    'zh-CN': '登录',
    ar: 'تسجيل الدخول',
    ru: 'Войти',
  }
};

// Map of translated tool names and short descriptions
export const TOOL_TRANSLATIONS: Record<string, Record<string, { name: string; shortDesc: string }>> = {
  merge: {
    es: { name: 'Unir PDF', shortDesc: 'Combina varios documentos PDF en un solo archivo unificado en orden personalizado.' },
    fr: { name: 'Fusionner PDF', shortDesc: 'Combinez plusieurs documents PDF en un seul fichier unifié dans un ordre personnalisé.' },
    de: { name: 'PDF zusammenfügen', shortDesc: 'Kombinieren Sie mehrere PDF-Dokumente zu einer einzigen Datei.' },
    hi: { name: 'पीडीएफ मर्ज करें', shortDesc: 'कई पीडीएफ दस्तावेजों को एक ही फाइल में मिलाएं।' },
    'zh-CN': { name: '合并 PDF', shortDesc: '按自定义页面顺序将多个 PDF 文档合并为一个文件。' },
    ar: { name: 'دمج PDF', shortDesc: 'دمج عدة مستندات PDF في ملف واحد موحد بترتيب مخصص.' },
    ru: { name: 'Объединить PDF', shortDesc: 'Объедините несколько документов PDF в один файл.' },
    pt: { name: 'Juntar PDF', shortDesc: 'Combine vários documentos PDF em um único arquivo unificado.' },
    it: { name: 'Unisci PDF', shortDesc: 'Unisci più documenti PDF in un unico file.' },
    ja: { name: 'PDF結合', shortDesc: '複数のPDFドキュメントを順序通り1つのファイルに結合。' },
  },
  split: {
    es: { name: 'Dividir PDF', shortDesc: 'Separa un archivo PDF en varios documentos o extrae páginas específicas.' },
    fr: { name: 'Diviser PDF', shortDesc: 'Séparez un fichier PDF en plusieurs documents ou extrayez des pages.' },
    de: { name: 'PDF teilen', shortDesc: 'Trennen Sie eine PDF-Datei in mehrere Dokumente oder extrahieren Sie Seiten.' },
    hi: { name: 'पीडीएफ विभाजित करें', shortDesc: 'एक पीडीएफ फाइल को कई दस्तावेजों में अलग करें या पृष्ठ निकालें।' },
    'zh-CN': { name: '拆分 PDF', shortDesc: '将一个 PDF 文件拆分为多个文档或提取特定页码。' },
    ar: { name: 'تقسيم PDF', shortDesc: 'فصل ملف PDF واحد إلى مستندات متعددة أو استخراج صفحات معينة.' },
    ru: { name: 'Разделить PDF', shortDesc: 'Разделите PDF-файл на несколько документов или извлеките страницы.' },
    pt: { name: 'Dividir PDF', shortDesc: 'Separe um arquivo PDF em vários documentos ou extraia páginas.' },
  },
  compress: {
    es: { name: 'Comprimir PDF', shortDesc: 'Reduce el tamaño del archivo PDF optimizando la calidad para correo y web.' },
    fr: { name: 'Compresser PDF', shortDesc: 'Réduisez la taille du fichier PDF tout en optimisant la qualité.' },
    de: { name: 'PDF komprimieren', shortDesc: 'Reduzieren Sie die PDF-Dateigröße bei optimaler Qualität.' },
    hi: { name: 'पीडीएफ कंप्रेस करें', shortDesc: 'गुणवत्ता बनाए रखते हुए पीडीएफ फाइल का आकार घटाएं।' },
    'zh-CN': { name: '压缩 PDF', shortDesc: '在优化电子邮件和网页上传质量的同时减小 PDF 文件大小。' },
    ar: { name: 'ضغط PDF', shortDesc: 'تقليل حجم ملف PDF مع تحسين الجودة للبريد الإلكتروني والويب.' },
    ru: { name: 'Сжать PDF', shortDesc: 'Уменьшите размер PDF-файла с сохранением качества.' },
  },
  edit: {
    es: { name: 'Editar y Anotar PDF', shortDesc: 'Añade texto, resaltados, formas, dibujos e imágenes directamente en PDF.' },
    fr: { name: 'Éditer & Annoter PDF', shortDesc: 'Ajoutez du texte, des surlignages, des formes et des images sur le PDF.' },
    de: { name: 'PDF bearbeiten', shortDesc: 'Fügen Sie Text, Hervorhebungen, Formen und Bilder direkt in PDFs ein.' },
    hi: { name: 'पीडीएफ एडिट और एनोटेट करें', shortDesc: 'पीडीएफ में टेक्स्ट, हाइलाइट्स, शेप्स और इमेज जोड़ें।' },
    'zh-CN': { name: '编辑与批注 PDF', shortDesc: '直接在 PDF 页面上添加文本、高亮、形状、手绘和图像。' },
    ar: { name: 'تعديل وتدوين ملاحظات PDF', shortDesc: 'إضافة نصوص وإبراز وأشكال ورسومات وصور مباشرة على PDF.' },
    ru: { name: 'Редактировать PDF', shortDesc: 'Добавляйте текст, выделения, фигуры и изображения в PDF.' },
  },
  'ai-summarize': {
    es: { name: 'Asistente IA PDF y OCR', shortDesc: 'Resume documentos, extrae datos clave y chatea con tu PDF usando Gemini AI.' },
    fr: { name: 'Assistant IA PDF & OCR', shortDesc: 'Résumez les documents, extrayez les faits clés et discutez avec votre PDF.' },
    de: { name: 'KI PDF-Assistent & OCR', shortDesc: 'Fassen Sie Dokumente zusammen, extrahieren Sie Fakten und chatten Sie mit PDFs.' },
    hi: { name: 'एआई पीडीएफ सहायक और ओसीआर', shortDesc: 'दस्तावेज़ों का सारांश बनाएं और जेमिनी एआई के साथ चैट करें।' },
    'zh-CN': { name: 'AI PDF 助手与 OCR', shortDesc: '使用 Gemini AI 总结文档、提取关键事实、翻译并与 PDF 聊天。' },
    ar: { name: 'مساعد الذكاء الاصطناعي و OCR', shortDesc: 'تلخيص المستندات واستخراج الحقائق والدردشة مع ملف PDF الخاص بك.' },
    ru: { name: 'ИИ PDF-помощник и OCR', shortDesc: 'Суммируйте документы, извлекайте факты и чатьтесь с PDF.' },
  },
  sign: {
    es: { name: 'Firmar PDF', shortDesc: 'Dibuja o escribe tu firma digital e insértala en cualquier lugar del PDF.' },
    fr: { name: 'Signer un PDF', shortDesc: 'Dessinez ou tapez votre signature numérique et placez-la sur le PDF.' },
    de: { name: 'PDF unterschreiben', shortDesc: 'Zeichnen oder tippen Sie Ihre digitale Unterschrift in das PDF.' },
    hi: { name: 'पीडीएफ पर हस्ताक्षर करें', shortDesc: 'डिजिटल हस्ताक्षर बनाएं और इसे अपने पीडीएफ पर कहीं भी रखें।' },
    'zh-CN': { name: '签名 PDF', shortDesc: '绘制或键入您的电子签名并放置在 PDF 的任何位置。' },
    ar: { name: 'توقيع PDF', shortDesc: 'رسم أو كتابة توقيعك الإلكتروني ووضعه في أي مكان على PDF.' },
    ru: { name: 'Подписать PDF', shortDesc: 'Нарисуйте или введите электронную подпись в любом месте PDF.' },
  },
  ocr: {
    es: { name: 'Extractor OCR Gemini Vision', shortDesc: 'Extrae texto editable y tablas de escaneos e imágenes con IA Gemini.' },
    fr: { name: 'Extracteur OCR Gemini Vision', shortDesc: 'Extrayez le texte et les tableaux des scans et des images avec Gemini AI.' },
    de: { name: 'Gemini Vision OCR-Extraktor', shortDesc: 'Extrahieren Sie bearbeitbaren Text und Tabellen aus Scans mit KI.' },
    hi: { name: 'ओसीआर पीडीएफ टेक्स्ट एक्सट्रैक्टर', shortDesc: 'स्कैन किए गए पीडीएफ और छवियों से टेक्स्ट और टेबल निकालें।' },
    'zh-CN': { name: 'Gemini Vision OCR 文本提取', shortDesc: '使用 Gemini AI 视觉从扫描的 PDF 和图像中提取文本和表格。' },
    ar: { name: 'مستخرج النص OCR Gemini Vision', shortDesc: 'استخراج النصوص والجداول القابلة للتعديل من الصور والمسح الضوئي.' },
    ru: { name: 'Gemini Vision OCR Распознавание', shortDesc: 'Извлекайте редактируемый текст и таблицы из сканов и изображений.' },
  }
};

export function getTranslation(key: string, langCode: string): string {
  if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][langCode]) {
    return UI_TRANSLATIONS[key][langCode];
  }
  if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key]['en']) {
    return UI_TRANSLATIONS[key]['en'];
  }
  return key;
}

export function getToolTranslation(toolId: string, defaultName: string, defaultDesc: string, langCode: string) {
  if (TOOL_TRANSLATIONS[toolId] && TOOL_TRANSLATIONS[toolId][langCode]) {
    return TOOL_TRANSLATIONS[toolId][langCode];
  }
  return { name: defaultName, shortDesc: defaultDesc };
}
