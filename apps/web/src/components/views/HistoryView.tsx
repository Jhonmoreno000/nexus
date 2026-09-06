import React, { useState, useEffect } from 'react';
import { History, Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  missionId: string;
  missionTitle: string;
  sql: string;
  executionTimeMs: number;
  rowCount: number;
  status: 'SUCCESS' | 'ERROR';
  score?: number;
  timestamp: string;
}

interface HistoryViewProps {
  onLoadQuery: (missionId: string, sql: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onLoadQuery }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((d) => setHistory(d))
      .catch(console.error);
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <History className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Query Execution Audit Log</h1>
            <p className="text-xs text-slate-400">Chronological history of SQL statements executed across staging sandboxes</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#15233d] bg-[#090f1e] overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="bg-[#070c17] text-slate-400 border-b border-[#142036]">
            <tr>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
              <th className="px-4 py-3 font-semibold">Incident / Mission</th>
              <th className="px-4 py-3 font-semibold">SQL Query</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Rows</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10192a]">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-[#0c1527] transition-colors">
                <td className="px-4 py-3 text-slate-400">{item.timestamp}</td>
                <td className="px-4 py-3 text-cyan-300 font-semibold">{item.missionTitle}</td>
                <td className="px-4 py-3 text-slate-200 max-w-xs truncate">{item.sql}</td>
                <td className="px-4 py-3 text-slate-400">{item.executionTimeMs} ms</td>
                <td className="px-4 py-3 text-slate-400">{item.rowCount}</td>
                <td className="px-4 py-3">
                  {item.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onLoadQuery(item.missionId, item.sql)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
