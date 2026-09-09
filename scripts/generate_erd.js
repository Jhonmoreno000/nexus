const fs = require('fs');
const path = require('path');

const code = \import React, { useState } from 'react';
import { Key, ExternalLink, Code, Maximize2, Database, Link as LinkIcon } from 'lucide-react';
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

  const ColumnRow = ({ icon, name, type, isPk = false, isFk = false, isLast = false }: any) => (
    <div className="flex items-center justify-between group py-[1px]">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 flex justify-center">
          {isPk ? (
            <Key className="w-2.5 h-2.5 text-amber-400" />
          ) : isFk ? (
            <LinkIcon className="w-2.5 h-2.5 text-sky-400" />
          ) : (
            <div className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors"></div>
          )}
        </div>
        <span className={\\\\\\ \\\\\\}>
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[7.5px] text-slate-500 font-sans tracking-widest uppercase">{type}</span>
        {isPk && <span className="text-[6px] px-1 py-[1px] rounded-[3px] bg-amber-500/20 text-amber-400 font-bold leading-none">PK</span>}
        {isFk && <span className="text-[6px] px-1 py-[1px] rounded-[3px] bg-sky-500/20 text-sky-400 font-bold leading-none">FK</span>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col bg-[#070c17]/90 rounded-xl border border-slate-800/60 overflow-hidden select-none backdrop-blur-md">
      {/* ERD Header */}
      <div className="px-3 py-2 bg-[#08101e]/80 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Relationships</span>
          <span className="text-[10px] text-slate-500 font-normal">(Snake Layout)</span>
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

      {/* 2D Canvas with Snake Layout */}
      <div className="relative w-full overflow-x-auto p-3 bg-[#050912]/90 custom-scrollbar">
        <div className="relative min-w-[520px] h-[280px]">
          {/* SVG Connector Wires with glowing sockets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 520 280">
            <defs>
              <filter id="erd-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Wire 1: customers -> orders */}
            <path
              d="M 145 50 C 160 50, 160 55, 180 55"
              fill="none"
              stroke={isWireActive('customers', 'orders') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('customers', 'orders') ? '2' : '1.5'}
              strokeOpacity={isWireActive('customers', 'orders') ? '1' : '0.65'}
              filter={isWireActive('customers', 'orders') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            <circle cx="145" cy="50" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="180" cy="55" r="2" fill="#38bdf8" />

            {/* Wire 2: orders -> payments */}
            <path
              d="M 325 55 C 340 55, 340 55, 360 55"
              fill="none"
              stroke={isWireActive('orders', 'payments') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('orders', 'payments') ? '2' : '1.5'}
              strokeOpacity={isWireActive('orders', 'payments') ? '1' : '0.65'}
              filter={isWireActive('orders', 'payments') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            <circle cx="325" cy="55" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="360" cy="55" r="2" fill="#38bdf8" />

            {/* Wire 3: payments (bottom) -> transactions (top) */}
            <path
              d="M 427 115 L 427 140"
              fill="none"
              stroke={isWireActive('payments', 'transactions') ? '#38bdf8' : '#0284c7'}
              strokeWidth={isWireActive('payments', 'transactions') ? '2' : '1.5'}
              strokeOpacity={isWireActive('payments', 'transactions') ? '1' : '0.65'}
              filter={isWireActive('payments', 'transactions') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            <circle cx="427" cy="115" r="2.5" fill="#070b14" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="427" cy="140" r="2" fill="#38bdf8" />

            {/* Wire 4: transactions (left) -> refunds (right) */}
            <path
              d="M 360 185 L 325 185"
              fill="none"
              stroke={isWireActive('transactions', 'refunds') ? '#34d399' : '#059669'}
              strokeWidth={isWireActive('transactions', 'refunds') ? '2' : '1.5'}
              strokeOpacity={isWireActive('transactions', 'refunds') ? '1' : '0.65'}
              filter={isWireActive('transactions', 'refunds') ? 'url(#erd-soft-glow)' : undefined}
              className="transition-all duration-300"
            />
            <circle cx="360" cy="185" r="2.5" fill="#070b14" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="325" cy="185" r="2" fill="#34d399" />
          </svg>

          {/* TABLE CARDS */}

          {/* Row 1, Card 1: customers */}
          <div
            onClick={() => onSelectTable('customers')}
            onMouseEnter={() => setHoveredTable('customers')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '10px', top: '10px', width: '135px' }}
            className={\bsolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md \\\\\\}
          >
            <div className="px-2 py-1 bg-slate-800/50 border-b border-slate-700/40 rounded-t-md font-semibold text-slate-200 flex items-center justify-between">
              <span>customers</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              <ColumnRow name="id" type="uuid" isPk={true} />
              <ColumnRow name="name" type="varchar" />
              <ColumnRow name="email" type="varchar" />
              <ColumnRow name="created_at" type="timestamp" isLast={true} />
            </div>
          </div>

          {/* Row 1, Card 2: orders (TARGET TABLE) */}
          <div
            onClick={() => onSelectTable('orders')}
            onMouseEnter={() => setHoveredTable('orders')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '180px', top: '5px', width: '145px' }}
            className={\bsolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md \\\\\\}
          >
            <div className="px-2 py-1 bg-sky-950/40 border-b border-sky-900/40 rounded-t-md font-bold text-white flex items-center justify-between">
              <span>orders</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 tracking-wider">TARGET</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              <ColumnRow name="id" type="uuid" isPk={true} />
              <ColumnRow name="customer_id" type="uuid" isFk={true} />
              <ColumnRow name="status" type="varchar" />
              <ColumnRow name="total_amount" type="numeric" />
              <ColumnRow name="created_at" type="timestamp" isLast={true} />
            </div>
          </div>

          {/* Row 1, Card 3: payments */}
          <div
            onClick={() => onSelectTable('payments')}
            onMouseEnter={() => setHoveredTable('payments')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '360px', top: '10px', width: '135px' }}
            className={\bsolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md \\\\\\}
          >
            <div className="px-2 py-1 bg-slate-800/50 border-b border-slate-700/40 rounded-t-md font-semibold text-slate-200 flex items-center justify-between">
              <span>payments</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              <ColumnRow name="id" type="uuid" isPk={true} />
              <ColumnRow name="order_id" type="uuid" isFk={true} />
              <ColumnRow name="amount" type="numeric" />
              <ColumnRow name="status" type="varchar" />
              <ColumnRow name="created_at" type="timestamp" isLast={true} />
            </div>
          </div>

          {/* Row 2, Card 4: transactions */}
          <div
            onClick={() => onSelectTable('transactions')}
            onMouseEnter={() => setHoveredTable('transactions')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '360px', top: '140px', width: '135px' }}
            className={\bsolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md \\\\\\}
          >
            <div className="px-2 py-1 bg-emerald-950/40 border-b border-emerald-900/40 rounded-t-md font-semibold text-emerald-200 flex items-center justify-between">
              <span>transactions</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              <ColumnRow name="id" type="uuid" isPk={true} />
              <ColumnRow name="payment_id" type="uuid" isFk={true} />
              <ColumnRow name="status" type="varchar" />
              <ColumnRow name="amount" type="numeric" />
              <ColumnRow name="created_at" type="timestamp" isLast={true} />
            </div>
          </div>

          {/* Row 2, Card 5: refunds */}
          <div
            onClick={() => onSelectTable('refunds')}
            onMouseEnter={() => setHoveredTable('refunds')}
            onMouseLeave={() => setHoveredTable(null)}
            style={{ left: '180px', top: '140px', width: '145px' }}
            className={\bsolute z-20 rounded-md border text-[9px] font-mono cursor-pointer transition-all shadow-md \\\\\\}
          >
            <div className="px-2 py-1 bg-emerald-950/40 border-b border-emerald-900/40 rounded-t-md font-semibold text-emerald-200 flex items-center justify-between">
              <span>refunds</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              <ColumnRow name="id" type="uuid" isPk={true} />
              <ColumnRow name="transaction_id" type="uuid" isFk={true} />
              <ColumnRow name="amount" type="numeric" />
              <ColumnRow name="status" type="varchar" />
              <ColumnRow name="created_at" type="timestamp" isLast={true} />
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
              onClick={() => onInsertQuery?.(\SELECT * FROM \ LIMIT 25;\)}
              title="Insert query into editor"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-medium transition-colors shadow-md shadow-sky-950/40"
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
\

fs.writeFileSync('./apps/web/src/components/erd/SchemaRelationshipsErd.tsx', code);
console.log('Component successfully updated!');
