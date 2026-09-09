import React from 'react';
import { BarChart3 } from 'lucide-react';

interface SkillsProgressProps {
  completedMissionsCount: number;
}

export const SkillsProgress: React.FC<SkillsProgressProps> = ({ completedMissionsCount }) => {
  const totalMissions = 6;
  
  // Calculate skills based on missions completed to show dynamic progression
  const calculateSkill = (baseScore: number, growthRate: number) => {
    const raw = baseScore + (completedMissionsCount * growthRate);
    return Math.min(100, Math.max(0, Math.round(raw)));
  };

  const skills = [
    { name: 'SQL Reasoning', progress: calculateSkill(0, 16.6), color: 'bg-blue-500' },
    { name: 'Data Modeling', progress: calculateSkill(0, 16.6), color: 'bg-indigo-500' },
    { name: 'Debugging', progress: calculateSkill(0, 16.6), color: 'bg-emerald-500' },
    { name: 'Optimization', progress: calculateSkill(0, 16.6), color: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 bg-[#0a0e17] border-l border-t border-white/5 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <span>Skills Progress</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
          {completedMissionsCount}/{totalMissions} Solved
        </div>
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="tracking-tight">{skill.name}</span>
              <span>{skill.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};