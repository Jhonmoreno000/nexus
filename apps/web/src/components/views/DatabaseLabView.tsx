import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Database, Play, Sparkles, SlidersHorizontal, Table2, LayoutGrid, TerminalSquare } from 'lucide-react';

export const DatabaseLabView: React.FC = () => {
  const [sql, setSql] = useState(`-- NEXUS Database Lab (Interactive Scratchpad)
-- Execute arbitrary SQL statements against the in-memory PostgreSQL engine
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public';`);

  const [results, setResults] = useState<{ columns: string[]; rows: any[]; rowCount: number; executionTimeMs: number; error?: string }>({
    columns: ['table_name', 'table_type'],
    rows: [
      { table_name: 'customers', table_type: 'BASE TABLE' },
      { table_name: 'orders', table_type: 'BASE TABLE' },
      { table_name: 'payments', table_type: 'BASE TABLE' },
      { table_name: 'transactions', table_type: 'BASE TABLE' },
      { table_name: 'refunds', table_type: 'BASE TABLE' }
    ],
    rowCount: 5,
    executionTimeMs: 16
  });

  const [isRunning, setIsRunning] = useState(false);

  const runQuery = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/lab/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const loadTemplate = (snippet: string) => {
    setSql(snippet);
  };

  return (
    <div className="flex-1 p-8 overflow-hidden flex flex-col bg-[#0a0e17] space-y-5 select-none font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Database Lab & Scratchpad</h1>
            <p className="text-[12px] font-medium text-slate-400 mt-0.5">Sandbox playground running against PostgreSQL 16 engine</p>
          </div>
        </div>

        {/* Quick Templates - Native iOS Pill Style */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5 shadow-inner">
          <button
            onClick={() => loadTemplate('SELECT * FROM orders LIMIT 10;')}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Orders Table
          </button>
          <button
            onClick={() => loadTemplate('SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;')}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Group By
          </button>
          <button
            onClick={() => loadTemplate('SELECT * FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;')}
            className="px-4 py-1.5 rounded-full text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            Left Join
          </button>
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="flex-1 grid grid-rows-2 gap-5 overflow-hidden z-10">
        {/* Editor Container */}
        <div className="rounded-[1.5rem] border border-white/5 bg-[#121927]/80 backdrop-blur-md flex flex-col overflow-hidden shadow-lg">
          <div className="h-12 bg-white/5 border-b border-white/5 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
              <TerminalSquare className="w-4 h-4 text-blue-400" />
              <span>scratchpad.sql</span>
            </div>
            <button
              onClick={runQuery}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Script</span>
            </button>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme="vs-dark"
              value={sql}
              onChange={(val) => setSql(val || '')}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 14, 
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                lineHeight: 22,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false
              }}
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="rounded-[1.5rem] border border-white/5 bg-[#121927]/80 backdrop-blur-md flex flex-col overflow-hidden shadow-lg">
          <div className="h-12 bg-white/5 border-b border-white/5 px-4 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Table2 className="w-4 h-4 text-emerald-400" />
              <span>Live Engine Output</span>
            </div>
            <div className="flex items-center gap-3 font-mono font-medium text-slate-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{results.executionTimeMs} ms</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>{results.rowCount} rows</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar bg-[#0f1523]">
            {results.error ? (
              <div className="p-4 m-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[13px] font-mono shadow-sm">
                <span className="font-bold">Error:</span> {results.error}
              </div>
            ) : (
              <table className="w-full text-left text-[12px] font-mono border-collapse">
                <thead className="sticky top-0 bg-[#161f30] text-slate-300 border-b border-white/5 shadow-sm">
                  <tr>
                    {results.columns.map((c) => (
                      <th key={c} className="px-5 py-2.5 font-semibold border-r border-white/5 last:border-0">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      {results.columns.map((c) => (
                        <td key={c} className="px-5 py-2 border-r border-white/5 last:border-0 text-slate-300 group-hover:text-white">
                          {r[c] === null ? <span className="text-slate-500 font-medium italic">NULL</span> : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};