const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. apps/web/src/components/modals/ProfileModal.tsx
write('apps/web/src/components/modals/ProfileModal.tsx', `
import React from 'react';
import { X, Award, Shield, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-lg font-extrabold text-[#00e5ff]">
                AR
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alex Rivera</h2>
              <p className="text-xs text-cyan-400 font-medium">Junior Database Developer</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#00e5ff]/15 text-[#00e5ff] text-[10px] font-bold">Level 2</span>
                <span className="text-[11px] text-slate-400 font-mono">3,500 / 5,000 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engineering Badges</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#060c18] border border-[#14223c] flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white text-[11px]">Anti-Join Pioneer</div>
                  <div className="text-[10px] text-slate-400">Mastered NULL assertion</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060c18] border border-[#14223c] flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white text-[11px]">40ms Query Runner</div>
                  <div className="text-[10px] text-slate-400">Sub-50ms execution</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#13233c]">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulation Career Stats</h3>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Production Incidents Resolved:</span>
                <span className="font-bold text-white font-mono">4 / 12</span>
              </div>
              <div className="flex justify-between">
                <span>Total Queries Tested:</span>
                <span className="font-bold text-white font-mono">148 queries</span>
              </div>
              <div className="flex justify-between">
                <span>Clean Code Review Score:</span>
                <span className="font-bold text-emerald-400 font-mono">96%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#060a14] border-t border-[#13233c] text-right">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
`);

// 2. apps/web/src/components/modals/NotificationsModal.tsx
write('apps/web/src/components/modals/NotificationsModal.tsx', `
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
              className={\`p-3.5 rounded-xl border text-xs space-y-1 \${
                n.type === 'critical'
                  ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                  : n.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                  : 'bg-[#0b1426] border-[#162744] text-slate-300'
              }\`}
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
`);

// 3. apps/web/src/components/modals/EnvironmentModal.tsx
write('apps/web/src/components/modals/EnvironmentModal.tsx', `
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
`);

// 4. apps/web/src/components/modals/TablePreviewModal.tsx
write('apps/web/src/components/modals/TablePreviewModal.tsx', `
import React from 'react';
import { X, Table2, Key } from 'lucide-react';
import { SchemaTable } from '../../types';

interface TablePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string | null;
  schema: SchemaTable[];
}

export const TablePreviewModal: React.FC<TablePreviewModalProps> = ({ isOpen, onClose, tableName, schema }) => {
  if (!isOpen || !tableName) return null;

  const table = schema.find((t) => t.name.toLowerCase() === tableName.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Table2 className="w-4 h-4 text-[#00e5ff]" />
            <h2 className="text-sm font-bold text-white font-mono">public.{tableName} Schema</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs font-mono">
          {table ? (
            <div className="space-y-2">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#070c17] text-slate-400 border-b border-[#142036]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Column</th>
                    <th className="px-3 py-2 font-semibold">Data Type</th>
                    <th className="px-3 py-2 font-semibold">Constraint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10192a]">
                  {table.columns.map((c) => (
                    <tr key={c.name} className="hover:bg-[#0c1527]">
                      <td className="px-3 py-2 text-white font-semibold flex items-center gap-1.5">
                        {c.isPk && <Key className="w-3 h-3 text-amber-400" />}
                        <span>{c.name}</span>
                      </td>
                      <td className="px-3 py-2 text-cyan-300">{c.type}</td>
                      <td className="px-3 py-2 text-slate-400">
                        {c.isPk ? (
                          <span className="text-amber-400 font-bold">PRIMARY KEY</span>
                        ) : c.isFk ? (
                          <span className="text-sky-400 font-bold">FK &rarr; {c.fkRef}</span>
                        ) : (
                          <span className="text-slate-500">NULLABLE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400">Table schema not found.</p>
          )}
        </div>

        <div className="p-4 bg-[#060a14] border-t border-[#13233c] text-right">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
`);

console.log('All modals created.');
