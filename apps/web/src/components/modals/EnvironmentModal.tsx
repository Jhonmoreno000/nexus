import React from 'react';
import { X, Database, Server, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

interface EnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentModal: React.FC<EnvironmentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#111622]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/20">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Environment Info</h2>
              <p className="text-xs text-slate-400 font-medium">Database engine diagnostics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4 shadow-inner">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute animate-ping opacity-75"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 relative"></span>
            </div>
            <div>
              <div className="font-bold text-emerald-400 tracking-wide text-xs uppercase">Staging Replica Healthy</div>
              <div className="text-[12px] text-emerald-100/70 font-medium mt-0.5">All sandbox instances online with zero lock waits</div>
            </div>
          </div>

          <div className="space-y-4 text-slate-300">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-medium">Engine Version</span>
              <span className="font-bold text-white">PostgreSQL 16.3</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-medium">Execution Engine</span>
              <span className="font-semibold text-blue-400">pg-mem (Microkernel)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-medium">Query Latency</span>
              <span className="font-semibold text-emerald-400">1.2 ms (Local)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="font-medium">Buffer Hit Ratio</span>
              <span className="font-semibold text-white">99.8%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">SQL Policy</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Strict Watchdog</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};