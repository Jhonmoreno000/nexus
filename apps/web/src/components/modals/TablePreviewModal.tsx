import React, { useState, useEffect } from 'react';
import { X, Table2, Key, Link2, Database, Code, Eye } from 'lucide-react';
import { SchemaTable } from '../../types';

interface TablePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string | null;
  schema: SchemaTable[];
  missionId?: string;
  onInsertQuery?: (sql: string) => void;
}

export const TablePreviewModal: React.FC<TablePreviewModalProps> = ({
  isOpen,
  onClose,
  tableName,
  schema,
  missionId = '1842',
  onInsertQuery
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'sample'>('schema');
  const [sampleRows, setSampleRows] = useState<any[]>([]);
  const [sampleCols, setSampleCols] = useState<string[]>([]);
  const [loadingSample, setLoadingSample] = useState(false);

  const table = schema.find((t) => t.name.toLowerCase() === tableName?.toLowerCase());

  useEffect(() => {
    if (isOpen && tableName) {
      setActiveTab('schema');
      setLoadingSample(true);
      fetch(`/api/missions/${missionId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: `SELECT * FROM ${tableName} LIMIT 5;` })
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.rows) {
            setSampleRows(data.rows);
            setSampleCols(data.columns || []);
          } else {
            setSampleRows([]);
            setSampleCols([]);
          }
          setLoadingSample(false);
        })
        .catch(() => {
          setLoadingSample(false);
        });
    }
  }, [isOpen, tableName, missionId]);

  if (!isOpen || !tableName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header with Subtle Gradient */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Table2 className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono">public.{tableName}</h2>
              <p className="text-[11px] text-slate-400">PostgreSQL Staging Ledger Table</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-950/60 border-b border-slate-800/60 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeTab === 'schema'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Table Schema ({table?.columns.length || 0} Columns)</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-all ${
              activeTab === 'sample'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Sample Records (5 Rows)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-auto text-xs font-mono flex-1">
          {activeTab === 'schema' && (
            <div>
              {table ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800/60">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-[11px]">Column Name</th>
                      <th className="px-3 py-2 font-semibold text-[11px]">Data Type</th>
                      <th className="px-3 py-2 font-semibold text-[11px]">Key / Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {table.columns.map((c) => (
                      <tr key={c.name} className="hover:bg-slate-800/25 transition-colors">
                        <td className="px-3 py-2 text-slate-200 font-medium flex items-center gap-1.5">
                          {c.isPk ? (
                            <Key className="w-3 h-3 text-amber-400" />
                          ) : c.isFk ? (
                            <Link2 className="w-3 h-3 text-sky-400" />
                          ) : (
                            <span className="w-3 h-3 text-slate-600 text-center">-</span>
                          )}
                          <span className={c.isPk ? 'text-amber-300' : c.isFk ? 'text-sky-300' : ''}>
                            {c.name}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-300">{c.type}</td>
                        <td className="px-3 py-2 text-slate-400">
                          {c.isPk ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/20 text-[10px]">
                              PRIMARY KEY
                            </span>
                          ) : c.isFk ? (
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 font-medium border border-sky-500/20 text-[10px]">
                              FK &rarr; {c.fkRef}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">NULLABLE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-400">Table schema definition not found.</p>
              )}
            </div>
          )}

          {activeTab === 'sample' && (
            <div>
              {loadingSample ? (
                <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
                  <Database className="w-4 h-4 text-sky-400 animate-spin" />
                  <span>Loading PostgreSQL 16 rows...</span>
                </div>
              ) : sampleRows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800/60">
                      <tr>
                        {sampleCols.map((c) => (
                          <th key={c} className="px-3 py-2 font-semibold text-[11px] whitespace-nowrap">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {sampleRows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/25 transition-colors">
                          {sampleCols.map((c) => {
                            const val = row[c];
                            const isNull = val === null || val === undefined;
                            return (
                              <td key={c} className="px-3 py-2 whitespace-nowrap">
                                {isNull ? (
                                  <span className="text-slate-500 italic">NULL</span>
                                ) : (
                                  <span className="text-slate-200">{String(val)}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-8">No sample records found in this table.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onInsertQuery?.(`SELECT * FROM ${tableName} LIMIT 25;`);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 text-sky-300 border border-slate-700/50 text-xs font-medium transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Load SELECT in Editor</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
