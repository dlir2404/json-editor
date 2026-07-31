import React from 'react';
import { JSONDataType } from '../../types/json';

interface DataTypeBadgeProps {
  type: JSONDataType;
}

export const DataTypeBadge: React.FC<DataTypeBadgeProps> = ({ type }) => {
  const badgeStyles: Record<JSONDataType, string> = {
    string: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    number: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    boolean: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    null: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    object: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    array: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${badgeStyles[type]}`}
    >
      {type}
    </span>
  );
};
