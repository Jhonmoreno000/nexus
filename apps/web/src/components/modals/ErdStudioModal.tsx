import React, { useState } from 'react';
import { X, Database, ZoomIn, ZoomOut, RotateCcw, Key, Link2, Code } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 select-none font-sans">
      <div className="w-full max-w-6xl h-[88vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Studio Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>PostgreSQL Schema Visualizer</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 font-medium border border-sky-500/20">
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
            <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-800/60 rounded-lg p-1 text-slate-300 text-xs">
              <button
                onClick={() => setZoom(Math.max(0.75, zoom - 0.1))}
                className="p-1 hover:text-sky-300 hover:bg-slate-800/60 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-[11px] text-sky-300 font-semibold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                className="p-1 hover:text-sky-300 hover:bg-slate-800/60 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 hover:text-sky-300 hover:bg-slate-800/60 rounded ml-1 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Canvas */}
        <div className="flex-1 bg-[#050811] overflow-auto p-8 relative flex items-center justify-center">
          {/* Blueprint Dots Grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          ></div>

          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="relative w-[920px] h-[480px] transition-transform duration-150"
          >
            {/* SVG Connecting Wires with Soft Ambient Color */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 920 480">
              <defs>
                <marker
                  id="studio-arrow-refined"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Wire 1: customers -> orders */}
              <path
                d="M 230 110 C 290 110, 290 145, 340 145"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              <circle cx="230" cy="110" r="3.5" fill="#070b14" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="340" cy="145" r="3.5" fill="#38bdf8" />
              <text x="275" y="100" fill="#7dd3fc" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N (FK)
              </text>

              {/* Wire 2: orders -> payments */}
              <path
                d="M 580 110 C 630 110, 630 145, 680 145"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              <circle cx="580" cy="110" r="3.5" fill="#070b14" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="680" cy="145" r="3.5" fill="#38bdf8" />
              <text x="630" y="100" fill="#7dd3fc" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N (FK)
              </text>

              {/* Wire 3: orders -> transactions */}
              <path
                d="M 460 250 C 460 280, 360 285, 360 320"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeOpacity="0.75"
                markerEnd="url(#studio-arrow-refined)"
              />
              <circle cx="460" cy="250" r="3.5" fill="#070b14" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="360" cy="320" r="3.5" fill="#38bdf8" />

              {/* Wire 4: orders -> refunds */}
              <path
                d="M 520 250 C 520 280, 660 285, 660 320"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeOpacity="0.75"
              />
              <circle cx="520" cy="250" r="3.5" fill="#070b14" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="660" cy="320" r="3.5" fill="#38bdf8" />

              {/* Wire 5: transactions -> refunds */}
              <path
                d="M 470 410 L 550 410"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              <circle cx="470" cy="410" r="3.5" fill="#070b14" stroke="#34d399" strokeWidth="2" />
              <circle cx="550" cy="410" r="3.5" fill="#34d399" />
              <text x="510" y="400" fill="#6ee7b7" fontSize="11" fontFamily="monospace" textAnchor="middle">
                1 : N
              </text>
            </svg>

            {/* TABLE 1: customers */}
            <div
              style={{ left: '20px', top: '40px', width: '210px' }}
              onClick={() => setSelectedTable('customers')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-xl transition-all ${
                selectedTable === 'customers'
                  ? 'bg-slate-900 border-sky-400 shadow-md'
                  : 'bg-slate-900/80 border-slate-700/60 hover:border-sky-500/50'
              }`}
            >
              <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700/40 rounded-t-xl font-semibold text-slate-200 flex items-center justify-between">
                <span className="text-sm">customers</span>
                <span className="text-[10px] text-slate-500">TABLE</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
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
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-xl transition-all ${
                selectedTable === 'orders'
                  ? 'bg-slate-900 border-sky-400 shadow-md'
                  : 'bg-slate-900/80 border-sky-500/40 hover:border-sky-400'
              }`}
            >
              <div className="px-3 py-2 bg-sky-950/30 border-b border-sky-900/40 rounded-t-xl font-bold text-white flex items-center justify-between">
                <span className="text-sm">orders</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-medium border border-sky-500/25">
                  TARGET
                </span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-sky-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>customer_id</span>
                  </div>
                  <span className="text-[10px] text-sky-400/80">FK &rarr; customers.id</span>
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
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-xl transition-all ${
                selectedTable === 'payments'
                  ? 'bg-slate-900 border-sky-400 shadow-md'
                  : 'bg-slate-900/80 border-slate-700/60 hover:border-sky-500/50'
              }`}
            >
              <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700/40 rounded-t-xl font-semibold text-slate-200 flex items-center justify-between">
                <span className="text-sm">payments</span>
                <span className="text-[10px] text-slate-500">TABLE</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-sky-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>order_id</span>
                  </div>
                  <span className="text-[10px] text-sky-400/80">FK &rarr; orders.id</span>
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

            {/* TABLE 4: transactions */}
            <div
              style={{ left: '230px', top: '300px', width: '240px' }}
              onClick={() => setSelectedTable('transactions')}
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-xl transition-all ${
                selectedTable === 'transactions'
                  ? 'bg-slate-900 border-emerald-400 shadow-md'
                  : 'bg-slate-900/80 border-emerald-900/50 hover:border-emerald-500/50'
              }`}
            >
              <div className="px-3 py-2 bg-emerald-950/30 border-b border-emerald-900/40 rounded-t-xl font-semibold text-emerald-200 flex items-center justify-between">
                <span className="text-sm">transactions</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 font-medium border border-rose-500/25">
                  NULL ANOMALY
                </span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-sky-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>payment_id</span>
                  </div>
                  <span className="text-[10px] text-sky-400/80">FK &rarr; payments.id</span>
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
              className={`absolute z-20 rounded-xl border text-xs font-mono shadow-xl transition-all ${
                selectedTable === 'refunds'
                  ? 'bg-slate-900 border-emerald-400 shadow-md'
                  : 'bg-slate-900/80 border-emerald-900/50 hover:border-emerald-500/50'
              }`}
            >
              <div className="px-3 py-2 bg-emerald-950/30 border-b border-emerald-900/40 rounded-t-xl font-semibold text-emerald-200 flex items-center justify-between">
                <span className="text-sm">refunds</span>
                <span className="text-[10px] text-slate-500">LEDGER</span>
              </div>
              <div className="p-3 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between text-amber-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>id</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">INT (PK)</span>
                </div>
                <div className="flex items-center justify-between text-sky-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>transaction_id</span>
                  </div>
                  <span className="text-[10px] text-sky-400/80">FK &rarr; transactions.id</span>
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
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/70 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Selected Table:</span>
            <strong className="text-sky-300 font-mono">{selectedTable}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Load SELECT Query in Editor</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors"
            >
              Close Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
