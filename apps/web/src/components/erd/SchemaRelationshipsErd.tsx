import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Database, Key, Link2, ExternalLink, Code, Maximize2, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { SchemaTable } from '../../types';

interface SchemaRelationshipsErdProps {
  schema: SchemaTable[];
  selectedTable: string | null;
  onSelectTable: (name: string) => void;
  onTablePreview?: (name: string) => void;
  onInsertQuery?: (sql: string) => void;
  onOpenStudio?: () => void;
  positions: Record<string, {x: number, y: number}>;
  onPositionsChange: (positions: Record<string, {x: number, y: number}>) => void;
}

const getColumnY = (tableCols: string[], columnName: string) => {
  const idx = tableCols.indexOf(columnName);
  if (idx === -1) return 50;
  return 50 + (idx * 32);
};

const ColumnRow = ({ name, type, isPk = false, isFk = false, isLast = false }: { name: string, type: string, isPk?: boolean, isFk?: boolean, isLast?: boolean }) => (
  <div className={`flex items-center justify-between py-2 px-4 group ${!isLast ? 'border-b border-white/[0.05]' : ''}`}>
    <div className="flex items-center gap-2.5 truncate">
      {isPk ? (
        <Key className="w-4 h-4 text-amber-400 opacity-90 shrink-0" />
      ) : isFk ? (
        <Link2 className="w-4 h-4 text-blue-400 opacity-90 shrink-0" />
      ) : (
        <div className="w-4 flex justify-center shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span></div>
      )}
      <span className={`text-[13px] tracking-tight truncate max-w-[110px] ${isPk ? 'text-amber-400 font-bold' : isFk ? 'text-blue-400 font-semibold' : 'text-slate-200 font-medium'}`}>
        {name}
      </span>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{type}</span>
    </div>
  </div>
);

