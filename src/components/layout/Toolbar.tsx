import React, { useState, useEffect, useRef } from 'react';
import { useJSON } from '../../context/JSONContext';
import {
  Columns,
  FolderTree,
  Code,
  Search,
  Undo2,
  Redo2,
  FileCode,
  Minimize2,
  Copy,
  Download,
  Upload,
  Code2,
  FileJson,
  Check,
  ChevronDown,
  ChevronUp,
  FileX,
} from 'lucide-react';
import { TypeScriptModal } from '../modals/TypeScriptModal';
import { JsonSchemaModal } from '../modals/JsonSchemaModal';
import { ExportModal } from '../modals/ExportModal';
import { ImportModal } from '../modals/ImportModal';

export const Toolbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    formatJson,
    minifyJson,
    undo,
    redo,
    canUndo,
    canRedo,
    searchQuery,
    setSearchQuery,
    searchResults,
    activeSearchIndex,
    setActiveSearchIndex,
    rawText,
    parsedData,
    showHistoryModal,
    setShowHistoryModal,
    clearToEmptyState,
  } = useJSON();

  const [copied, setCopied] = useState(false);
  const [showTsModal, setShowTsModal] = useState(false);
  const [showJsonSchemaModal, setShowJsonSchemaModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextSearch = () => {
    if (searchResults.length === 0) return;
    setActiveSearchIndex((activeSearchIndex + 1) % searchResults.length);
  };

  const handlePrevSearch = () => {
    if (searchResults.length === 0) return;
    setActiveSearchIndex((activeSearchIndex - 1 + searchResults.length) % searchResults.length);
  };

  // Global Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+F / Cmd+F -> Focus Search Input
      if (ctrlOrCmd && !e.altKey && !e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // Ctrl+H / Cmd+H -> Toggle History Modal
      if (ctrlOrCmd && !e.altKey && !e.shiftKey && e.code === 'KeyH') {
        e.preventDefault();
        setShowHistoryModal(!showHistoryModal);
        return;
      }

      // Safe Non-Conflicting Action Shortcuts: Alt+Shift (Win/Linux) or Option+Shift (macOS)
      if (e.altKey && e.shiftKey) {
        const code = e.code;

        if (code === 'KeyJ') {
          e.preventDefault();
          setViewMode('split');
        } else if (code === 'KeyK') {
          e.preventDefault();
          setViewMode('tree');
        } else if (code === 'KeyL') {
          e.preventDefault();
          setViewMode('code');
        } else if (code === 'KeyF') {
          e.preventDefault();
          formatJson();
        } else if (code === 'KeyM') {
          e.preventDefault();
          minifyJson();
        } else if (code === 'KeyC') {
          e.preventDefault();
          handleCopy();
        } else if (code === 'KeyT') {
          e.preventDefault();
          setShowTsModal((prev) => !prev);
        } else if (code === 'KeyS') {
          e.preventDefault();
          setShowJsonSchemaModal((prev) => !prev);
        } else if (code === 'KeyI') {
          e.preventDefault();
          setShowImportModal((prev) => !prev);
        } else if (code === 'KeyE') {
          e.preventDefault();
          setShowExportModal((prev) => !prev);
        } else if (code === 'KeyX') {
          e.preventDefault();
          clearToEmptyState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewMode, formatJson, minifyJson, rawText, clearToEmptyState, showHistoryModal, setShowHistoryModal]);

  return (
    <>
      <div className="h-12 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {/* Left Group: View Switcher, Undo/Redo, History */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50">
            <button
              onClick={() => setViewMode('split')}
              title="Split View (Alt/⌥ + Shift + J)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>Split</span>
            </button>

            <button
              onClick={() => setViewMode('tree')}
              title="Tree View (Alt/⌥ + Shift + K)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'tree'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Tree</span>
            </button>

            <button
              onClick={() => setViewMode('code')}
              title="Code View (Alt/⌥ + Shift + L)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'code'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 mx-0.5" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl/⌘ + Z)"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 disabled:opacity-40 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl/⌘ + Y)"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 disabled:opacity-40 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Group: Live Search Bar */}
        <div className="flex-1 min-w-[160px] max-w-xs relative">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search (Ctrl/⌘ + F)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />

            {searchResults.length > 0 ? (
              <div className="absolute right-1.5 flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {activeSearchIndex + 1}/{searchResults.length}
                </span>
                <button onClick={handlePrevSearch} title="Prev" className="p-0.5 text-slate-500 hover:text-indigo-500">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button onClick={handleNextSearch} title="Next" className="p-0.5 text-slate-500 hover:text-indigo-500">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
) : null}
          </div>
        </div>

        {/* Right Group: Action Buttons with 3 Distinct Key Caps */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={clearToEmptyState}
            title="Clear Canvas (Alt/⌥ + Shift + X)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/60 rounded-lg transition-colors"
          >
            <FileX className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            onClick={formatJson}
            title="Pretty Format (Alt/⌥ + Shift + F)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <FileCode className="w-4 h-4 text-emerald-500" />
            <span>Format</span>
          </button>

          <button
            onClick={minifyJson}
            title="Minify JSON (Alt/⌥ + Shift + M)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-amber-500" />
            <span>Minify</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Formatted JSON (Alt/⌥ + Shift + C)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-500" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setShowTsModal(true)}
            title="TypeScript Generator (Alt/⌥ + Shift + T)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>TS Types</span>
          </button>

          <button
            onClick={() => setShowJsonSchemaModal(true)}
            title="JSON Schema Generator (Alt/⌥ + Shift + S)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <FileJson className="w-4 h-4 text-emerald-500" />
            <span>JSON Schema</span>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            title="Import File (Alt/⌥ + Shift + I)"
            className="p-1.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <Upload className="w-4 h-4 text-purple-500" />
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            title="Export Data (Alt/⌥ + Shift + E)"
            className="p-1.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <Download className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showTsModal && <TypeScriptModal data={parsedData} onClose={() => setShowTsModal(false)} />}
      {showJsonSchemaModal && <JsonSchemaModal data={parsedData} onClose={() => setShowJsonSchemaModal(false)} />}
      {showExportModal && <ExportModal data={parsedData} rawText={rawText} onClose={() => setShowExportModal(false)} />}
      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} />}
    </>
  );
};
