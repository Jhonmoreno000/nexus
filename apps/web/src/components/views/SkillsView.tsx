import React from 'react';
import { BarChart3, CheckCircle2, Lock, Sparkles, BookOpen, Target, Activity } from 'lucide-react';
import { UserProfileData } from '../modals/ProfileModal';

interface SkillsViewProps {
  user: UserProfileData;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ user }) => {
  const count = user.completedMissions.length;
  const ratio = count / 6;

  const domains = [
    {
      name: 'SQL Fundamentals',
      score: Math.min(100, Math.round(ratio * 100)),
      level: count >= 6 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/20',
      topics: ['SELECT & Projection', 'WHERE Filters & Comparison Operators', 'ORDER BY & Pagination', 'Subqueries & Scalar In-lines']
    },
    {
      name: 'Relational Thinking',
      score: Math.min(100, Math.round(ratio * 85)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      topics: ['Multi-hop INNER JOINs', 'LEFT & RIGHT Outer Joins', 'Anti-Join NULL Assertions', 'Cartesian Product Detection']
    },
    {
      name: 'Data Analysis & Aggregations',
      score: Math.min(100, Math.round(ratio * 75)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-purple-500 to-fuchsia-500',
      shadow: 'shadow-purple-500/20',
      topics: ['GROUP BY Multiple Columns', 'HAVING Aggregate Thresholds', 'Window Functions OVER', 'PARTITION BY & Ranking']
    },
    {
      name: 'Database Engineering',
      score: Math.min(100, Math.round(ratio * 70)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-500/20',
      topics: ['Foreign Key Constraints', 'B-Tree & Composite Indexes', 'Transaction Isolation', 'Deadlock Prevention Order']
    },
    {
      name: 'Production Security & Optimization',
      score: Math.min(100, Math.round(ratio * 50)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
      topics: ['SQL Injection Surface Analysis', 'EXPLAIN ANALYZE Cost Analysis', 'Sequential Scan Bottlenecks', 'Lock Contention Mitigation']
    }
  ];

  const overall = Math.round((domains.reduce((acc, d) => acc + d.score, 0) / (domains.length * 100)) * 100);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0e17] space-y-8 select-none font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Database Engineering Skill Graph</h1>
            <p className="text-[13px] font-medium text-slate-400 mt-1">Dynamic competency vectors for {user.name} (@{user.username})</p>
          </div>
        </div>

        <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-sm flex items-center gap-2.5 text-[13px] font-bold text-white backdrop-blur-md">
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400 z-10" />
            <div className="absolute inset-0 bg-amber-400/30 blur-sm rounded-full"></div>
          </div>
          <span className="tracking-tight">Overall Competency: <span className="text-amber-400">{overall}%</span></span>
          <span className="w-px h-3.5 bg-white/20 mx-1"></span>
          <span className="text-slate-400 font-semibold">{user.rankTitle}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 z-10 relative">
        {domains.map((dom) => (
          <div key={dom.name} className="p-6 rounded-[1.5rem] bg-[#121927]/80 backdrop-blur-xl border border-white/5 space-y-6 shadow-xl hover:bg-[#161f30]/90 transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">{dom.name}</h3>
                <span className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5 block">Rank: {dom.level}</span>
              </div>
              <span className={`text-2xl font-mono font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${dom.color}`}>{dom.score}%</span>
            </div>

            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div
                className={`h-full bg-gradient-to-r ${dom.color} rounded-full transition-all duration-1000 shadow-lg ${dom.shadow} relative`}
                style={{ width: `${dom.score}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5">
              {dom.topics.map((t) => (
                <div key={t} className="flex items-center gap-3 text-[12px] text-slate-300 font-medium">
                  <div className={`w-2 h-2 rounded-full ${dom.score > 0 ? 'bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.6)]' : 'bg-slate-700'}`}></div>
                  <span className="group-hover:text-white transition-colors">{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};