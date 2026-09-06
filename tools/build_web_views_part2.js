const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. apps/web/src/components/views/DatabaseLabView.tsx
write('apps/web/src/components/views/DatabaseLabView.tsx', `
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Database, Play, Sparkles, SlidersHorizontal, Table2 } from 'lucide-react';

export const DatabaseLabView: React.FC = () => {
  const [sql, setSql] = useState(\`-- NEXUS Database Lab (Interactive Scratchpad)
-- Execute arbitrary SQL statements against the in-memory PostgreSQL engine
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public';\`);

  const [results, setResults] = useState<{ columns: string[]; rows: any[]; rowCount: number; executionTimeMs: number; error?: string }>({
    columns: ['table_name', 'table_type'],
    rows: [
      { table_name: 'customers', table_type: 'BASE TABLE' },
      { table_name: 'orders', table_type: 'BASE TABLE' },
      { table_name: 'payments', table_type: 'BASE TABLE' },
      { table_name: 'transactions', table_type: 'BASE TABLE' },
      { table_name: 'refunds', table_type: 'BASE TABLE' }
    ],
    rowCount: 5,
    executionTimeMs: 16
  });

  const [isRunning, setIsRunning] = useState(false);

  const runQuery = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/lab/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const loadTemplate = (snippet: string) => {
    setSql(snippet);
  };

  return (
    <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[#070b14] space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Database className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Database Lab & SQL Scratchpad</h1>
            <p className="text-[11px] text-slate-400">Sandbox playground running against PostgreSQL 16 engine</p>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Templates:</span>
          <button
            onClick={() => loadTemplate('SELECT * FROM orders LIMIT 10;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Orders Table
          </button>
          <button
            onClick={() => loadTemplate('SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Group By
          </button>
          <button
            onClick={() => loadTemplate('SELECT * FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;')}
            className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#172742] text-xs text-slate-300 hover:text-cyan-300"
          >
            Left Join
          </button>
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="flex-1 grid grid-rows-2 gap-4 overflow-hidden">
        {/* Editor Container */}
        <div className="rounded-xl border border-[#15233d] bg-[#080d19] flex flex-col overflow-hidden">
          <div className="h-9 bg-[#060a14] border-b border-[#15233d] px-3 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">scratchpad.sql</span>
            <button
              onClick={runQuery}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs glow-cyan-sm transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>RUN SCRATCHPAD</span>
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme="vs-dark"
              value={sql}
              onChange={(val) => setSql(val || '')}
              options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="rounded-xl border border-[#15233d] bg-[#080d19] flex flex-col overflow-hidden">
          <div className="h-9 bg-[#060a14] border-b border-[#15233d] px-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Live PostgreSQL Engine Output</span>
            <span className="font-mono text-[11px] text-cyan-400">⏱️ {results.executionTimeMs} ms • {results.rowCount} rows</span>
          </div>
          <div className="flex-1 overflow-auto">
            {results.error ? (
              <div className="p-4 text-xs font-mono text-rose-400 bg-rose-950/30 m-3 rounded-lg border border-rose-900/50">
                PostgreSQL Engine Error: {results.error}
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-[#070c17] text-slate-400 border-b border-[#142036]">
                  <tr>
                    {results.columns.map((c) => (
                      <th key={c} className="px-4 py-2 font-semibold border-r border-[#121c2e]">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10192a]">
                  {results.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-[#0c1527]">
                      {results.columns.map((c) => (
                        <td key={c} className="px-4 py-1.5 border-r border-[#10192a] text-slate-200">
                          {r[c] === null ? <span className="text-slate-500 italic">NULL</span> : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
`);

// 2. apps/web/src/components/views/SkillsView.tsx
write('apps/web/src/components/views/SkillsView.tsx', `
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
                className={\`h-full bg-gradient-to-r \${d.color} rounded-full transition-all duration-700\`}
                style={{ width: \`\${d.score}%\` }}
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
`);

