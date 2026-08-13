import React, { useState } from 'react';
import { Check, Copy, Download, FileJson, X } from 'lucide-react';
import { downloadFile } from '../../utils/exportUtils';
import { generateJsonSchema } from '../../utils/jsonSchemaGenerator';

interface JsonSchemaModalProps {
  data: unknown;
  onClose: () => void;
}

export const JsonSchemaModal: React.FC<JsonSchemaModalProps> = ({ data, onClose }) => {
  const schemaCode = generateJsonSchema(data, 'RootObject');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(schemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(schemaCode, 'schema.json', 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[min(720px,85vh)]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Generated JSON Schema</h2>
              <p className="mt-0.5 text-[10px] text-slate-400">JSON Schema Draft 2020-12</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close JSON Schema generator"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 p-6 overflow-auto bg-slate-950 font-mono text-xs leading-relaxed text-emerald-300">
          <pre>{schemaCode}</pre>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Schema
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Schema!' : 'Copy Schema'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
