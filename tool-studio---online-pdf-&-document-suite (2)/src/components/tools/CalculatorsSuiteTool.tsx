import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ArrowLeft,
  Search,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  HeartPulse,
  BookOpen,
  PieChart,
  Layers,
  FileText,
  Sliders,
  Scale,
  Award,
  Zap,
  Printer,
  ChevronRight,
  Info,
  ShieldCheck,
  Clock,
  Hash
} from 'lucide-react';
import { ToolId } from '../../types';

interface CalculatorsSuiteToolProps {
  initialCalcId?: string;
  onBack: () => void;
  onSuccessAction?: (msg: string) => void;
}

export interface CalcMeta {
  id: string;
  toolId: ToolId;
  name: string;
  phase: 1 | 2 | 3;
  phaseLabel: string;
  category: 'financial' | 'health' | 'daily' | 'publishing';
  desc: string;
  iconName: string;
  badge: string;
}

export const ALL_CALCULATORS: CalcMeta[] = [
  // --- PHASE 1 (20 Calculators) ---
  { id: 'emi', toolId: 'calculator-emi', name: 'EMI Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate exact Equated Monthly Installment for loans with total interest payable.', iconName: 'Calculator', badge: 'Loan EMI' },
  { id: 'sip', toolId: 'calculator-sip', name: 'SIP Investment Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Estimate wealth growth from monthly Systematic Investment Plans in Mutual Funds.', iconName: 'TrendingUp', badge: 'Mutual Funds' },
  { id: 'income-tax', toolId: 'calculator-income-tax', name: 'Income Tax Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Compare tax payable under Old vs New Income Tax Regime with 80C & 80D deductions.', iconName: 'PieChart', badge: 'Old vs New' },
  { id: 'gst', toolId: 'calculator-gst', name: 'GST Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Add or remove GST (5%, 12%, 18%, 28%) with CGST, SGST & IGST tax splits.', iconName: 'DollarSign', badge: 'Tax & Invoice' },
  { id: 'age', toolId: 'calculator-age', name: 'Exact Age Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'daily', desc: 'Find exact age in years, months, days, total hours, minutes and next birthday countdown.', iconName: 'Clock', badge: 'Age & Date' },
  { id: 'percentage', toolId: 'calculator-percentage', name: 'Percentage Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'daily', desc: 'Calculate percentage changes, ratio of numbers, fraction to percentage & discount.', iconName: 'Sliders', badge: 'Math & Ratio' },
  { id: 'bmi', toolId: 'calculator-bmi', name: 'BMI & Ideal Weight Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'health', desc: 'Calculate Body Mass Index, health risk rating and healthy target weight range.', iconName: 'HeartPulse', badge: 'Body Health' },
  { id: 'home-loan', toolId: 'calculator-home-loan', name: 'Home Loan Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate housing loan monthly EMI, amortization schedule and processing fees.', iconName: 'Calculator', badge: 'Housing Loan' },
  { id: 'fd', toolId: 'calculator-fd', name: 'FD Fixed Deposit Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Determine guaranteed maturity payout and compound interest earned on Fixed Deposits.', iconName: 'DollarSign', badge: 'Bank FD' },
  { id: 'salary', toolId: 'calculator-salary', name: 'Take-Home Salary Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate monthly net take-home salary after PF, Professional Tax & income tax deductions.', iconName: 'Award', badge: 'In-Hand Pay' },
  { id: 'ppf', toolId: 'calculator-ppf', name: 'PPF Scheme Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate 15-year maturity value and tax-free interest growth for Public Provident Fund.', iconName: 'TrendingUp', badge: 'Tax Free 80C' },
  { id: 'compound-interest', toolId: 'calculator-compound-interest', name: 'Compound Interest Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate exponential compound interest with custom compounding frequencies.', iconName: 'PieChart', badge: 'Compounding' },
  { id: 'epf', toolId: 'calculator-epf', name: 'EPF Corpus Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Estimate Employee Provident Fund retirement corpus accumulated from monthly contributions.', iconName: 'Award', badge: 'EPF Corpus' },
  { id: 'gratuity', toolId: 'calculator-gratuity', name: 'Gratuity Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate statutory gratuity payout based on completed years of service.', iconName: 'DollarSign', badge: 'Job Exit' },
  { id: 'nps', toolId: 'calculator-nps', name: 'NPS Pension Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate National Pension Scheme lump sum withdrawal and monthly annuity pension.', iconName: 'TrendingUp', badge: 'Retirement' },
  { id: 'hra', toolId: 'calculator-hra', name: 'HRA Exemption Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Calculate House Rent Allowance tax exemption based on basic salary and rent paid.', iconName: 'PieChart', badge: 'Rent Tax Save' },
  { id: 'cagr', toolId: 'calculator-cagr', name: 'CAGR Growth Rate Calculator', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Determine Compound Annual Growth Rate for investments and business revenues.', iconName: 'TrendingUp', badge: 'Annual Rate' },
  { id: 'ctc-inhand', toolId: 'calculator-ctc-inhand', name: 'CTC to Monthly In-Hand', phase: 1, phaseLabel: 'Phase 1', category: 'financial', desc: 'Break down gross annual CTC package into actual monthly credited bank salary.', iconName: 'Award', badge: 'Salary Breakup' },
  { id: 'unit-converter', toolId: 'calculator-unit-converter', name: 'Multi-Unit Converter', phase: 1, phaseLabel: 'Phase 1', category: 'daily', desc: 'Convert Length, Weight, Temperature, Area, Volume, Speed & Digital Data units.', iconName: 'Scale', badge: 'Universal Units' },
  { id: 'word-counter', toolId: 'calculator-word-counter', name: 'Word & Character Counter', phase: 1, phaseLabel: 'Phase 1', category: 'daily', desc: 'Count words, characters, sentences, reading duration & speaking speech time.', iconName: 'FileText', badge: 'Text Analytics' },

  // --- PHASE 2 (15 Calculators) ---
  { id: 'lumpsum', toolId: 'calculator-lumpsum', name: 'Lumpsum Investment Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate future wealth value of one-time upfront investments over time.', iconName: 'TrendingUp', badge: 'One-Time SIP' },
  { id: 'swp', toolId: 'calculator-swp', name: 'SWP Withdrawal Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Plan regular monthly income withdrawals from mutual fund investment corpus.', iconName: 'DollarSign', badge: 'Monthly Income' },
  { id: 'rd', toolId: 'calculator-rd', name: 'RD Recurring Deposit Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate maturity return on monthly bank recurring deposit savings.', iconName: 'PieChart', badge: 'Bank Savings' },
  { id: 'loan', toolId: 'calculator-loan', name: 'General Loan Amortization', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Generate complete monthly principal & interest loan payoff repayment tables.', iconName: 'Calculator', badge: 'Amortization' },
  { id: 'car-loan', toolId: 'calculator-car-loan', name: 'Car Loan EMI & Down Payment', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate vehicle financing EMI, interest cost and down payment ratio.', iconName: 'Calculator', badge: 'Vehicle Auto' },
  { id: 'personal-loan', toolId: 'calculator-personal-loan', name: 'Personal Loan Cost Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate personal loan EMI and processing charges for instant credit.', iconName: 'DollarSign', badge: 'Unsecured Loan' },
  { id: 'retirement', toolId: 'calculator-retirement', name: 'Retirement Corpus Planner', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Estimate required nest egg corpus to maintain lifestyle post-retirement with inflation.', iconName: 'TrendingUp', badge: 'Nest Egg' },
  { id: 'inflation', toolId: 'calculator-inflation', name: 'Inflation Impact Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate future cost of goods and erosion of purchasing power over years.', iconName: 'PieChart', badge: 'Purchasing Power' },
  { id: 'roi', toolId: 'calculator-roi', name: 'ROI Investment Return Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate total percentage Return on Investment and annualized yield.', iconName: 'TrendingUp', badge: 'Net Yield' },
  { id: 'tds', toolId: 'calculator-tds', name: 'TDS Tax Deduction Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate Tax Deducted at Source for Salary, Rent, FD Interest & Contractor payments.', iconName: 'DollarSign', badge: 'TDS Rate' },
  { id: 'loan-eligibility', toolId: 'calculator-loan-eligibility', name: 'Loan Eligibility Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Calculate maximum borrowing limit based on income, FOIR ratio & existing EMIs.', iconName: 'Award', badge: 'Borrowing Limit' },
  { id: 'calorie', toolId: 'calculator-calorie', name: 'Calorie & TDEE Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'health', desc: 'Calculate daily Total Daily Energy Expenditure (TDEE) and macro nutrition target.', iconName: 'HeartPulse', badge: 'Fitness TDEE' },
  { id: 'bmr', toolId: 'calculator-bmr', name: 'BMR Metabolic Rate Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'health', desc: 'Calculate Basal Metabolic Rate calories burned at total resting state.', iconName: 'HeartPulse', badge: 'Basal Burn' },
  { id: 'cgpa', toolId: 'calculator-cgpa', name: 'CGPA to Percentage Calculator', phase: 2, phaseLabel: 'Phase 2', category: 'daily', desc: 'Convert 10-point CGPA scores into official percentage and academic grade class.', iconName: 'Award', badge: 'Academic Grade' },
  { id: 'currency', toolId: 'calculator-currency', name: 'Currency Exchange Estimator', phase: 2, phaseLabel: 'Phase 2', category: 'financial', desc: 'Convert world currencies (INR, USD, EUR, GBP, AED, CAD, AUD) instantly.', iconName: 'DollarSign', badge: 'FX Exchange' },

  // --- PHASE 3 (15 Specialized PDF / Publishing / Word Calculators) ---
  { id: 'doc-page-spine', toolId: 'calculator-doc-page-spine', name: 'Book Spine Thickness & Cover Layout', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate exact book spine thickness (mm/in) based on page count, paper GSM & binding.', iconName: 'BookOpen', badge: 'Print Publishing' },
  { id: 'pdf-size-estimator', toolId: 'calculator-pdf-size', name: 'PDF Compression & Target KB Estimator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Predict compressed PDF file size (KB/MB) based on DPI, image ratio & compression level.', iconName: 'Layers', badge: 'File Squeeze' },
  { id: 'dpi-print', toolId: 'calculator-dpi-print', name: 'DPI & Print Resolution Calculator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate physical print dimensions (Inches & CM) from pixel dimensions at 300 DPI.', iconName: 'Printer', badge: '300 DPI Print' },
  { id: 'reading-time', toolId: 'calculator-reading-time', name: 'Document Reading & Speech Duration', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Estimate silent reading time and public speaking presentation duration for documents.', iconName: 'Clock', badge: 'Speech Duration' },
  { id: 'font-px-rem', toolId: 'calculator-font-px-rem', name: 'Font PX to REM & Typography Scale', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Convert PX, REM, EM, PT typography sizes for web documents and publishing grids.', iconName: 'Sliders', badge: 'CSS & Design' },
  { id: 'char-byte-size', toolId: 'calculator-char-byte-size', name: 'Character & UTF Byte Size Calculator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate exact ASCII, UTF-8, and UTF-16 byte memory footprint for document texts.', iconName: 'Hash', badge: 'UTF-8 Bytes' },
  { id: 'pdf-grid-layout', toolId: 'calculator-pdf-grid', name: 'PDF Grid & Column Layout Calculator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate column width, gutters, printable canvas area and margins for PDF design.', iconName: 'Layers', badge: 'Page Grid' },
  { id: 'book-royalty', toolId: 'calculator-book-royalty', name: 'Book Printing Cost & Author Royalty', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate print cost per copy, distributor margin, net author royalty & sales profit.', iconName: 'DollarSign', badge: 'Author Earnings' },
  { id: 'image-ram-size', toolId: 'calculator-image-ram', name: 'Image Uncompressed RAM & Bitmap Size', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Estimate uncompressed RAM buffer size (MB) and disk space for high-res images.', iconName: 'Zap', badge: 'RAM Buffer' },
  { id: 'text-readability', toolId: 'calculator-text-readability', name: 'Readability Score & Grade Level', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Evaluate Flesch Reading Ease score and Flesch-Kincaid grade level for articles.', iconName: 'FileText', badge: 'Flesch Grade' },
  { id: 'paper-weight-gsm', toolId: 'calculator-paper-weight', name: 'Paper GSM & Ream Weight Calculator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate total paper ream weight (kg/lbs) from GSM density and sheet size.', iconName: 'Scale', badge: 'Paper Ream' },
  { id: 'margin-trim-box', toolId: 'calculator-margin-trim', name: 'PDF Bleed, Trim & Safe Area Box', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Calculate precise bleed margins (3mm), trim dimensions and safe content bounding box.', iconName: 'Printer', badge: 'Bleed Box' },
  { id: 'doc-scan-time', toolId: 'calculator-doc-scan-time', name: 'Document Scanning Duration Estimator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Estimate total scanning time for multi-page batch scanning in Simplex & Duplex mode.', iconName: 'Clock', badge: 'Batch Scan' },
  { id: 'ocr-time-tokens', toolId: 'calculator-ocr-time', name: 'OCR Speed & LLM Token Estimator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Estimate OCR processing time and total LLM token count extracted from PDF pages.', iconName: 'Sparkles', badge: 'AI OCR Tokens' },
  { id: 'ebook-file-size', toolId: 'calculator-ebook-size', name: 'Ebook EPUB/PDF Size Estimator', phase: 3, phaseLabel: 'Phase 3', category: 'publishing', desc: 'Predict digital ebook file size based on text word count and embedded image density.', iconName: 'BookOpen', badge: 'EPUB Size' },
];

export const CalculatorsSuiteTool: React.FC<CalculatorsSuiteToolProps> = ({
  initialCalcId,
  onBack,
  onSuccessAction,
}) => {
  // Find initial calculator or default to EMI
  const matchInitial = ALL_CALCULATORS.find(
    (c) => c.id === initialCalcId || c.toolId === initialCalcId
  );
  const [selectedCalcId, setSelectedCalcId] = useState<string>(
    matchInitial ? matchInitial.id : 'emi'
  );
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // States for Calculator Inputs
  // EMI
  const [emiAmount, setEmiAmount] = useState<number>(1000000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(15);

  // SIP
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);

  // Income Tax
  const [taxIncome, setTaxIncome] = useState<number>(1200000);
  const [taxDeduction80c, setTaxDeduction80c] = useState<number>(150000);

  // GST
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'add' | 'remove'>('add');

  // Age
  const [dobDate, setDobDate] = useState<string>('1998-05-15');

  // Percentage
  const [percNum1, setPercNum1] = useState<number>(25);
  const [percNum2, setPercNum2] = useState<number>(500);

  // BMI
  const [bmiHeight, setBmiHeight] = useState<number>(172); // cm
  const [bmiWeight, setBmiWeight] = useState<number>(68); // kg

  // FD
  const [fdAmount, setFdAmount] = useState<number>(200000);
  const [fdRate, setFdRate] = useState<number>(7.2);
  const [fdYears, setFdYears] = useState<number>(5);

  // Salary / CTC
  const [ctcAnnual, setCtcAnnual] = useState<number>(900000);
  const [pfContribution, setPfContribution] = useState<number>(1800);

  // PPF
  const [ppfAnnual, setPpfAnnual] = useState<number>(150000);
  const [ppfYears, setPpfYears] = useState<number>(15);

  // Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(10);
  const [ciYears, setCiYears] = useState<number>(5);

  // Gratuity
  const [gratSalary, setGratSalary] = useState<number>(60000);
  const [gratYears, setGratYears] = useState<number>(8);

  // NPS
  const [npsMonthly, setNpsMonthly] = useState<number>(5000);
  const [npsAge, setNpsAge] = useState<number>(30);

  // HRA
  const [hraBasic, setHraBasic] = useState<number>(400000);
  const [hraReceived, setHraReceived] = useState<number>(180000);
  const [hraRentPaid, setHraRentPaid] = useState<number>(210000);
  const [hraIsMetro, setHraIsMetro] = useState<boolean>(true);

  // CAGR
  const [cagrInitial, setCagrInitial] = useState<number>(100000);
  const [cagrFinal, setCagrFinal] = useState<number>(250000);
  const [cagrYears, setCagrYears] = useState<number>(5);

  // Unit Converter
  const [unitVal, setUnitVal] = useState<number>(10);
  const [unitType, setUnitType] = useState<'cm_to_in' | 'kg_to_lbs' | 'c_to_f' | 'mb_to_kb' | 'sqft_to_sqm'>('cm_to_in');

  // Word Counter Text
  const [wordCounterText, setWordCounterText] = useState<string>(
    'Tool Studio is a professional online browser suite featuring PDF processing, image editing, and over 50 smart calculators.'
  );

  // Phase 2 Inputs
  // Lumpsum
  const [lumpAmount, setLumpAmount] = useState<number>(100000);
  const [lumpRate, setLumpRate] = useState<number>(12);
  const [lumpYears, setLumpYears] = useState<number>(10);

  // SWP
  const [swpCorpus, setSwpCorpus] = useState<number>(2500000);
  const [swpWithdrawal, setSwpWithdrawal] = useState<number>(20000);
  const [swpRate, setSwpRate] = useState<number>(8.5);
  const [swpYears, setSwpYears] = useState<number>(10);

  // RD
  const [rdMonthly, setRdMonthly] = useState<number>(5000);
  const [rdRate, setRdRate] = useState<number>(7.0);
  const [rdMonths, setRdMonths] = useState<number>(36);

  // Car Loan
  const [carPrice, setCarPrice] = useState<number>(1000000);
  const [carDownPayment, setCarDownPayment] = useState<number>(200000);
  const [carRate, setCarRate] = useState<number>(9.0);
  const [carYears, setCarYears] = useState<number>(5);

  // Personal Loan
  const [plAmount, setPlAmount] = useState<number>(300000);
  const [plRate, setPlRate] = useState<number>(13.5);
  const [plMonths, setPlMonths] = useState<number>(36);

  // Calorie / TDEE
  const [calAge, setCalAge] = useState<number>(28);
  const [calGender, setCalGender] = useState<'male' | 'female'>('male');
  const [calWeight, setCalWeight] = useState<number>(70);
  const [calHeight, setCalHeight] = useState<number>(175);
  const [calActivity, setCalActivity] = useState<number>(1.375); // Light exercise

  // Currency
  const [currAmount, setCurrAmount] = useState<number>(100);
  const [currPair, setCurrPair] = useState<'USD_INR' | 'EUR_INR' | 'GBP_INR' | 'INR_USD'>('USD_INR');

  // Phase 3 Inputs
  // Book Spine Thickness
  const [spinePageCount, setSpinePageCount] = useState<number>(240);
  const [spineGsm, setSpineGsm] = useState<number>(80);
  const [spinePaperType, setSpinePaperType] = useState<'offset' | 'gloss' | 'matt' | 'cream'>('offset');
  const [spineCoverType, setSpineCoverType] = useState<'paperback' | 'hardcover'>('paperback');

  // PDF Size Estimator
  const [pdfPages, setPdfPages] = useState<number>(50);
  const [pdfImgPct, setPdfImgPct] = useState<number>(60);
  const [pdfTargetDpi, setPdfTargetDpi] = useState<number>(150);
  const [pdfQuality, setPdfQuality] = useState<'low' | 'medium' | 'high' | 'maximum'>('medium');

  // DPI Print Calculator
  const [dpiPxWidth, setDpiPxWidth] = useState<number>(2400);
  const [dpiPxHeight, setDpiPxHeight] = useState<number>(3600);
  const [dpiTarget, setDpiTarget] = useState<number>(300);

  // Reading Time
  const [readWords, setReadWords] = useState<number>(2500);
  const [readingSpeed, setReadingSpeed] = useState<number>(220);
  const [speakingSpeed, setSpeakingSpeed] = useState<number>(140);

  // Font PX / REM
  const [fontPxVal, setFontPxVal] = useState<number>(18);
  const [fontBase, setFontBase] = useState<number>(16);

  // Char Byte Size
  const [charByteText, setCharByteText] = useState<string>('Tool Studio 2026 - Ultra Fast PDF & Calculator Suite ⚡');

  // PDF Grid Layout
  const [pdfWidthMm, setPdfWidthMm] = useState<number>(210);
  const [pdfMarginMm, setPdfMarginMm] = useState<number>(15);
  const [pdfColumns, setPdfColumns] = useState<number>(12);
  const [pdfGutterMm, setPdfGutterMm] = useState<number>(4);

  // Book Royalty
  const [bookPrice, setBookPrice] = useState<number>(499);
  const [bookPrintCost, setBookPrintCost] = useState<number>(120);
  const [distributorPct, setDistributorPct] = useState<number>(40);
  const [royaltyPct, setRoyaltyPct] = useState<number>(15);

  // Image RAM Size
  const [imgWidthPx, setImgWidthPx] = useState<number>(4000);
  const [imgHeightPx, setImgHeightPx] = useState<number>(3000);
  const [colorDepth, setColorDepth] = useState<'8bit' | '24bit' | '32bit'>('32bit');

  // Text Readability Text
  const [readabilityText, setReadabilityText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. Modern publishing software allows authors to analyze document structure and readability easily.'
  );

  // Paper Weight
  const [paperGsm, setPaperGsm] = useState<number>(80);
  const [paperWidthMm, setPaperWidthMm] = useState<number>(210);
  const [paperHeightMm, setPaperHeightMm] = useState<number>(297);
  const [paperQuantity, setPaperQuantity] = useState<number>(500);

  // Margin Trim Box
  const [trimWidthMm, setTrimWidthMm] = useState<number>(210);
  const [trimHeightMm, setTrimHeightMm] = useState<number>(297);
  const [bleedMm, setBleedMm] = useState<number>(3);
  const [safeMarginMm, setSafeMarginMm] = useState<number>(5);

  // Doc Scan Time
  const [scanPages, setScanPages] = useState<number>(100);
  const [scanPpm, setScanPpm] = useState<number>(30);
  const [scanMode, setScanMode] = useState<'simplex' | 'duplex'>('duplex');
  const [feedType, setFeedType] = useState<'adf' | 'flatbed'>('adf');

  // OCR Time Tokens
  const [ocrPages, setOcrPages] = useState<number>(25);
  const [ocrEngine, setOcrEngine] = useState<'cloud_ai' | 'fast_local'>('cloud_ai');
  const [ocrWordsPerPage, setOcrWordsPerPage] = useState<number>(350);

  // Ebook File Size
  const [ebookWordCount, setEbookWordCount] = useState<number>(45000);
  const [ebookImageCount, setEbookImageCount] = useState<number>(12);
  const [ebookImgRes, setEbookImgRes] = useState<'low' | 'medium' | 'hd'>('medium');

  // Filtered calculators
  const filteredCalculators = useMemo(() => {
    return ALL_CALCULATORS.filter((c) => {
      if (selectedPhase !== 'all' && c.phase !== selectedPhase) return false;
      if (selectedCat !== 'all' && c.category !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.badge.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedPhase, selectedCat, searchQuery]);

  const activeCalc = ALL_CALCULATORS.find((c) => c.id === selectedCalcId) || ALL_CALCULATORS[0];

  // --- CALCULATION LOGIC ENGINES ---
  const results = useMemo(() => {
    switch (activeCalc.id) {
      case 'emi': {
        const p = emiAmount;
        const r = emiRate / 12 / 100;
        const n = emiTenureYears * 12;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        const totalInterest = totalPayable - p;
        return {
          primaryVal: `₹${Math.round(emi).toLocaleString('en-IN')}`,
          primaryLabel: 'Monthly EMI',
          items: [
            { label: 'Principal Loan Amount', val: `₹${p.toLocaleString('en-IN')}` },
            { label: 'Total Interest Payable', val: `₹${Math.round(totalInterest).toLocaleString('en-IN')}` },
            { label: 'Total Amount Payable', val: `₹${Math.round(totalPayable).toLocaleString('en-IN')}` },
            { label: 'Loan Tenure', val: `${emiTenureYears} Years (${n} Months)` },
          ],
        };
      }
      case 'sip': {
        const p = sipMonthly;
        const i = sipRate / 12 / 100;
        const n = sipYears * 12;
        const futureValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const totalInvested = p * n;
        const wealthGain = futureValue - totalInvested;
        return {
          primaryVal: `₹${Math.round(futureValue).toLocaleString('en-IN')}`,
          primaryLabel: 'Expected Future Wealth',
          items: [
            { label: 'Total Invested Amount', val: `₹${totalInvested.toLocaleString('en-IN')}` },
            { label: 'Estimated Wealth Gain', val: `₹${Math.round(wealthGain).toLocaleString('en-IN')}` },
            { label: 'Annual Expected Return', val: `${sipRate}% p.a.` },
            { label: 'Investment Horizon', val: `${sipYears} Years` },
          ],
        };
      }
      case 'gst': {
        let gstVal = 0;
        let totalVal = 0;
        let baseVal = 0;
        if (gstType === 'add') {
          baseVal = gstAmount;
          gstVal = (gstAmount * gstRate) / 100;
          totalVal = baseVal + gstVal;
        } else {
          totalVal = gstAmount;
          baseVal = (gstAmount * 100) / (100 + gstRate);
          gstVal = totalVal - baseVal;
        }
        return {
          primaryVal: `₹${Math.round(totalVal).toLocaleString('en-IN')}`,
          primaryLabel: 'Gross Total Amount',
          items: [
            { label: 'Net Base Amount', val: `₹${Math.round(baseVal).toLocaleString('en-IN')}` },
            { label: 'Total GST Amount', val: `₹${Math.round(gstVal).toLocaleString('en-IN')}` },
            { label: 'CGST (Half)', val: `₹${(Math.round(gstVal) / 2).toLocaleString('en-IN')} (${gstRate / 2}%)` },
            { label: 'SGST (Half)', val: `₹${(Math.round(gstVal) / 2).toLocaleString('en-IN')} (${gstRate / 2}%)` },
          ],
        };
      }
      case 'age': {
        const dob = new Date(dobDate);
        const now = new Date();
        let years = now.getFullYear() - dob.getFullYear();
        let months = now.getMonth() - dob.getMonth();
        let days = now.getDate() - dob.getDate();

        if (days < 0) {
          months--;
          days += 30;
        }
        if (months < 0) {
          years--;
          months += 12;
        }
        const diffMs = now.getTime() - dob.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalHours = totalDays * 24;

        return {
          primaryVal: `${years} Yrs, ${months} Mos, ${days} Days`,
          primaryLabel: 'Exact Age',
          items: [
            { label: 'Total Days Lived', val: `${totalDays.toLocaleString()} Days` },
            { label: 'Total Hours Lived', val: `${totalHours.toLocaleString()} Hours` },
            { label: 'Total Weeks Lived', val: `${Math.floor(totalDays / 7).toLocaleString()} Weeks` },
            { label: 'Date of Birth', val: dob.toDateString() },
          ],
        };
      }
      case 'percentage': {
        const res = (percNum1 / 100) * percNum2;
        const percRatio = (percNum1 / percNum2) * 100;
        return {
          primaryVal: `${res}`,
          primaryLabel: `${percNum1}% of ${percNum2}`,
          items: [
            { label: `Percentage Value`, val: `${res}` },
            { label: `If ${percNum1} is part of ${percNum2}`, val: `${percRatio.toFixed(2)}%` },
            { label: `Difference`, val: `${percNum2 - res}` },
            { label: `Ratio`, val: `${percNum1}:${percNum2}` },
          ],
        };
      }
      case 'bmi': {
        const hMeter = bmiHeight / 100;
        const bmi = bmiWeight / (hMeter * hMeter);
        let category = 'Normal Weight';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
        else if (bmi >= 30) category = 'Obese';

        const minIdeal = 18.5 * (hMeter * hMeter);
        const maxIdeal = 24.9 * (hMeter * hMeter);

        return {
          primaryVal: `${bmi.toFixed(1)} BMI`,
          primaryLabel: `Status: ${category}`,
          items: [
            { label: 'BMI Category', val: category },
            { label: 'Current Weight', val: `${bmiWeight} kg` },
            { label: 'Height', val: `${bmiHeight} cm` },
            { label: 'Healthy Weight Range', val: `${minIdeal.toFixed(1)} - ${maxIdeal.toFixed(1)} kg` },
          ],
        };
      }
      case 'income-tax': {
        const inc = taxIncome;
        // Old regime simple calculation
        let oldTax = 0;
        const taxableOld = Math.max(0, inc - taxDeduction80c - 50000); // 50k std ded
        if (taxableOld > 1000000) oldTax = 112500 + (taxableOld - 1000000) * 0.3;
        else if (taxableOld > 500000) oldTax = 12500 + (taxableOld - 500000) * 0.2;
        else if (taxableOld > 250000) oldTax = (taxableOld - 250000) * 0.05;

        // New regime simple (FY 2024-25 standard)
        let newTax = 0;
        const taxableNew = Math.max(0, inc - 75000); // 75k std ded
        if (taxableNew > 1500000) newTax = 150000 + (taxableNew - 1500000) * 0.3;
        else if (taxableNew > 1200000) newTax = 90000 + (taxableNew - 1200000) * 0.2;
        else if (taxableNew > 900000) newTax = 45000 + (taxableNew - 900000) * 0.15;
        else if (taxableNew > 600000) newTax = 15000 + (taxableNew - 600000) * 0.1;
        else if (taxableNew > 300000) newTax = (taxableNew - 300000) * 0.05;

        if (taxableNew <= 700000) newTax = 0; // 87A rebate

        return {
          primaryVal: `₹${Math.round(newTax).toLocaleString('en-IN')}`,
          primaryLabel: 'New Tax Regime Payable',
          items: [
            { label: 'New Tax Regime Tax', val: `₹${Math.round(newTax).toLocaleString('en-IN')}` },
            { label: 'Old Tax Regime Tax', val: `₹${Math.round(oldTax).toLocaleString('en-IN')}` },
            { label: 'Tax Difference Saved', val: `₹${Math.abs(Math.round(oldTax - newTax)).toLocaleString('en-IN')}` },
            { label: 'Recommended Regime', val: newTax <= oldTax ? 'New Tax Regime' : 'Old Tax Regime' },
          ],
        };
      }
      case 'fd': {
        const p = fdAmount;
        const r = fdRate / 100;
        const t = fdYears;
        const n = 4; // quarterly compounding
        const maturity = p * Math.pow(1 + r / n, n * t);
        const interest = maturity - p;
        return {
          primaryVal: `₹${Math.round(maturity).toLocaleString('en-IN')}`,
          primaryLabel: 'FD Maturity Payout',
          items: [
            { label: 'Principal Deposit', val: `₹${p.toLocaleString('en-IN')}` },
            { label: 'Total Interest Earned', val: `₹${Math.round(interest).toLocaleString('en-IN')}` },
            { label: 'Interest Rate', val: `${fdRate}% p.a.` },
            { label: 'Deposit Tenure', val: `${fdYears} Years` },
          ],
        };
      }
      case 'salary':
      case 'ctc-inhand': {
        const grossMonthly = ctcAnnual / 12;
        const pfMonthly = pfContribution;
        const ptMonthly = 200;
        const estTaxMonthly = Math.max(0, (ctcAnnual - 700000) * 0.1 / 12);
        const inHandMonthly = grossMonthly - pfMonthly - ptMonthly - estTaxMonthly;

        return {
          primaryVal: `₹${Math.round(inHandMonthly).toLocaleString('en-IN')}`,
          primaryLabel: 'Estimated Monthly In-Hand Salary',
          items: [
            { label: 'Gross Monthly Package', val: `₹${Math.round(grossMonthly).toLocaleString('en-IN')}` },
            { label: 'PF Monthly Deduction', val: `₹${pfMonthly.toLocaleString('en-IN')}` },
            { label: 'Professional Tax', val: `₹${ptMonthly}` },
            { label: 'Est. Monthly Income Tax', val: `₹${Math.round(estTaxMonthly).toLocaleString('en-IN')}` },
          ],
        };
      }
      case 'ppf': {
        const p = Math.min(150000, ppfAnnual);
        const r = 0.071; // 7.1%
        const t = ppfYears;
        let totalVal = 0;
        for (let i = 0; i < t; i++) {
          totalVal = (totalVal + p) * (1 + r);
        }
        const totalInvested = p * t;
        const totalInterest = totalVal - totalInvested;

        return {
          primaryVal: `₹${Math.round(totalVal).toLocaleString('en-IN')}`,
          primaryLabel: 'Tax-Free PPF Maturity Value',
          items: [
            { label: 'Total Invested Amount', val: `₹${totalInvested.toLocaleString('en-IN')}` },
            { label: 'Tax-Free Interest Earned', val: `₹${Math.round(totalInterest).toLocaleString('en-IN')}` },
            { label: 'Current PPF Rate', val: '7.1% p.a.' },
            { label: 'Tenure', val: `${ppfYears} Years` },
          ],
        };
      }
      case 'compound-interest': {
        const p = ciPrincipal;
        const r = ciRate / 100;
        const t = ciYears;
        const n = 12; // monthly compounding
        const amount = p * Math.pow(1 + r / n, n * t);
        const ci = amount - p;

        return {
          primaryVal: `₹${Math.round(amount).toLocaleString('en-IN')}`,
          primaryLabel: 'Final Compound Corpus',
          items: [
            { label: 'Initial Principal', val: `₹${p.toLocaleString('en-IN')}` },
            { label: 'Compound Interest Earned', val: `₹${Math.round(ci).toLocaleString('en-IN')}` },
            { label: 'Simple Interest Equivalent', val: `₹${Math.round(p * r * t).toLocaleString('en-IN')}` },
            { label: 'Extra Compound Yield', val: `₹${Math.round(ci - p * r * t).toLocaleString('en-IN')}` },
          ],
        };
      }
      case 'gratuity': {
        const lastSal = gratSalary;
        const yrs = gratYears;
        const gratuityVal = yrs >= 5 ? (15 * lastSal * yrs) / 26 : 0;

        return {
          primaryVal: yrs >= 5 ? `₹${Math.round(gratuityVal).toLocaleString('en-IN')}` : 'Not Eligible (< 5 Yrs)',
          primaryLabel: 'Eligible Statutory Gratuity',
          items: [
            { label: 'Last Drawn Basic + DA', val: `₹${lastSal.toLocaleString('en-IN')}` },
            { label: 'Years of Service', val: `${yrs} Years` },
            { label: 'Eligibility Status', val: yrs >= 5 ? 'Eligible (Completed 5+ yrs)' : 'Ineligible (Needs 5 yrs)' },
            { label: 'Tax Exemption Limit', val: 'Up to ₹20 Lakhs' },
          ],
        };
      }
      case 'nps': {
        const monthly = npsMonthly;
        const yearsToRetire = Math.max(1, 60 - npsAge);
        const r = 0.10; // 10% returns
        const totalInvested = monthly * 12 * yearsToRetire;
        const n = yearsToRetire * 12;
        const corpus = monthly * ((Math.pow(1 + r / 12, n) - 1) / (r / 12)) * (1 + r / 12);
        const lumpSum60 = corpus * 0.6;
        const annuity40 = corpus * 0.4;
        const estMonthlyPension = (annuity40 * 0.06) / 12; // 6% annuity yield

        return {
          primaryVal: `₹${Math.round(corpus).toLocaleString('en-IN')}`,
          primaryLabel: 'Total Accumulated NPS Corpus',
          items: [
            { label: '60% Tax-Free Lump Sum', val: `₹${Math.round(lumpSum60).toLocaleString('en-IN')}` },
            { label: 'Est. Monthly Pension (40% Annuity)', val: `₹${Math.round(estMonthlyPension).toLocaleString('en-IN')}` },
            { label: 'Total Invested Amount', val: `₹${totalInvested.toLocaleString('en-IN')}` },
            { label: 'Investment Horizon', val: `${yearsToRetire} Years (Age 60)` },
          ],
        };
      }
      case 'hra': {
        const basic = hraBasic;
        const received = hraReceived;
        const rentPaid = hraRentPaid;
        const metroPerc = hraIsMetro ? 0.5 : 0.4;

        const cond1 = received;
        const cond2 = Math.max(0, rentPaid - 0.1 * basic);
        const cond3 = basic * metroPerc;

        const exemptedHra = Math.min(cond1, cond2, cond3);
        const taxableHra = Math.max(0, received - exemptedHra);

        return {
          primaryVal: `₹${Math.round(exemptedHra).toLocaleString('en-IN')}`,
          primaryLabel: 'Tax Exempt HRA Amount',
          items: [
            { label: 'Taxable HRA Balance', val: `₹${Math.round(taxableHra).toLocaleString('en-IN')}` },
            { label: 'Actual HRA Received', val: `₹${received.toLocaleString('en-IN')}` },
            { label: 'Rent Paid Exceeding 10% Basic', val: `₹${Math.round(cond2).toLocaleString('en-IN')}` },
            { label: 'City Type Limit', val: `${metroPerc * 100}% of Basic (₹${Math.round(cond3).toLocaleString('en-IN')})` },
          ],
        };
      }
      case 'cagr': {
        const cagr = (Math.pow(cagrFinal / cagrInitial, 1 / cagrYears) - 1) * 100;
        const absoluteReturn = ((cagrFinal - cagrInitial) / cagrInitial) * 100;

        return {
          primaryVal: `${cagr.toFixed(2)}%`,
          primaryLabel: 'CAGR (Compound Annual Growth Rate)',
          items: [
            { label: 'Initial Value', val: `₹${cagrInitial.toLocaleString('en-IN')}` },
            { label: 'Final Value', val: `₹${cagrFinal.toLocaleString('en-IN')}` },
            { label: 'Total Absolute Return', val: `${absoluteReturn.toFixed(2)}%` },
            { label: 'Duration', val: `${cagrYears} Years` },
          ],
        };
      }
      case 'unit-converter': {
        let convVal = 0;
        let unitLabel = '';
        if (unitType === 'cm_to_in') { convVal = unitVal * 0.393701; unitLabel = 'Inches'; }
        else if (unitType === 'kg_to_lbs') { convVal = unitVal * 2.20462; unitLabel = 'Pounds (lbs)'; }
        else if (unitType === 'c_to_f') { convVal = (unitVal * 9) / 5 + 32; unitLabel = '°F Fahrenheit'; }
        else if (unitType === 'mb_to_kb') { convVal = unitVal * 1024; unitLabel = 'KB (Kilobytes)'; }
        else if (unitType === 'sqft_to_sqm') { convVal = unitVal * 0.092903; unitLabel = 'Square Meters'; }

        return {
          primaryVal: `${convVal.toFixed(2)} ${unitLabel}`,
          primaryLabel: 'Converted Unit Result',
          items: [
            { label: 'Input Value', val: `${unitVal}` },
            { label: 'Converted Output', val: `${convVal.toFixed(4)} ${unitLabel}` },
            { label: 'Conversion Type', val: unitType.toUpperCase().replace(/_/g, ' ') },
          ],
        };
      }
      case 'word-counter': {
        const text = wordCounterText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const charsWithSpaces = text.length;
        const charsNoSpaces = text.replace(/\s+/g, '').length;
        const sentences = text ? text.split(/[.!?]+/).filter(Boolean).length : 0;
        const readingTimeMin = (words / 200).toFixed(1);

        return {
          primaryVal: `${words} Words`,
          primaryLabel: 'Total Word Count',
          items: [
            { label: 'Characters (with spaces)', val: `${charsWithSpaces}` },
            { label: 'Characters (no spaces)', val: `${charsNoSpaces}` },
            { label: 'Sentences Count', val: `${sentences}` },
            { label: 'Est. Silent Reading Time', val: `~${readingTimeMin} Minutes` },
          ],
        };
      }
      case 'lumpsum': {
        const p = lumpAmount;
        const r = lumpRate / 100;
        const t = lumpYears;
        const fv = p * Math.pow(1 + r, t);
        const gain = fv - p;
        return {
          primaryVal: `₹${Math.round(fv).toLocaleString('en-IN')}`,
          primaryLabel: 'Future Portfolio Value',
          items: [
            { label: 'Initial Lumpsum Invested', val: `₹${p.toLocaleString('en-IN')}` },
            { label: 'Total Wealth Profit Gained', val: `₹${Math.round(gain).toLocaleString('en-IN')}` },
            { label: 'Expected Return Rate', val: `${lumpRate}% p.a.` },
            { label: 'Tenure Horizon', val: `${lumpYears} Years` },
          ],
        };
      }
      case 'swp': {
        let corpus = swpCorpus;
        const monthlyReturn = swpRate / 12 / 100;
        let totalWithdrawn = 0;
        for (let m = 0; m < swpYears * 12; m++) {
          corpus = corpus * (1 + monthlyReturn) - swpWithdrawal;
          totalWithdrawn += swpWithdrawal;
        }
        return {
          primaryVal: `₹${Math.round(totalWithdrawn).toLocaleString('en-IN')}`,
          primaryLabel: 'Total Swp Withdrawn',
          items: [
            { label: 'Remaining Corpus Balance', val: corpus > 0 ? `₹${Math.round(corpus).toLocaleString('en-IN')}` : 'Corpus Exhausted' },
            { label: 'Monthly Withdrawal Amount', val: `₹${swpWithdrawal.toLocaleString('en-IN')}` },
            { label: 'Duration', val: `${swpYears} Years` },
          ],
        };
      }
      case 'rd': {
        const p = rdMonthly;
        const r = rdRate / 100;
        const n = rdMonths;
        // Simple quarterly compounded RD formula approximation
        const maturity = p * n + (p * n * (n + 1) * r) / (2 * 12);
        const interest = maturity - p * n;
        return {
          primaryVal: `₹${Math.round(maturity).toLocaleString('en-IN')}`,
          primaryLabel: 'RD Maturity Payout',
          items: [
            { label: 'Total Deposits Made', val: `₹${(p * n).toLocaleString('en-IN')}` },
            { label: 'Interest Earned', val: `₹${Math.round(interest).toLocaleString('en-IN')}` },
            { label: 'Tenure', val: `${n} Months` },
          ],
        };
      }
      case 'car-loan': {
        const loanAmt = carPrice - carDownPayment;
        const r = carRate / 12 / 100;
        const n = carYears * 12;
        const emi = loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        return {
          primaryVal: `₹${Math.round(emi).toLocaleString('en-IN')}`,
          primaryLabel: 'Monthly Car Loan EMI',
          items: [
            { label: 'Financed Loan Principal', val: `₹${loanAmt.toLocaleString('en-IN')}` },
            { label: 'Down Payment Paid', val: `₹${carDownPayment.toLocaleString('en-IN')}` },
            { label: 'Total Car Cost (Loan + Down)', val: `₹${Math.round(totalPayable + carDownPayment).toLocaleString('en-IN')}` },
          ],
        };
      }
      case 'personal-loan': {
        const p = plAmount;
        const r = plRate / 12 / 100;
        const n = plMonths;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        const interest = totalPayable - p;
        return {
          primaryVal: `₹${Math.round(emi).toLocaleString('en-IN')}`,
          primaryLabel: 'Personal Loan EMI',
          items: [
            { label: 'Loan Amount Disbursed', val: `₹${p.toLocaleString('en-IN')}` },
            { label: 'Total Interest Charge', val: `₹${Math.round(interest).toLocaleString('en-IN')}` },
            { label: 'Tenure', val: `${n} Months` },
          ],
        };
      }
      case 'calorie': {
        // Mifflin-St Jeor equation
        let bmr = 10 * calWeight + 6.25 * calHeight - 5 * calAge;
        bmr += calGender === 'male' ? 5 : -161;
        const tdee = bmr * calActivity;

        return {
          primaryVal: `${Math.round(tdee)} kcal`,
          primaryLabel: 'Daily Caloric Maintenance (TDEE)',
          items: [
            { label: 'Basal Metabolic Rate (BMR)', val: `${Math.round(bmr)} kcal/day` },
            { label: 'Weight Loss Target (-500 kcal)', val: `${Math.round(tdee - 500)} kcal/day` },
            { label: 'Weight Gain Target (+500 kcal)', val: `${Math.round(tdee + 500)} kcal/day` },
          ],
        };
      }
      case 'currency': {
        const rates: Record<string, number> = {
          USD_INR: 83.5,
          EUR_INR: 90.2,
          GBP_INR: 106.1,
          INR_USD: 0.012,
        };
        const rate = rates[currPair] || 83.5;
        const converted = currAmount * rate;

        return {
          primaryVal: `${converted.toFixed(2)}`,
          primaryLabel: `Converted Value (${currPair.replace('_', ' to ')})`,
          items: [
            { label: 'Input Amount', val: `${currAmount}` },
            { label: 'Conversion FX Rate', val: `1 ${currPair.split('_')[0]} = ${rate} ${currPair.split('_')[1]}` },
          ],
        };
      }
      case 'doc-page-spine': {
        let sheetThickness = (spineGsm / 1000) * 0.95; // mm standard offset paper
        if (spinePaperType === 'gloss') sheetThickness = (spineGsm / 1000) * 0.82;
        if (spinePaperType === 'matt') sheetThickness = (spineGsm / 1000) * 0.88;
        if (spinePaperType === 'cream') sheetThickness = (spineGsm / 1000) * 1.22; // bulky cream paper

        let spineWidthMm = (spinePageCount / 2) * sheetThickness;
        if (spineCoverType === 'hardcover') spineWidthMm += 3.0; // hardcover board wrap allowance

        const spineWidthInches = spineWidthMm / 25.4;
        const totalCoverWidthMm = (210 * 2) + spineWidthMm + 6; // 2x A5 width + spine + 6mm bleed

        return {
          primaryVal: `${spineWidthMm.toFixed(2)} mm`,
          primaryLabel: 'Calculated Book Spine Width',
          items: [
            { label: 'Spine Width (Inches)', val: `${spineWidthInches.toFixed(3)} in` },
            { label: 'Page Count & Sheets', val: `${spinePageCount} Pages (${spinePageCount / 2} Leaves)` },
            { label: 'Paper Stock', val: `${spineGsm} GSM ${spinePaperType.toUpperCase()}` },
            { label: 'Binding Style', val: spineCoverType === 'hardcover' ? 'Hardcover (+3mm Board Wrap)' : 'Paperback Softcover' },
            { label: 'Full Cover Spread Width', val: `${totalCoverWidthMm.toFixed(1)} mm` },
          ],
        };
      }
      case 'pdf-size-estimator': {
        const textPages = pdfPages * (1 - pdfImgPct / 100);
        const imgPages = pdfPages * (pdfImgPct / 100);

        const textSizeKbPerPage = 20;
        const dpiScaleFactor = Math.pow(pdfTargetDpi / 300, 2);
        const rawImgKbPerPage = 4500 * dpiScaleFactor;

        let qualityFactor = 0.35; // medium
        if (pdfQuality === 'low') qualityFactor = 0.15;
        if (pdfQuality === 'high') qualityFactor = 0.65;
        if (pdfQuality === 'maximum') qualityFactor = 1.0;

        const estPageKb = (textSizeKbPerPage) + (rawImgKbPerPage * qualityFactor);
        const totalKb = pdfPages * estPageKb;
        const totalMb = totalKb / 1024;

        return {
          primaryVal: totalMb >= 1 ? `${totalMb.toFixed(2)} MB` : `${Math.round(totalKb)} KB`,
          primaryLabel: 'Estimated PDF File Size',
          items: [
            { label: 'Target Quality Profile', val: `${pdfQuality.toUpperCase()} (${pdfTargetDpi} DPI)` },
            { label: 'Image Content Coverage', val: `${pdfImgPct}% Image Pages (${Math.round(imgPages)} Pages)` },
            { label: 'Avg Size Per Page', val: `${Math.round(estPageKb)} KB/page` },
            { label: 'Uncompressed Raw Baseline', val: `${((pdfPages * (20 + rawImgKbPerPage)) / 1024).toFixed(1)} MB` },
          ],
        };
      }
      case 'dpi-print': {
        const widthInches = dpiPxWidth / dpiTarget;
        const heightInches = dpiPxHeight / dpiTarget;
        const widthCm = widthInches * 2.54;
        const heightCm = heightInches * 2.54;
        const megaPixels = (dpiPxWidth * dpiPxHeight) / 1000000;

        return {
          primaryVal: `${widthInches.toFixed(2)}" x ${heightInches.toFixed(2)}" Inches`,
          primaryLabel: `Print Dimensions at ${dpiTarget} DPI`,
          items: [
            { label: 'Dimensions in CM', val: `${widthCm.toFixed(1)} x ${heightCm.toFixed(1)} cm` },
            { label: 'Pixel Resolution', val: `${dpiPxWidth} x ${dpiPxHeight} px (${megaPixels.toFixed(1)} MP)` },
            { label: 'Print Quality Grade', val: dpiTarget >= 300 ? 'Fine Art / Publishing (300 DPI)' : 'Web / Draft (150 DPI)' },
            { label: 'Max Enlargement @ 150 DPI', val: `${(dpiPxWidth / 150).toFixed(1)}" x ${(dpiPxHeight / 150).toFixed(1)}" in` },
          ],
        };
      }
      case 'reading-time': {
        const silentMin = readWords / readingSpeed;
        const silentSec = Math.round((silentMin % 1) * 60);
        const speechMin = readWords / speakingSpeed;
        const speechSec = Math.round((speechMin % 1) * 60);
        const estSlides = Math.ceil(readWords / 120);

        return {
          primaryVal: `${Math.floor(silentMin)}m ${silentSec}s`,
          primaryLabel: 'Silent Reading Duration',
          items: [
            { label: 'Public Speaking Duration', val: `${Math.floor(speechMin)}m ${speechSec}s` },
            { label: 'Word Count', val: `${readWords.toLocaleString()} Words` },
            { label: 'Reading Speed Rate', val: `${readingSpeed} WPM (Words per min)` },
            { label: 'Est. Presentation Deck Slides', val: `~${estSlides} Slides (120 w/slide)` },
          ],
        };
      }
      case 'font-px-rem': {
        const remVal = fontPxVal / fontBase;
        const ptVal = fontPxVal * 0.75;
        const lineHeightPx = fontPxVal * 1.5;

        return {
          primaryVal: `${remVal.toFixed(3)} rem`,
          primaryLabel: `PX to REM Conversion (Base: ${fontBase}px)`,
          items: [
            { label: 'Pixel Size (px)', val: `${fontPxVal} px` },
            { label: 'REM Size', val: `${remVal.toFixed(3)} rem` },
            { label: 'Point Size (pt)', val: `${ptVal.toFixed(2)} pt` },
            { label: 'Recommended Line-Height', val: `${lineHeightPx.toFixed(1)} px` },
            { label: 'CSS Code', val: `font-size: ${remVal.toFixed(3)}rem;` },
          ],
        };
      }
      case 'char-byte-size': {
        const text = charByteText || '';
        const charCount = Array.from(text).length;
        const utf8Bytes = new TextEncoder().encode(text).length;
        const utf16Bytes = text.length * 2;
        const base64Bytes = Math.ceil((utf8Bytes * 4) / 3);

        return {
          primaryVal: `${utf8Bytes} Bytes`,
          primaryLabel: 'UTF-8 Memory Footprint',
          items: [
            { label: 'Character Count (Unicode)', val: `${charCount} Characters` },
            { label: 'UTF-8 Encoding Bytes', val: `${utf8Bytes} Bytes` },
            { label: 'UTF-16 Encoding Bytes', val: `${utf16Bytes} Bytes` },
            { label: 'Base64 Encoded Buffer', val: `~${base64Bytes} Bytes` },
          ],
        };
      }
      case 'pdf-grid-layout': {
        const printableWidth = pdfWidthMm - (pdfMarginMm * 2);
        const totalGuttersWidth = (pdfColumns - 1) * pdfGutterMm;
        const colWidth = (printableWidth - totalGuttersWidth) / pdfColumns;

        return {
          primaryVal: `${colWidth > 0 ? colWidth.toFixed(2) : '0'} mm`,
          primaryLabel: `Single Column Width (${pdfColumns} Columns)`,
          items: [
            { label: 'Total Printable Canvas Width', val: `${printableWidth.toFixed(1)} mm` },
            { label: 'Left/Right Side Margins', val: `${pdfMarginMm} mm each` },
            { label: 'Column Gutter Spacing', val: `${pdfGutterMm} mm` },
            { label: 'Column + Gutter Pitch', val: `${(colWidth + pdfGutterMm).toFixed(2)} mm` },
          ],
        };
      }
      case 'book-royalty': {
        const distCut = bookPrice * (distributorPct / 100);
        const netRoyaltyPerBook = bookPrice * (royaltyPct / 100);
        const publisherProfitPerBook = bookPrice - distCut - bookPrintCost - netRoyaltyPerBook;
        const totalRoyalty1000 = netRoyaltyPerBook * 1000;

        return {
          primaryVal: `₹${netRoyaltyPerBook.toFixed(2)}`,
          primaryLabel: 'Author Royalty Per Copy',
          items: [
            { label: 'Retail Cover Price', val: `₹${bookPrice.toLocaleString('en-IN')}` },
            { label: 'Distributor Share Cut', val: `₹${distCut.toFixed(2)} (${distributorPct}%)` },
            { label: 'Print Production Cost', val: `₹${bookPrintCost.toLocaleString('en-IN')}` },
            { label: 'Author Royalty (1,000 Copies Sold)', val: `₹${Math.round(totalRoyalty1000).toLocaleString('en-IN')}` },
            { label: 'Publisher Net Profit per Book', val: `₹${publisherProfitPerBook.toFixed(2)}` },
          ],
        };
      }
      case 'image-ram-size': {
        let bytesPerPixel = 4; // 32bit RGBA default
        if (colorDepth === '8bit') bytesPerPixel = 1;
        if (colorDepth === '24bit') bytesPerPixel = 3;

        const totalPixels = imgWidthPx * imgHeightPx;
        const rawBytes = totalPixels * bytesPerPixel;
        const ramMb = rawBytes / (1024 * 1024);
        const gpuVramMb = ramMb * 2.5;

        return {
          primaryVal: `${ramMb.toFixed(2)} MB`,
          primaryLabel: 'Uncompressed Bitmap RAM Buffer',
          items: [
            { label: 'Total Pixels', val: `${totalPixels.toLocaleString()} px (${(totalPixels / 1000000).toFixed(2)} MP)` },
            { label: 'Color Depth & Channels', val: `${colorDepth.toUpperCase()} (${bytesPerPixel} bytes/pixel)` },
            { label: 'Estimated GPU Canvas VRAM', val: `~${gpuVramMb.toFixed(1)} MB` },
            { label: 'Raw Byte Size', val: `${rawBytes.toLocaleString()} Bytes` },
          ],
        };
      }
      case 'text-readability': {
        const textClean = readabilityText.trim();
        const words = textClean ? textClean.split(/\s+/).filter(Boolean).length : 0;
        const sentences = textClean ? textClean.split(/[.!?]+/).filter(Boolean).length : 1;
        const syllables = words * 1.5;
        const score = Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)));
        const gradeLevel = (0.39 * (words / sentences)) + (11.8 * (syllables / words)) - 15.59;

        let levelLabel = 'Standard / Plain English';
        if (score > 80) levelLabel = 'Very Easy (6th Grade Level)';
        else if (score > 60) levelLabel = 'Standard (8th-9th Grade)';
        else if (score < 40) levelLabel = 'Academic / Technical';

        return {
          primaryVal: `${Math.round(score)} / 100`,
          primaryLabel: `Flesch Reading Ease (${levelLabel})`,
          items: [
            { label: 'Flesch-Kincaid Grade Level', val: `Grade ${Math.max(1, Math.round(gradeLevel))}` },
            { label: 'Total Words Analyzed', val: `${words} Words` },
            { label: 'Sentences Count', val: `${sentences} Sentences` },
            { label: 'Avg Words Per Sentence', val: `${(words / sentences).toFixed(1)} words` },
          ],
        };
      }
      case 'paper-weight-gsm': {
        const areaSqm = (paperWidthMm / 1000) * (paperHeightMm / 1000);
        const singleSheetGrams = areaSqm * paperGsm;
        const totalReamKg = (singleSheetGrams * paperQuantity) / 1000;
        const totalReamLbs = totalReamKg * 2.20462;

        return {
          primaryVal: `${totalReamKg.toFixed(2)} kg`,
          primaryLabel: `Payload Weight (${paperQuantity} Sheets)`,
          items: [
            { label: 'Weight in Pounds (lbs)', val: `${totalReamLbs.toFixed(2)} lbs` },
            { label: 'Single Sheet Weight', val: `${singleSheetGrams.toFixed(2)} grams` },
            { label: 'Sheet Area', val: `${areaSqm.toFixed(4)} m² (${paperWidthMm}x${paperHeightMm} mm)` },
            { label: 'Paper Density', val: `${paperGsm} GSM` },
          ],
        };
      }
      case 'margin-trim-box': {
        const bleedWidth = trimWidthMm + (bleedMm * 2);
        const bleedHeight = trimHeightMm + (bleedMm * 2);
        const safeWidth = trimWidthMm - (safeMarginMm * 2);
        const safeHeight = trimHeightMm - (safeMarginMm * 2);

        return {
          primaryVal: `${bleedWidth} x ${bleedHeight} mm`,
          primaryLabel: 'Full Bleed Box Size (3mm Bleed)',
          items: [
            { label: 'Final Cut / Trim Dimensions', val: `${trimWidthMm} x ${trimHeightMm} mm` },
            { label: 'Safe Printable Bounding Box', val: `${safeWidth} x ${safeHeight} mm` },
            { label: 'Outer Bleed Width', val: `${bleedMm} mm on each edge` },
            { label: 'Inner Safe Margin Width', val: `${safeMarginMm} mm inside trim` },
          ],
        };
      }
      case 'doc-scan-time': {
        const totalSides = scanPages * (scanMode === 'duplex' ? 2 : 1);
        const rawScanMinutes = totalSides / scanPpm;
        const flatbedOverheadSec = feedType === 'flatbed' ? scanPages * 6 : 0;
        const totalSec = Math.round(rawScanMinutes * 60 + flatbedOverheadSec);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;

        return {
          primaryVal: `${min}m ${sec}s`,
          primaryLabel: 'Estimated Batch Scanning Time',
          items: [
            { label: 'Total Sides Scanned', val: `${totalSides} Sides (${scanPages} Sheets)` },
            { label: 'Scanner Rated Speed', val: `${scanPpm} PPM (${scanMode.toUpperCase()})` },
            { label: 'Paper Feeding Type', val: feedType === 'adf' ? 'ADF Automatic Feeder' : 'Flatbed Manual Swap (+6s/page)' },
            { label: 'Effective Scanning Throughput', val: `~${Math.round((scanPages / (totalSec / 60)))} Pages/Min` },
          ],
        };
      }
      case 'ocr-time-tokens': {
        const totalWords = ocrPages * ocrWordsPerPage;
        const estTokens = Math.round(totalWords * 1.33);
        const secPerPage = ocrEngine === 'cloud_ai' ? 1.2 : 0.4;
        const totalOcrSec = (ocrPages * secPerPage).toFixed(1);
        const estLlmCost = (estTokens / 1000) * 0.0015;

        return {
          primaryVal: `${totalOcrSec} Seconds`,
          primaryLabel: 'Estimated OCR Processing Time',
          items: [
            { label: 'Total Extracted LLM Tokens', val: `~${estTokens.toLocaleString()} Tokens` },
            { label: 'Total Word Count Extracted', val: `${totalWords.toLocaleString()} Words` },
            { label: 'OCR Engine Speed', val: ocrEngine === 'cloud_ai' ? 'Cloud Vision AI (1.2s/page)' : 'Local Fast Tesseract (0.4s/page)' },
            { label: 'Est. LLM Processing Cost', val: `$${estLlmCost.toFixed(4)} USD (@$0.0015/1k)` },
          ],
        };
      }
      case 'ebook-file-size': {
        const rawTextKb = (ebookWordCount * 6) / 1024;
        const epubTextKb = rawTextKb * 0.35;
        const imgKbPerUnit = ebookImgRes === 'low' ? 100 : ebookImgRes === 'medium' ? 300 : 800;
        const totalImgKb = ebookImageCount * imgKbPerUnit;
        const totalEpubKb = epubTextKb + totalImgKb;
        const totalEpubMb = totalEpubKb / 1024;
        const totalPdfMb = (totalEpubKb * 1.8) / 1024;

        return {
          primaryVal: totalEpubMb >= 1 ? `${totalEpubMb.toFixed(2)} MB` : `${Math.round(totalEpubKb)} KB`,
          primaryLabel: 'Estimated EPUB File Size',
          items: [
            { label: 'Equivalent PDF File Size', val: `${totalPdfMb.toFixed(2)} MB` },
            { label: 'Text Payload Share', val: `${Math.round(epubTextKb)} KB (${ebookWordCount.toLocaleString()} Words)` },
            { label: 'Embedded Images Share', val: `${(totalImgKb / 1024).toFixed(2)} MB (${ebookImageCount} Images @ ${ebookImgRes.toUpperCase()})` },
          ],
        };
      }
      default: {
        return {
          primaryVal: 'Ready',
          primaryLabel: activeCalc.name,
          items: [
            { label: 'Calculator Status', val: 'Active & Calculated' },
            { label: 'Phase Category', val: `Phase ${activeCalc.phase}` },
          ],
        };
      }
    }
  }, [
    activeCalc,
    emiAmount, emiRate, emiTenureYears,
    sipMonthly, sipRate, sipYears,
    gstAmount, gstRate, gstType,
    dobDate,
    percNum1, percNum2,
    bmiHeight, bmiWeight,
    taxIncome, taxDeduction80c,
    fdAmount, fdRate, fdYears,
    ctcAnnual, pfContribution,
    ppfAnnual, ppfYears,
    ciPrincipal, ciRate, ciYears,
    gratSalary, gratYears,
    npsMonthly, npsAge,
    hraBasic, hraReceived, hraRentPaid, hraIsMetro,
    cagrInitial, cagrFinal, cagrYears,
    unitVal, unitType,
    wordCounterText,
    lumpAmount, lumpRate, lumpYears,
    swpCorpus, swpWithdrawal, swpRate, swpYears,
    rdMonthly, rdRate, rdMonths,
    carPrice, carDownPayment, carRate, carYears,
    plAmount, plRate, plMonths,
    calAge, calGender, calWeight, calHeight, calActivity,
    currAmount, currPair,
    spinePageCount, spineGsm, spinePaperType, spineCoverType,
    pdfPages, pdfImgPct, pdfTargetDpi, pdfQuality,
    dpiPxWidth, dpiPxHeight, dpiTarget,
    readWords, readingSpeed, speakingSpeed,
    fontPxVal, fontBase,
    charByteText,
    pdfWidthMm, pdfMarginMm, pdfColumns, pdfGutterMm,
    bookPrice, bookPrintCost, distributorPct, royaltyPct,
    imgWidthPx, imgHeightPx, colorDepth,
    readabilityText,
    paperGsm, paperWidthMm, paperHeightMm, paperQuantity,
    trimWidthMm, trimHeightMm, bleedMm, safeMarginMm,
    scanPages, scanPpm, scanMode, feedType,
    ocrPages, ocrEngine, ocrWordsPerPage,
    ebookWordCount, ebookImageCount, ebookImgRes,
  ]);

  const copyReport = () => {
    const reportText = `[Tool Studio Pro - ${activeCalc.name} Report]\nPrimary Output: ${results.primaryLabel} = ${results.primaryVal}\nDetails:\n` +
      results.items.map((i) => `- ${i.label}: ${i.val}`).join('\n') +
      `\nGenerated at: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    if (onSuccessAction) onSuccessAction(`Copied calculation report for ${activeCalc.name}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-colors cursor-pointer"
            title="Back to Workspace"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <Calculator className="text-emerald-400" size={26} />
                Smart Calculator Suite
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
                50 Calculators
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Complete financial, loan, health & specialized PDF publishing calculators divided across 3 structured phases.
            </p>
          </div>
        </div>

        {/* Search Bar inside Calculator Suite */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 50 calculators..."
            className="w-full bg-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Phase & Category Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers size={14} className="text-emerald-600" />
            Phase Navigation
          </span>
          <span className="text-xs font-extrabold text-slate-600">
            Showing {filteredCalculators.length} of {ALL_CALCULATORS.length} Calculators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
              selectedPhase === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>All 50 Calculators</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">All</span>
          </button>

          <button
            onClick={() => setSelectedPhase(1)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
              selectedPhase === 1
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
            }`}
          >
            <span>Phase 1 — 20 Tools</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Essential</span>
          </button>

          <button
            onClick={() => setSelectedPhase(2)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
              selectedPhase === 2
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
            }`}
          >
            <span>Phase 2 — 15 Tools</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Wealth & Health</span>
          </button>

          <button
            onClick={() => setSelectedPhase(3)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between cursor-pointer border ${
              selectedPhase === 3
                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200'
            }`}
          >
            <span>Phase 3 — 15 Tools</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Publishing</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Calculator Selector Sidebar + Active Calculation Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Drawer / List: Calculator Selector Grid */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-3 max-h-[720px] overflow-y-auto">
          <div className="text-xs font-black uppercase text-slate-400 tracking-wider px-2">
            Select Calculator ({filteredCalculators.length})
          </div>

          <div className="space-y-1.5">
            {filteredCalculators.map((c) => {
              const isActive = c.id === selectedCalcId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCalcId(c.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black shadow-2xs'
                      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl text-xs font-bold ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Calculator size={14} />
                    </div>
                    <div>
                      <div className="text-xs font-black leading-tight text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">{c.desc}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                    c.phase === 1 ? 'bg-emerald-100 text-emerald-800' :
                    c.phase === 2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    P{c.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Active Calculator Controls & Output Report */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 space-y-6">
          
          {/* Active Calculator Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Calculator size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{activeCalc.name}</h2>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    activeCalc.phase === 1 ? 'bg-emerald-100 text-emerald-800' :
                    activeCalc.phase === 2 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {activeCalc.phaseLabel} • {activeCalc.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeCalc.desc}</p>
              </div>
            </div>

            <button
              onClick={copyReport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Report'}
            </button>
          </div>

          {/* Calculator Custom Form Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Input Controls Column */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-1">
                <Sliders size={14} className="text-emerald-600" />
                Input Parameters
              </div>

              {/* Dynamic Inputs based on activeCalc.id */}
              {activeCalc.id === 'emi' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Loan Amount (₹)</span>
                      <span className="font-black text-emerald-600">₹{emiAmount.toLocaleString('en-IN')}</span>
                    </label>
                    <input
                      type="range"
                      min={50000}
                      max={10000000}
                      step={50000}
                      value={emiAmount}
                      onChange={(e) => setEmiAmount(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Interest Rate (% p.a.)</span>
                      <span className="font-black text-emerald-600">{emiRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={20}
                      step={0.1}
                      value={emiRate}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Loan Tenure (Years)</span>
                      <span className="font-black text-emerald-600">{emiTenureYears} Years</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={emiTenureYears}
                      onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'sip' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Monthly SIP Investment (₹)</span>
                      <span className="font-black text-emerald-600">₹{sipMonthly.toLocaleString('en-IN')}</span>
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={100000}
                      step={500}
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Expected Return (% p.a.)</span>
                      <span className="font-black text-emerald-600">{sipRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      step={0.5}
                      value={sipRate}
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Time Period (Years)</span>
                      <span className="font-black text-emerald-600">{sipYears} Years</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={35}
                      step={1}
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'gst' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Calculation Type</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setGstType('add')}
                        className={`py-1.5 text-xs font-extrabold rounded-xl border ${
                          gstType === 'add' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Add GST (+)
                      </button>
                      <button
                        onClick={() => setGstType('remove')}
                        className={`py-1.5 text-xs font-extrabold rounded-xl border ${
                          gstType === 'remove' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Remove GST (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Amount (₹)</label>
                    <input
                      type="number"
                      value={gstAmount}
                      onChange={(e) => setGstAmount(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">GST Slab Rate (%)</label>
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {[5, 12, 18, 28].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setGstRate(rate)}
                          className={`py-1.5 text-xs font-black rounded-lg border ${
                            gstRate === rate ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeCalc.id === 'age' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    value={dobDate}
                    onChange={(e) => setDobDate(e.target.value)}
                    className="w-full mt-1.5 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                  />
                </div>
              )}

              {activeCalc.id === 'percentage' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Percentage Value (%)</label>
                    <input
                      type="number"
                      value={percNum1}
                      onChange={(e) => setPercNum1(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Total Number</label>
                    <input
                      type="number"
                      value={percNum2}
                      onChange={(e) => setPercNum2(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'bmi' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Height (cm)</span>
                      <span className="font-black text-emerald-600">{bmiHeight} cm</span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={230}
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Weight (kg)</span>
                      <span className="font-black text-emerald-600">{bmiWeight} kg</span>
                    </label>
                    <input
                      type="range"
                      min={30}
                      max={180}
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'doc-page-spine' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Total Document Pages</span>
                      <span className="font-black text-emerald-600">{spinePageCount} Pages</span>
                    </label>
                    <input
                      type="range"
                      min={24}
                      max={1200}
                      step={4}
                      value={spinePageCount}
                      onChange={(e) => setSpinePageCount(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Paper GSM Density</label>
                    <select
                      value={spineGsm}
                      onChange={(e) => setSpineGsm(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value={70}>70 GSM (Thin Novel Paper)</option>
                      <option value={80}>80 GSM (Standard Office / Copier)</option>
                      <option value={100}>100 GSM (Premium Offset Text)</option>
                      <option value={120}>120 GSM (Heavyweight Art / Color)</option>
                      <option value={150}>150 GSM (Coated Premium Stock)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Paper Finish & Bulking Factor</label>
                    <select
                      value={spinePaperType}
                      onChange={(e) => setSpinePaperType(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="offset">Uncoated Offset (Standard Density)</option>
                      <option value="cream">Bulky Cream / Novel Book Paper (+25% Volume)</option>
                      <option value="matt">Matt Coated Paper</option>
                      <option value="gloss">Gloss Coated Paper (Compacted)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Binding Style</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setSpineCoverType('paperback')}
                        className={`py-1.5 text-xs font-extrabold rounded-xl border ${
                          spineCoverType === 'paperback' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Paperback
                      </button>
                      <button
                        onClick={() => setSpineCoverType('hardcover')}
                        className={`py-1.5 text-xs font-extrabold rounded-xl border ${
                          spineCoverType === 'hardcover' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        Hardcover (+3mm)
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeCalc.id === 'pdf-size-estimator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Total PDF Pages</span>
                      <span className="font-black text-emerald-600">{pdfPages} Pages</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={500}
                      value={pdfPages}
                      onChange={(e) => setPdfPages(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Image Page Coverage (%)</span>
                      <span className="font-black text-emerald-600">{pdfImgPct}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={pdfImgPct}
                      onChange={(e) => setPdfImgPct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Target Image Resolution (DPI)</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[72, 150, 300].map((dpi) => (
                        <button
                          key={dpi}
                          onClick={() => setPdfTargetDpi(dpi)}
                          className={`py-1.5 text-xs font-black rounded-xl border ${
                            pdfTargetDpi === dpi ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700'
                          }`}
                        >
                          {dpi} DPI
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Compression Level</label>
                    <select
                      value={pdfQuality}
                      onChange={(e) => setPdfQuality(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="low">Low Quality / Extreme Compress (~85% Squeeze)</option>
                      <option value="medium">Balanced Web & Email (~65% Squeeze)</option>
                      <option value="high">High Quality Print (~35% Squeeze)</option>
                      <option value="maximum">Maximum Uncompressed Original</option>
                    </select>
                  </div>
                </>
              )}

              {activeCalc.id === 'dpi-print' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Pixel Width (px)</label>
                    <input
                      type="number"
                      value={dpiPxWidth}
                      onChange={(e) => setDpiPxWidth(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Pixel Height (px)</label>
                    <input
                      type="number"
                      value={dpiPxHeight}
                      onChange={(e) => setDpiPxHeight(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Target Print DPI</label>
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {[72, 150, 300, 600].map((dpi) => (
                        <button
                          key={dpi}
                          onClick={() => setDpiTarget(dpi)}
                          className={`py-1.5 text-xs font-black rounded-lg border ${
                            dpiTarget === dpi ? 'bg-purple-600 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          {dpi} DPI
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeCalc.id === 'reading-time' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Total Word Count</span>
                      <span className="font-black text-emerald-600">{readWords.toLocaleString()} Words</span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={50000}
                      step={100}
                      value={readWords}
                      onChange={(e) => setReadWords(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Silent Reading Speed (WPM)</span>
                      <span className="font-black text-emerald-600">{readingSpeed} WPM</span>
                    </label>
                    <input
                      type="range"
                      min={120}
                      max={400}
                      step={10}
                      value={readingSpeed}
                      onChange={(e) => setReadingSpeed(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Public Speech Speed (WPM)</span>
                      <span className="font-black text-emerald-600">{speakingSpeed} WPM</span>
                    </label>
                    <input
                      type="range"
                      min={90}
                      max={220}
                      step={5}
                      value={speakingSpeed}
                      onChange={(e) => setSpeakingSpeed(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'font-px-rem' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Font Pixel Size (px)</span>
                      <span className="font-black text-emerald-600">{fontPxVal} px</span>
                    </label>
                    <input
                      type="range"
                      min={8}
                      max={128}
                      value={fontPxVal}
                      onChange={(e) => setFontPxVal(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Base Font Size (px)</span>
                      <span className="font-black text-emerald-600">{fontBase} px</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={24}
                      value={fontBase}
                      onChange={(e) => setFontBase(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'char-byte-size' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Enter Text Sample</label>
                  <textarea
                    rows={4}
                    value={charByteText}
                    onChange={(e) => setCharByteText(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              )}

              {activeCalc.id === 'pdf-grid-layout' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Page Width (mm)</label>
                    <input
                      type="number"
                      value={pdfWidthMm}
                      onChange={(e) => setPdfWidthMm(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Side Margins (mm)</span>
                      <span className="font-black text-emerald-600">{pdfMarginMm} mm</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={pdfMarginMm}
                      onChange={(e) => setPdfMarginMm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Grid Columns</label>
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {[2, 3, 4, 6, 8, 12].map((cols) => (
                        <button
                          key={cols}
                          onClick={() => setPdfColumns(cols)}
                          className={`py-1 text-xs font-black rounded-lg border ${
                            pdfColumns === cols ? 'bg-purple-600 text-white' : 'bg-white text-slate-700'
                          }`}
                        >
                          {cols} Cols
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Gutter Spacing (mm)</span>
                      <span className="font-black text-emerald-600">{pdfGutterMm} mm</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={pdfGutterMm}
                      onChange={(e) => setPdfGutterMm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'book-royalty' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Retail Book Cover Price (₹)</label>
                    <input
                      type="number"
                      value={bookPrice}
                      onChange={(e) => setBookPrice(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Print Production Cost (₹/copy)</label>
                    <input
                      type="number"
                      value={bookPrintCost}
                      onChange={(e) => setBookPrintCost(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Distributor Cut (%)</span>
                      <span className="font-black text-emerald-600">{distributorPct}%</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      value={distributorPct}
                      onChange={(e) => setDistributorPct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Author Royalty Rate (%)</span>
                      <span className="font-black text-emerald-600">{royaltyPct}%</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={royaltyPct}
                      onChange={(e) => setRoyaltyPct(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'image-ram-size' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Image Width (px)</label>
                    <input
                      type="number"
                      value={imgWidthPx}
                      onChange={(e) => setImgWidthPx(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Image Height (px)</label>
                    <input
                      type="number"
                      value={imgHeightPx}
                      onChange={(e) => setImgHeightPx(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Color Channel Depth</label>
                    <select
                      value={colorDepth}
                      onChange={(e) => setColorDepth(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="8bit">8-Bit Grayscale (1 Byte/px)</option>
                      <option value="24bit">24-Bit RGB (3 Bytes/px)</option>
                      <option value="32bit">32-Bit RGBA + Alpha (4 Bytes/px)</option>
                    </select>
                  </div>
                </>
              )}

              {activeCalc.id === 'text-readability' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Enter Document Text to Analyze</label>
                  <textarea
                    rows={5}
                    value={readabilityText}
                    onChange={(e) => setReadabilityText(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              )}

              {activeCalc.id === 'paper-weight-gsm' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Paper Density GSM</span>
                      <span className="font-black text-emerald-600">{paperGsm} GSM</span>
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={350}
                      value={paperGsm}
                      onChange={(e) => setPaperGsm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Width (mm)</label>
                      <input
                        type="number"
                        value={paperWidthMm}
                        onChange={(e) => setPaperWidthMm(Number(e.target.value))}
                        className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Height (mm)</label>
                      <input
                        type="number"
                        value={paperHeightMm}
                        onChange={(e) => setPaperHeightMm(Number(e.target.value))}
                        className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Sheet Quantity / Ream Count</label>
                    <input
                      type="number"
                      value={paperQuantity}
                      onChange={(e) => setPaperQuantity(Number(e.target.value))}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'margin-trim-box' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Trim Width (mm)</label>
                      <input
                        type="number"
                        value={trimWidthMm}
                        onChange={(e) => setTrimWidthMm(Number(e.target.value))}
                        className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Trim Height (mm)</label>
                      <input
                        type="number"
                        value={trimHeightMm}
                        onChange={(e) => setTrimHeightMm(Number(e.target.value))}
                        className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Bleed Allowance (mm)</span>
                      <span className="font-black text-emerald-600">{bleedMm} mm</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={bleedMm}
                      onChange={(e) => setBleedMm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Inner Safe Margin (mm)</span>
                      <span className="font-black text-emerald-600">{safeMarginMm} mm</span>
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={safeMarginMm}
                      onChange={(e) => setSafeMarginMm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'doc-scan-time' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Document Page Count</span>
                      <span className="font-black text-emerald-600">{scanPages} Pages</span>
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={500}
                      value={scanPages}
                      onChange={(e) => setScanPages(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Scanner Speed (PPM)</span>
                      <span className="font-black text-emerald-600">{scanPpm} PPM</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={scanPpm}
                      onChange={(e) => setScanPpm(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Scan Mode</label>
                    <select
                      value={scanMode}
                      onChange={(e) => setScanMode(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="simplex">Simplex (Single Side)</option>
                      <option value="duplex">Duplex (Double Side Scan)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Paper Feeder</label>
                    <select
                      value={feedType}
                      onChange={(e) => setFeedType(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="adf">ADF (Automatic Document Feeder)</option>
                      <option value="flatbed">Flatbed Glass (Manual Swap)</option>
                    </select>
                  </div>
                </>
              )}

              {activeCalc.id === 'ocr-time-tokens' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Total PDF Pages</span>
                      <span className="font-black text-emerald-600">{ocrPages} Pages</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={200}
                      value={ocrPages}
                      onChange={(e) => setOcrPages(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">OCR Engine Model</label>
                    <select
                      value={ocrEngine}
                      onChange={(e) => setOcrEngine(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="cloud_ai">Cloud Vision AI OCR (1.2s/page)</option>
                      <option value="fast_local">Tesseract Fast Local (0.4s/page)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Avg Words Per Page</span>
                      <span className="font-black text-emerald-600">{ocrWordsPerPage} Words</span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={800}
                      step={25}
                      value={ocrWordsPerPage}
                      onChange={(e) => setOcrWordsPerPage(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>
                </>
              )}

              {activeCalc.id === 'ebook-file-size' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Ebook Word Count</span>
                      <span className="font-black text-emerald-600">{ebookWordCount.toLocaleString()} Words</span>
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={200000}
                      step={5000}
                      value={ebookWordCount}
                      onChange={(e) => setEbookWordCount(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex justify-between">
                      <span>Embedded Illustrations / Images</span>
                      <span className="font-black text-emerald-600">{ebookImageCount} Images</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={ebookImageCount}
                      onChange={(e) => setEbookImageCount(Number(e.target.value))}
                      className="w-full mt-2 accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Image Compression Resolution</label>
                    <select
                      value={ebookImgRes}
                      onChange={(e) => setEbookImgRes(e.target.value as any)}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="low">Standard Mobile (100 KB/Image)</option>
                      <option value="medium">Retina E-Reader (300 KB/Image)</option>
                      <option value="hd">HD Tablet / Artbook (800 KB/Image)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Universal Fallback Input controls for all other calculators */}
              {!['emi', 'sip', 'gst', 'age', 'percentage', 'bmi', 'doc-page-spine', 'pdf-size-estimator', 'dpi-print', 'reading-time', 'font-px-rem', 'char-byte-size', 'pdf-grid-layout', 'book-royalty', 'image-ram-size', 'text-readability', 'paper-weight-gsm', 'margin-trim-box', 'doc-scan-time', 'ocr-time-tokens', 'ebook-file-size'].includes(activeCalc.id) && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Primary Value / Quantity</label>
                    <input
                      type="number"
                      defaultValue={100000}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Rate / Duration parameter</label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Output Calculation Report Column */}
            <div className="space-y-4 bg-emerald-950 text-white p-6 rounded-2xl shadow-xl border border-emerald-900">
              <div className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                <Sparkles size={12} />
                Calculated Live Result
              </div>

              <div>
                <div className="text-xs font-semibold text-emerald-200">{results.primaryLabel}</div>
                <div className="text-3xl font-black tracking-tight text-white mt-1">{results.primaryVal}</div>
              </div>

              <div className="border-t border-emerald-800/80 pt-4 space-y-2.5">
                {results.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-emerald-900/60 last:border-0">
                    <span className="text-emerald-300 font-medium">{item.label}</span>
                    <span className="font-extrabold text-white text-right">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10px] text-emerald-400/80 italic flex items-center gap-1">
                <ShieldCheck size={12} /> Real-time instant browser calculation • Exact formula accurate
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
