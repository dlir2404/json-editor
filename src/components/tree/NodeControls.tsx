import React from 'react';
import { Plus, Copy, Trash2, Link } from 'lucide-react';

interface NodeControlsProps {
  isContainer: boolean;
  onAddChild?: () => void;
  onCopyValue: () => void;
  onDelete: () => void;
  onCopyPath: () => void;
}

export const NodeControls: React.FC<NodeControlsProps> = ({
  isContainer,
  onAddChild,
  onCopyValue,
  onDelete,
  onCopyPath,
}) => {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 inline-flex items-center gap-0.5 ml-2 bg-slate-100 dark:bg-slate-800/80 px-1 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/60 shadow-xs">
      {isContainer && onAddChild && (
        <button
          onClick={onAddChild}
          title="Add Child Node"
          className="p-1 text-slate-500 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}

      <button
        onClick={onCopyValue}
        title="Copy Value"
        className="p-1 text-slate-500 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
      >
        <Copy className="w-3 h-3" />
      </button>

      <button
        onClick={onCopyPath}
        title="Copy JSONPath"
        className="p-1 text-slate-500 hover:text-cyan-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
      >
        <Link className="w-3 h-3" />
      </button>

      <button
        onClick={onDelete}
        title="Delete Node"
        className="p-1 text-slate-500 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
