import React, { useState } from 'react';
import { Key, Table2, ExternalLink, Code, Maximize2, Sparkles, Database } from 'lucide-react';
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

  // Table columns definition matching the incident #1842 mockup ERD
  const tablesData = {
    customers: {
      name: 'customers',
      type: 'relational',
      color: 'blue',
      columns: [
        { name: 'id', isPk: true, isFk: false },
        { name: 'name', isPk: false, isFk: false },
        { name: 'email', isPk: false, isFk: false },
        { name: 'created_at', isPk: false, isFk: false }
      ]
    },
    orders: {
      name: 'orders',
      type: 'target',
      color: 'cyan',
      columns: [
        { name: 'id', isPk: true, isFk: false },
        { name: 'customer_id', isPk: false, isFk: true, fkRef: 'customers.id' },
        { name: 'status', isPk: false, isFk: false },
        { name: 'total_amount', isPk: false, isFk: false },
        { name: 'created_at', isPk: false, isFk: false }
      ]
    },
    payments: {
      name: 'payments',
      type: 'relational',
      color: 'blue',
      columns: [
        { name: 'id', isPk: true, isFk: false },
        { name: 'order_id', isPk: false, isFk: true, fkRef: 'orders.id' },
        { name: 'amount', isPk: false, isFk: false },
        { name: 'status', isPk: false, isFk: false },
        { name: 'created_at', isPk: false, isFk: false }
      ]
    },
    transactions: {
      name: 'transactions',
      type: 'ledger',
      color: 'emerald',
      columns: [
        { name: 'id', isPk: true, isFk: false },
        { name: 'payment_id', isPk: false, isFk: true, fkRef: 'payments.id' },
        { name: 'status', isPk: false, isFk: false },
        { name: 'amount', isPk: false, isFk: false },
        { name: 'created_at', isPk: false, isFk: false }
      ]
    },
    refunds: {
      name: 'refunds',
      type: 'ledger',
      color: 'emerald',
      columns: [
        { name: 'id', isPk: true, isFk: false },
        { name: 'transaction_id', isPk: false, isFk: true, fkRef: 'transactions.id' },
        { name: 'amount', isPk: false, isFk: false },
        { name: 'status', isPk: false, isFk: false },
        { name: 'created_at', isPk: false, isFk: false }
      ]
    }
  };

  const isWireActive = (from: string, to: string) => {
    if (!hoveredTable && !selectedTable) return false;
    const active = hoveredTable || selectedTable;
    return active === from || active === to;
  };

  return (
    <div className="flex flex-col bg-[#060c16] rounded-xl border border-[#14233c] overflow-hidden select-none shadow-inner">
      {/* ERD Header */}
      <div className="px-3 py-2 bg-[#08101e] border-b border-[#13223a] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
          <Database className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Relationships</span>
          <span className="text-[10px] text-slate-500 font-normal">(PostgreSQL ERD)</span>
        </div>

        <div className="flex items-center gap-1">
          {onOpenStudio && (
            <button
              onClick={onOpenStudio}
              title="Open Fullscreen ERD Studio"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 hover:text-cyan-300 hover:bg-[#0e1d36] transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Studio View</span>
            </button>
          )}
        </div>
      </div>

      {/* 2D Canvas matching Mockup */}
      <div className="relative w-full overflow-x-auto p-3 bg-[#050912]">
        <div className="relative min-w-[360px] h-[225px]">
          {/* SVG Connector Wires with glowing sockets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 360 225">
            <defs>
              <filter id="erd-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <marker
                id="erd-arrow"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#00e5ff" />
              </marker>
            </defs>

            {/* Wire 1: customers (right) -> orders (left) */}
            <path
              d="M 98 42 C 114 42, 114 55, 130 55"
              fill="none"
              stroke={isWireActive('customers', 'orders') ? '#00e5ff' : '#0284c7'}
              strokeWidth={isWireActive('customers', 'orders') ? '2.5' : '1.5'}
              filter={isWireActive('customers', 'orders') ? 'url(#erd-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 1 */}
            <circle cx="98" cy="42" r="2.5" fill="#070b14" stroke="#00e5ff" strokeWidth="1.5" />
            <circle cx="130" cy="55" r="2.5" fill="#00e5ff" />

            {/* Wire 2: orders (right) -> payments (left) */}
            <path
              d="M 226 42 C 242 42, 242 55, 258 55"
              fill="none"
              stroke={isWireActive('orders', 'payments') ? '#00e5ff' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'payments') ? '2.5' : '1.5'}
              filter={isWireActive('orders', 'payments') ? 'url(#erd-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 2 */}
            <circle cx="226" cy="42" r="2.5" fill="#070b14" stroke="#00e5ff" strokeWidth="1.5" />
            <circle cx="258" cy="55" r="2.5" fill="#00e5ff" />

            {/* Wire 3: orders (bottom) -> transactions (top) */}
            <path
              d="M 166 100 C 166 114, 130 116, 130 130"
              fill="none"
              stroke={isWireActive('orders', 'transactions') ? '#00e5ff' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'transactions') ? '2.5' : '1.5'}
              filter={isWireActive('orders', 'transactions') ? 'url(#erd-glow)' : undefined}
              markerEnd="url(#erd-arrow)"
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 3 */}
            <circle cx="166" cy="100" r="2.5" fill="#070b14" stroke="#00e5ff" strokeWidth="1.5" />
            <circle cx="130" cy="130" r="2.5" fill="#00e5ff" />

            {/* Wire 4: orders (bottom right) -> refunds (top) */}
            <path
              d="M 196 100 C 196 114, 254 116, 254 130"
              fill="none"
              stroke={isWireActive('orders', 'refunds') ? '#00e5ff' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'refunds') ? '2.5' : '1.5'}
              filter={isWireActive('orders', 'refunds') ? 'url(#erd-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 4 */}
            <circle cx="196" cy="100" r="2.5" fill="#070b14" stroke="#00e5ff" strokeWidth="1.5" />
            <circle cx="254" cy="130" r="2.5" fill="#00e5ff" />

            {/* Wire 5: transactions (right) -> refunds (left) */}
            <path
              d="M 178 165 L 210 165"
              fill="none"
              stroke={isWireActive('transactions', 'refunds') ? '#00e5ff' : '#059669'}
              strokeWidth={isWireActive('transactions', 'refunds') ? '2.5' : '1.5'}
              filter={isWireActive('transactions', 'refunds') ? 'url(#erd-glow)' : undefined}
              className="transition-all duration-300"
            />
            {/* Sockets for Wire 5 */}
            <circle cx="178" cy="165" r="2.5" fill="#070b14" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="210" cy="165" r="2.5" fill="#10b981" />
          </svg>

          {/* TABLE CARDS (Arranged in exact 2-row layout) */}

          {/* Row 1, Card 1: customers */}
          <div
            onClick={() => onSelectTable('customers')}
            onMouseEnter={() => setHoveredTable('customers')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '6px', top: '10px', width: '92px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'customers'
                ? 'bg-[#0a172c] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-[#07101e] border-[#0284c7]/70 hover:border-[#00e5ff]'
            }`}
          >
            <div className="px-1.5 py-1 bg-[#0d213f] border-b border-[#142d54] rounded-t-md font-bold text-cyan-200 flex items-center justify-between">
              <span>customers</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
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
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-lg ${
              selectedTable === 'orders'
                ? 'bg-[#0b1932] border-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.5)]'
                : 'bg-[#081224] border-[#00e5ff]/80 hover:border-[#00e5ff]'
            }`}
          >
            <div className="px-1.5 py-1 bg-[#0e274c] border-b border-[#163666] rounded-t-md font-bold text-white flex items-center justify-between">
              <span>orders</span>
              <span className="text-[7px] px-1 rounded bg-[#00e5ff]/20 text-[#00e5ff]">TARGET</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center justify-between text-amber-300 font-semibold">
                <div className="flex items-center gap-1">
                  <Key className="w-2 h-2 text-amber-400" />
                  <span>id</span>
                </div>
                <span className="text-[7px] text-slate-500 font-sans font-bold">PK</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
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
                ? 'bg-[#0a172c] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-[#07101e] border-[#0284c7]/70 hover:border-[#00e5ff]'
            }`}
          >
            <div className="px-1.5 py-1 bg-[#0d213f] border-b border-[#142d54] rounded-t-md font-bold text-cyan-200 flex items-center justify-between">
              <span>payments</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
                <span>— order_id</span>
                <span className="text-[7px] text-slate-400 font-sans font-bold">FK</span>
              </div>
              <div className="text-slate-400">— amount</div>
              <div className="text-slate-400">— status</div>
              <div className="text-slate-400 truncate">— created_at</div>
            </div>
          </div>

          {/* Row 2, Card 4: transactions (NULL ANOMALY) */}
          <div
            onClick={() => onSelectTable('transactions')}
            onMouseEnter={() => setHoveredTable('transactions')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '80px', top: '130px', width: '98px' }}
            className={`absolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md ${
              selectedTable === 'transactions'
                ? 'bg-[#07241f] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-[#051714] border-[#059669]/80 hover:border-[#10b981]'
            }`}
          >
            <div className="px-1.5 py-1 bg-[#07362c] border-b border-[#0b4d3f] rounded-t-md font-bold text-emerald-200 flex items-center justify-between">
              <span>transactions</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
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
                ? 'bg-[#07241f] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-[#051714] border-[#059669]/80 hover:border-[#10b981]'
            }`}
          >
            <div className="px-1.5 py-1 bg-[#07362c] border-b border-[#0b4d3f] rounded-t-md font-bold text-emerald-200 flex items-center justify-between">
              <span>refunds</span>
            </div>
            <div className="p-1.5 space-y-0.5 text-slate-300">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <Key className="w-2 h-2 text-amber-400" />
                <span>id</span>
              </div>
              <div className="flex items-center justify-between text-cyan-300">
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
        <div className="px-3 py-2 bg-[#050b14] border-t border-[#122036] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
            <span className="font-bold">{selectedTable}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTablePreview?.(selectedTable)}
              title="Preview table schema & live rows"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0b1b36] hover:bg-[#12294f] text-cyan-300 border border-[#16386d] text-[10px] transition-colors"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              <span>Inspect</span>
            </button>

            <button
              onClick={() => onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`)}
              title="Insert query into editor"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-bold transition-colors"
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
