import React from 'react';
import { BarChart2, Cpu, Database, Bug, Target } from 'lucide-react';

export const SkillsProgress: React.FC = () => {
  const skills = [
    { name: 'SQL Reasoning', percentage: 82, icon: Cpu, color: 'from-[#06b6d4] to-[#00e5ff]' },
    { name: 'Data Modeling', percentage: 67, icon: Database, color: 'from-[#0284c7] to-[#38bdf8]' },
    { name: 'Debugging', percentage: 74, icon: Bug, color: 'from-[#0d9488] to-[#2dd4bf]' },
    { name: 'Optimization', percentage: 51, icon: Target, color: 'from-[#7c3aed] to-[#a855f7]' }
  ];

  return (
    <div className="p-4 bg-[#0a101f] border-l border-t border-[#15233d] select-none space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-200 border-b border-[#142036] pb-2">
        <BarChart2 className="w-3.5 h-3.5 text-[#00e5ff]" />
        <span>Skills Progress</span>
      </div>

      <div className="space-y-3">
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{s.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {s.percentage}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#142036] rounded-full overflow-hidden">
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
