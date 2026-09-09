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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 select-none font-sans">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#111622]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/20">
        
        {/* Header Banner */}
        <div className="p-8 bg-gradient-to-br from-blue-900/20 to-indigo-900/10 border-b border-white/5 relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
          
          <button onClick={onClose} className="absolute right-5 top-5 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95 z-20">
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0a0e17] rounded-[1.1rem] flex items-center justify-center text-xl font-extrabold text-blue-400">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-sm text-blue-400 font-semibold tracking-wide">@{user.username}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                  {user.rankTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-bold tracking-widest">{user.xp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 text-sm">
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Real Simulation Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-slate-300 font-medium">Incidents Resolved</span>
                <span className="font-bold text-white tracking-wide">{user.completedMissions.length} <span className="text-slate-500">/ 6</span></span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-slate-300 font-medium">Actual Queries Tested</span>
                <span className="font-bold text-white tracking-wide">{user.queriesExecuted}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-slate-300 font-medium">Engineering Tier</span>
                <span className="font-bold text-blue-400">Tier {user.level}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-slate-300 font-medium">Earned Badges</span>
                <span className="font-bold text-emerald-400">{user.badges.length} unlocked</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={onResetProgress}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};