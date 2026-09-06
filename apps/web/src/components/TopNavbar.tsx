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
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* Stylized Cyan Origami N Logo matching Mockup */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00e5ff]/20 rounded-lg blur-sm group-hover:bg-[#00e5ff]/40 transition-all"></div>
              <div className="relative w-8 h-8 rounded-lg bg-[#070b14] border border-[#00e5ff]/40 p-1 flex items-center justify-center shadow-lg group-hover:border-[#00e5ff] transition-all">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 5C6 4.44772 6.44772 4 7 4H11.5C12.0523 4 12.5 4.44772 12.5 5V27C12.5 27.5523 12.0523 28 11.5 28H7C6.44772 28 6 27.5523 6 27V5Z" fill="url(#nexus-col1)" />
                  <path d="M10 5L22 27H17L6.5 7.5L10 5Z" fill="url(#nexus-diag)" />
                  <path d="M19.5 5C19.5 4.44772 19.9477 4 20.5 4H25C25.5523 4 26 4.44772 26 5V27C26 27.5523 25.5523 28 25 28H20.5C19.9477 28 19.5 27.5523 19.5 27V5Z" fill="url(#nexus-col2)" />
                  <defs>
                    <linearGradient id="nexus-col1" x1="6" y1="4" x2="12.5" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0284c7" />
                      <stop offset="1" stopColor="#0369a1" />
                    </linearGradient>
                    <linearGradient id="nexus-diag" x1="6.5" y1="5" x2="22" y2="27" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00e5ff" />
                      <stop offset="0.6" stopColor="#38bdf8" />
                      <stop offset="1" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="nexus-col2" x1="19.5" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8" />
                      <stop offset="1" stopColor="#00e5ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div>
              <div className="font-extrabold tracking-widest text-sm text-white font-mono flex items-center gap-1.5 leading-none">
                NEXUS
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
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
