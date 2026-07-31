import React, { useState, useRef, useEffect } from 'react';
import { JSONDataType } from '../../types/json';
import { ArrowLeftRight } from 'lucide-react';

interface TypePopoverProps {
  currentType: JSONDataType;
  onTypeChange: (newType: JSONDataType) => void;
}

const ALL_TYPES: JSONDataType[] = ['string', 'number', 'boolean', 'null', 'object', 'array'];

export const TypePopover: React.FC<TypePopoverProps> = ({ currentType, onTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change data type"
        className="p-1 text-slate-400 hover:text-indigo-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <ArrowLeftRight className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 z-30 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 text-xs font-mono">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
            Convert Type
          </div>
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => {
                onTypeChange(type);
                setIsOpen(false);
              }}
              className={`w-full text-left px-2 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-between ${
                type === currentType ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{type}</span>
              {type === currentType && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
