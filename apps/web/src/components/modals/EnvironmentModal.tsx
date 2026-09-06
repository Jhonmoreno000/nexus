import React from 'react';
import { X, Database, Server, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#00e5ff]" />
            <h2 className="text-sm font-bold text-white">Database Engine Environment</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[#032e22]/50 border border-[#059669]/50 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping"></span>
            <div>
              <div className="font-bold text-[#34d399]">STAGING REPLICA HEALTHY</div>
              <div className="text-[11px] text-slate-300">All 6 sandbox instances online with zero lock waits</div>
            </div>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between py-1.5 border-b border-[#13233c]">
              <span>Engine Version:</span>
              <span className="font-mono font-bold text-white">PostgreSQL 16.3</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#13233c]">
              <span>Execution Engine:</span>
              <span className="font-mono text-cyan-400">pg-mem (In-Memory Microkernel)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#13233c]">
              <span>Query Latency:</span>
              <span className="font-mono text-emerald-400">1.2 ms (Local Sandbox)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#13233c]">
              <span>Buffer Cache Hit Ratio:</span>
              <span className="font-mono text-cyan-300">99.8%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>SQL Security Policy:</span>
              <span className="font-semibold text-emerald-400">Strict AST Watchdog</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#060a14] border-t border-[#13233c] text-right">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
