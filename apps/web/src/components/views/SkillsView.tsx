import React from 'react';
import { BarChart3, CheckCircle2, Lock, Sparkles, BookOpen, Target } from 'lucide-react';

export const SkillsView: React.FC = () => {
  const domains = [
    {
      name: 'SQL Fundamentals',
      score: 92,
      level: 'Mastered',
      color: 'from-emerald-500 to-teal-400',
      topics: ['SELECT & Projection (100%)', 'WHERE Filters & Operators (95%)', 'ORDER BY & Pagination (90%)', 'Subqueries & Scalar In-lines (85%)']
    },
    {
      name: 'Relational Thinking',
      score: 82,
      level: 'Advanced',
      color: 'from-cyan-500 to-blue-400',
      topics: ['Multi-hop INNER JOINs (90%)', 'LEFT & RIGHT Outer Joins (85%)', 'Anti-Join NULL Assertions (82%)', 'Cartesian Product Detection (70%)']
    },
    {
      name: 'Data Analysis & Aggregations',
      score: 67,
      level: 'Intermediate',
      color: 'from-sky-500 to-indigo-400',
      topics: ['GROUP BY Multiple Columns (80%)', 'HAVING Aggregate Thresholds (75%)', 'Window Functions OVER (50%)', 'PARTITION BY & Ranking (45%)']
    },
    {
      name: 'Database Engineering',
      score: 74,
      level: 'Advanced',
      color: 'from-purple-500 to-pink-400',
      topics: ['Foreign Key Constraints (90%)', 'B-Tree & Composite Indexes (75%)', 'Transaction Isolation (65%)', 'Deadlock Prevention Order (60%)']
    },
    {
      name: 'Production Security & Optimization',
      score: 51,
      level: 'Intermediate',
      color: 'from-amber-500 to-orange-400',
      topics: ['SQL Injection Surface Analysis (80%)', 'EXPLAIN ANALYZE Cost Analysis (55%)', 'Sequential Scan Bottlenecks (50%)', 'Lock Contention Mitigation (40%)']
    }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Database Engineering Skill Graph</h1>
            <p className="text-xs text-slate-400">Dynamic competency vectors evaluated across 5 core engineering disciplines</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0b1426] border border-[#172f5c] text-xs flex items-center gap-2 text-cyan-300 font-semibold">
          <Sparkles className="w-4 h-4 text-[#00e5ff]" />
          <span>Overall Competency: 73.2% (Junior Specialist)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {domains.map((d) => (
          <div key={d.name} className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{d.name}</h3>
                <span className="text-[11px] text-cyan-400 font-medium">{d.level}</span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-200">{d.score}%</div>
            </div>

            <div className="w-full h-2 bg-[#121c2e] rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-700`}
                style={{ width: `${d.score}%` }}
              ></div>
            </div>

            <div className="pt-2 border-t border-[#13233c] space-y-1.5">
              {d.topics.map((t) => (
                <div key={t} className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
