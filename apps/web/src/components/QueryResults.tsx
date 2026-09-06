import React, { useState } from 'react';
import { SlidersHorizontal, Clock, Copy, Download, Check, Search, Database } from 'lucide-react';
import { QueryResult } from '../types';

interface QueryResultsProps {
  results: QueryResult;
}

export const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  const [filterText, setFilterText] = useState('');
  const [copied, setCopied] = useState(false);

  // Copy rows as JSON to clipboard
  const copyToClipboard = () => {
    if (results.rows && results.rows.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(results.rows, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Export results as CSV file
  const exportCsv = () => {
    if (!results.rows || results.rows.length === 0) return;

    const headers = results.columns.join(',');
    const rows = results.rows.map((row) =>
      results.columns
        .map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
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

  // Filter rows by text in any column
  const filteredRows = results.rows.filter((row) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex flex-col h-full bg-[#070b14] select-none font-sans overflow-hidden">
      {/* Header Bar matching Mockup */}
      <div className="h-10 bg-[#070c17] border-b border-slate-800/60 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
          <span>Query Results</span>
        </div>

        {/* Inline Search / Filter */}
        <div className="relative flex items-center">
          <Search className="w-3 h-3 text-slate-500 absolute left-2" />
          <input
            type="text"
            placeholder="Filter results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-36 focus:w-52 transition-all bg-slate-900/60 border border-slate-800/60 rounded-md pl-6 pr-2 py-0.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 font-mono"
          />
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          {/* Execution Time Badge with Translucent Tone */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-sky-400" />
            <span>{results.executionTimeMs} ms</span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/60">
            Query 03
          </span>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            title="Copy results as JSON"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors relative"
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
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto bg-[#070b14]">
        {results.error ? (
          <div className="p-4 text-xs font-mono text-rose-300 bg-rose-950/25 border border-rose-900/40 m-3 rounded-xl flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
            <div>
              <div className="font-bold text-rose-200 mb-1">PostgreSQL Execution Error</div>
              <div>{results.error}</div>
            </div>
          </div>
        ) : results.columns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs space-y-2">
            <Database className="w-6 h-6 text-slate-600" />
            <span>Run a query to view live PostgreSQL rows</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 bg-[#070c17]/95 backdrop-blur-sm text-slate-400 border-b border-slate-800/60 z-10">
              <tr>
                {results.columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 font-semibold tracking-wider text-[11px] text-slate-300 border-r border-slate-800/40 last:border-r-0 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredRows.map((row, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors group hover:bg-slate-800/25 ${
                      isEven ? 'bg-[#070b14]' : 'bg-[#090e1c]/40'
                    }`}
                  >
                    {results.columns.map((col) => {
                      const val = row[col];
                      const isNull = val === null || val === undefined;
                      const strVal = String(val);

                      return (
                        <td
                          key={col}
                          className="px-4 py-2 border-r border-slate-800/30 last:border-r-0 whitespace-nowrap"
                        >
                          {isNull ? (
                            <span className="text-slate-500/80 italic font-mono text-[11px] tracking-wide">
                              NULL
                            </span>
                          ) : strVal === 'paid' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              paid
                            </span>
                          ) : strVal === 'completed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                              completed
                            </span>
                          ) : strVal === 'failed' || strVal === 'refunded' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                              {strVal}
                            </span>
                          ) : (
                            <span className="text-slate-200 group-hover:text-white">
                              {strVal}
                            </span>
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
      <div className="h-7 bg-[#070c17] border-t border-slate-800/60 px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-300">
            Rows: <strong className="text-sky-300 font-semibold">{results.rowCount}</strong>
          </span>
          {filterText && (
            <span className="text-[10px] text-slate-500">
              (Filtered: {filteredRows.length} rows)
            </span>
          )}
        </div>

        <div className="text-[10px] text-slate-500">
          PostgreSQL 16 Output Buffer
        </div>
      </div>
    </div>
  );
};
