import React from 'react';
import { BarChart2, Cpu, Database, Bug, Target } from 'lucide-react';

interface SkillsProgressProps {
  completedMissionsCount?: number;
}

export const SkillsProgress: React.FC<SkillsProgressProps> = ({ completedMissionsCount = 0 }) => {
  const ratio = completedMissionsCount / 6;

  const skills = [
    { name: 'SQL Reasoning', percentage: Math.min(100, Math.round(ratio * 100)), icon: Cpu, color: 'from-sky-500 to-blue-600' },
    { name: 'Data Modeling', percentage: Math.min(100, Math.round(ratio * 85)), icon: Database, color: 'from-blue-500 to-indigo-600' },
    { name: 'Debugging', percentage: Math.min(100, Math.round(ratio * 80)), icon: Bug, color: 'from-teal-500 to-emerald-600' },
    { name: 'Optimization', percentage: Math.min(100, Math.round(ratio * 60)), icon: Target, color: 'from-violet-500 to-purple-600' }
  ];

  return (
    <div className="p-4 bg-[#070c17]/90 border-l border-t border-slate-800/60 select-none space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Skills Progress</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {completedMissionsCount}/6 Solved
        </span>
      </div>

      <div className="space-y-3">
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {s.percentage}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-500`}
                  style={{ width: `${s.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
