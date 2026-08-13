import React, { useEffect, useState } from 'react';
import { Code, Columns, Command, FolderTree, Settings, SlidersHorizontal, X } from 'lucide-react';
import { SHORTCUT_CATEGORIES, SHORTCUTS } from '../../constants/shortcuts';
import { useJSON } from '../../context/JSONContext';
import { ViewMode } from '../../types/json';

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsTab = 'general' | 'shortcuts';

const VIEW_OPTIONS: Array<{
  value: ViewMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: 'split',
    label: 'Split View',
    description: 'Tree and code side by side.',
    icon: Columns,
  },
  {
    value: 'tree',
    label: 'Tree View',
    description: 'Focus on the visual editor.',
    icon: FolderTree,
  },
  {
    value: 'code',
    label: 'Code View',
    description: 'Focus on the Monaco editor.',
    icon: Code,
  },
];

const KeyCaps: React.FC<{ keys: string[] }> = ({ keys }) => (
  <span className="inline-flex items-center gap-1">
    {keys.map((key, index) => (
      <React.Fragment key={`${key}-${index}`}>
        <kbd className="min-w-7 px-2 py-1 text-center text-xs leading-none font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-xs">
          {key}
        </kbd>
        {index < keys.length - 1 && <span className="text-[10px] text-slate-400">+</span>}
      </React.Fragment>
    ))}
  </span>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { defaultViewMode, setDefaultViewMode } = useJSON();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [draftDefaultViewMode, setDraftDefaultViewMode] = useState<ViewMode>(defaultViewMode);
  const hasChanges = draftDefaultViewMode !== defaultViewMode;

  const handleSave = () => {
    if (hasChanges) setDefaultViewMode(draftDefaultViewMode);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="w-full max-w-3xl h-[min(720px,86vh)] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-title" className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Settings
              </h2>
              <p className="text-[11px] text-slate-400">Customize and discover editor controls</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <nav className="w-40 shrink-0 p-3 space-y-1 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'general'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shortcuts')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'shortcuts'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Command className="w-4 h-4" />
              Shortcuts
            </button>
          </nav>

          <div className="min-w-0 flex-1 overflow-y-auto p-5">
            {activeTab === 'general' ? (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Editor Preferences</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choose how the editor should look whenever you open the app.
                  </p>
                </div>

                <fieldset>
                  <legend className="text-xs font-bold text-slate-800 dark:text-slate-200">Default View</legend>
                  <p className="mt-1 mb-3 text-[11px] text-slate-400">
                    The selected view is saved in this browser. Temporary toolbar switches will not change it.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {VIEW_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const selected = draftDefaultViewMode === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setDraftDefaultViewMode(option.value)}
                          className={`p-4 text-left border rounded-xl transition-all ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-500/30'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900/60'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 mb-3 flex items-center justify-center rounded-lg ${
                              selected
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div className={`text-xs font-bold ${selected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {option.label}
                          </div>
                          <div className="mt-1 text-[11px] leading-relaxed text-slate-400">{option.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Keyboard commands remain active anywhere in the editor.
                  </p>
                </div>

                <div className="space-y-6">
                  {SHORTCUT_CATEGORIES.map((category) => (
                    <section key={category}>
                      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        {category}
                      </h4>
                      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800">
                        {SHORTCUTS.filter((shortcut) => shortcut.category === category).map((shortcut) => (
                          <div
                            key={shortcut.action}
                            className="grid grid-cols-[minmax(150px,1fr)_auto_auto] items-center gap-4 px-4 py-3 bg-white dark:bg-slate-900/60"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {shortcut.action}
                              </div>
                              <div className="mt-0.5 text-[11px] text-slate-400 truncate">
                                {shortcut.description}
                              </div>
                            </div>
                            <div className="min-w-28">
                              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">macOS</div>
                              <KeyCaps keys={shortcut.mac} />
                            </div>
                            <div className="min-w-36">
                              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Windows / Linux
                              </div>
                              <KeyCaps keys={shortcut.windows} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <span className="text-[11px] text-slate-400">
            {hasChanges ? 'You have unsaved changes.' : 'All settings are saved.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
