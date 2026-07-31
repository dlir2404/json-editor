import React, { useState, useEffect, useRef } from 'react';

interface InlineEditorProps {
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
  onSave: (newValue: any) => void;
  onCancel: () => void;
  className?: string;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({ value, type, onSave, onCancel, className = '' }) => {
  const [inputValue, setInputValue] = useState<string>(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const submit = () => {
    if (type === 'number') {
      const num = Number(inputValue);
      onSave(isNaN(num) ? value : num);
    } else if (type === 'boolean') {
      onSave(inputValue === 'true');
    } else {
      onSave(inputValue);
    }
  };

  if (type === 'boolean') {
    return (
      <select
        value={String(inputValue)}
        onChange={(e) => onSave(e.target.value === 'true')}
        onBlur={submit}
        className="px-1 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-indigo-500 rounded text-slate-900 dark:text-slate-100 focus:outline-none"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  return (
    <input
      ref={inputRef}
      type={type === 'number' ? 'number' : 'text'}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={submit}
      onKeyDown={handleKeyDown}
      className={`px-1.5 py-0.5 text-xs font-mono bg-white dark:bg-slate-800 border border-indigo-500 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${className}`}
    />
  );
};
