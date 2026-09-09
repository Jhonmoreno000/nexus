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
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0e17] space-y-8 select-none font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex items-center justify-between z-10 relative border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Engineering Career Ladder</h1>
            <p className="text-[13px] font-medium text-slate-400 mt-1">Professional progression for {user.name} (@{user.username})</p>
          </div>
        </div>

        <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-sm flex items-center gap-2.5 text-[13px] font-bold text-white backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-400 z-10" />
            <div className="absolute inset-0 bg-blue-500/30 blur-sm rounded-full"></div>
          </div>
          <span className="tracking-tight">Current XP: <span className="text-blue-400">{user.xp}</span></span>
          <span className="w-px h-3.5 bg-white/20 mx-1"></span>
          <span className="text-slate-400 font-semibold">Level {user.level}</span>
        </div>
      </div>

      <div className="space-y-4 z-10 relative">
        {ladder.map((step) => (
          <div
            key={step.rank}
            className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
              step.current
                ? 'bg-[#121927]/90 border-blue-500/50 shadow-xl ring-1 ring-blue-500/30 backdrop-blur-xl scale-[1.01]'
                : step.status === 'Completed'
                ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                : 'bg-transparent border-transparent opacity-50'
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold font-mono shadow-sm ${
                  step.current ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/5'
                }`}
              >
                0{step.id}
              </div>
              <div>
                <h3 className={`text-[15px] font-bold tracking-tight ${step.current ? 'text-white' : 'text-slate-200 group-hover:text-white transition-colors'}`}>{step.rank}</h3>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-0.5 block flex items-center gap-3">
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Market: {step.salary}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10"></span>
                  <span>Threshold: {step.reqXp} XP</span>
                </span>
              </div>
            </div>

            <div>
              {step.current ? (
                <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  CURRENT ROLE ({user.xp} / {step.reqXp} XP)
                </span>
              ) : step.status === 'Completed' ? (
                <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MASTERED</span>
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-white/5 text-slate-500 border border-white/5 flex items-center gap-1.5">
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