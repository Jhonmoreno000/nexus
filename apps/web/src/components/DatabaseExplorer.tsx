import React, { useState } from 'react';
import {
  Database,
  Search,
  ChevronDown,
  ChevronRight,
  Table2,
  Key,
  Link2,
  ExternalLink,
  Code,
  Sparkles,
  Info
} from 'lucide-react';
import { SchemaTable } from '../types';

interface DatabaseExplorerProps {
  schema: SchemaTable[];
  onTablePreview?: (tableName: string) => void;
  onInsertQuery?: (sql: string) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  schema = [],
  onTablePreview,
  onInsertQuery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDbOpen, setIsDbOpen] = useState(true);
  const [isPublicOpen, setIsPublicOpen] = useState(true);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    orders: true,
    payments: true
  });
  const [selectedTable, setSelectedTable] = useState<string>('orders');
  const [hoveredRelation, setHoveredRelation] = useState<string | null>(null);

  const toggleTableExpand = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTables((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredTables = schema.filter((tbl) => {
    const matchesName = tbl.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCol = tbl.columns.some((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesName || matchesCol;
  });

  // Relationships defined in the incident schema
  const relationships = [
    {
      id: 'cust-orders',
      from: 'customers',
      fromCol: 'id',
      to: 'orders',
      toCol: 'customer_id',
      type: '1 : N',
      description: 'Customer owns multiple Orders'
    },
    {
      id: 'orders-payments',
      from: 'orders',
      fromCol: 'id',
      to: 'payments',
      toCol: 'order_id',
      type: '1 : N',
      description: 'Order can have multiple Payment attempts'
    },
    {
      id: 'payments-transactions',
      from: 'payments',
      fromCol: 'id',
      to: 'transactions',
      toCol: 'payment_id',
      type: '1 : 1',
      description: 'Payment settles into a Bank Transaction (Anomaly Site!)'
    },
    {
      id: 'transactions-refunds',
      from: 'transactions',
      fromCol: 'id',
      to: 'refunds',
      toCol: 'transaction_id',
      type: '1 : N',
      description: 'Transaction can initiate settlement Refunds'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#080d19] border-l border-[#15233d] overflow-y-auto select-none font-sans">
      {/* Header */}
      <div className="p-3 border-b border-[#142036] space-y-2.5 bg-[#060a14]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Database className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Database Explorer</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-[#0c1830] px-1.5 py-0.5 rounded border border-[#142d54]">
            PostgreSQL 16
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search tables and columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070c17] border border-[#172742] rounded-lg pl-8 pr-6 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors font-mono"
          />
          <span className="absolute right-2.5 top-2 text-[10px] text-slate-500 font-mono">⌘</span>
        </div>
      </div>

      {/* Schema Tree Section */}
      <div className="p-3 space-y-1 text-xs font-mono">
        <div
          onClick={() => setIsDbOpen(!isDbOpen)}
          className="flex items-center gap-1.5 text-slate-300 font-semibold cursor-pointer hover:text-white transition-colors"
        >
          {isDbOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>nexus_db</span>
        </div>

        {isDbOpen && (
          <div className="pl-4 space-y-1 mt-1 border-l border-[#172640]">
            <div
              onClick={() => setIsPublicOpen(!isPublicOpen)}
              className="flex items-center gap-1.5 text-slate-400 font-medium cursor-pointer hover:text-slate-200"
            >
              {isPublicOpen ? (
                <ChevronDown className="w-3 h-3 text-slate-300" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span className="text-slate-300">public</span>
              <span className="text-[10px] text-slate-500">({schema.length} tables)</span>
            </div>

            {isPublicOpen && (
              <div className="pl-3 space-y-1 mt-1 border-l border-[#172640]">
                {filteredTables.map((tbl) => {
                  const isExpanded = expandedTables[tbl.name] || false;
                  const isSelected = selectedTable === tbl.name;

                  return (
                    <div key={tbl.name} className="space-y-1">
                      <div
                        onClick={() => setSelectedTable(tbl.name)}
                        className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#0f213d] text-[#00e5ff] font-semibold border-l-2 border-[#00e5ff]'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1527]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <button
                            onClick={(e) => toggleTableExpand(tbl.name, e)}
                            className="p-0.5 hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3 h-3 text-cyan-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-500" />
                            )}
                          </button>
                          <Table2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00e5ff]' : 'text-slate-500'}`} />
                          <span className="truncate">{tbl.name}</span>
                        </div>

                        {/* Action shortcuts on hover */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTablePreview?.(tbl.name);
                            }}
                            title={`Preview ${tbl.name} Schema & Data`}
                            className="p-1 hover:text-cyan-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertQuery?.(`SELECT * FROM ${tbl.name} LIMIT 10;`);
                            }}
                            title={`Paste SELECT * FROM ${tbl.name}`}
                            className="p-1 hover:text-cyan-300"
                          >
                            <Code className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Columns List */}
                      {isExpanded && (
                        <div className="pl-6 pr-1 py-1 space-y-1 text-[11px] bg-[#070b14]/50 rounded border-l border-[#192b4a]">
                          {tbl.columns.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center justify-between py-0.5 text-slate-400 hover:text-slate-200"
                            >
                              <div className="flex items-center gap-1 truncate">
                                {col.isPk ? (
                                  <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                ) : col.isFk ? (
                                  <Link2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                ) : (
                                  <span className="w-2.5 h-2.5 inline-block text-[8px] text-slate-600 text-center">•</span>
                                )}
                                <span className={col.isPk ? 'text-amber-300' : col.isFk ? 'text-cyan-300' : ''}>
                                  {col.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] text-slate-500 font-sans">{col.type}</span>
                                {col.isPk && (
                                  <span className="text-[9px] px-1 rounded bg-amber-950/60 text-amber-400 font-sans border border-amber-800/50">
                                    PK
                                  </span>
                                )}
                                {col.isFk && (
                                  <span
                                    title={`References ${col.fkRef}`}
                                    className="text-[9px] px-1 rounded bg-cyan-950/60 text-cyan-400 font-sans border border-cyan-800/50"
                                  >
                                    FK
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Relationships Visualizer (Interactive ERD Diagram) */}
      <div className="p-3 border-t border-[#142036] space-y-3 bg-[#060a14]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Relationships (ERD)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">4 Foreign Keys</span>
        </div>

        {/* Dynamic Interactive Relationship Diagram Cards */}
        <div className="space-y-3">
          {schema.map((tbl, idx) => {
            const isTarget = tbl.name === 'orders';
            const isAnomaly = tbl.name === 'transactions';
            const isSelected = selectedTable === tbl.name;
            const outboundRel = relationships.find((r) => r.from === tbl.name);

            return (
              <div key={tbl.name} className="space-y-2">
                {/* Table Schema Card */}
                <div
                  onClick={() => {
                    setSelectedTable(tbl.name);
                    onTablePreview?.(tbl.name);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-mono shadow-md ${
                    isSelected
                      ? 'bg-[#0a1832] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                      : isTarget
                      ? 'bg-[#081224] border-[#0284c7]/60'
                      : isAnomaly
                      ? 'bg-[#140b17] border-rose-800/40'
                      : 'bg-[#070c17] border-[#162744] hover:border-[#0284c7]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#121f36] pb-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Table2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00e5ff]' : 'text-cyan-400'}`} />
                      <span className="font-bold text-white text-xs">{tbl.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isTarget && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-800/40">
                          TARGET
                        </span>
                      )}
                      {isAnomaly && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 font-bold border border-rose-800/40">
                          NULL ANOMALY
                        </span>
                      )}
                      <span className="text-[9px] text-slate-500 font-sans">
                        {tbl.columns.length} cols
                      </span>
                    </div>
                  </div>

                  {/* Columns List */}
                  <div className="space-y-1 text-[11px] text-slate-300">
                    {tbl.columns.map((col) => (
                      <div key={col.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {col.isPk ? (
                            <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          ) : col.isFk ? (
                            <Link2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                          ) : (
                            <span className="text-slate-600 text-[10px] w-2.5 text-center">-</span>
                          )}
                          <span className={col.isPk ? 'text-amber-300 font-semibold' : col.isFk ? 'text-cyan-300' : 'text-slate-300'}>
                            {col.name}
                          </span>
                        </div>

                        {col.isPk && (
                          <span className="text-[9px] text-amber-400/80 font-sans font-bold">PK</span>
                        )}
                        {col.isFk && (
                          <span className="text-[9px] text-cyan-400 font-sans font-bold">FK</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relational Connector Cable with Cardinality */}
                {outboundRel && (
                  <div
                    onMouseEnter={() => setHoveredRelation(outboundRel.id)}
                    onMouseLeave={() => setHoveredRelation(null)}
                    className="flex flex-col items-center justify-center -my-1 py-1 cursor-pointer group"
                    title={outboundRel.description}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-0.5 ${hoveredRelation === outboundRel.id ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#0284c7]/70'} transition-colors`}></div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#0b1b36] border border-[#17386d] text-cyan-300 font-mono">
                        {outboundRel.type} ({outboundRel.fromCol} &rarr; {outboundRel.toCol})
                      </span>
                      <div className={`h-4 w-0.5 ${hoveredRelation === outboundRel.id ? 'bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]' : 'bg-[#0284c7]/70'} transition-colors`}></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
