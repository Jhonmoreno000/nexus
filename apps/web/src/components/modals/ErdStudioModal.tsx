import React, { useState } from 'react';
import { X, Database, ZoomIn, ZoomOut, RotateCcw, Key, Link2, Table2, Code, Download } from 'lucide-react';
import { SchemaTable } from '../../types';

interface ErdStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: SchemaTable[];
  onSelectTable?: (tableName: string) => void;
  onInsertQuery?: (sql: string) => void;
}

export const ErdStudioModal: React.FC<ErdStudioModalProps> = ({
  isOpen,
  onClose,
  schema = [],
  onSelectTable,
  onInsertQuery
}) => {
  const [zoom, setZoom] = useState(1);
  const [selectedTable, setSelectedTable] = useState<string>('orders');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6 select-none font-sans">
      <div className="w-full max-w-6xl h-[88vh] bg-[#070c17] border border-[#0284c7]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Studio Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a1832] via-[#09152b] to-[#070e1c] border-b border-[#162f59] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#00e5ff]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>PostgreSQL Schema Visualizer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00e5ff]/15 text-[#00e5ff] font-bold border border-[#00e5ff]/30">
                  ERD STUDIO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                nexus_db • public schema (5 relational tables, 4 active foreign key constraints)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#091122] border border-[#172d54] rounded-lg p-1 text-slate-300 text-xs">
              <button
                onClick={() => setZoom(Math.max(0.75, zoom - 0.1))}
                className="p-1 hover:text-cyan-300 hover:bg-[#0e213f] rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px] text-cyan-300 font-bold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                className="p-1 hover:text-cyan-300 hover:bg-[#0e213f] rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:text-cyan-300 hover:bg-[#0e213f] rounded ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#0f1f3a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Canvas */}
        <div className="flex-1 bg-[#050811] overflow-auto p-8 relative flex items-center justify-center">
          {/* Background Grid Lines (like CAD / DBeaver / pgAdmin canvas) */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          ></div>

          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="relative w-[920px] h-[480px] transition-transform duration-150"
          >
            {/* SVG Connecting Wires in High-Res */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 920 480">
              <defs>
                <filter id="studio-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker
                  id="studio-arrow"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#00e5ff" />
                </marker>
              </defs>

              {/* Wire 1: customers -> orders */}
              <path
                d="M 230 110 C 290 110, 290 145, 340 145"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.5"
                filter="url(#studio-glow)"
              />
              <circle cx="230" cy="110" r="4" fill="#070b14" stroke="#00e5ff" strokeWidth="2" />
              <circle cx="340" cy="145" r="4" fill="#00e5ff" />
              <text x="275" y="100" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N (FK)
              </text>

              {/* Wire 2: orders -> payments */}
              <path
                d="M 580 110 C 630 110, 630 145, 680 145"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.5"
                filter="url(#studio-glow)"
              />
              <circle cx="580" cy="110" r="4" fill="#070b14" stroke="#00e5ff" strokeWidth="2" />
              <circle cx="680" cy="145" r="4" fill="#00e5ff" />
              <text x="630" y="100" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N (FK)
              </text>

              {/* Wire 3: orders -> transactions */}
              <path
                d="M 460 250 C 460 280, 360 285, 360 320"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                markerEnd="url(#studio-arrow)"
              />
              <circle cx="460" cy="250" r="4" fill="#070b14" stroke="#00e5ff" strokeWidth="2" />
              <circle cx="360" cy="320" r="4" fill="#00e5ff" />

              {/* Wire 4: orders -> refunds */}
              <path
                d="M 520 250 C 520 280, 660 285, 660 320"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
              <circle cx="520" cy="250" r="4" fill="#070b14" stroke="#00e5ff" strokeWidth="2" />
              <circle cx="660" cy="320" r="4" fill="#00e5ff" />

              {/* Wire 5: transactions -> refunds */}
              <path
                d="M 470 410 L 550 410"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                filter="url(#studio-glow)"
              />
              <circle cx="470" cy="410" r="4" fill="#070b14" stroke="#10b981" strokeWidth="2" />
              <circle cx="550" cy="410" r="4" fill="#10b981" />
              <text x="510" y="400" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N
              </text>
            </svg>

            {/* TABLE 1: customers */}
            <div
              style={{ left: '20px', top: '40px', width: '210px' }}
              onClick={() => setSelectedTable('customers')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-2xl transition-all ${
                selectedTable === 'customers'
                  ? 'bg-[#09172f] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-[#081120] border-[#0284c7] hover:border-cyan-400'
              }`}
            >
              <div className="px-3 py-2 bg-[#0c2242] border-b border-[#173866] rounded-t-xl font-bold text-white flex items-center justify-between">
                <span className="text-sm">customers</span>
                <span className="text-[10px] text-slate-400">TABLE</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>name</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(100)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>email</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(150)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>created_at</span>
                  <span className="text-[10px] text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* TABLE 2: orders (TARGET) */}
            <div
              style={{ left: '340px', top: '25px', width: '240px' }}
              onClick={() => setSelectedTable('orders')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-2xl transition-all ${
                selectedTable === 'orders'
                  ? 'bg-[#0b1b36] border-[#00e5ff] shadow-[0_0_24px_rgba(0,229,255,0.5)]'
                  : 'bg-[#081326] border-[#00e5ff]/80 hover:border-cyan-300'
              }`}
            >
              <div className="px-3 py-2 bg-[#0f2952] border-b border-[#184282] rounded-t-xl font-bold text-white flex items-center justify-between">
                <span className="text-sm">orders</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00e5ff]/20 text-[#00e5ff] font-bold">
                  TARGET
                </span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>customer_id</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">FK &rarr; customers.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>status</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(30)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>total_amount</span>
                  <span className="text-[10px] text-slate-500">NUMERIC(10,2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>created_at</span>
                  <span className="text-[10px] text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* TABLE 3: payments */}
            <div
              style={{ left: '680px', top: '40px', width: '220px' }}
              onClick={() => setSelectedTable('payments')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-2xl transition-all ${
                selectedTable === 'payments'
                  ? 'bg-[#09172f] border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                  : 'bg-[#081120] border-[#0284c7] hover:border-cyan-400'
              }`}
            >
              <div className="px-3 py-2 bg-[#0c2242] border-b border-[#173866] rounded-t-xl font-bold text-white flex items-center justify-between">
                <span className="text-sm">payments</span>
                <span className="text-[10px] text-slate-400">TABLE</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>order_id</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">FK &rarr; orders.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>amount</span>
                  <span className="text-[10px] text-slate-500">NUMERIC(10,2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>status</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(30)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>created_at</span>
                  <span className="text-[10px] text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* TABLE 4: transactions (NULL ANOMALY) */}
            <div
              style={{ left: '230px', top: '300px', width: '240px' }}
              onClick={() => setSelectedTable('transactions')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-2xl transition-all ${
                selectedTable === 'transactions'
                  ? 'bg-[#06241f] border-[#00e5ff] shadow-[0_0_24px_rgba(0,229,255,0.4)]'
                  : 'bg-[#051714] border-[#059669]/90 hover:border-emerald-400'
              }`}
            >
              <div className="px-3 py-2 bg-[#07362d] border-b border-[#0d594a] rounded-t-xl font-bold text-emerald-200 flex items-center justify-between">
                <span className="text-sm">transactions</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 font-bold border border-rose-800/60">
                  NULL ANOMALY
                </span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>payment_id</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">FK &rarr; payments.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>status</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(30)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>amount</span>
                  <span className="text-[10px] text-slate-500">NUMERIC(10,2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>created_at</span>
                  <span className="text-[10px] text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* TABLE 5: refunds */}
            <div
              style={{ left: '550px', top: '300px', width: '240px' }}
              onClick={() => setSelectedTable('refunds')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-2xl transition-all ${
                selectedTable === 'refunds'
                  ? 'bg-[#06241f] border-[#00e5ff] shadow-[0_0_24px_rgba(0,229,255,0.4)]'
                  : 'bg-[#051714] border-[#059669]/90 hover:border-emerald-400'
              }`}
            >
              <div className="px-3 py-2 bg-[#07362d] border-b border-[#0d594a] rounded-t-xl font-bold text-emerald-200 flex items-center justify-between">
                <span className="text-sm">refunds</span>
                <span className="text-[10px] text-slate-400">LEDGER</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>transaction_id</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">FK &rarr; transactions.id</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>amount</span>
                  <span className="text-[10px] text-slate-500">NUMERIC(10,2)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>status</span>
                  <span className="text-[10px] text-slate-500">VARCHAR(30)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>created_at</span>
                  <span className="text-[10px] text-slate-500">TIMESTAMP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-[#060a14] border-t border-[#13223a] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Selected Table:</span>
            <strong className="text-cyan-300 font-mono">{selectedTable}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Load SELECT Query in Editor</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#0b1b36] hover:bg-[#122b54] text-slate-200 border border-[#173769] transition-colors"
            >
              Close Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
