import { useState, useEffect } from 'react';
import { MonacoCodeEditor } from './components/MonacoCodeEditor';
import { workspaceStorage } from './storage/workspaceStorage';

function App() {
  const [code, setCode] = useState(workspaceStorage.loadCode());

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
      workspaceStorage.saveCode(newCode);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Editor Section (Left) */}
      <div style={{ flex: 1, borderRight: '1px solid #333' }}>
        <MonacoCodeEditor value={code} onChange={handleCodeChange} />
      </div>

      {/* Sidebar Section (Right) - Placeholder for now */}
      <div style={{ width: '400px', backgroundColor: '#252526', padding: '10px' }}>
        <h3>Test Cases</h3>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}

export default App;
