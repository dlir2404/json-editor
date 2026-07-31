import React from 'react';
import { useJSON } from '../../context/JSONContext';
import { CheckCircle2, AlertTriangle, FileText, KeyRound, Layers } from 'lucide-react';

export const FooterStats: React.FC = () => {
  const { stats, isValidJson } = useJSON();

  return (
    <footer className="h-7 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
      {/* Validation Status */}
      <div className="flex items-center gap-2">
        {isValidJson ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Valid JSON
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
            <AlertTriangle className="w-3 h-3" /> Syntax Error
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-slate-400" />
          {stats.formattedSize}
        </span>

        <span className="flex items-center gap-1">
          <KeyRound className="w-3 h-3 text-slate-400" />
          {stats.totalKeys} keys
        </span>

        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-slate-400" />
          Depth: {stats.maxDepth}
        </span>
      </div>
    </footer>
  );
};
