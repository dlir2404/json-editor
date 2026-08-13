import React, { useState } from 'react';
import { useJSON } from '../../context/JSONContext';
import { SAMPLE_PRESETS } from '../../utils/sampleData';
import { Sun, Moon, Database, Braces, Code2, Settings } from 'lucide-react';
import { SettingsModal } from '../modals/SettingsModal';

export const Header: React.FC = () => {
  const { theme, toggleTheme, loadPresetData } = useJSON();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shadow-xs">
      {/* Brand & Distinctive JSON Editor Logo */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
          <Braces className="w-5 h-5 stroke-[2.5]" />
          <Code2 className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-amber-300 drop-shadow-sm" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            JSON Editor Pro
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {'{ }'} Visual
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Interactive Visual Tree & Monaco Code Editor</p>
        </div>
      </div>

      {/* Preset Selector & Theme Switcher */}
      <div className="flex items-center gap-3">
        {/* Preset Selector Dropdown */}
        <div className="relative group">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load Presets</span>
          </button>

          <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1 hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Sample Datasets
            </div>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPresetData(preset.data)}
                className="w-full text-left px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors block"
              >
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          title="Settings"
          aria-label="Open settings"
          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>
      </div>
      </header>

      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </>
  );
};
