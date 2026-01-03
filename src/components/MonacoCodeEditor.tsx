import React, { useRef, useEffect, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Configure loader to use local monaco instance instead of CDN
// This ensures monaco-vim and the editor use the same instance
loader.config({ monaco });

interface MonacoCodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  vimMode?: boolean;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  vimMode = false
}) => {
  const [editor, setEditor] = useState<any>(null);
  const vimStatusRef = useRef<HTMLDivElement>(null);
  const vimInstanceRef = useRef<any>(null);

  const handleEditorDidMount = (editorInstance: any) => {
    setEditor(editorInstance);
    editorInstance.focus();
  };

  useEffect(() => {
    if (!editor || !vimStatusRef.current) return;

    if (vimMode) {
      if (!vimInstanceRef.current) {
        try {
            // Lazy-load monaco-vim so a bundler/runtime issue doesn't blank the whole app.
            import('monaco-vim')
              .then((mod: any) => {
                const init = mod?.initVimMode;
                if (typeof init !== 'function') {
                  throw new Error('monaco-vim: initVimMode not found');
                }
                vimInstanceRef.current = init(editor, vimStatusRef.current);
              })
              .catch((e: any) => {
                console.error('Failed to load/init vim mode', e);
                if (vimStatusRef.current) {
                  vimStatusRef.current.textContent = 'Vim mode failed to load';
                }
              });
        } catch (e) {
            console.error("Failed to init vim mode", e);
        }
      }
    } else {
      if (vimInstanceRef.current) {
        vimInstanceRef.current.dispose();
        vimInstanceRef.current = null;
      }
    }

    return () => {
      // Cleanup on unmount handled by ref check or parent unmount
    };
  }, [editor, vimMode]);
  
  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (vimInstanceRef.current) {
              vimInstanceRef.current.dispose();
          }
      }
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
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
      {vimMode && (
          <div 
            ref={vimStatusRef} 
            style={{ 
                height: '24px', 
                backgroundColor: '#007acc', 
                color: 'white', 
                fontSize: '12px',
                padding: '0 5px',
                display: 'flex',
                alignItems: 'center'
            }} 
          />
      )}
    </div>
  );
};
