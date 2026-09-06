import React, { useState } from 'react';
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
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  level === lvl
                    ? 'bg-[#00e5ff] text-[#070b14]'
                    : 'bg-[#0e192f] text-slate-300 hover:bg-[#15274d]'
                }`}
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
