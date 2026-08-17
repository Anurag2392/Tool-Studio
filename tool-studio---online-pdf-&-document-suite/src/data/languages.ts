export interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  rtl?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', rtl: true },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
  { code: 'da', nativeName: 'Dansk', englishName: 'Danish' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German' },
  { code: 'cs', nativeName: 'Čeština', englishName: 'Czech' },
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish' },
  { code: 'fr', nativeName: 'Français', englishName: 'French' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian' },
  { code: 'el', nativeName: 'Ελληνικά', englishName: 'Greek' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese' },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean' },
  { code: 'zh-CN', nativeName: '简体中文', englishName: 'Chinese (Simplified)' },
  { code: 'zh-TW', nativeName: '繁體中文', englishName: 'Chinese (Traditional)' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'he', nativeName: 'עברית', englishName: 'Hebrew', rtl: true },
  { code: 'hu', nativeName: 'Magyar', englishName: 'Hungarian' },
  { code: 'nl', nativeName: 'Nederlands', englishName: 'Dutch' },
  { code: 'no', nativeName: 'Norsk', englishName: 'Norwegian' },
  { code: 'pl', nativeName: 'Polski', englishName: 'Polish' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese' },
  { code: 'ro', nativeName: 'Română', englishName: 'Romanian' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian' },
  { code: 'fi', nativeName: 'Suomi', englishName: 'Finnish' },
  { code: 'sv', nativeName: 'Svenska', englishName: 'Swedish' },
  { code: 'th', nativeName: 'ภาษาไทย', englishName: 'Thai' },
  { code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish' },
  { code: 'uk', nativeName: 'Українська', englishName: 'Ukrainian' },
];
