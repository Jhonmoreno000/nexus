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
    <div className="h-full flex flex-col justify-between p-6 bg-[#0a0e17] border-r border-white/5 overflow-y-auto select-none font-sans">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 text-white font-semibold text-sm pb-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <span>Mission Briefing</span>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Context</h3>
          <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
            {context}
          </p>
        </div>

        {/* Your Objectives */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Objectives</h3>
          <div className="space-y-2">
            {objectives.map((obj) => {
              const isSelected = activeObjectiveId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => onObjectiveSelect(obj.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        obj.completed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isSelected
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {obj.completed ? <Check className="w-3.5 h-3.5" /> : obj.id}
                    </div>
                    <div className="space-y-0.5">
                      <div className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {obj.title}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed font-medium">
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
      <div className="pt-5 border-t border-white/5 space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Related Tables</h3>
        <div className="flex flex-wrap gap-2">
          {relatedTables.map((tbl) => (
            <button
              key={tbl}
              onClick={() => onTableClick?.(tbl)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/40 text-[13px] font-medium text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <Table2 className="w-3.5 h-3.5 text-blue-400 opacity-80" />
              <span>{tbl}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};