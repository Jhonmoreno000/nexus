import React from 'react';
import { SlidersHorizontal, Clock, Copy, Download } from 'lucide-react';
import { QueryResult } from '../types';

interface QueryResultsProps {
  results: QueryResult;
}

export const QueryResults: React.FC<QueryResultsProps> = ({ results }) => {
  const copyToClipboard = () => {
    if (results.rows && results.rows.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(results.rows, null, 2));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d19] select-none">
      {/* Header Bar */}
      <div className="h-10 bg-[#060a14] border-b border-[#15233d] flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Query Results</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b1322] border border-[#172640] text-slate-300 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-[#00e5ff]" />
            <span>{results.executionTimeMs} ms</span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">Query 03</span>

          <button
            onClick={copyToClipboard}
            title="Copy results as JSON"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title="Export CSV"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-auto">
        {results.error ? (
          <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/20 border border-rose-900/50 m-3 rounded-lg">
            Error: {results.error}
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 bg-[#070c17] text-slate-400 border-b border-[#142036]">
              <tr>
                {results.columns.map((col) => (
                  <th key={col} className="px-4 py-2 font-semibold tracking-wider text-[11px] border-r border-[#121c2e] last:border-r-0">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#10192a]">
              {results.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#0c1527] transition-colors">
                  {results.columns.map((col) => {
                    const val = row[col];
                    const isNull = val === null || val === undefined;
                    return (
                      <td
                        key={col}
                        className={`px-4 py-2 border-r border-[#10192a] last:border-r-0 whitespace-nowrap ${
                          isNull ? 'text-slate-500 italic font-normal' : 'text-slate-200'
                        }`}
                      >
                        {isNull ? 'NULL' : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="h-7 bg-[#060a14] border-t border-[#15233d] px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Rows: {results.rowCount}</span>
      </div>
    </div>
  );
};
