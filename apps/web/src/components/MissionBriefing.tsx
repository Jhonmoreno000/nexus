import React from 'react';
import { BookOpen, Table2, Check } from 'lucide-react';

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
    <div className="h-full flex flex-col justify-between p-4 bg-[#070c17]/90 backdrop-blur-md border-r border-slate-800/60 overflow-y-auto select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm border-b border-slate-800/60 pb-3">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Mission Briefing</span>
        </div>

        {/* Context */}
        <div className="space-y-1.5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Context</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {context}
          </p>
        </div>

        {/* Your Objectives */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Objectives</h3>
          <div className="space-y-2">
            {objectives.map((obj) => {
              const isSelected = activeObjectiveId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => onObjectiveSelect(obj.id)}
                  className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-950/20 border-sky-500/35 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${
                        obj.completed
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : isSelected
                          ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
                      }`}
                    >
                      {obj.completed ? <Check className="w-3 h-3" /> : obj.id}
                    </div>
                    <div className="space-y-0.5">
                      <div className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {obj.title}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug">
                        {obj.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Tables */}
      <div className="pt-4 border-t border-slate-800/60 space-y-2">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Tables</h3>
        <div className="flex flex-wrap gap-1.5">
          {relatedTables.map((tbl) => (
            <button
              key={tbl}
              onClick={() => onTableClick?.(tbl)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800/60 hover:border-sky-500/40 text-xs font-mono text-slate-300 hover:text-sky-300 transition-colors"
            >
              <Table2 className="w-3 h-3 text-slate-400" />
              <span>{tbl}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
