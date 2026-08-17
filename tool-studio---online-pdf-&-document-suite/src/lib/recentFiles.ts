export interface RecentProcessedFile {
  id: string;
  name: string;
  toolId: string;
  toolName: string;
  timestamp: number;
  sizeBytes: number;
  downloadUrl?: string;
  downloadFileName?: string;
  pageCount?: number;
  fileType?: 'pdf' | 'word' | 'excel' | 'ppt' | 'image' | 'text' | 'other';
}

const STORAGE_KEY = 'tool_studio_recent_processed_files_v1';

export function getRecentFiles(): RecentProcessedFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 3);
    }
  } catch (err) {
    // Quiet handling
  }
  return [];
}

export function detectFileType(fileName: string): RecentProcessedFile['fileType'] {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return 'word';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp'].includes(ext)) return 'image';
  return 'other';
}

export function saveRecentFile(fileInfo: Omit<RecentProcessedFile, 'id' | 'timestamp'>): RecentProcessedFile[] {
  try {
    const current = getRecentFiles();
    const newEntry: RecentProcessedFile = {
      ...fileInfo,
      id: `rf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      fileType: fileInfo.fileType || detectFileType(fileInfo.name),
    };

    // Keep only distinct files by name or update existing, capped at last 3
    const filtered = current.filter((item) => item.name !== newEntry.name);
    const updated = [newEntry, ...filtered].slice(0, 3);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time state sync across components
    window.dispatchEvent(new Event('tool_studio_recent_files_updated'));
    return updated;
  } catch (err) {
    return [];
  }
}

export function clearRecentFiles(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('tool_studio_recent_files_updated'));
  } catch (err) {
    // Quiet handling
  }
}
