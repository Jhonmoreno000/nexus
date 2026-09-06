import React from 'react';
import { Briefcase, Award, CheckCircle2, Lock, TrendingUp, Zap } from 'lucide-react';
import { UserProfileData } from '../modals/ProfileModal';

interface CareerViewProps {
  user: UserProfileData;
}

export const CareerView: React.FC<CareerViewProps> = ({ user }) => {
  const ladder = [
    {
      id: 1,
      rank: 'Database Engineering Trainee',
      status: user.xp >= 500 ? 'Completed' : 'Current Role',
      salary: '$45,000',
      reqXp: 500,
      current: user.xp < 500
    },
    {
      id: 2,
      rank: 'Junior Database Developer',
      status: user.xp >= 1500 ? 'Completed' : user.xp >= 500 ? 'Current Role' : 'Locked',
      salary: '$78,000',
      reqXp: 1500,
      current: user.xp >= 500 && user.xp < 1500
    },
    {
      id: 3,
      rank: 'Mid-Level Database Engineer',
      status: user.xp >= 5000 ? 'Completed' : user.xp >= 1500 ? 'Current Role' : 'Locked',
      salary: '$115,000',
      reqXp: 5000,
      current: user.xp >= 1500 && user.xp < 5000
    },
    {
      id: 4,
      rank: 'Senior Data Infrastructure Engineer',
      status: user.xp >= 10000 ? 'Completed' : user.xp >= 5000 ? 'Current Role' : 'Locked',
      salary: '$165,000',
      reqXp: 10000,
      current: user.xp >= 5000 && user.xp < 10000
    },
    {
      id: 5,
      rank: 'Principal Database Architect',
      status: user.xp >= 20000 ? 'Current Role' : 'Locked',
      salary: '$220,000',
      reqXp: 20000,
      current: user.xp >= 20000
    }
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
            <p className="text-xs text-slate-400">Professional progression for {user.name} (@{user.username})</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0b1426] border border-[#172f5c] text-xs font-semibold text-cyan-300 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>Current XP: {user.xp} • Level {user.level}</span>
        </div>
      </div>

      <div className="space-y-3">
        {ladder.map((step) => (
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
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                  step.current ? 'bg-[#00e5ff] text-[#070b14]' : 'bg-[#121f36] text-slate-400'
                }`}
              >
                0{step.id}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{step.rank}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Market Reference: {step.salary} • Threshold: {step.reqXp} XP
                </span>
              </div>
            </div>

            <div>
              {step.current ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40">
                  CURRENT ROLE ({user.xp} / {step.reqXp} XP)
                </span>
              ) : step.status === 'Completed' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MASTERED</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>LOCKED</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
