import React, { useState } from 'react';
import { useJSON } from '../../context/JSONContext';
import { X, Upload, FileCode } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const { updateFromRawText } = useJSON();
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        updateFromRawText(content);
        onClose();
      }
    };
    reader.readAsText(file);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Import JSON File
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drop Zone */}
        <div className="p-6">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer block transition-colors ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-950/50'
            }`}
          >
            <FileCode className="w-10 h-10 mx-auto mb-3 text-indigo-500 stroke-1" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Drag & Drop your JSON file here
            </p>
            <p className="text-[11px] text-slate-400 mb-4">Supports .json, .txt files</p>
            <span className="inline-block px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg border border-indigo-200 dark:border-indigo-800">
              Browse File
            </span>
            <input type="file" accept=".json,.txt" onChange={handleChange} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
