import React, { useEffect, useState } from 'react';
import { useJSON } from '../context/JSONContext';
import { Clipboard, Braces, Database, Upload, History } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/sampleData';

export const EmptyPasteOverlay: React.FC = () => {
  const {
    isEmptyState,
    updateFromRawText,
    loadPresetData,
    historyRecords,
    loadHistoryRecord,
    setShowHistoryModal,
  } = useJSON();
  const [dragActive, setDragActive] = useState(false);

  // Latest JSON record if available in localStorage
  const latestHistory = historyRecords.length > 0 ? historyRecords[0] : null;

  // Global Ctrl+V / Cmd+V and Alt+Shift+R shortcut listener when in empty state
  useEffect(() => {
    if (!isEmptyState) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Restore shortcut: Alt+Shift+R or Option+Shift+R
      if (e.altKey && e.shiftKey && e.code === 'KeyR' && latestHistory) {
        e.preventDefault();
        loadHistoryRecord(latestHistory);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text');
      if (pastedText && pastedText.trim()) {
        e.preventDefault();
        updateFromRawText(pastedText);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, [isEmptyState, updateFromRawText, latestHistory, loadHistoryRecord]);

  if (!isEmptyState) return null;

  const handleClipboardClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        updateFromRawText(text);
      }
    } catch (err) {
      alert('Clipboard permission denied or unavailable. Please use Ctrl+V / Cmd+V to paste!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) updateFromRawText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) updateFromRawText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-200 ${
        dragActive ? 'ring-4 ring-indigo-500 bg-indigo-950/90' : ''
      }`}
    >
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* Distinctive JSON Braces Logo Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 mb-6 animate-bounce">
          <Braces className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
          JSON Editor & Viewer
        </h1>
        <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
          Paste JSON from clipboard using{' '}
          <span className="inline-flex items-center gap-0.5 mx-1 align-middle">
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-800 border border-slate-700 text-indigo-300 rounded font-bold shadow-2xs">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-800 border border-slate-700 text-indigo-300 rounded font-bold shadow-2xs">
              V
            </kbd>
          </span>{' '}
          /{' '}
          <span className="inline-flex items-center gap-0.5 mx-1 align-middle">
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-800 border border-slate-700 text-indigo-300 rounded font-bold shadow-2xs">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-800 border border-slate-700 text-indigo-300 rounded font-bold shadow-2xs">
              V
            </kbd>
          </span>
          , import a file, or restore your last session.
        </p>

        {/* Unified 3-Column Action Grid: Paste Clipboard, Import File & Restore Last JSON */}
        <div
          className={`grid gap-4 w-full mb-8 ${
            latestHistory ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 max-w-md'
          }`}
        >
          {/* Action 1: Clipboard Paste */}
          <button
            onClick={handleClipboardClick}
            className="p-5 bg-slate-900/80 hover:bg-slate-800/90 border border-indigo-500/40 hover:border-indigo-400 rounded-2xl transition-all shadow-xl flex flex-col items-center group cursor-pointer"
          >
            <div className="p-3.5 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform mb-2">
              <Clipboard className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white mb-1.5">
              Paste from Clipboard
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-mono">Press</span>
              <kbd className="text-[12px] font-mono font-bold text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-indigo-700/60 shadow-2xs">
                Ctrl+V
              </kbd>
              <span className="text-[11px] text-slate-500 font-mono">/</span>
              <kbd className="text-[12px] font-mono font-bold text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-indigo-700/60 shadow-2xs">
                ⌘V
              </kbd>
            </div>
          </button>

          {/* Action 2: Import File */}
          <label className="p-5 bg-slate-900/80 hover:bg-slate-800/90 border border-purple-500/40 hover:border-purple-400 rounded-2xl transition-all shadow-xl flex flex-col items-center group cursor-pointer">
            <div className="p-3.5 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform mb-2">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white mb-1.5">
              Import JSON File
            </span>
            <span className="text-[11px] text-slate-400 font-mono">.json, .txt, drag & drop</span>
            <input type="file" accept=".json,.txt" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Action 3: Restore Last JSON (3 Distinct Key Caps: ⌥ ⇧ R) */}
          {latestHistory && (
            <button
              onClick={() => loadHistoryRecord(latestHistory)}
              className="p-5 bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl transition-all shadow-xl flex flex-col items-center group cursor-pointer text-center"
            >
              <div className="p-3.5 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform mb-2">
                <History className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white mb-1.5">
                Restore Last JSON
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-mono">Press</span>
                <span className="inline-flex items-center gap-0.5">
                  <kbd className="text-[12px] font-mono font-bold text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-cyan-700/60 shadow-2xs">
                    ⌥
                  </kbd>
                  <kbd className="text-[12px] font-mono font-bold text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-cyan-700/60 shadow-2xs">
                    ⇧
                  </kbd>
                  <kbd className="text-[12px] font-mono font-bold text-cyan-200 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-600 shadow-2xs">
                    R
                  </kbd>
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Sample Datasets & View All History Link */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Sample Datasets
            </div>
            {historyRecords.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center gap-1"
              >
                <History className="w-3 h-3" />
                View All History ({historyRecords.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPresetData(preset.data)}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-semibold text-slate-300 truncate">{preset.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{preset.category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