export const SchemaRelationshipsErd: React.FC<SchemaRelationshipsErdProps> = ({
  schema,
  selectedTable,
  onSelectTable,
  onTablePreview,
  onInsertQuery,
  onOpenStudio,
  positions,
  onPositionsChange
}) => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  
  // Use CSS Transform Scale to proportionally scale everything without overlapping!
  const [zoom, setZoom] = useState(0.5); 
  
  const [activeDraggingTable, setActiveDraggingTable] = useState<string | null>(null);
  const isDraggingRef = useRef<{ table: string; startX: number; startY: number } | null>(null);
  
  // Add panning state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{ startX: number, startY: number, initialPanX: number, initialPanY: number } | null>(null);

  // Exact same width as Studio to keep everything mathematically 1:1
  const CARD_WIDTH = 220; 

  const { tableConfigs, relations } = useMemo(() => {
    const configs: Record<string, { columns: string[] }> = {};
    const rels: any[] = [];

    schema.forEach((t) => {
      configs[t.name] = {
        columns: t.columns.map(c => c.name)
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
    e.stopPropagation();
    isDraggingRef.current = {
      table: tableId,
      startX: e.clientX / zoom - (positions[tableId]?.x || 0),
      startY: e.clientY / zoom - (positions[tableId]?.y || 0)
    };
    setActiveDraggingTable(tableId);
    onSelectTable(tableId);
  };
  
  const handleBgMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
    setIsPanning(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && activeDraggingTable) {
        const { table, startX, startY } = isDraggingRef.current;
        onPositionsChange({
          ...positions,
          [table]: {
            x: e.clientX / zoom - startX,
            y: e.clientY / zoom - startY
          }
        });
      } else if (panRef.current && isPanning) {
        setPan({
          x: panRef.current.initialPanX + (e.clientX - panRef.current.startX),
          y: panRef.current.initialPanY + (e.clientY - panRef.current.startY)
        });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = null;
      panRef.current = null;
      setActiveDraggingTable(null);
      setIsPanning(false);
    };

    if (activeDraggingTable || isPanning) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDraggingTable, isPanning, zoom, positions, onPositionsChange, pan]);

  const isWireActive = (source: string, target: string) => {
    return hoveredTable === source || hoveredTable === target || selectedTable === source || selectedTable === target;
  };

  const cables = useMemo(() => {
    return relations.map(rel => {
      const p1 = positions[rel.from];
      const p2 = positions[rel.to];
      if (!p1 || !p2) return null;

      const y1 = p1.y + getColumnY(tableConfigs[rel.from].columns, rel.fromCol);
      const y2 = p2.y + getColumnY(tableConfigs[rel.to].columns, rel.toCol);

      const isBToRight = p2.x > p1.x;
      const isDirectlyBelow = p2.x === p1.x && p2.y > p1.y;

      let pA, pB, c1, c2;

      if (isBToRight) {
        pA = { x: p1.x + CARD_WIDTH, y: y1 };
        pB = { x: p2.x, y: y2 };
        const offset = Math.max(50, Math.abs(pB.x - pA.x) * 0.5);
        c1 = { x: pA.x + offset, y: pA.y };
        c2 = { x: pB.x - offset, y: pB.y };
      } else if (isDirectlyBelow) {
        pA = { x: p1.x + CARD_WIDTH, y: y1 };
        pB = { x: p2.x, y: y2 };
        c1 = { x: pA.x + 50, y: pA.y };
        c2 = { x: pB.x - 50, y: pB.y };
      } else {
        pA = { x: p1.x, y: y1 };
        pB = { x: p2.x + CARD_WIDTH, y: y2 };
        const offset = Math.max(50, Math.abs(pA.x - pB.x) * 0.5);
        c1 = { x: pA.x - offset, y: pA.y };
        c2 = { x: pB.x + offset, y: pB.y };
      }

      return {
        id: rel.id,
        path: `M ${pA.x} ${pA.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${pB.x} ${pB.y}`,
        pA, pB,
        active: isWireActive(rel.from, rel.to),
        color: isWireActive(rel.from, rel.to) ? '#3b82f6' : 'rgba(255,255,255,0.15)'
      };
    }).filter(Boolean);
  }, [hoveredTable, selectedTable, positions, relations, tableConfigs]);

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] rounded-[1.5rem] border border-white/5 overflow-hidden font-sans shadow-lg relative group">
      
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#111622] border-b border-white/5 flex items-center justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-blue-400" />
          <h3 className="text-[13px] font-semibold text-white tracking-tight">Mini ERD</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex bg-black/40 rounded-full border border-white/5 p-0.5 mr-1">
            <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.2))} className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all text-[11px] font-bold shadow-md shadow-blue-500/20 active:scale-95"
            title="Open ERD Studio"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
        </div>
      </div>

      {/* Panning Container */}
      <div 
        className={`flex-1 relative overflow-hidden bg-[#0a0e17] ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleBgMouseDown}
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px', transform: `translate(${pan.x}px, ${pan.y}px)` }}></div>
        
        {/* CSS Scaled Wrapper */}
        <div 
          className="relative origin-top-left transition-transform duration-75" 
          style={{ 
            width: '3000px', 
            height: '3000px', 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` 
          }}
        >
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {cables.map((cable: any) => (
              <g key={cable.id} className="transition-opacity duration-300" style={{ opacity: cable.active ? 1 : 0.7 }}>
                <path d={cable.path} fill="none" stroke={cable.color} strokeWidth={cable.active ? '4' : '2.5'} />
                {cable.active && (
                  <path d={cable.path} fill="none" stroke="#93c5fd" strokeWidth="4" className="particle-line" />
                )}
                <circle cx={cable.pA.x} cy={cable.pA.y} r={cable.active ? 6 : 4} fill="#1e293b" stroke={cable.color} strokeWidth={cable.active ? 3 : 2} />
                <circle cx={cable.pB.x} cy={cable.pB.y} r={cable.active ? 6 : 4} fill="#1e293b" stroke={cable.color} strokeWidth={cable.active ? 3 : 2} />
              </g>
            ))}
          </svg>

          {schema.map(table => {
            const pos = positions[table.name] || {x: 0, y: 0};
            const isSelected = selectedTable === table.name;
            const isHovered = hoveredTable === table.name;
            const isDragging = activeDraggingTable === table.name;

            let cardClasses = 'bg-[#161f30] border-white/10 shadow-lg';
            if (isDragging) cardClasses = 'bg-[#1e293b] border-blue-500 shadow-2xl ring-2 ring-blue-500 scale-[1.02] z-50';
            else if (isSelected) cardClasses = 'bg-[#1e293b] border-blue-500 shadow-xl ring-1 ring-blue-500/50 z-40';
            else if (isHovered) cardClasses = 'bg-[#1e293b] border-slate-500/60 z-30 shadow-md';

            return (
              <div
                key={table.name}
                onMouseEnter={() => setHoveredTable(table.name)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{ 
                  left: pos.x, 
                  top: pos.y, 
                  width: CARD_WIDTH,
                  willChange: 'transform, left, top'
                }}
                className={`absolute rounded-2xl border transition-colors duration-200 ${cardClasses}`}
              >
                <div 
                  onMouseDown={(e) => handleTableMouseDown(table.name, e)}
                  className={`px-4 py-3 border-b rounded-t-2xl text-[15px] font-bold flex items-center justify-between cursor-grab active:cursor-grabbing ${isSelected ? 'bg-blue-500 text-white border-blue-600' : 'bg-[#1a2335] border-white/5 text-slate-200'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Move className={`w-4 h-4 ${isSelected ? 'text-blue-200' : 'text-slate-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <span>{table.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-col bg-[#0f1523] rounded-b-2xl overflow-hidden py-1.5">
                  {table.columns.map((col, idx) => (
                    <ColumnRow key={col.name} name={col.name} type={col.type} isPk={col.isPk} isFk={col.isFk} isLast={idx === table.columns.length - 1} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTable && (
        <div className="px-5 py-3 bg-[#111622]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 text-[12px] font-bold text-white tracking-tight">
            <div className="w-1.5 h-3.5 bg-blue-500 rounded-full"></div>
            <span>{selectedTable}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onTablePreview?.(selectedTable)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-semibold border border-white/5 active:scale-95">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>
            <button onClick={() => onInsertQuery?.(`SELECT * FROM ${selectedTable} LIMIT 25;`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-semibold transition-all shadow-md active:scale-95 shadow-blue-500/20">
              <Code className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};