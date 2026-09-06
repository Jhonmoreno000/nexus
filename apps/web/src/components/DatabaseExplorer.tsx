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
  Code
} from 'lucide-react';
import { SchemaTable } from '../types';
import { SchemaRelationshipsErd } from './erd/SchemaRelationshipsErd';
import { ErdStudioModal } from './modals/ErdStudioModal';

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
    orders: false,
    payments: false
  });
  const [selectedTable, setSelectedTable] = useState<string>('orders');
  const [isStudioOpen, setIsStudioOpen] = useState(false);

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

  return (
    <div className="h-full flex flex-col bg-[#080d19] border-l border-[#15233d] overflow-y-auto select-none font-sans">
      {/* Header matching Mockup */}
      <div className="p-3 border-b border-[#142036] space-y-2.5 bg-[#060a14] shrink-0">
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
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070c17] border border-[#172742] rounded-lg pl-8 pr-6 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00e5ff] transition-colors font-mono"
          />
          <span className="absolute right-2.5 top-2 text-[10px] text-slate-500 font-mono">⌘</span>
        </div>
      </div>

      {/* Schema Tree Section matching Mockup */}
      <div className="p-3 space-y-1 text-xs font-mono shrink-0">
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
            </div>

            {isPublicOpen && (
              <div className="pl-3 space-y-0.5 mt-1 border-l border-[#172640]">
                {filteredTables.map((tbl) => {
                  const isExpanded = expandedTables[tbl.name] || false;
                  const isSelected = selectedTable === tbl.name;

                  return (
                    <div key={tbl.name} className="space-y-0.5">
                      <div
                        onClick={() => {
                          setSelectedTable(tbl.name);
                          onTablePreview?.(tbl.name);
                        }}
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
                              <ChevronDown className="w-2.5 h-2.5 text-cyan-400" />
                            ) : (
                              <ChevronRight className="w-2.5 h-2.5 text-slate-500" />
                            )}
                          </button>
                          <Table2 className={`w-3 h-3 ${isSelected ? 'text-[#00e5ff]' : 'text-slate-500'}`} />
                          <span className="truncate">{tbl.name}</span>
                        </div>

                        {/* Action shortcuts */}
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertQuery?.(`SELECT * FROM ${tbl.name} LIMIT 10;`);
                            }}
                            title={`Paste SELECT * FROM ${tbl.name}`}
                            className="p-0.5 hover:text-cyan-300"
                          >
                            <Code className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Columns List */}
                      {isExpanded && (
                        <div className="pl-5 pr-1 py-1 space-y-0.5 text-[10px] bg-[#070b14]/50 rounded border-l border-[#192b4a]">
                          {tbl.columns.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center justify-between py-0.5 text-slate-400"
                            >
                              <div className="flex items-center gap-1 truncate">
                                {col.isPk ? (
                                  <Key className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                ) : col.isFk ? (
                                  <Link2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                ) : (
                                  <span className="text-slate-600 text-[8px] w-2.5 text-center">-</span>
                                )}
                                <span className={col.isPk ? 'text-amber-300 font-semibold' : col.isFk ? 'text-cyan-300' : ''}>
                                  {col.name}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-500 font-sans">{col.type}</span>
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

      {/* Relationships Section (Interactive ERD Diagram matching Mockup) */}
      <div className="p-3 border-t border-[#142036] space-y-2 flex-1">
        <SchemaRelationshipsErd
          schema={schema}
          selectedTable={selectedTable}
          onSelectTable={(name) => setSelectedTable(name)}
          onTablePreview={onTablePreview}
          onInsertQuery={onInsertQuery}
          onOpenStudio={() => setIsStudioOpen(true)}
        />
      </div>

      {/* Fullscreen ERD Studio Modal */}
      <ErdStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        schema={schema}
        onSelectTable={(name) => setSelectedTable(name)}
        onInsertQuery={onInsertQuery}
      />
    </div>
  );
};
