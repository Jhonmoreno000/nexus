import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIncident?: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, onOpenIncident }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'CRITICAL: Settlement Ledger Discrepancy Detected',
      message: 'Automated reconciliation detected 3.7% orders marked as paid without ledger transaction ID. Incident #1842 assigned.',
      time: '12 min ago',
      type: 'critical',
      incidentId: '1842'
    },
    {
      id: '2',
      title: 'Code Review Passed: Foreign Key Integrity Fix',
      message: 'Senior DBA Sarah approved your proposed migration for orphaned order foreign key constraints.',
      time: '1 hour ago',
      type: 'success'
    },
    {
      id: '3',
      title: 'Staging Environment Refreshed',
      message: 'PostgreSQL 16 staging sandbox snapshot restored with deterministic seed datasets.',
      time: '3 hours ago',
      type: 'info'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#00e5ff]" />
            <h2 className="text-sm font-bold text-white">System Notifications & Alerts</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                n.type === 'critical'
                  ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                  : n.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                  : 'bg-[#0b1426] border-[#162744] text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>{n.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
              {n.incidentId && onOpenIncident && (
                <button
                  onClick={() => {
                    onOpenIncident(n.incidentId!);
                    onClose();
                  }}
                  className="mt-2 px-3 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-bold"
                >
                  Open Incident #{n.incidentId} &rarr;
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
