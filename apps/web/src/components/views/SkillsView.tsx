import React from 'react';
import { BarChart3, CheckCircle2, Lock, Sparkles, BookOpen, Target } from 'lucide-react';
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
      color: 'from-emerald-500 to-teal-400',
      topics: ['SELECT & Projection', 'WHERE Filters & Comparison Operators', 'ORDER BY & Pagination', 'Subqueries & Scalar In-lines']
    },
    {
      name: 'Relational Thinking',
      score: Math.min(100, Math.round(ratio * 85)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-cyan-500 to-blue-400',
      topics: ['Multi-hop INNER JOINs', 'LEFT & RIGHT Outer Joins', 'Anti-Join NULL Assertions', 'Cartesian Product Detection']
    },
    {
      name: 'Data Analysis & Aggregations',
      score: Math.min(100, Math.round(ratio * 75)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-sky-500 to-indigo-400',
      topics: ['GROUP BY Multiple Columns', 'HAVING Aggregate Thresholds', 'Window Functions OVER', 'PARTITION BY & Ranking']
    },
    {
      name: 'Database Engineering',
      score: Math.min(100, Math.round(ratio * 70)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-purple-500 to-pink-400',
      topics: ['Foreign Key Constraints', 'B-Tree & Composite Indexes', 'Transaction Isolation', 'Deadlock Prevention Order']
    },
    {
      name: 'Production Security & Optimization',
      score: Math.min(100, Math.round(ratio * 50)),
      level: count >= 5 ? 'Mastered' : count >= 3 ? 'Advanced' : count >= 1 ? 'Intermediate' : 'Novice',
      color: 'from-amber-500 to-orange-400',
      topics: ['SQL Injection Surface Analysis', 'EXPLAIN ANALYZE Cost Analysis', 'Sequential Scan Bottlenecks', 'Lock Contention Mitigation']
    }
  ];

  const overall = Math.round((domains.reduce((acc, d) => acc + d.score, 0) / (domains.length * 100)) * 100);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Database Engineering Skill Graph</h1>
            <p className="text-xs text-slate-400">Dynamic competency vectors for {user.name} (@{user.username})</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0b1426] border border-[#172f5c] text-xs flex items-center gap-2 text-cyan-300 font-semibold">
          <Sparkles className="w-4 h-4 text-[#00e5ff]" />
          <span>Overall Competency: {overall}% ({user.rankTitle})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {domains.map((dom) => (
          <div key={dom.name} className="p-5 rounded-xl bg-[#090f1e] border border-[#152642] space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{dom.name}</h3>
                <span className="text-xs text-slate-400 font-medium">Rank: {dom.level}</span>
              </div>
              <span className="text-lg font-mono font-extrabold text-cyan-300">{dom.score}%</span>
            </div>

            <div className="w-full h-2 bg-[#101b2f] rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${dom.color} rounded-full transition-all duration-700`}
                style={{ width: `${dom.score}%` }}
              ></div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#122036]">
              {dom.topics.map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${dom.score > 0 ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
