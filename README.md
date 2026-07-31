# 🚀 JSON Editor Pro & Visualizer

A modern, fast, high-performance web-based JSON Editor featuring a visual interactive AST tree viewer, Monaco Code Editor with real-time bi-directional synchronization, keyboard-first ergonomics, live search, TypeScript interface generator, and multi-format conversion (YAML, CSV, JSON).

---

## ✨ Features & Highlights

### ⚡ Split View & Real-time Bi-directional Sync
- **Interactive Visual Tree Viewer**: Render JSON as a structured interactive tree with data type badges, inline key/value editing, instant data type casting popover, and hover action controls (+Child, Duplicate, Delete, Copy JSONPath).
- **Monaco Code Editor**: Power-packed raw code editor with syntax highlighting, code folding, auto-formatting, minification, and real-time schema error diagnostics.
- **Debounced Sync**: Bi-directional sync with 300ms debounce ensures smooth typing performance even with large JSON objects.

### 🎨 Empty State Overlay
- Fullscreen quick-start overlay when canvas is clear:
  - 📋 **Paste from Clipboard**: Quick click or global `Ctrl+V` / `Cmd+V` paste listener.
  - 📁 **Import File**: File picker and Drag & Drop support (`.json`, `.txt`).
  - ↺ **Restore Last JSON**: Restore last edited session from LocalStorage (`⌥` `⇧` `R`).
  - 📊 **Sample Datasets**: Built-in presets (User Profile, REST API Payload, E-Commerce Catalog, App Config).

### ⌨️ Comprehensive Keyboard Ergonomics & Hotkeys
Custom non-conflicting keyboard shortcuts engineered to avoid system & browser DevTools collisions:

| Action | Shortcut (macOS) | Shortcut (Windows/Linux) |
| :--- | :--- | :--- |
| **Split View** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>J</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>J</kbd> |
| **Tree View** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>K</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>K</kbd> |
| **Code View** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>L</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>L</kbd> |
| **Pretty Format** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>F</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>F</kbd> |
| **Minify JSON** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>M</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>M</kbd> |
| **Copy Formatted JSON** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>C</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>C</kbd> |
| **TypeScript Generator** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd> |
| **Import File Modal** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>I</kbd> |
| **Export Data Modal** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>E</kbd> |
| **Clear Canvas** | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>X</kbd> | <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>X</kbd> |
| **Live Search** | <kbd>⌘</kbd> <kbd>F</kbd> | <kbd>Ctrl</kbd> <kbd>F</kbd> |
| **Edit History Modal** | <kbd>⌘</kbd> <kbd>H</kbd> | <kbd>Ctrl</kbd> <kbd>H</kbd> |
| **Undo / Redo** | <kbd>⌘</kbd> <kbd>Z</kbd> / <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>Ctrl</kbd> <kbd>Z</kbd> / <kbd>Ctrl</kbd> <kbd>Y</kbd> |

### 🛠️ Developer Utility Tools
- 🔍 **Live Search**: Instant highlight across keys & values, matching result counter navigation, auto parent node expansion, and auto-scroll to search hit.
- 📘 **TypeScript Interface Generator**: Converts any valid JSON into accurate TypeScript `interface` / `type` definitions with nested structural inference.
- 💾 **Local Edit History**: Saves up to 30 valid edit history snapshots in LocalStorage accessible via `Ctrl+H` / `Cmd+H`.
- 🔁 **Multi-Format Converters**: Import & Export data to **JSON**, **YAML**, and **CSV**.
- 🌓 **Dark / Light Glassmorphism**: Toggle visual modes with high-contrast UI accents.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Converters**: `yaml`, `papaparse`, `jsonpath-plus`

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/json-editor.git
cd json-editor

# 2. Install dependencies
pnpm install # or npm install

# 3. Run development server
pnpm dev # or npm run dev
```

Open `http://localhost:5173` in your browser to start editing JSON!

### Production Build

```bash
# Build production bundle
pnpm build # or npm run build

# Preview production build locally
pnpm preview # or npm run preview
```

---

## 📄 License

MIT License. Open source software built with ❤️ for developer efficiency and optimal UI/UX ergonomics.
