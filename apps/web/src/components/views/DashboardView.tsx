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
      badgeColor: 'bg-[#032e22] text-[#34d399] border-[#059669]/40',
      description: 'Foreign key discrepancies in the orders pipeline. Find records with invalid customer references.'
    },
    {
      id: '1842',
      num: 1842,
      title: 'Payment Integrity',
      difficulty: 'Advanced',
      badgeColor: 'bg-[#082a4d] text-cyan-300 border-cyan-500/40',
      description: 'Orders marked as paid without ledger transaction records. Multi-hop LEFT JOIN anti-pattern.'
    },
    {
      id: '2045',
      num: 2045,
      title: 'Fraudulent Refund Velocity',
      difficulty: 'Expert',
      badgeColor: 'bg-purple-950/40 text-purple-300 border-purple-800/40',
      description: 'Automated refund bursts detected across terminals. Use SQL Window Functions to flag velocity anomalies.'
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1c38] via-[#09152b] to-[#0a1224] border border-[#173059] flex items-center justify-between shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>OPERATIONAL SIMULATION ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Operating as <span className="text-cyan-300 font-mono">@{user.username}</span>. Database Sandbox is synchronized. Tackle real-world incidents to climb the engineering ladder.
          </p>
        </div>

        <button
          onClick={() => onSelectMission('1842')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs tracking-wider glow-cyan transition-all active:scale-95 shadow-lg"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>RESUME INCIDENT #1842</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Queries Executed</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{user.queriesExecuted}</div>
          <div className="text-[11px] text-slate-400 font-medium">
            <span>Recorded in PostgreSQL sandbox</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Experience</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{user.xp} XP</div>
          <div className="text-[11px] text-amber-300 font-medium">Earned through solutions & quizzes</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Incidents Solved</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{completedCount} / 6</div>
          <div className="text-[11px] text-cyan-400 font-medium">Rank: {user.rankTitle}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Promotion Progress</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{promotionPercent}%</div>
          <div className="text-[11px] text-purple-300">Target: Junior Database Developer</div>
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
                className={`p-4 rounded-xl bg-[#090f1d] border transition-all space-y-3 flex flex-col justify-between ${
                  isCompleted ? 'border-emerald-500/50 bg-[#061714]' : 'border-[#172d54] hover:border-[#0284c7]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">#{m.num}</span>
                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-500/50 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED</span>
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${m.badgeColor}`}>
                        {m.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {m.description}
                  </p>
                </div>
                <button
                  onClick={() => onSelectMission(m.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-[#0b2420] text-emerald-300 border border-emerald-700/50 hover:bg-[#0f332d]'
                      : 'bg-[#0d192f] hover:bg-[#132649] text-cyan-300 border border-[#1a3869]'
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
