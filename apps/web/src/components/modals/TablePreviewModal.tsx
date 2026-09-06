import React from 'react';
import { X, Table2, Key } from 'lucide-react';
import { SchemaTable } from '../../types';

interface TablePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string | null;
  schema: SchemaTable[];
}

export const TablePreviewModal: React.FC<TablePreviewModalProps> = ({ isOpen, onClose, tableName, schema }) => {
  if (!isOpen || !tableName) return null;

  const table = schema.find((t) => t.name.toLowerCase() === tableName.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-lg bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Table2 className="w-4 h-4 text-[#00e5ff]" />
            <h2 className="text-sm font-bold text-white font-mono">public.{tableName} Schema</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs font-mono">
          {table ? (
            <div className="space-y-2">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#070c17] text-slate-400 border-b border-[#142036]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Column</th>
                    <th className="px-3 py-2 font-semibold">Data Type</th>
                    <th className="px-3 py-2 font-semibold">Constraint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10192a]">
                  {table.columns.map((c) => (
                    <tr key={c.name} className="hover:bg-[#0c1527]">
                      <td className="px-3 py-2 text-white font-semibold flex items-center gap-1.5">
                        {c.isPk && <Key className="w-3 h-3 text-amber-400" />}
                        <span>{c.name}</span>
                      </td>
                      <td className="px-3 py-2 text-cyan-300">{c.type}</td>
                      <td className="px-3 py-2 text-slate-400">
                        {c.isPk ? (
                          <span className="text-amber-400 font-bold">PRIMARY KEY</span>
                        ) : c.isFk ? (
                          <span className="text-sky-400 font-bold">FK &rarr; {c.fkRef}</span>
                        ) : (
                          <span className="text-slate-500">NULLABLE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400">Table schema not found.</p>
          )}
        </div>

        <div className="p-4 bg-[#060a14] border-t border-[#13233c] text-right">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
