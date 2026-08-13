import React, { useEffect, useState } from 'react';
import { Command, Settings, X } from 'lucide-react';
import { SHORTCUT_CATEGORIES, SHORTCUTS } from '../../constants/shortcuts';

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsTab = 'shortcuts';

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
  const [activeTab, setActiveTab] = useState<SettingsTab>('shortcuts');

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
        className="w-full max-w-3xl max-h-[86vh] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl"
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
          <nav className="w-40 shrink-0 p-3 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800">
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
        </div>
      </div>
    </div>
  );
};
