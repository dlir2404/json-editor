export interface HistoryRecord {
  id: string;
  timestamp: number;
  formattedTime: string;
  previewText: string;
  fullRawText: string;
  itemCount: number;
}

const HISTORY_KEY = 'json_editor_pro_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getHistoryFromStorage(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from LocalStorage', e);
    return [];
  }
}

export function saveHistoryEntry(rawText: string, parsedData: any): HistoryRecord[] {
  if (!rawText || !rawText.trim()) return getHistoryFromStorage();

  const history = getHistoryFromStorage();

  // Calculate item count preview
  let itemCount = 0;
  if (parsedData && typeof parsedData === 'object') {
    itemCount = Array.isArray(parsedData) ? parsedData.length : Object.keys(parsedData).length;
  }

  // Create preview snippet (first 100 chars)
  const previewText = rawText.trim().replace(/\s+/g, ' ').slice(0, 100);

  // Avoid saving duplicate identical consecutive entries
  if (history.length > 0 && history[0].fullRawText === rawText) {
    return history;
  }

  const now = new Date();
  const newEntry: HistoryRecord = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: now.getTime(),
    formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + now.toLocaleDateString(),
    previewText,
    fullRawText: rawText,
    itemCount,
  };

  const updatedHistory = [newEntry, ...history.filter((item) => item.fullRawText !== rawText)].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save history to LocalStorage', e);
  }

  return updatedHistory;
}

export function clearAllHistoryStorage() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear history from LocalStorage', e);
  }
}
