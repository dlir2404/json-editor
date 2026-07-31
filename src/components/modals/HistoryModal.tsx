import React from 'react';
import { useJSON } from '../../context/JSONContext';
import { X, History, Trash2, Clock, FileCode } from 'lucide-react';
import { HistoryRecord } from '../../utils/historyStorage';

export const HistoryModal: React.FC = () => {
  const { showHistoryModal, setShowHistoryModal, historyRecords, loadHistoryRecord, clearHistory } = useJSON();

  if (!showHistoryModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              JSON Edit History
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Saved locally ({historyRecords.length})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {historyRecords.length > 0 && (
              <button
                onClick={clearHistory}
                title="Clear all history entries"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg border border-rose-200 dark:border-rose-800/60 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={() => setShowHistoryModal(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List Body */}
        <div className="flex-1 p-6 overflow-auto space-y-3">
          {historyRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-12 h-12 mx-auto mb-3 text-slate-500 stroke-1" />
              <p className="text-xs font-semibold text-slate-300 mb-1">No History Records Yet</p>
              <p className="text-[11px] text-slate-500">
                Your valid JSON edits will automatically be saved to LocalStorage history here.
              </p>
            </div>
          ) : (
            historyRecords.map((record: HistoryRecord) => (
              <div
                key={record.id}
                onClick={() => loadHistoryRecord(record)}
                className="group p-3.5 bg-slate-50 dark:bg-slate-950/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {record.formattedTime}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {record.itemCount} {record.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                    {record.previewText}
                  </div>
                </div>

                <button className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all shrink-0">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900/50">
          <span>Shortcut to toggle history: <kbd className="text-indigo-400 font-semibold">Ctrl + H</kbd></span>
          <button
            onClick={() => setShowHistoryModal(false)}
            className="px-4 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
