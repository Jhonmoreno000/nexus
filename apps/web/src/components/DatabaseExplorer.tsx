import React, { useState, useEffect } from 'react';
import { Database, Search, ChevronRight, ChevronDown, Key, Link2, Code, Table2 } from 'lucide-react';
import { SchemaTable } from '../types';
import { ErdStudioModal } from './modals/ErdStudioModal';
import { SchemaRelationshipsErd } from './erd/SchemaRelationshipsErd';

interface DatabaseExplorerProps {
  schema: SchemaTable[];
  onInsertQuery?: (sql: string) => void;
  onTablePreview?: (tableName: string) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  schema,
  onInsertQuery,
  onTablePreview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [isDbOpen, setIsDbOpen] = useState(true);
  const [isPublicOpen, setIsPublicOpen] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  
  // Shared state for table positions
  const [schemaPositions, setSchemaPositions] = useState<Record<string, {x: number, y: number}>>({});

  useEffect(() => {
    // Generate a beautiful "snake" layout that fits narrow sidebars
    const pos: Record<string, { x: number, y: number }> = {};
    schema.forEach((t, i) => {
      // 2 columns per row
      const col = i % 2;
      const row = Math.floor(i / 2);
      pos[t.name] = {
        x: 40 + col * 320,
        y: 40 + row * 240
      };
    });
    setSchemaPositions(pos);
  }, [schema]);

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
    <div className="h-full flex flex-col bg-[#0a0e17] border-l border-white/5 overflow-y-auto select-none font-sans">
      <div className="p-4 border-b border-white/5 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <span className="tracking-tight">Database Explorer</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            PostgreSQL 16
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tables or columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111622] border border-white/10 rounded-xl pl-9 pr-6 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="p-4 space-y-1 text-sm font-medium shrink-0">
        <div
          onClick={() => setIsDbOpen(!isDbOpen)}
          className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white transition-colors"
        >
          {isDbOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
          <Database className="w-4 h-4 text-blue-400 opacity-80" />
          <span>nexus_db</span>
        </div>

        {isDbOpen && (
          <div className="pl-5 space-y-1 mt-2 border-l border-white/10 ml-2">
            <div
              onClick={() => setIsPublicOpen(!isPublicOpen)}
              className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white"
            >
              {isPublicOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>public</span>
            </div>

            {isPublicOpen && (
              <div className="pl-4 space-y-1 mt-2 border-l border-white/10 ml-2">
                {filteredTables.map((tbl) => {
                  const isExpanded = expandedTables[tbl.name] || false;
                  const isSelected = selectedTable === tbl.name;

                  return (
                    <div key={tbl.name} className="space-y-1">
                      <div
                        onClick={() => {
                          setSelectedTable(tbl.name);
                          onTablePreview?.(tbl.name);
                        }}
                        className={`group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <button
                            onClick={(e) => toggleTableExpand(tbl.name, e)}
                            className="p-0.5"
                          >
                            {isExpanded ? (
                              <ChevronDown className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                            ) : (
                              <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                            )}
                          </button>
                          <Table2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-400 opacity-80'}`} />
                          <span className="truncate tracking-tight">{tbl.name}</span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertQuery?.(`SELECT * FROM ${tbl.name} LIMIT 10;`);
                            }}
                            className={`p-1 rounded-md ${isSelected ? 'hover:bg-blue-600' : 'hover:bg-white/10'}`}
                          >
                            <Code className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="pl-7 pr-3 py-1.5 space-y-1 text-xs bg-black/20 rounded-xl border-l border-white/5 ml-3">
                          {tbl.columns.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center justify-between py-1 text-slate-400"
                            >
                              <div className="flex items-center gap-2 truncate">
                                {col.isPk ? (
                                  <Key className="w-3 h-3 text-amber-400 shrink-0 opacity-90" />
                                ) : col.isFk ? (
                                  <Link2 className="w-3 h-3 text-blue-400 shrink-0 opacity-90" />
                                ) : (
                                  <div className="w-3 flex justify-center">
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                  </div>
                                )}
                                <span className={`${col.isPk ? 'text-amber-400 font-semibold' : col.isFk ? 'text-blue-400 font-medium' : 'text-slate-300'}`}>
                                  {col.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{col.type}</span>
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

      <div className="p-4 border-t border-white/5 space-y-3 flex-1 min-h-[300px]">
        <SchemaRelationshipsErd
          schema={schema}
          selectedTable={selectedTable}
          onSelectTable={(name) => setSelectedTable(name)}
          onTablePreview={onTablePreview}
          onInsertQuery={onInsertQuery}
          onOpenStudio={() => setIsStudioOpen(true)}
          positions={schemaPositions}
          onPositionsChange={setSchemaPositions}
        />
      </div>

      <ErdStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        schema={schema}
        selectedTable={selectedTable}
        onSelectTable={(name) => setSelectedTable(name)}
        onInsertQuery={onInsertQuery}
        positions={schemaPositions}
        onPositionsChange={setSchemaPositions}
      />
    </div>
  );
};