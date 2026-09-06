import React from 'react';
import { X, Award, Shield, Cpu, Zap, CheckCircle2, RotateCcw } from 'lucide-react';

export interface UserProfileData {
  name: string;
  username: string;
  role: string;
  level: number;
  xp: number;
  rankTitle: string;
  completedMissions: string[];
  queriesExecuted: number;
  badges: string[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData;
  onResetProgress: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onResetProgress }) => {
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
                JM
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <p className="text-xs text-cyan-400 font-medium">@{user.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#00e5ff]/15 text-[#00e5ff] text-[10px] font-bold">
                  {user.rankTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{user.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real Simulation Statistics</h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-[#13233c]">
                <span>Incidents Resolved:</span>
                <span className="font-bold text-white font-mono">{user.completedMissions.length} / 6</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#13233c]">
                <span>Actual Queries Tested:</span>
                <span className="font-bold text-white font-mono">{user.queriesExecuted} queries</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#13233c]">
                <span>Engineering Level:</span>
                <span className="font-bold text-cyan-400 font-mono">Tier {user.level}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Earned Badges:</span>
                <span className="font-semibold text-emerald-400 font-mono">{user.badges.length} badges</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#13233c] flex items-center justify-between">
            <button
              onClick={onResetProgress}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress to 0</span>
            </button>
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
