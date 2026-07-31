import React from 'react';
import { useJSON } from '../../context/JSONContext';
import { JSONNode } from './JSONNode';
import { Plus, Code2 } from 'lucide-react';
import { convertPathToJSONPath } from '../../utils/jsonParser';

export const JSONTreeViewer: React.FC = () => {
  const {
    parsedData,
    isValidJson,
    updateValueAtPath,
    updateKeyAtPath,
    deleteNodeAtPath,
    addNodeAtPath,
    duplicateNodeAtPath,
    setSelectedPath,
    searchQuery,
    searchResults,
    activeSearchIndex,
  } = useJSON();

  const activeMatchPathStr =
    searchResults.length > 0 && searchResults[activeSearchIndex]
      ? convertPathToJSONPath(searchResults[activeSearchIndex].path)
      : undefined;

  if (!isValidJson || parsedData === null || parsedData === undefined) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950 text-slate-500">
        <Code2 className="w-12 h-12 mb-3 text-slate-400 stroke-1" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Invalid JSON Syntax
        </h3>
        <p className="text-xs max-w-sm text-slate-500">
          Fix the syntax error in the code editor on the right to view and interact with the visual tree.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="mb-2 flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Interactive Tree Canvas
        </span>
        <button
          onClick={() => addNodeAtPath([])}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Root Node
        </button>
      </div>

      <JSONNode
        value={parsedData}
        path={[]}
        onUpdateValue={updateValueAtPath}
        onUpdateKey={updateKeyAtPath}
        onDeleteNode={deleteNodeAtPath}
        onAddNode={addNodeAtPath}
        onDuplicateNode={duplicateNodeAtPath}
        onSelectPath={setSelectedPath}
        searchQuery={searchQuery}
        activeMatchPathStr={activeMatchPathStr}
      />
    </div>
  );
};
