import React, { useState } from 'react';
import { Copy, Download, Clock, SlidersHorizontal, Search, Check, Database } from 'lucide-react';
import { QueryResult } from '../types';

interface QueryResultsProps {
  results: QueryResult | null;
}

export const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  const [filterText, setFilterText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm space-y-3 bg-[#0a0e17] font-sans">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
          <Database className="w-5 h-5 text-slate-400" />
        </div>
        <span className="font-medium tracking-tight">Run a query to view results</span>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(results.rows, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    if (!results.columns.length) return;
    const headers = results.columns.join(',');
    const rows = results.rows.map((row) =>
      results.columns
        .map((col) => {
          const val = row[col];
          if (val === null) return '';
          if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
          return String(val);
        })
        .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexus_query_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRows = results.rows.filter((row) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] select-none font-sans overflow-hidden">
      {/* Header Bar */}
      <div className="h-12 bg-[#0a0e17] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span>Query Results</span>
        </div>

        {/* Inline Search / Filter */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
          <input
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-40 focus:w-56 transition-all bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Execution Time Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-slate-300 font-mono text-[11px] font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-400 opacity-80" />
            <span>{results.executionTimeMs} ms</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            title="Copy results as JSON"
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportCsv}
            title="Export to CSV"
            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto bg-[#0a0e17]">
        {results.error ? (
          <div className="p-4 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 m-4 rounded-2xl flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0"></div>
            <div>
              <div className="font-semibold text-rose-200 mb-1">PostgreSQL Execution Error</div>
              <div className="text-rose-400/90 font-mono text-xs">{results.error}</div>
            </div>
          </div>
        ) : results.columns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-400" />
            </div>
            <span className="font-medium tracking-tight">Query returned no columns.</span>
          </div>
        ) : (
          <table className="w-full text-left text-[13px] font-mono border-collapse">
            <thead className="sticky top-0 bg-[#0a0e17]/95 backdrop-blur-md text-slate-400 border-b border-white/5 z-10">
              <tr>
                {results.columns.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 font-semibold tracking-wide text-xs text-slate-400 border-r border-white/5 last:border-r-0 whitespace-nowrap uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRows.map((row, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors group hover:bg-white/5 ${
                      isEven ? 'bg-transparent' : 'bg-white/[0.02]'
                    }`}
                  >
                    {results.columns.map((col) => {
                      const val = row[col];
                      const isNull = val === null || val === undefined;
                      const strVal = String(val);

                      return (
                        <td
                          key={col}
                          className="px-5 py-2.5 border-r border-white/5 last:border-r-0 whitespace-nowrap text-slate-300 group-hover:text-white"
                        >
                          {isNull ? (
                            <span className="text-slate-500/80 italic font-medium text-[11px] tracking-wide">
                              NULL
                            </span>
                          ) : strVal === 'paid' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 tracking-wide uppercase">
                              PAID
                            </span>
                          ) : strVal === 'completed' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 tracking-wide uppercase">
                              COMPLETED
                            </span>
                          ) : strVal === 'failed' || strVal === 'refunded' ? (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 tracking-wide uppercase">
                              {strVal}
                            </span>
                          ) : (
                            <span>{strVal}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="h-9 bg-[#0a0e17] border-t border-white/5 px-5 flex items-center justify-between text-xs font-medium shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Rows: <strong className="text-white">{results.rowCount}</strong>
          </span>
          {filterText && (
            <span className="text-slate-500">
              (Filtered: {filteredRows.length})
            </span>
          )}
        </div>

        <div className="text-slate-500">
          PostgreSQL 16 Output
        </div>
      </div>
    </div>
  );
};