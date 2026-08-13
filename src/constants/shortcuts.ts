export type ShortcutCategory = 'Navigation' | 'Editing' | 'Tools' | 'General';

export interface ShortcutDefinition {
  action: string;
  description: string;
  category: ShortcutCategory;
  mac: string[];
  windows: string[];
}

export const SHORTCUTS: ShortcutDefinition[] = [
  {
    action: 'Split View',
    description: 'Show the visual tree and code editor side by side.',
    category: 'Navigation',
    mac: ['⌥', '⇧', 'J'],
    windows: ['Alt', 'Shift', 'J'],
  },
  {
    action: 'Tree View',
    description: 'Focus the interactive visual tree.',
    category: 'Navigation',
    mac: ['⌥', '⇧', 'K'],
    windows: ['Alt', 'Shift', 'K'],
  },
  {
    action: 'Code View',
    description: 'Focus the Monaco code editor.',
    category: 'Navigation',
    mac: ['⌥', '⇧', 'L'],
    windows: ['Alt', 'Shift', 'L'],
  },
  {
    action: 'Search',
    description: 'Focus and select the live search field.',
    category: 'Navigation',
    mac: ['⌘', 'F'],
    windows: ['Ctrl', 'F'],
  },
  {
    action: 'Format JSON',
    description: 'Pretty-print the current JSON document.',
    category: 'Editing',
    mac: ['⌥', '⇧', 'F'],
    windows: ['Alt', 'Shift', 'F'],
  },
  {
    action: 'Minify JSON',
    description: 'Remove unnecessary whitespace.',
    category: 'Editing',
    mac: ['⌥', '⇧', 'M'],
    windows: ['Alt', 'Shift', 'M'],
  },
  {
    action: 'Undo',
    description: 'Undo the latest JSON change.',
    category: 'Editing',
    mac: ['⌘', 'Z'],
    windows: ['Ctrl', 'Z'],
  },
  {
    action: 'Redo',
    description: 'Redo the latest reverted JSON change.',
    category: 'Editing',
    mac: ['⌘', 'Y'],
    windows: ['Ctrl', 'Y'],
  },
  {
    action: 'Copy JSON',
    description: 'Copy the current JSON to the clipboard.',
    category: 'Tools',
    mac: ['⌥', '⇧', 'C'],
    windows: ['Alt', 'Shift', 'C'],
  },
  {
    action: 'Generate TypeScript',
    description: 'Open the TypeScript type generator.',
    category: 'Tools',
    mac: ['⌥', '⇧', 'T'],
    windows: ['Alt', 'Shift', 'T'],
  },
  {
    action: 'Generate JSON Schema',
    description: 'Infer a JSON Schema from the current document.',
    category: 'Tools',
    mac: ['⌥', '⇧', 'S'],
    windows: ['Alt', 'Shift', 'S'],
  },
  {
    action: 'Import',
    description: 'Open the data import dialog.',
    category: 'Tools',
    mac: ['⌥', '⇧', 'I'],
    windows: ['Alt', 'Shift', 'I'],
  },
  {
    action: 'Export',
    description: 'Open the data export dialog.',
    category: 'Tools',
    mac: ['⌥', '⇧', 'E'],
    windows: ['Alt', 'Shift', 'E'],
  },
  {
    action: 'Edit History',
    description: 'Open or close locally saved edit history.',
    category: 'General',
    mac: ['⌘', 'H'],
    windows: ['Ctrl', 'H'],
  },
  {
    action: 'Clear Canvas',
    description: 'Clear the editor and return to the start screen.',
    category: 'General',
    mac: ['⌥', '⇧', 'X'],
    windows: ['Alt', 'Shift', 'X'],
  },
];

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = ['Navigation', 'Editing', 'Tools', 'General'];
