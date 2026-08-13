import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Theme, ViewMode, ParseError, JSONStats, SearchMatch } from '../types/json';
import { safeJsonParse, calculateJSONStats, updateValueByPath, updateKeyByPath, deleteNodeByPath, addNodeByPath, duplicateNodeByPath } from '../utils/jsonParser';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { HistoryRecord, getHistoryFromStorage, saveHistoryEntry, clearAllHistoryStorage } from '../utils/historyStorage';
import { getDefaultViewMode, saveDefaultViewMode } from '../utils/settingsStorage';

interface JSONContextType {
  // Primary States
  rawText: string;
  parsedData: any;
  isValidJson: boolean;
  parseError: ParseError | null;
  stats: JSONStats;
  isEmptyState: boolean;

  // UI & View States
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  defaultViewMode: ViewMode;
  setDefaultViewMode: (mode: ViewMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Indentation
  indentation: 2 | 4;
  setIndentation: (indent: 2 | 4) => void;

  // Navigation & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchMatch[];
  activeSearchIndex: number;
  setActiveSearchIndex: (index: number) => void;
  selectedPath: (string | number)[];
  setSelectedPath: (path: (string | number)[]) => void;

  // History & Storage
  historyRecords: HistoryRecord[];
  showHistoryModal: boolean;
  setShowHistoryModal: (show: boolean) => void;
  loadHistoryRecord: (record: HistoryRecord) => void;
  clearHistory: () => void;

  // Actions
  updateFromRawText: (text: string) => void;
  updateValueAtPath: (path: (string | number)[], value: any) => void;
  updateKeyAtPath: (path: (string | number)[], newKey: string) => void;
  deleteNodeAtPath: (path: (string | number)[]) => void;
  addNodeAtPath: (path: (string | number)[], keyName?: string, defaultValue?: any) => void;
  duplicateNodeAtPath: (path: (string | number)[]) => void;
  loadPresetData: (data: any) => void;
  clearToEmptyState: () => void;
  formatJson: () => void;
  minifyJson: () => void;

  // History Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const JSONContext = createContext<JSONContextType | undefined>(undefined);

export const JSONProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with empty string to trigger paste overlay
  const { state: rawText, set: setRawText, undo, redo, canUndo, canRedo } = useUndoRedo<string>('');

  const [defaultViewMode, setDefaultViewModeState] = useState<ViewMode>(getDefaultViewMode);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [theme, setTheme] = useState<Theme>('dark');
  const [indentation, setIndentation] = useState<2 | 4>(2);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number>(0);
  const [selectedPath, setSelectedPath] = useState<(string | number)[]>([]);

  // History modal & storage state
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    setHistoryRecords(getHistoryFromStorage());
  }, []);

  // Parse JSON derived from rawText
  const { data: parsedData, error: parseError } = useMemo(() => safeJsonParse(rawText), [rawText]);
  const isValidJson = parseError === null && rawText.trim() !== '';
  const isEmptyState = rawText.trim() === '';

  // Calculate statistics
  const stats = useMemo(() => calculateJSONStats(parsedData, rawText), [parsedData, rawText]);

  // Automatically save to local history when valid JSON changes
  useEffect(() => {
    if (isValidJson && parsedData) {
      const updated = saveHistoryEntry(rawText, parsedData);
      setHistoryRecords(updated);
    }
  }, [isValidJson, parsedData, rawText]);

  // Global Ctrl+H / Cmd+H shortcut for History modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHistoryModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setDefaultViewMode = useCallback((mode: ViewMode) => {
    setDefaultViewModeState(mode);
    saveDefaultViewMode(mode);
    setViewMode(mode);
  }, []);

  // Bi-directional state handlers
  const updateFromRawText = useCallback((text: string) => {
    setRawText(text);
  }, [setRawText]);

  const updateTreeState = useCallback((newData: any) => {
    const formatted = JSON.stringify(newData, null, indentation);
    setRawText(formatted);
  }, [setRawText, indentation]);

  const updateValueAtPath = useCallback((path: (string | number)[], value: any) => {
    if (!parsedData) return;
    const newData = updateValueByPath(parsedData, path, value);
    updateTreeState(newData);
  }, [parsedData, updateTreeState]);

  const updateKeyAtPath = useCallback((path: (string | number)[], newKey: string) => {
    if (!parsedData) return;
    const newData = updateKeyByPath(parsedData, path, newKey);
    updateTreeState(newData);
  }, [parsedData, updateTreeState]);

  const deleteNodeAtPath = useCallback((path: (string | number)[]) => {
    if (!parsedData) return;
    const newData = deleteNodeByPath(parsedData, path);
    updateTreeState(newData);
  }, [parsedData, updateTreeState]);

  const addNodeAtPath = useCallback((path: (string | number)[], keyName?: string, defaultValue: any = '') => {
    if (!parsedData) return;
    const newData = addNodeByPath(parsedData, path, keyName, defaultValue);
    updateTreeState(newData);
  }, [parsedData, updateTreeState]);

  const duplicateNodeAtPath = useCallback((path: (string | number)[]) => {
    if (!parsedData) return;
    const newData = duplicateNodeByPath(parsedData, path);
    updateTreeState(newData);
  }, [parsedData, updateTreeState]);

  const loadPresetData = useCallback((data: any) => {
    const formatted = JSON.stringify(data, null, indentation);
    setRawText(formatted);
  }, [setRawText, indentation]);

  const clearToEmptyState = useCallback(() => {
    setRawText('');
  }, [setRawText]);

  const loadHistoryRecord = useCallback((record: HistoryRecord) => {
    setRawText(record.fullRawText);
    setShowHistoryModal(false);
  }, [setRawText]);

  const clearHistory = useCallback(() => {
    clearAllHistoryStorage();
    setHistoryRecords([]);
  }, []);

  const formatJson = useCallback(() => {
    if (parsedData !== null) {
      setRawText(JSON.stringify(parsedData, null, indentation));
    }
  }, [parsedData, indentation, setRawText]);

  const minifyJson = useCallback(() => {
    if (parsedData !== null) {
      setRawText(JSON.stringify(parsedData));
    }
  }, [parsedData, setRawText]);

  // Search logic across JSON Tree
  useEffect(() => {
    if (!searchQuery.trim() || !parsedData) {
      setSearchResults([]);
      setActiveSearchIndex(0);
      return;
    }

    const matches: SearchMatch[] = [];
    const query = searchQuery.toLowerCase();

    function searchTraverse(node: any, currentPath: (string | number)[]) {
      if (node === null || node === undefined) return;

      if (typeof node === 'object') {
        if (Array.isArray(node)) {
          node.forEach((item, index) => searchTraverse(item, [...currentPath, index]));
        } else {
          Object.keys(node).forEach((key) => {
            const keyMatches = key.toLowerCase().includes(query);
            if (keyMatches) {
              matches.push({
                path: [...currentPath, key],
                jsonPathStr: '$' + [...currentPath, key].join('.'),
                matchedKey: true,
              });
            }
            searchTraverse(node[key], [...currentPath, key]);
          });
        }
      } else {
        const valStr = String(node).toLowerCase();
        if (valStr.includes(query)) {
          matches.push({
            path: currentPath,
            jsonPathStr: '$' + currentPath.join('.'),
            matchedValue: true,
          });
        }
      }
    }

    searchTraverse(parsedData, []);
    setSearchResults(matches);
    setActiveSearchIndex(0);
  }, [searchQuery, parsedData]);

  const contextValue = useMemo<JSONContextType>(
    () => ({
      rawText,
      parsedData,
      isValidJson,
      parseError,
      stats,
      isEmptyState,
      viewMode,
      setViewMode,
      defaultViewMode,
      setDefaultViewMode,
      theme,
      setTheme,
      toggleTheme,
      indentation,
      setIndentation,
      searchQuery,
      setSearchQuery,
      searchResults,
      activeSearchIndex,
      setActiveSearchIndex,
      selectedPath,
      setSelectedPath,
      historyRecords,
      showHistoryModal,
      setShowHistoryModal,
      loadHistoryRecord,
      clearHistory,
      updateFromRawText,
      updateValueAtPath,
      updateKeyAtPath,
      deleteNodeAtPath,
      addNodeAtPath,
      duplicateNodeAtPath,
      loadPresetData,
      clearToEmptyState,
      formatJson,
      minifyJson,
      undo,
      redo,
      canUndo,
      canRedo,
    }),
    [
      rawText,
      parsedData,
      isValidJson,
      parseError,
      stats,
      isEmptyState,
      viewMode,
      defaultViewMode,
      setDefaultViewMode,
      theme,
      toggleTheme,
      indentation,
      searchQuery,
      searchResults,
      activeSearchIndex,
      selectedPath,
      historyRecords,
      showHistoryModal,
      loadHistoryRecord,
      clearHistory,
      updateFromRawText,
      updateValueAtPath,
      updateKeyAtPath,
      deleteNodeAtPath,
      addNodeAtPath,
      duplicateNodeAtPath,
      loadPresetData,
      clearToEmptyState,
      formatJson,
      minifyJson,
      undo,
      redo,
      canUndo,
      canRedo,
    ]
  );

  return <JSONContext.Provider value={contextValue}>{children}</JSONContext.Provider>;
};

export const useJSON = () => {
  const context = useContext(JSONContext);
  if (!context) {
    throw new Error('useJSON must be used within a JSONProvider');
  }
  return context;
};
