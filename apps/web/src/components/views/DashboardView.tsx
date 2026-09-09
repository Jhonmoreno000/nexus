import React from 'react';
import { Play, TrendingUp, CheckCircle2, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';
import { UserProfileData } from '../modals/ProfileModal';

interface DashboardViewProps {
  onSelectMission: (missionId: string) => void;
  user: UserProfileData;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectMission, user }) => {
  const completedCount = user.completedMissions.length;
  const promotionPercent = Math.min(100, Math.round((user.xp / 1000) * 100));

  const missionsSummary = [
    {
      id: '1021',
      num: 1021,
      title: 'Orphaned Customer Records',
      difficulty: 'Beginner',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Foreign key discrepancies in the orders pipeline. Find records with invalid customer references.'
    },
    {
      id: '1842',
      num: 1842,
      title: 'Payment Integrity',
      difficulty: 'Advanced',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Orders marked as paid without ledger transaction records. Multi-hop LEFT JOIN anti-pattern.'
    },
    {
      id: '2045',
      num: 2045,
      title: 'Fraudulent Refund Velocity',
      difficulty: 'Expert',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      description: 'Automated refund bursts detected across terminals. Use SQL Window Functions to flag velocity anomalies.'
    }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-black space-y-8 select-none font-sans">
      {/* Native iOS style Welcome Banner */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide uppercase">
            <Zap className="w-3 h-3" />
            <span>Active Session</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-slate-400 max-w-xl font-medium leading-relaxed">
            Operating as <span className="text-blue-400">@{user.username}</span>. Database Sandbox is synchronized. Tackle real-world incidents to climb the engineering ladder.
          </p>
        </div>

        <button
          onClick={() => onSelectMission('1842')}
          className="relative z-10 flex items-center gap-3 px-6 py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/20 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Resume Incident #1842</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-[#0a0e17] border border-white/5 space-y-2 hover:bg-[#0c121e] transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wide">
            <span>Queries Executed</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white tracking-tighter">{user.queriesExecuted}</div>
          <div className="text-xs text-slate-500 font-medium">Recorded in PG sandbox</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0e17] border border-white/5 space-y-2 hover:bg-[#0c121e] transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wide">
            <span>Experience</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white tracking-tighter">{user.xp} <span className="text-lg text-slate-500">XP</span></div>
          <div className="text-xs text-amber-500/80 font-medium">Earned through solutions</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0e17] border border-white/5 space-y-2 hover:bg-[#0c121e] transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wide">
            <span>Incidents Solved</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white tracking-tighter">{completedCount} <span className="text-lg text-slate-500">/ 6</span></div>
          <div className="text-xs text-emerald-500/80 font-medium">{user.rankTitle}</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0a0e17] border border-white/5 space-y-2 hover:bg-[#0c121e] transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wide">
            <span>Promotion Progress</span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white tracking-tighter">{promotionPercent}%</div>
          <div className="text-xs text-indigo-400/80 font-medium">Target: Junior Database Dev</div>
        </div>
      </div>

      {/* Incidents Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Dispatch Queue
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {missionsSummary.map((m) => {
            const isCompleted = user.completedMissions.includes(m.id);
            return (
              <div
                key={m.id}
                className={`p-6 rounded-3xl border transition-all duration-300 space-y-4 flex flex-col justify-between shadow-lg ${
                  isCompleted
                    ? 'border-emerald-500/20 bg-emerald-950/10'
                    : 'border-white/5 bg-[#0a0e17] hover:bg-[#111622] hover:border-blue-500/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-400 tracking-tight">#{m.num}</span>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Solved</span>
                        </span>
                      )}
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border uppercase tracking-wide ${m.badgeColor}`}>
                        {m.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{m.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed font-medium line-clamp-2">
                    {m.description}
                  </p>
                </div>
                <button
                  onClick={() => onSelectMission(m.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span>{isCompleted ? 'Review Logs' : 'Investigate'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};