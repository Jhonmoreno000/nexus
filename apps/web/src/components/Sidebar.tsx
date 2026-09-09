import React from 'react';
import {
  LayoutDashboard,
  Crosshair,
  Database,
  BarChart3,
  Briefcase,
  History,
  Settings,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedMissionsCount: number;
  totalMissionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  completedMissionsCount = 0,
  totalMissionsCount = 6
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missions', label: 'Missions', icon: Crosshair },
    { id: 'database-lab', label: 'Database Lab', icon: Database },
    { id: 'skills', label: 'Skills', icon: BarChart3 },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const progressPercentage = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0f141f] flex flex-col justify-between p-4 select-none font-sans">
      {/* Top Nav Links */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Progress Card (Mobile Style) */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="p-4 rounded-[1.25rem] bg-white/5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs tracking-tight">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Career Progress</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">{progressPercentage}%</span>
          </div>
          <div className="text-sm font-semibold text-blue-400 tracking-tight">
            {completedMissionsCount} of {totalMissionsCount} Missions
          </div>
          {/* Native Progress Bar */}
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};