import React, { useState } from 'react';
import { Bell, Database } from 'lucide-react';
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
      <header className="h-14 border-b border-[#15233d] bg-[#070b14] px-4 flex items-center justify-between z-20 select-none">
        {/* Left: Brand Logo + Environments */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
            {/* Stylized Cyan N Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#0284c7] p-[1.5px] flex items-center justify-center glow-cyan-sm shadow-inner">
              <div className="w-full h-full bg-[#070b14] rounded-[7px] flex items-center justify-center">
                <span className="text-[#00e5ff] font-extrabold text-lg tracking-tighter font-mono">N</span>
              </div>
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-sm text-white font-mono flex items-center gap-1.5">
                NEXUS
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                Learn. Build. Improve.
              </div>
            </div>
          </div>

          {/* Environment Pills */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsEnvOpen(true)}
              title="Inspect Environment Status"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#064e3b]/30 border border-[#059669]/40 text-[#10b981] hover:bg-[#064e3b]/50 transition-colors font-medium tracking-wide text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              STAGING ENVIRONMENT
            </button>

            <button
              onClick={() => setIsEnvOpen(true)}
              title="Inspect Database Engine"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1627] border border-[#1e2e4a] text-slate-300 hover:border-cyan-400/50 transition-colors font-medium text-[11px]"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>PostgreSQL 16</span>
            </button>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNotifOpen(true)}
            title="Notifications & Incident Alerts"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111e33] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
          </button>

          {/* Real User Card */}
          <div
            onClick={() => setIsProfileOpen(true)}
            title="View Profile & Career Stats"
            className="flex items-center gap-2.5 pl-2 border-l border-[#1a2942] cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#06b6d4] p-[1.5px] flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a1120] rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
                JM
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">{user.name}</span>
              <span className="text-[10px] text-slate-400">{user.rankTitle}</span>
            </div>
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
