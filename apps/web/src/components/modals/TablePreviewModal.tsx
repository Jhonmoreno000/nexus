import React, { useState, useEffect } from 'react';
import { X, Table2, Key, Link2, Code, Eye, Database } from 'lucide-react';
import { SchemaTable } from '../../types';

interface TablePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string | null;
  schema: SchemaTable[];
  missionId: string;
  onInsertQuery?: (sql: string) => void;
}

export const TablePreviewModal: React.FC<TablePreviewModalProps> = ({
  isOpen,
  onClose,
  tableName,
  schema,
  missionId,
  onInsertQuery
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'sample'>('schema');
  const [sampleRows, setSampleRows] = useState<any[]>([]);
  const [sampleCols, setSampleCols] = useState<string[]>([]);
  const [loadingSample, setLoadingSample] = useState(false);

  useEffect(() => {
    if (!isOpen || !tableName) return;
    setActiveTab('schema');
    setSampleRows([]);
    setSampleCols([]);

    const fetchSample = async () => {
      setLoadingSample(true);
      try {
        const query = `SELECT * FROM ${tableName} LIMIT 5;`;
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ missionId, sql: query })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.rows) {
            setSampleRows(data.results.rows);
            setSampleCols(data.results.columns);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSample(false);
      }
    };

    fetchSample();
  }, [isOpen, tableName, missionId]);

  if (!isOpen || !tableName) return null;

  const table = schema.find((t) => t.name === tableName);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Window - iOS Native Style */}
      <div className="relative w-full max-w-2xl bg-[#111622]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-black/20">
        
        {/* Header */}
        <div className="px-6 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">public.{tableName}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">PostgreSQL Staging Ledger Table</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-black/20 border-b border-white/5 text-sm shrink-0">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'schema'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table2 className="w-4 h-4 opacity-80" />
            <span>Table Schema ({table?.columns.length || 0} Columns)</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-all ${
              activeTab === 'sample'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 opacity-80" />
            <span>Live Sample Records (5 Rows)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-auto text-[13px] flex-1">
          {activeTab === 'schema' && (
            <div>
              {table ? (
                <table className="w-full text-left border-collapse">
                  <thead className="text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Column Name</th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Data Type</th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Key / Constraints</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {table.columns.map((c) => (
                      <tr key={c.name} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-slate-200 font-semibold tracking-tight flex items-center gap-2.5">
                          {c.isPk ? (
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                          ) : c.isFk ? (
                            <Link2 className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <span className="w-3.5 h-3.5 text-slate-600 text-center flex items-center justify-center">-</span>
                          )}
                          <span className={c.isPk ? 'text-amber-400' : c.isFk ? 'text-blue-400' : 'text-slate-200'}>
                            {c.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{c.type}</td>
                        <td className="px-4 py-3">
                          {c.isPk ? (
                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px] uppercase tracking-wide">
                              PRIMARY KEY
                            </span>
                          ) : c.isFk ? (
                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 text-[10px] uppercase tracking-wide">
                              FK &rarr; {c.fkRef}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">NULLABLE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-slate-400 font-medium">Table schema definition not found.</p>
              )}
            </div>
          )}

          {activeTab === 'sample' && (
            <div>
              {loadingSample ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                  <Database className="w-6 h-6 text-blue-400 animate-pulse" />
                  <span className="font-medium tracking-tight">Loading PostgreSQL 16 rows...</span>
                </div>
              ) : sampleRows.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead className="bg-black/20 text-slate-400 border-b border-white/5">
                      <tr>
                        {sampleCols.map((c) => (
                          <th key={c} className="px-4 py-3 font-semibold whitespace-nowrap">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sampleRows.map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          {sampleCols.map((c) => {
                            const val = row[c];
                            const isNull = val === null || val === undefined;
                            return (
                              <td key={c} className="px-4 py-2.5 whitespace-nowrap">
                                {isNull ? (
                                  <span className="text-slate-500 italic font-medium">NULL</span>
                                ) : (
                                  <span className="text-slate-300">{String(val)}</span>
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
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Database className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-medium">No sample records found in this table.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              onInsertQuery?.(`SELECT * FROM ${tableName} LIMIT 25;`);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all active:scale-95"
          >
            <Code className="w-4 h-4 text-blue-400" />
            <span>Load SELECT in Editor</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-md shadow-blue-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};