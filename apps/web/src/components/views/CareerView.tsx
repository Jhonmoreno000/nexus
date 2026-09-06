import React from 'react';
import { Briefcase, Award, CheckCircle2, Lock, TrendingUp, FileText } from 'lucide-react';

export const CareerView: React.FC = () => {
  const ladder = [
    { rank: 'Intern Database Developer', status: 'Completed', salary: '$45,000', xp: '1000 XP', current: false },
    { rank: 'Junior Database Developer', status: 'Current Role', salary: '$78,000', xp: '3500 / 5000 XP', current: true },
    { rank: 'Mid-Level Database Engineer', status: 'Locked', salary: '$115,000', xp: '10,000 XP', current: false },
    { rank: 'Senior Data Infrastructure Engineer', status: 'Locked', salary: '$165,000', xp: '25,000 XP', current: false },
    { rank: 'Principal Database Architect', status: 'Locked', salary: '$220,000', xp: '50,000 XP', current: false }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Engineering Career Ladder</h1>
            <p className="text-xs text-slate-400">Professional progression, simulated company tickets, and sprint reviews</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0b1426] border border-[#172f5c] text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Performance Rating: Exceeds Expectations</span>
        </div>
      </div>

      <div className="space-y-3">
        {ladder.map((step, idx) => (
          <div
            key={step.rank}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              step.current
                ? 'bg-[#0b1730] border-[#00e5ff]/50 shadow-md'
                : step.status === 'Completed'
                ? 'bg-[#090f1e] border-[#162744] opacity-80'
                : 'bg-[#060a14] border-[#131f34] opacity-50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                step.current ? 'bg-[#00e5ff] text-[#070b14]' : 'bg-[#121f36] text-slate-400'
              }`}>
                0{idx + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{step.rank}</h3>
                <span className="text-xs text-slate-400 font-mono">Simulated Target: {step.salary} • {step.xp}</span>
              </div>
            </div>

            <div>
              {step.current ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40">
                  CURRENT ROLE
                </span>
              ) : step.status === 'Completed' ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                  <Lock className="w-4 h-4" /> Locked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
