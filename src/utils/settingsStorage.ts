import { ViewMode } from '../types/json';

const DEFAULT_VIEW_MODE_KEY = 'json-editor-default-view-mode';
const DEFAULT_VIEW_MODE: ViewMode = 'split';
const VALID_VIEW_MODES: ViewMode[] = ['split', 'tree', 'code'];

const isViewMode = (value: unknown): value is ViewMode =>
  typeof value === 'string' && VALID_VIEW_MODES.includes(value as ViewMode);

export const getDefaultViewMode = (): ViewMode => {
  try {
    const storedValue = localStorage.getItem(DEFAULT_VIEW_MODE_KEY);
    return isViewMode(storedValue) ? storedValue : DEFAULT_VIEW_MODE;
  } catch {
    return DEFAULT_VIEW_MODE;
  }
};

export const saveDefaultViewMode = (viewMode: ViewMode): void => {
  try {
    localStorage.setItem(DEFAULT_VIEW_MODE_KEY, viewMode);
  } catch {
    // Keep the in-memory preference when browser storage is unavailable.
  }
};