// 3. apps/web/src/components/views/CareerView.tsx
write('apps/web/src/components/views/CareerView.tsx', `
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
            className={\`p-4 rounded-xl border transition-all flex items-center justify-between \${
              step.current
                ? 'bg-[#0b1730] border-[#00e5ff]/50 shadow-md'
                : step.status === 'Completed'
                ? 'bg-[#090f1e] border-[#162744] opacity-80'
                : 'bg-[#060a14] border-[#131f34] opacity-50'
            }\`}
          >
            <div className="flex items-center gap-4">
              <div className={\`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono \${
                step.current ? 'bg-[#00e5ff] text-[#070b14]' : 'bg-[#121f36] text-slate-400'
              }\`}>
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
`);

// 4. apps/web/src/components/views/HistoryView.tsx
write('apps/web/src/components/views/HistoryView.tsx', `
import React, { useState, useEffect } from 'react';
import { History, Clock, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  missionId: string;
  missionTitle: string;
  sql: string;
  executionTimeMs: number;
  rowCount: number;
  status: 'SUCCESS' | 'ERROR';
  score?: number;
  timestamp: string;
}

interface HistoryViewProps {
  onLoadQuery: (missionId: string, sql: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onLoadQuery }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((d) => setHistory(d))
      .catch(console.error);
  }, []);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <History className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Query Execution Audit Log</h1>
            <p className="text-xs text-slate-400">Chronological history of SQL statements executed across staging sandboxes</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#15233d] bg-[#090f1e] overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead className="bg-[#070c17] text-slate-400 border-b border-[#142036]">
            <tr>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
              <th className="px-4 py-3 font-semibold">Incident / Mission</th>
              <th className="px-4 py-3 font-semibold">SQL Query</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Rows</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10192a]">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-[#0c1527] transition-colors">
                <td className="px-4 py-3 text-slate-400">{item.timestamp}</td>
                <td className="px-4 py-3 text-cyan-300 font-semibold">{item.missionTitle}</td>
                <td className="px-4 py-3 text-slate-200 max-w-xs truncate">{item.sql}</td>
                <td className="px-4 py-3 text-slate-400">{item.executionTimeMs} ms</td>
                <td className="px-4 py-3 text-slate-400">{item.rowCount}</td>
                <td className="px-4 py-3">
                  {item.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onLoadQuery(item.missionId, item.sql)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`);

// 5. apps/web/src/components/views/SettingsView.tsx
write('apps/web/src/components/views/SettingsView.tsx', `
import React, { useState } from 'react';
import { Settings, Sliders, Cpu, Save, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [fontSize, setFontSize] = useState('13');
  const [autoSave, setAutoSave] = useState(true);
  const [timeout, setTimeout] = useState('3000');
  const [aiProvider, setAiProvider] = useState('local');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Simulator & Editor Settings</h1>
            <p className="text-xs text-slate-400">Configure IDE preferences, sandbox resource boundaries, and AI mentor providers</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs glow-cyan transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Editor Settings Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Monaco Editor Preferences</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Editor Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full bg-[#070c17] border border-[#172742] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="12">12px (Compact)</option>
                <option value="13">13px (Default IDE)</option>
                <option value="14">14px (Comfort)</option>
                <option value="16">16px (Large)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Automatic Query Saving</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <span className="text-slate-400">Save drafts on keystroke</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Guardrails Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>PostgreSQL Sandbox Policy Boundaries</span>
          </h3>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Statement Timeout Limit</label>
              <span className="text-cyan-400 font-mono font-bold">{timeout} ms</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Statements exceeding this duration will be terminated by the SQL Gateway watchdog to prevent runaway joins.
            </p>
          </div>
        </div>

        {/* AI Tutor Provider Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Tutor Inference Provider</span>
          </h3>

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Active Model Provider</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full bg-[#070c17] border border-[#172742] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="local">Local Socratic Rules Engine (Deterministic)</option>
              <option value="ollama">Ollama (Local LLM via localhost:11434)</option>
              <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
              <option value="claude">Anthropic Claude 3.5 Sonnet</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
`);

console.log('DatabaseLabView, SkillsView, CareerView, HistoryView, SettingsView written.');
