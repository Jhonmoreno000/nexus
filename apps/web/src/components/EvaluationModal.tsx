import React from 'react';
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
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              result.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
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

          <div className={`p-4 rounded-xl text-xs leading-relaxed ${
            result.passed
              ? 'bg-emerald-950/25 border border-emerald-800/40 text-emerald-200'
              : 'bg-amber-950/25 border border-amber-800/40 text-amber-200'
          }`}>
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
