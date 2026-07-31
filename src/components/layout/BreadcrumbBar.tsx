import React from 'react';
import { useJSON } from '../../context/JSONContext';
import { ChevronRight, Layers } from 'lucide-react';

export const BreadcrumbBar: React.FC = () => {
  const { selectedPath, setSelectedPath } = useJSON();

  if (selectedPath.length === 0) {
    return (
      <div className="h-7 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
        <Layers className="w-3 h-3 text-indigo-500" />
        <span>root</span>
      </div>
    );
  }

  return (
    <div className="h-7 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center gap-1 text-[11px] font-mono overflow-x-auto">
      <button
        onClick={() => setSelectedPath([])}
        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
      >
        <Layers className="w-3 h-3 text-indigo-500" />
        root
      </button>

      {selectedPath.map((segment, index) => {
        const partialPath = selectedPath.slice(0, index + 1);
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <button
              onClick={() => setSelectedPath(partialPath)}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:underline whitespace-nowrap font-medium"
            >
              {typeof segment === 'number' ? `[${segment}]` : segment}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
