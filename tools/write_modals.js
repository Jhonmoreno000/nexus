const fs = require('fs');

fs.writeFileSync('apps/web/src/components/SkillsProgress.tsx', `import React from 'react';
import { BarChart2, Cpu, Database, Bug, Target } from 'lucide-react';

export const SkillsProgress: React.FC = () => {
  const skills = [
    { name: 'SQL Reasoning', percentage: 82, icon: Cpu, color: 'from-[#06b6d4] to-[#00e5ff]' },
    { name: 'Data Modeling', percentage: 67, icon: Database, color: 'from-[#0284c7] to-[#38bdf8]' },
    { name: 'Debugging', percentage: 74, icon: Bug, color: 'from-[#0d9488] to-[#2dd4bf]' },
    { name: 'Optimization', percentage: 51, icon: Target, color: 'from-[#7c3aed] to-[#a855f7]' }
  ];

  return (
    <div className="p-4 bg-[#0a101f] border-l border-t border-[#15233d] select-none space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-200 border-b border-[#142036] pb-2">
        <BarChart2 className="w-3.5 h-3.5 text-[#00e5ff]" />
        <span>Skills Progress</span>
      </div>

      <div className="space-y-3">
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{s.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {s.percentage}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#142036] rounded-full overflow-hidden">
                <div
                  className={\`h-full bg-gradient-to-r \${s.color} rounded-full transition-all duration-500\`}
                  style={{ width: \`\${s.percentage}%\` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
`, 'utf8');

fs.writeFileSync('apps/web/src/components/AiTutorModal.tsx', `import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, HelpCircle, Code } from 'lucide-react';
import { TutorHint } from '../types';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSnippet?: (code: string) => void;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, onSelectSnippet }) => {
  const [level, setLevel] = useState(1);
  const [hintData, setHintData] = useState<TutorHint | null>({
    diagnosis: 'Query analysis ready. Current progressive hint tier: 1/5.',
    hintLevel: 1,
    concept: 'Preserving Unmatched Rows in Production Ledgers',
    hint: 'The incident states that orders are marked as paid, but lack transactions. If you use an INNER JOIN, what happens to rows in orders that have no matching transaction record?',
    nextQuestion: 'What JOIN type allows keeping all orders, filling missing right-side records with NULL?'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const fetchHint = async (lvl: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/missions/1842/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: lvl })
      });
      if (res.ok) {
        const data = await res.json();
        setHintData(data);
        setLevel(lvl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-xl bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#0a162b] to-[#0d2242] border-b border-[#172d54] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">NEXUS AI Tutor</h2>
              <p className="text-[10px] text-slate-400">Socratic Engineering Guidance — Incident #1842</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white rounded-lg p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-[#060b17] border-b border-[#14233c] flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Guidance Level:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => fetchHint(lvl)}
                className={\`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all \${
                  level === lvl
                    ? 'bg-[#00e5ff] text-[#070b14]'
                    : 'bg-[#0e192f] text-slate-300 hover:bg-[#15274d]'
                }\`}
              >
                L{lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse">
              Consulting tutor model...
            </div>
          ) : hintData ? (
            <>
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <HelpCircle className="w-4 h-4 text-[#00e5ff]" />
                <span>Concept: {hintData.concept}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e192f] border border-[#172d54] text-slate-200 leading-relaxed">
                {hintData.hint}
              </div>

              {hintData.nextQuestion && (
                <div className="p-3 rounded-lg bg-[#070f1f] border border-[#13284a] text-slate-300 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-amber-200">{hintData.nextQuestion}</span>
                </div>
              )}

              {hintData.codeSnippet && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Code className="w-3 h-3" /> Reference Syntax</span>
                    {onSelectSnippet && (
                      <button
                        onClick={() => {
                          onSelectSnippet(hintData.codeSnippet!);
                          onClose();
                        }}
                        className="text-[#00e5ff] hover:underline"
                      >
                        Insert into editor
                      </button>
                    )}
                  </div>
                  <pre className="p-3 rounded-lg bg-[#040812] border border-[#15233d] font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {hintData.codeSnippet}
                  </pre>
                </div>
              )}
            </>
          ) : null}
        </div>

        <div className="px-5 py-3 bg-[#060b17] border-t border-[#14233c] flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Level 5 reveals full reference solution.</span>
          <button
            onClick={() => {
              if (level < 5) fetchHint(level + 1);
            }}
            disabled={level >= 5}
            className="px-3 py-1.5 rounded-lg bg-[#0d2242] hover:bg-[#12315e] border border-[#1e4680] text-slate-200 font-semibold disabled:opacity-50"
          >
            Next Hint Level &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
`, 'utf8');

fs.writeFileSync('apps/web/src/components/EvaluationModal.tsx', `import React from 'react';
import { X, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { EvaluationResult } from '../types';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a162b] to-[#0d2242] border-b border-[#172d54] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={\`w-9 h-9 rounded-xl flex items-center justify-center \${
              result.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }\`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {result.passed ? 'Incident Diagnosis Approved' : 'Evaluation Incomplete'}
              </h2>
              <p className="text-xs text-slate-400">Multi-layer deterministic assessment report</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white rounded-lg p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-6 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Correctness</div>
              <div className="text-base font-mono font-bold text-cyan-400">{result.breakdown.correctness}/40</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Logic</div>
              <div className="text-base font-mono font-bold text-cyan-400">{result.breakdown.logic}/20</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Robustness</div>
              <div className="text-base font-mono font-bold text-cyan-400">{result.breakdown.robustness}/15</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Performance</div>
              <div className="text-base font-mono font-bold text-cyan-400">{result.breakdown.performance}/10</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Readability</div>
              <div className="text-base font-mono font-bold text-cyan-400">{result.breakdown.readability}/10</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#070c17] border border-[#172742]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Security</div>
              <div className="text-base font-mono font-bold text-emerald-400">{result.breakdown.security}/5</div>
            </div>
          </div>

          <div className={\`p-4 rounded-xl text-xs leading-relaxed \${
            result.passed
              ? 'bg-emerald-950/25 border border-emerald-800/40 text-emerald-200'
              : 'bg-amber-950/25 border border-amber-800/40 text-amber-200'
          }\`}>
            {result.explanation}
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Test Cases</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {result.testCases.map((tc, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#070c17] border border-[#142036] flex items-start gap-3">
                  {tc.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-200">{tc.name}</div>
                    <p className="text-[11px] text-slate-400">{tc.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#060b17] border-t border-[#14233c] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Total Score: <span className="font-bold text-lg text-white">{result.totalScore}</span> / 100
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
`, 'utf8');

console.log('SkillsProgress, AiTutorModal, EvaluationModal written.');
