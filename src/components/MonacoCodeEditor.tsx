import React, { useRef, useEffect, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './VimStatusBar.css';

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
  vimMode = false,
}) => {
  const [editor, setEditor] = useState<any>(null);
  const vimStatusRef = useRef<HTMLDivElement>(null);
  const vimInstanceRef = useRef<any>(null);

  const handleEditorDidMount = (editorInstance: any) => {
    setEditor(editorInstance);
    editorInstance.focus();
  };

  useEffect(() => {
    if (!editor) return;

    // IMPORTANT: when vimMode is toggled OFF, the status bar element unmounts.
    // We still must dispose monaco-vim even if vimStatusRef.current is null,
    // otherwise the next toggle ON won't re-bind to the new status node.
    if (!vimMode) {
      if (vimInstanceRef.current) {
        vimInstanceRef.current.dispose();
        vimInstanceRef.current = null;
      }
      return;
    }

    // vimMode === true
    if (!vimStatusRef.current) return;

    // Ensure the editor is active; monaco-vim updates can depend on focus/attach timing.
    try {
      editor.focus();
    } catch {
      // ignore
    }

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

            // Setup observer to toggle colors based on mode text (Normal/Insert/Visual)
            const node = vimStatusRef.current;
            if (node) {
              const observer = new MutationObserver(() => {
                const text = node.textContent || '';
                let mode = 'normal';
                if (text.includes('INSERT')) mode = 'insert';
                else if (text.includes('VISUAL')) mode = 'visual';
                else if (text.includes('REPLACE')) mode = 'replace';
                
                if (node.getAttribute('data-mode') !== mode) {
                  node.setAttribute('data-mode', mode);
                }
              });
              observer.observe(node, {
                childList: true,
                subtree: true,
                characterData: true
              });
              
              // Seed initial text if empty
              requestAnimationFrame(() => {
                const modeSpan = node.querySelector('span');
                if (modeSpan && !modeSpan.textContent) {
                  modeSpan.textContent = '--NORMAL--';
                }
                // Force initial attribute
                node.setAttribute('data-mode', 'normal');
              });
            }
          })
          .catch((e: any) => {
            console.error('Failed to load/init vim mode', e);
            if (vimStatusRef.current) {
              vimStatusRef.current.textContent = 'Vim mode failed to load';
            }
          });
      } catch (e) {
        console.error('Failed to init vim mode', e);
      }
    }
  }, [editor, vimMode]);

  // When toggling the Vim status bar, Monaco often doesn't recompute its layout
  // immediately, which can cause the status bar to be partially hidden until reload.
  useEffect(() => {
    if (!editor) return;
    // Wait for the status bar DOM to mount/unmount, then force a relayout.
    const raf = requestAnimationFrame(() => {
      try {
        editor.layout();
      } catch {
        // ignore
      }
    });
    const t = window.setTimeout(() => {
      try {
        editor.layout();
      } catch {
        // ignore
      }
    }, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
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
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
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
            className="vim-status-bar"
          />
      )}
    </div>
  );
};
