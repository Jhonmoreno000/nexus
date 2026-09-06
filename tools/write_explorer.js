const fs = require('fs');

fs.writeFileSync('apps/web/src/components/DatabaseExplorer.tsx', `import React, { useState } from 'react';
import { Database, Search, ChevronDown, ChevronRight, Table2, Key, Link2 } from 'lucide-react';
import { SchemaTable } from '../types';

interface DatabaseExplorerProps {
  schema: SchemaTable[];
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({ schema }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDbOpen, setIsDbOpen] = useState(true);
  const [isPublicOpen, setIsPublicOpen] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>('orders');

  const filteredTables = schema.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#0a101f] border-l border-[#15233d] overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3 border-b border-[#142036] space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Database className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Database Explorer</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070c17] border border-[#172742] rounded-lg pl-8 pr-6 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors"
          />
          <span className="absolute right-2.5 top-2 text-[10px] text-slate-500 font-mono">⌘</span>
        </div>
      </div>

      {/* Schema Tree */}
      <div className="p-3 space-y-1 text-xs font-mono">
        <div
          onClick={() => setIsDbOpen(!isDbOpen)}
          className="flex items-center gap-1.5 text-slate-300 font-semibold cursor-pointer hover:text-white"
        >
          {isDbOpen ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>nexus_db</span>
        </div>

        {isDbOpen && (
          <div className="pl-4 space-y-1 mt-1 border-l border-[#172640]">
            <div
              onClick={() => setIsPublicOpen(!isPublicOpen)}
              className="flex items-center gap-1.5 text-slate-400 font-medium cursor-pointer hover:text-slate-200"
            >
              {isPublicOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>public</span>
            </div>

            {isPublicOpen && (
              <div className="pl-4 space-y-1 mt-1 border-l border-[#172640]">
                {filteredTables.map((tbl) => (
                  <div
                    key={tbl.name}
                    onClick={() => setSelectedTable(tbl.name)}
                    className={\`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors \${
                      selectedTable === tbl.name
                        ? 'bg-[#0f1f38] text-[#00e5ff] font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1527]'
                    }\`}
                  >
                    <Table2 className="w-3 h-3 text-slate-400" />
                    <span>{tbl.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Relationships Visualizer (ERD Diagram) */}
      <div className="p-3 border-t border-[#142036] space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Link2 className="w-3 h-3 text-[#00e5ff]" />
          <span>Relationships</span>
        </div>

        <div className="space-y-2">
          {/* Card: customers */}
          <div className="p-2 rounded bg-[#070c17] border border-[#172742] text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-[#121f36] pb-1">
              <span>customers</span>
              <span className="text-[9px] text-slate-500">TABLE</span>
            </div>
            <div className="space-y-0.5 text-slate-400 text-[10px]">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-amber-400" /> id</span>
                <span className="text-[9px] text-slate-500 font-sans">PK</span>
              </div>
              <div>name</div>
              <div>email</div>
              <div>created_at</div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-1">
            <div className="w-0.5 h-2.5 bg-[#0284c7]/70"></div>
          </div>

          {/* Card: orders */}
          <div className="p-2 rounded bg-[#070c17] border border-[#0284c7]/50 text-[11px] font-mono space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-[#121f36] pb-1">
              <span>orders</span>
              <span className="text-[9px] text-[#00e5ff]">TARGET</span>
            </div>
            <div className="space-y-0.5 text-slate-400 text-[10px]">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-amber-400" /> id</span>
                <span className="text-[9px] text-slate-500 font-sans">PK</span>
              </div>
              <div className="flex items-center justify-between text-sky-400">
                <span>customer_id</span>
                <span className="text-[9px] text-slate-500 font-sans">FK</span>
              </div>
              <div>status</div>
              <div>total_amount</div>
              <div>created_at</div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-1">
            <div className="w-0.5 h-2.5 bg-[#0284c7]/70"></div>
          </div>

          {/* Card: payments */}
          <div className="p-2 rounded bg-[#070c17] border border-[#172742] text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-[#121f36] pb-1">
              <span>payments</span>
            </div>
            <div className="space-y-0.5 text-slate-400 text-[10px]">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-amber-400" /> id</span>
                <span className="text-[9px] text-slate-500 font-sans">PK</span>
              </div>
              <div className="flex items-center justify-between text-sky-400">
                <span>order_id</span>
                <span className="text-[9px] text-slate-500 font-sans">FK</span>
              </div>
              <div>amount</div>
              <div>status</div>
              <div>created_at</div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-1">
            <div className="w-0.5 h-2.5 bg-[#0284c7]/70"></div>
          </div>

          {/* Card: transactions */}
          <div className="p-2 rounded bg-[#070c17] border border-[#172742] text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-[#121f36] pb-1">
              <span>transactions</span>
              <span className="text-[9px] text-rose-400 font-sans">NULL ANOMALY</span>
            </div>
            <div className="space-y-0.5 text-slate-400 text-[10px]">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-amber-400" /> id</span>
                <span className="text-[9px] text-slate-500 font-sans">PK</span>
              </div>
              <div className="flex items-center justify-between text-sky-400">
                <span>payment_id</span>
                <span className="text-[9px] text-slate-500 font-sans">FK</span>
              </div>
              <div>status</div>
              <div>amount</div>
              <div>created_at</div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center -my-1">
            <div className="w-0.5 h-2.5 bg-[#0284c7]/70"></div>
          </div>

          {/* Card: refunds */}
          <div className="p-2 rounded bg-[#070c17] border border-[#172742] text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-[#121f36] pb-1">
              <span>refunds</span>
            </div>
            <div className="space-y-0.5 text-slate-400 text-[10px]">
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1"><Key className="w-2.5 h-2.5 text-amber-400" /> id</span>
                <span className="text-[9px] text-slate-500 font-sans">PK</span>
              </div>
              <div className="flex items-center justify-between text-sky-400">
                <span>transaction_id</span>
                <span className="text-[9px] text-slate-500 font-sans">FK</span>
              </div>
              <div>amount</div>
              <div>status</div>
              <div>created_at</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`, 'utf8');

console.log('DatabaseExplorer.tsx created.');
