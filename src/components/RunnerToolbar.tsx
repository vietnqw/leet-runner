import React from 'react';
import { CHECKERS } from '../runner/checkers';
import './RunnerToolbar.css';

interface RunnerToolbarProps {
  methodName: string;
  onMethodNameChange: (name: string) => void;
  checkerId: string;
  onCheckerChange: (id: string) => void;
  vimMode: boolean;
  onVimModeChange: (enabled: boolean) => void;
  onRun: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export const RunnerToolbar: React.FC<RunnerToolbarProps> = ({
  methodName,
  onMethodNameChange,
  checkerId,
  onCheckerChange,
  vimMode,
  onVimModeChange,
  onRun,
  onStop,
  isRunning
}) => {
  const runLabel = isRunning ? 'Stop' : 'Run';
  return (
    <div className="runnerToolbar">
      <div className="runnerToolbar__brand">Leet Runner</div>

      <div className="runnerToolbar__divider" />

      <div className="runnerToolbar__group" aria-label="Language">
        <span className="runnerToolbar__chipLabel">Language:</span>
        <select className="runnerToolbar__select runnerToolbar__selectSm" disabled>
          <option>Python 3</option>
        </select>
      </div>

      <div className="runnerToolbar__group" aria-label="Method">
        <span className="runnerToolbar__chipLabel">Method:</span>
        <input
          className="runnerToolbar__input runnerToolbar__inputSm"
          type="text"
          value={methodName}
          onChange={(e) => onMethodNameChange(e.target.value)}
          placeholder="method (e.g. twoSum)"
        />
      </div>

      <div className="runnerToolbar__group" aria-label="Checker">
        <span className="runnerToolbar__chipLabel">Checker:</span>
        <select
          className="runnerToolbar__select"
          value={checkerId}
          onChange={(e) => onCheckerChange(e.target.value)}
        >
          {CHECKERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="runnerToolbar__spacer" />

      <div className="runnerToolbar__toggle" title="Toggle Vim mode">
        <span>Vim</span>
        <div
          className="runnerToolbar__switch"
          data-on={vimMode ? 'true' : 'false'}
          role="switch"
          aria-checked={vimMode}
          tabIndex={0}
          onClick={() => onVimModeChange(!vimMode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onVimModeChange(!vimMode);
            }
          }}
        >
          <div className="runnerToolbar__switchKnob" />
        </div>
      </div>

      <button
        className={[
          'runnerToolbar__button',
          isRunning ? 'runnerToolbar__buttonDanger' : 'runnerToolbar__buttonPrimary',
        ].join(' ')}
        onClick={isRunning ? onStop : onRun}
        title={isRunning ? 'Stop' : 'Run (Ctrl+Enter)'}
      >
        {isRunning ? (
          runLabel
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>{runLabel}</span>
            <span className="runnerToolbar__kbd">⌃↵</span>
          </span>
        )}
      </button>
    </div>
  );
};
