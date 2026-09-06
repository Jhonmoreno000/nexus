import React from 'react';
import { Play, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  onSelectMission: (missionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectMission }) => {
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
            Welcome back, Alex Rivera
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            You are operating on the staging ledger replica. 1 active production incident requires immediate resolution to prevent customer revenue reconciliation discrepancies.
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
            <span>Queries Executed Today</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">14</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% vs yesterday</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Evaluation Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">94.2%</div>
          <div className="text-[11px] text-slate-400">Across 6 test suites</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Incidents Solved</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">3 / 12</div>
          <div className="text-[11px] text-cyan-400 font-medium">Rank: Junior Developer</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b1322] border border-[#162744] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Next Promotion</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">75%</div>
          <div className="text-[11px] text-purple-300">Mid-Level DB Engineer</div>
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
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-[#172d54] hover:border-[#0284c7] transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">#1021</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#032e22] text-[#34d399] font-medium border border-[#059669]/40">Beginner</span>
              </div>
              <h3 className="text-sm font-bold text-white">Orphaned Customer Records</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Foreign key discrepancies in the orders pipeline. Find records with invalid customer references.
              </p>
            </div>
            <button
              onClick={() => onSelectMission('1021')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0d192f] hover:bg-[#132649] text-cyan-300 border border-[#1a3869] text-xs font-semibold transition-colors"
            >
              <span>Investigate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-[#0284c7]/50 shadow-md space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">#1842</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#032e22] text-[#34d399] font-medium border border-[#059669]/40">Advanced</span>
              </div>
              <h3 className="text-sm font-bold text-white">Payment Integrity</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Orders marked as paid without ledger transaction records. Multi-hop LEFT JOIN anti-pattern.
              </p>
            </div>
            <button
              onClick={() => onSelectMission('1842')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs transition-colors"
            >
              <span>Open in Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-[#090f1d] border border-[#172d54] hover:border-[#0284c7] transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">#2045</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 font-medium border border-purple-800/40">Expert</span>
              </div>
              <h3 className="text-sm font-bold text-white">Fraudulent Refund Velocity</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                Automated refund bursts detected across terminals. Use SQL Window Functions to flag velocity anomalies.
              </p>
            </div>
            <button
              onClick={() => onSelectMission('2045')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0d192f] hover:bg-[#132649] text-cyan-300 border border-[#1a3869] text-xs font-semibold transition-colors"
            >
              <span>Investigate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
