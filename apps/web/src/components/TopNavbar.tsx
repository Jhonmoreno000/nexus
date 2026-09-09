import React, { useState } from 'react';
import { Bell, Database, ChevronDown } from 'lucide-react';
import { ProfileModal, UserProfileData } from './modals/ProfileModal';
import { NotificationsModal } from './modals/NotificationsModal';
import { EnvironmentModal } from './modals/EnvironmentModal';
import { NexusLogo } from './NexusLogo';

interface TopNavbarProps {
  user: UserProfileData;
  onOpenIncident?: (id: string) => void;
  onResetProgress: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ user, onOpenIncident, onResetProgress }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isEnvOpen, setIsEnvOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-[#0a0e17] px-6 flex items-center justify-between z-20 select-none font-sans">
        {/* Left: Brand Logo + Environments */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group">
            <NexusLogo />
            <div>
              <div className="font-extrabold tracking-tight text-[16px] text-white flex items-center gap-1.5 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-slate-300 transition-colors">
                NEXUS
              </div>
              <div className="text-[11px] text-blue-400/80 font-semibold mt-0.5 tracking-wide uppercase">
                Database Engineer
              </div>
            </div>
          </div>

          {/* Environment Pills - Apple Style */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsEnvOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/15 active:scale-95 transition-all font-semibold tracking-tight text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              STAGING
            </button>

            <button
              onClick={() => setIsEnvOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 active:scale-95 transition-all font-semibold tracking-tight text-[11px]"
            >
              <Database className="w-3 h-3 text-blue-400" />
              <span>PostgreSQL 16</span>
            </button>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-[#0a0e17] shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </button>

          {/* iOS Style Profile Button */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 pl-5 border-l border-white/10 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-bold text-slate-200 group-hover:text-white tracking-tight">{user.name}</span>
              <span className="text-[11px] text-slate-400 font-semibold">{user.rankTitle}</span>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full group-hover:bg-blue-500/40 transition-colors"></div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_5px_rgba(0,0,0,0.5)] border border-white/10">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </div>
        </div>
      </header>

      {/* Modals */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onResetProgress={onResetProgress} />
      <NotificationsModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onOpenIncident={onOpenIncident} />
      <EnvironmentModal isOpen={isEnvOpen} onClose={() => setIsEnvOpen(false)} />
    </>
  );
};