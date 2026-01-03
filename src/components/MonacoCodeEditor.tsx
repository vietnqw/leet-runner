import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language = 'python'
}) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Configure editor settings if needed
    editor.focus();
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          folding: true,
          tabSize: 4,
          insertSpaces: true,
        }}
      />
    </div>
  );
};

