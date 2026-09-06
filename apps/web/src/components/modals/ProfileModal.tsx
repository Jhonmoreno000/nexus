import React from 'react';
import { X, Award, Shield, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md bg-[#090f1e] border border-[#0284c7]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#0d1f40] to-[#09152b] border-b border-[#172e57] relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#00e5ff] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center text-lg font-extrabold text-[#00e5ff]">
                AR
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Alex Rivera</h2>
              <p className="text-xs text-cyan-400 font-medium">Junior Database Developer</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#00e5ff]/15 text-[#00e5ff] text-[10px] font-bold">Level 2</span>
                <span className="text-[11px] text-slate-400 font-mono">3,500 / 5,000 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engineering Badges</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#060c18] border border-[#14223c] flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white text-[11px]">Anti-Join Pioneer</div>
                  <div className="text-[10px] text-slate-400">Mastered NULL assertion</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#060c18] border border-[#14223c] flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white text-[11px]">40ms Query Runner</div>
                  <div className="text-[10px] text-slate-400">Sub-50ms execution</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#13233c]">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Simulation Career Stats</h3>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Production Incidents Resolved:</span>
                <span className="font-bold text-white font-mono">4 / 12</span>
              </div>
              <div className="flex justify-between">
                <span>Total Queries Tested:</span>
                <span className="font-bold text-white font-mono">148 queries</span>
              </div>
              <div className="flex justify-between">
                <span>Clean Code Review Score:</span>
                <span className="font-bold text-emerald-400 font-mono">96%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#060a14] border-t border-[#13233c] text-right">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
