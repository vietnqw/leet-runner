declare module 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/pyodide.mjs' {
  // Minimal typing for the CDN-loaded Pyodide module (browser).
  export function loadPyodide(options: any): Promise<any>;
}


