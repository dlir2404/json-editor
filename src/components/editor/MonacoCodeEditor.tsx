import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useJSON } from '../../context/JSONContext';
import { ErrorBanner } from './ErrorBanner';

export const MonacoCodeEditor: React.FC = () => {
  const { rawText, updateFromRawText, parseError, theme } = useJSON();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
      <ErrorBanner error={parseError} />
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={rawText}
          onChange={(value) => updateFromRawText(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: 'on',
            folding: true,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};
