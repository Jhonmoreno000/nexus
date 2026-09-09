import React from 'react';
import { X, Bell, Info, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIncident?: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onOpenIncident }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#111622]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/20">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Notifications</h2>
              <p className="text-xs text-slate-400 font-medium">System alerts and mission updates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors cursor-pointer">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-sm tracking-tight">System Restarted</span>
                <span className="text-[10px] text-slate-500 font-semibold">2m ago</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                The mock database environment was refreshed. All queries now execute locally via pg-mem.
              </p>
            </div>
          </div>

          <div 
            onClick={() => { if (onOpenIncident) { onOpenIncident('2045'); onClose(); } }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start hover:bg-amber-500/20 transition-colors cursor-pointer shadow-inner"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm tracking-tight">New Mission Available</span>
                <span className="text-[10px] text-amber-500/70 font-semibold">1h ago</span>
              </div>
              <p className="text-xs text-amber-200/70 font-medium leading-relaxed">
                Incident #2045: Fraudulent Refund Velocity requires your attention. Click to view.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start hover:bg-white/10 transition-colors cursor-pointer">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-sm tracking-tight">Promotion Earned</span>
                <span className="text-[10px] text-slate-500 font-semibold">Yesterday</span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                You reached Tier 1 Junior Database Developer. Your clearance level has been increased.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};