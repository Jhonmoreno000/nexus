import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Database, Key, Link2, Code, X, Search, Filter, Expand } from 'lucide-react';
import { SchemaTable } from '../../types';

interface ErdStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  schema: SchemaTable[];
  selectedTable: string | null;
  onSelectTable?: (name: string) => void;
  onInsertQuery?: (sql: string) => void;
  positions: Record<string, {x: number, y: number}>;
  onPositionsChange: (positions: Record<string, {x: number, y: number}>) => void;
}

const getColumnY = (tableCols: any[], columnName: string) => {
  const idx = tableCols.findIndex((c) => c.name === columnName);
  if (idx === -1) return 56;
  return 56 + (idx * 36);
};

export const ErdStudioModal: React.FC<ErdStudioModalProps> = ({
  isOpen,
  onClose,
  schema,
  selectedTable: parentSelectedTable,
  onSelectTable,
  onInsertQuery,
  positions,
  onPositionsChange
}) => {
  const [activeTab, setActiveTab] = useState<'erd' | 'list'>('erd');
  const [localSelectedTable, setLocalSelectedTable] = useState<string | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [activeDraggingTable, setActiveDraggingTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedTable = parentSelectedTable || localSelectedTable;

  const handleSelectTable = (name: string) => {
    setLocalSelectedTable(name);
    onSelectTable?.(name);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<{ table: string; startX: number; startY: number } | null>(null);

  const { tableConfigs, relations } = useMemo(() => {
    const configs: Record<string, any> = {};
    const rels: any[] = [];

    schema.forEach((t) => {
      configs[t.name] = {
        name: t.name,
        width: 220,
        columns: t.columns,
        badge: {
          text: 'TABLE',
          bg: 'bg-white/5',
          textCol: 'text-slate-300',
          border: 'border-white/10'
        }
      };

      t.columns.forEach(c => {
        if (c.isFk && c.fkRef) {
          const [targetTable, targetCol] = c.fkRef.split('.');
          rels.push({
            id: `${targetTable}_${t.name}_${c.name}`,
            from: targetTable,
            fromCol: targetCol || 'id',
            to: t.name,
            toCol: c.name
          });
        }
      });
    });

    return { tableConfigs: configs, relations: rels };
  }, [schema]);

  const handleTableMouseDown = (tableId: string, e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = {
      table: tableId,
      startX: e.clientX - (positions[tableId]?.x || 0),
      startY: e.clientY - (positions[tableId]?.y || 0)
    };
    setActiveDraggingTable(tableId);
    handleSelectTable(tableId);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const { table, startX, startY } = isDraggingRef.current;
      onPositionsChange({
        ...positions,
        [table]: {
          x: e.clientX - startX,
          y: e.clientY - startY
        }
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = null;
      setActiveDraggingTable(null);
    };

    if (activeDraggingTable) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDraggingTable, positions, onPositionsChange]);

  const isWireActive = (source: string, target: string) => {
    return hoveredTable === source || hoveredTable === target || selectedTable === source || selectedTable === target;
  };

  const calculateCables = () => {
    return relations.map((rel) => {
      const p1 = positions[rel.from];
      const p2 = positions[rel.to];
      
      if (!p1 || !p2) return null;

      const y1 = p1.y + getColumnY(tableConfigs[rel.from].columns, rel.fromCol);
      const y2 = p2.y + getColumnY(tableConfigs[rel.to].columns, rel.toCol);

      const isBToRight = p2.x > p1.x;
      const isDirectlyBelow = p2.x === p1.x && p2.y > p1.y;

      let pA, pB, c1, c2;
      const active = isWireActive(rel.from, rel.to);

      if (isBToRight) {
        pA = { x: p1.x + tableConfigs[rel.from].width, y: y1 };
        pB = { x: p2.x, y: y2 };
        const offset = Math.max(60, Math.abs(pB.x - pA.x) * 0.5);
        c1 = { x: pA.x + offset, y: pA.y };
        c2 = { x: pB.x - offset, y: pB.y };
      } else if (isDirectlyBelow) {
        pA = { x: p1.x + tableConfigs[rel.from].width, y: y1 };
        pB = { x: p2.x, y: y2 };
        c1 = { x: pA.x + 80, y: pA.y };
        c2 = { x: pB.x - 80, y: pB.y };
      } else {
        pA = { x: p1.x, y: y1 };
        pB = { x: p2.x + tableConfigs[rel.to].width, y: y2 };
        const offset = Math.max(60, Math.abs(pA.x - pB.x) * 0.5);
        c1 = { x: pA.x - offset, y: pA.y };
        c2 = { x: pB.x + offset, y: pB.y };
      }

      return {
        id: rel.id,
        path: `M ${pA.x} ${pA.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${pB.x} ${pB.y}`,
        pA,
        pB,
        active,
        midX: (pA.x + pB.x) / 2,
        midY: (pA.y + pB.y) / 2,
        label: '1:N'
      };
    }).filter(Boolean);
  };

  if (!isOpen) return null;

  const cables = calculateCables();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl h-[90vh] bg-[#111622]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/20">
        
        <div className="px-6 py-5 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">ERD Studio</h2>
              <p className="text-xs text-slate-400 font-medium">Interactive Relational Sandbox</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-3 bg-black/20 border-b border-white/5 text-sm shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('erd')}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                activeTab === 'erd'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              Interactive ERD
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              Schema List
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
            <button className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#0a0e17] flex items-stretch">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div ref={containerRef} className="flex-1 relative overflow-auto custom-scrollbar">
            
            <svg className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-none z-10">
              <defs>
                <filter id="erd-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {cables.map((cable: any) => {
                const strokeColor = cable.active ? '#3b82f6' : 'rgba(255,255,255,0.15)';
                const pathWidth = cable.active ? '3' : '2';
                const opacity = cable.active ? 1 : 0.4;

                return (
                  <g key={cable.id} className="transition-opacity duration-200" style={{ opacity }}>
                    <path
                      d={cable.path}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={pathWidth}
                      strokeOpacity="0.5"
                    />
                    {cable.active && (
                      <path
                        d={cable.path}
                        fill="none"
                        stroke="#93c5fd"
                        strokeWidth="2.5"
                        className="particle-line"
                      />
                    )}
                    <circle cx={cable.pA.x} cy={cable.pA.y} r="4" fill="#1e293b" stroke={strokeColor} strokeWidth="2" />
                    <circle cx={cable.pA.x} cy={cable.pA.y} r="1.5" fill="#ffffff" />
                    <circle cx={cable.pB.x} cy={cable.pB.y} r="4" fill="#1e293b" stroke={strokeColor} strokeWidth="2" />
                    <circle cx={cable.pB.x} cy={cable.pB.y} r="1.5" fill="#ffffff" />
                    <g transform={`translate(${cable.midX}, ${cable.midY})`}>
                      <rect
                        x="-22"
                        y="-11"
                        width="44"
                        height="22"
                        rx="11"
                        fill="#1e293b"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.8"
                      />
                      <text
                        x="0"
                        y="4"
                        fill="#cbd5e1"
                        fontSize="10"
                        fontFamily="sans-serif"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {cable.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {Object.entries(tableConfigs).map(([key, config]: [string, any]) => {
              const pos = positions[key] || {x: 0, y: 0};
              const isSelected = selectedTable === key;
              const isHovered = hoveredTable === key;
              const isDragging = activeDraggingTable === key;

              if (searchTerm && !key.toLowerCase().includes(searchTerm.toLowerCase())) return null;

              return (
                <div
                  key={key}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    width: `${config.width}px`,
                    willChange: 'transform'
                  }}
                  onMouseEnter={() => setHoveredTable(key)}
                  onMouseLeave={() => setHoveredTable(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTable(key);
                  }}
                  className={`absolute z-20 rounded-2xl border font-sans text-xs shadow-lg backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-200 select-none ${
                    isDragging
                      ? 'shadow-2xl shadow-black/50 ring-2 ring-blue-500 border-blue-500 bg-[#1e293b]/95 scale-[1.02]'
                      : isSelected
                      ? 'shadow-xl shadow-blue-900/20 border-blue-500 ring-1 ring-blue-500/50 bg-[#1e293b]/90'
                      : isHovered
                      ? 'border-slate-600/50 bg-[#1e293b]/85'
                      : 'border-white/10 bg-[#161f30]/80'
                  }`}
                >
                  <div
                    onMouseDown={(e) => handleTableMouseDown(key, e)}
                    className={`px-4 py-3 border-b rounded-t-2xl flex items-center justify-between cursor-grab active:cursor-grabbing transition-colors ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                      <span className={`text-sm tracking-tight ${isSelected ? 'text-white font-semibold' : 'text-slate-200 font-medium'}`}>
                        {config.name}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border tracking-wide uppercase ${config.badge.bg} ${config.badge.textCol} ${config.badge.border}`}
                    >
                      {config.badge.text}
                    </span>
                  </div>

                  <div className="p-2 space-y-0.5">
                    {config.columns.map((col: any) => (
                      <div
                        key={col.name}
                        className={`group flex items-center justify-between text-[11px] px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-white/5 ${
                          col.isPk
                            ? 'text-amber-400 font-medium'
                            : col.isFk
                            ? 'text-blue-400 font-medium'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {col.isPk ? (
                            <Key className="w-3.5 h-3.5 text-amber-400 opacity-90 shrink-0" />
                          ) : col.isFk ? (
                            <Link2 className="w-3.5 h-3.5 text-blue-400 opacity-90 shrink-0" />
                          ) : (
                            <div className="w-3.5 flex justify-center shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500/70"></span>
                            </div>
                          )}
                          <span className="truncate max-w-[100px] text-sm tracking-tight">{col.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-medium tracking-wide opacity-80 ${
                            col.isPk
                              ? 'text-amber-400'
                              : col.isFk
                              ? 'text-blue-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm font-medium">Selected Table:</span>
            {selectedTable ? (
              <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-sm border border-blue-500/20">
                {selectedTable}
              </span>
            ) : (
              <span className="text-slate-500 italic text-sm">None</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if(selectedTable) onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`);
                onClose();
              }}
              disabled={!selectedTable}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Code className="w-4 h-4" />
              <span>Query in Editor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};