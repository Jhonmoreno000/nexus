const fs = require('fs');

fs.writeFileSync('apps/web/src/components/MissionBriefing.tsx', `import React from 'react';
import { BookOpen, Table2 } from 'lucide-react';

interface Objective {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface MissionBriefingProps {
  context: string;
  objectives: Objective[];
  relatedTables: string[];
  activeObjectiveId: number;
  onObjectiveSelect: (id: number) => void;
  onTableClick?: (tableName: string) => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  context,
  objectives,
  relatedTables,
  activeObjectiveId,
  onObjectiveSelect,
  onTableClick
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#0a101f] border-r border-[#15233d] overflow-y-auto select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm border-b border-[#142036] pb-3">
          <BookOpen className="w-4 h-4 text-[#00e5ff]" />
          <span>Mission Briefing</span>
        </div>

        {/* Context */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Context</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {context}
          </p>
        </div>

        {/* Your Objectives */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Your Objectives</h3>
          <div className="space-y-2.5">
            {objectives.map((obj) => {
              const isSelected = activeObjectiveId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => onObjectiveSelect(obj.id)}
                  className={\`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer \${
                    isSelected
                      ? 'bg-[#0f1d36] border-[#0284c7]/60 shadow-sm'
                      : 'bg-[#080d19] border-[#15233d] hover:border-[#1e3357]'
                  }\`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={\`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 \${
                        obj.completed
                          ? 'bg-[#06b6d4] text-[#070b14]'
                          : isSelected
                          ? 'bg-[#0284c7] text-white'
                          : 'bg-[#142036] text-slate-400'
                      }\`}
                    >
                      {obj.id}
                    </div>
                    <div className="space-y-0.5">
                      <div className={\`text-xs font-semibold \${isSelected ? 'text-white' : 'text-slate-200'}\`}>
                        {obj.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Tables */}
      <div className="pt-4 border-t border-[#142036] space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Tables</h4>
          <span className="text-[10px] text-slate-500">Click to preview</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {relatedTables.map((tbl) => (
            <button
              key={tbl}
              onClick={() => onTableClick && onTableClick(tbl)}
              className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#1c2c48] text-slate-300 text-xs font-mono font-medium hover:border-[#06b6d4] hover:text-[#00e5ff] transition-colors cursor-pointer active:scale-95"
            >
              {tbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
`, 'utf8');

console.log('MissionBriefing.tsx updated.');
