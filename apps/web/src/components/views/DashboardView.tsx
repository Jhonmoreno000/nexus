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
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      description: 'Foreign key discrepancies in the orders pipeline. Find records with invalid customer references.'
    },
    {
      id: '1842',
      num: 1842,
      title: 'Payment Integrity',
      difficulty: 'Advanced',
      badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      description: 'Orders marked as paid without ledger transaction records. Multi-hop LEFT JOIN anti-pattern.'
    },
    {
      id: '2045',
      num: 2045,
      title: 'Fraudulent Refund Velocity',
      difficulty: 'Expert',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      description: 'Automated refund bursts detected across terminals. Use SQL Window Functions to flag velocity anomalies.'
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none font-sans">
      {/* Welcome Banner with Refined Translucent Gradient */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/70 flex items-center justify-between shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>OPERATIONAL SIMULATION ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Operating as <span className="text-sky-300 font-mono">@{user.username}</span>. Database Sandbox is synchronized. Tackle real-world incidents to climb the engineering ladder.
          </p>
        </div>

        <button
          onClick={() => onSelectMission('1842')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wider shadow-md shadow-sky-950/40 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>RESUME INCIDENT #1842</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Queries Executed</span>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{user.queriesExecuted}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            <span>Recorded in PostgreSQL sandbox</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Experience</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{user.xp} XP</div>
          <div className="text-[11px] text-amber-400/80 font-medium">Earned through solutions & quizzes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Incidents Solved</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{completedCount} / 6</div>
          <div className="text-[11px] text-sky-400/80 font-medium">Rank: {user.rankTitle}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Promotion Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{promotionPercent}%</div>
          <div className="text-[11px] text-indigo-300/80">Target: Junior Database Developer</div>
        </div>
      </div>

      {/* Incidents Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Incident Dispatch Queue
          </h2>
          <span className="text-xs text-slate-500 font-mono">6 Incidents Available</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {missionsSummary.map((m) => {
            const isCompleted = user.completedMissions.includes(m.id);
            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800/60 bg-slate-900/30 hover:border-slate-700/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">#{m.num}</span>
                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-medium border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED</span>
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${m.badgeColor}`}>
                        {m.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {m.description}
                  </p>
                </div>
                <button
                  onClick={() => onSelectMission(m.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/15'
                      : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-slate-700/50'
                  }`}
                >
                  <span>{isCompleted ? 'Review Investigation' : 'Investigate'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
