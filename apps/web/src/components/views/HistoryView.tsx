import React, { useState, useEffect } from 'react';
import { History, Clock, CheckCircle2, XCircle, ArrowUpRight, TerminalSquare } from 'lucide-react';

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
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0e17] space-y-8 select-none font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex items-center justify-between z-10 relative border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Query Execution Audit Log</h1>
            <p className="text-[13px] font-medium text-slate-400 mt-1">Chronological history of SQL statements executed across staging sandboxes</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/5 bg-[#121927]/80 backdrop-blur-xl overflow-hidden shadow-xl z-10 relative">
        <table className="w-full text-left text-[12px] font-mono border-collapse">
          <thead className="bg-[#161f30] text-slate-300 border-b border-white/5">
            <tr>
              <th className="px-5 py-4 font-semibold border-r border-white/5">Timestamp</th>
              <th className="px-5 py-4 font-semibold border-r border-white/5">Incident / Mission</th>
              <th className="px-5 py-4 font-semibold border-r border-white/5">SQL Query</th>
              <th className="px-5 py-4 font-semibold border-r border-white/5">Time</th>
              <th className="px-5 py-4 font-semibold border-r border-white/5">Rows</th>
              <th className="px-5 py-4 font-semibold border-r border-white/5">Status</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-5 py-3.5 text-slate-400 border-r border-white/5 group-hover:text-slate-300">{item.timestamp}</td>
                <td className="px-5 py-3.5 border-r border-white/5 font-semibold text-blue-400">{item.missionTitle}</td>
                <td className="px-5 py-3.5 text-slate-300 max-w-[300px] truncate border-r border-white/5 group-hover:text-white">
                  <div className="flex items-center gap-2">
                    <TerminalSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item.sql}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-400 border-r border-white/5">
                  <span className="bg-black/30 px-2 py-1 rounded-md border border-white/5">{item.executionTimeMs} ms</span>
                </td>
                <td className="px-5 py-3.5 text-slate-400 border-r border-white/5">{item.rowCount}</td>
                <td className="px-5 py-3.5 border-r border-white/5">
                  {item.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      <XCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onLoadQuery(item.missionId, item.sql)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white font-semibold transition-all"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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