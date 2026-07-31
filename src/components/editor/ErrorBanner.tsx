import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ParseError } from '../../types/json';

interface ErrorBannerProps {
  error: ParseError | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <div className="flex-1 font-mono">
        <span className="font-semibold">JSON Syntax Error:</span> {error.message}
        {error.line && error.column && (
          <span className="ml-2 px-1.5 py-0.5 bg-rose-500/20 rounded text-[10px]">
            Line {error.line}, Col {error.column}
          </span>
        )}
      </div>
    </div>
  );
};
