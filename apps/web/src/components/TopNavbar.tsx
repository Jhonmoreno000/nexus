import React, { useState } from 'react';
import { Bell, Database, ChevronDown } from 'lucide-react';
import { ProfileModal, UserProfileData } from './modals/ProfileModal';
import { NotificationsModal } from './modals/NotificationsModal';
import { EnvironmentModal } from './modals/EnvironmentModal';

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
            {/* Native App Icon Style Logo */}
            <div className="w-9 h-9 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold tracking-tight text-[15px] text-white flex items-center gap-1.5 leading-none">
                NEXUS
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Database Engineer
              </div>
            </div>
          </div>

          {/* Environment Pills - Apple Style */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsEnvOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 active:scale-95 transition-all font-semibold tracking-tight text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              STAGING
            </button>

            <button
              onClick={() => setIsEnvOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 active:scale-95 transition-all font-semibold tracking-tight text-[11px]"
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
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-[#0a0e17]"></span>
          </button>

          {/* iOS Style Profile Button */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 pl-5 border-l border-white/10 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="flex flex-col text-right">
              <span className="text-[13px] font-semibold text-slate-200 group-hover:text-white tracking-tight">{user.name}</span>
              <span className="text-[11px] text-slate-400 font-medium">{user.rankTitle}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
              JM
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