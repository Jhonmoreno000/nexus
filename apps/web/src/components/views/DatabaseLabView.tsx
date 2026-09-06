import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Database, Play, Sparkles, SlidersHorizontal, Table2 } from 'lucide-react';

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
    <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[#070b14] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Database className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Database Lab & SQL Scratchpad</h1>
            <p className="text-[11px] text-slate-400">Sandbox playground running against PostgreSQL 16 engine</p>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Templates:</span>
          <button
            onClick={() => loadTemplate('SELECT * FROM orders LIMIT 10;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Orders Table
          </button>
          <button
            onClick={() => loadTemplate('SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Group By
          </button>
          <button
            onClick={() => loadTemplate('SELECT * FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Left Join
          </button>
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="flex-1 grid grid-rows-2 gap-4 overflow-hidden">
        {/* Editor Container */}
        <div className="rounded-xl border border-[#15233d] bg-[#080d19] flex flex-col overflow-hidden">
          <div className="h-9 bg-[#060a14] border-b border-[#15233d] px-3 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">scratchpad.sql</span>
            <button
              onClick={runQuery}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs glow-cyan-sm transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>RUN SCRATCHPAD</span>
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme="vs-dark"
              value={sql}
              onChange={(val) => setSql(val || '')}
              options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="rounded-xl border border-[#15233d] bg-[#080d19] flex flex-col overflow-hidden">
          <div className="h-9 bg-[#060a14] border-b border-[#15233d] px-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Live PostgreSQL Engine Output</span>
            <span className="font-mono text-[11px] text-cyan-400">⏱️ {results.executionTimeMs} ms • {results.rowCount} rows</span>
          </div>
          <div className="flex-1 overflow-auto">
            {results.error ? (
              <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/30 m-3 rounded-lg border border-rose-900/50">
                PostgreSQL Engine Error: {results.error}
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-[#070c17] text-slate-400 border-b border-[#142036]">
                  <tr>
                    {results.columns.map((c) => (
                      <th key={c} className="px-4 py-2 font-semibold border-r border-[#121c2e]">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10192a]">
                  {results.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-[#0c1527]">
                      {results.columns.map((c) => (
                        <td key={c} className="px-4 py-1.5 border-r border-[#10192a] text-slate-200">
                          {r[c] === null ? <span className="text-slate-500 italic">NULL</span> : String(r[c])}
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
