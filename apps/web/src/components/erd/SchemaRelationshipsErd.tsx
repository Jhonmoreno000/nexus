import React, { useState } from 'react';
import { Key, Table2, ExternalLink, Code, Maximize2, Database } from 'lucide-react';
import { SchemaTable } from '../../types';

interface SchemaRelationshipsErdProps {
  schema: SchemaTable[];
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
  onTablePreview?: (tableName: string) => void;
  onInsertQuery?: (sql: string) => void;
  onOpenStudio?: () => void;
}

export const SchemaRelationshipsErd: React.FC<SchemaRelationshipsErdProps> = ({
  schema = [],
  selectedTable = 'orders',
  onSelectTable,
  onTablePreview,
  onInsertQuery,
  onOpenStudio
}) => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const isWireActive = (from: string, to: string) => {
    if (!hoveredTable && !selectedTable) return false;
    const active = hoveredTable || selectedTable;
    return active === from || active === to;
  };

  return (
    <div className="flex flex-col bg-[#070c17]/90 rounded-xl border border-slate-800/60 overflow-hidden select-none backdrop-blur-md">
      {/* ERD Header */}
      <div className="px-3 py-2 bg-[#08101e]/80 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Relationships</span>
          <span className="text-[10px] text-slate-500 font-normal">(PostgreSQL ERD)</span>
        </div>

        <div className="flex items-center gap-1">
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              title="Open Fullscreen ERD Studio"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 hover:text-sky-300 hover:bg-slate-800/50 transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Studio View</span>
            </button>
          )}
        </div>
      </div>

      {/* 2D Canvas matching Mockup with Refined Color Palette */}
      <div className="relative w-full overflow-x-auto p-3 bg-[#050912]/90">
        <div className="relative min-w-[360px] h-[225px]">
          {/* SVG Connector Wires with glowing sockets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 360 225">
            <defs>
              <filter id="erd-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <marker
                id="erd-arrow-refined"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Wire 1: customers (right) -> orders (left) */}
            <path
              d="M 98 42 C 114 42, 114 55, 130 55"
              fill="none"
              stroke={isWireActive('customers', 'orders') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('customers', 'orders') ? '2' : '1.5'}
              strokeOpacity={isWireActive('customers', 'orders') ? '1' : '0.65'}
              filter={isWireActive('customers', 'orders') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 1 */}
            <circle cx="98" cy="42" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="130" cy="55" r="2" fill="#38bdf8" />

            {/* Wire 2: orders (right) -> payments (left) */}
            <path
              d="M 226 42 C 242 42, 242 55, 258 55"
              fill="none"
              stroke={isWireActive('orders', 'payments') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'payments') ? '2' : '1.5'}
              strokeOpacity={isWireActive('orders', 'payments') ? '1' : '0.65'}
              filter={isWireActive('orders', 'payments') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 2 */}
            <circle cx="226" cy="42" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="258" cy="55" r="2" fill="#38bdf8" />

            {/* Wire 3: orders (bottom) -> transactions (top) */}
            <path
              d="M 166 100 C 166 114, 130 116, 130 130"
              fill="none"
              stroke={isWireActive('orders', 'transactions') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'transactions') ? '2' : '1.5'}
              strokeOpacity={isWireActive('orders', 'transactions') ? '1' : '0.65'}
              filter={isWireActive('orders', 'transactions') ? 'url(#erd-soft-glow)' : undefined}
              markerEnd="url(#erd-arrow-refined)"
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 3 */}
            <circle cx="166" cy="100" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="130" cy="130" r="2" fill="#38bdf8" />

            {/* Wire 4: orders (bottom right) -> refunds (top) */}
            <path
              d="M 196 100 C 196 114, 254 116, 254 130"
              fill="none"
              stroke={isWireActive('orders', 'refunds') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'refunds') ? '2' : '1.5'}
              strokeOpacity={isWireActive('orders', 'refunds') ? '1' : '0.65'}
              filter={isWireActive('orders', 'refunds') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 4 */}
            <circle cx="196" cy="100" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="254" cy="130" r="2" fill="#38bdf8" />

            {/* Wire 5: transactions (right) -> refunds (left) */}
            <path
              d="M 178 165 L 210 165"
              fill="none"
              stroke={isWireActive('transactions', 'refunds') ? '#34d399' : '#059669'}
              strokeWidth={isWireActive('transactions', 'refunds') ? '2' : '1.5'}
              strokeOpacity={isWireActive('transactions', 'refunds') ? '1' : '0.65'}
              filter={isWireActive('transactions', 'refunds') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 5 */}
            <circle cx="178" cy="165" r="2.5" fill="#070b14" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="210" cy="165" r="2" fill="#34d399" />
          </svg>

          {/* TABLE CARDS */}

          {/* Row 1, Card 1: customers */}
          <div
            onClick={() => onSelectTable('customers')}
            onMouseEnter={() => setHoveredTable('customers')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '6px', top: '10px', width: '92px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'customers'
                ? 'bg-[#0b172a] border-sky-400 shadow-sm'
                : 'bg-[#091222]/90 border-slate-700/60 hover:border-sky-500/50'
            }`}
          >
            <div className="px-1.5 py-1 bg-slate-800/50 border-b border-slate-700/40 rounded-t-md font-semibold text-slate-200 flex items-center justify-between">
              <span>customers</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="text-slate-400">— name</div>
              <div className="text-slate-400">— email</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>

          {/* Row 1, Card 2: orders (TARGET TABLE) */}
          <div
            onClick={() => onSelectTable('orders')}
            onMouseEnter={() => setHoveredTable('orders')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '130px', top: '6px', width: '96px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'orders'
                ? 'bg-[#0d1a33] border-sky-400 shadow-sm'
                : 'bg-[#0b162c]/95 border-sky-500/50 hover:border-sky-400'
            }`}
          >
            <div className="px-1.5 py-1 bg-sky-950/40 border-b border-sky-900/40 rounded-t-md font-bold text-white flex items-center justify-between">
              <span>orders</span>
              <span className="text-[7px] px-1 rounded bg-sky-500/20 text-sky-300">TARGET</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center justify-between text-amber-300 font-medium">
                <div className="flex items-center gap-1">
                  <Key className="w-2 h-2 text-amber-400" />
                  <span>id</span>
                </div>
                <span className="text-[7px] text-slate-500 font-sans font-bold">PK</span>
              </div>
              <div className="flex items-center justify-between text-sky-300">
                <span>— customer_id</span>
                <span className="text-[7px] text-slate-400 font-sans font-bold">FK</span>
              </div>
              <div className="text-slate-400">— status</div>
              <div className="text-slate-400">— total_amount</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>

          {/* Row 1, Card 3: payments */}
          <div
            onClick={() => onSelectTable('payments')}
            onMouseEnter={() => setHoveredTable('payments')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '258px', top: '10px', width: '92px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'payments'
                ? 'bg-[#0b172a] border-sky-400 shadow-sm'
                : 'bg-[#091222]/90 border-slate-700/60 hover:border-sky-500/50'
            }`}
          >
            <div className="px-1.5 py-1 bg-slate-800/50 border-b border-slate-700/40 rounded-t-md font-semibold text-slate-200 flex items-center justify-between">
              <span>payments</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-sky-300">
                <span>— order_id</span>
                <span className="text-[7px] text-slate-400 font-sans font-bold">FK</span>
              </div>
              <div className="text-slate-400">— amount</div>
              <div className="text-slate-400">— status</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>

          {/* Row 2, Card 4: transactions (ANOMALY SITE) */}
          <div
            onClick={() => onSelectTable('transactions')}
            onMouseEnter={() => setHoveredTable('transactions')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '80px', top: '130px', width: '98px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'transactions'
                ? 'bg-[#06201b] border-emerald-400 shadow-sm'
                : 'bg-[#061714]/90 border-emerald-900/50 hover:border-emerald-500/50'
            }`}
          >
            <div className="px-1.5 py-1 bg-emerald-950/40 border-b border-emerald-900/40 rounded-t-md font-semibold text-emerald-200 flex items-center justify-between">
              <span>transactions</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-sky-300">
                <span>— payment_id</span>
                <span className="text-[7px] text-slate-400 font-sans font-bold">FK</span>
              </div>
              <div className="text-slate-400">— status</div>
              <div className="text-slate-400">— amount</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>

          {/* Row 2, Card 5: refunds */}
          <div
            onClick={() => onSelectTable('refunds')}
            onMouseEnter={() => setHoveredTable('refunds')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '210px', top: '130px', width: '98px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'refunds'
                ? 'bg-[#06201b] border-emerald-400 shadow-sm'
                : 'bg-[#061714]/90 border-emerald-900/50 hover:border-emerald-500/50'
            }`}
          >
            <div className="px-1.5 py-1 bg-emerald-950/40 border-b border-emerald-900/40 rounded-t-md font-semibold text-emerald-200 flex items-center justify-between">
              <span>refunds</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-sky-300">
                <span>— transaction_id</span>
                <span className="text-[7px] text-slate-400 font-sans font-bold">FK</span>
              </div>
              <div className="text-slate-400">— amount</div>
              <div className="text-slate-400">— status</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Selection Footer */}
      {selectedTable && (
        <div className="px-3 py-2 bg-[#070c17] border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-sky-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span className="font-semibold">{selectedTable}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTablePreview?.(selectedTable)}
              title="Preview table schema & live rows"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 text-[10px] transition-colors"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span>Inspect</span>
            </button>

            <button
              onClick={() => onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`)}
              title="Insert query into editor"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-medium transition-colors"
            >
              <Code className="w-2.5 h-2.5" />
              <span>Query</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
