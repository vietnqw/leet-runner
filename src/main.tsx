import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

const showFatal = (title: string, detail: unknown) => {
  const message =
    detail instanceof Error ? (detail.stack || detail.message) : String(detail)
  rootEl.innerHTML = `
    <div style="white-space:pre-wrap;padding:16px;background:#1e1e1e;color:#fff">
      <div style="font-weight:700;color:#ff6b6b;margin-bottom:8px">${title}</div>
      <div style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;font-size:12px;color:#ffd1d1">${message}</div>
      <div style="margin-top:10px;color:#aaa;font-size:12px">Open DevTools Console for more details.</div>
    </div>
  `
}

window.addEventListener('error', (e) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showFatal('Runtime error', (e as any).error || e.message)
})

window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showFatal('Unhandled promise rejection', (e as any).reason)
})

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
