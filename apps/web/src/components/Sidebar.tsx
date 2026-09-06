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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missions', label: 'Missions', icon: Crosshair },
    { id: 'database-lab', label: 'Database Lab', icon: Database },
    { id: 'skills', label: 'Skills', icon: BarChart3 },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 border-r border-[#15233d] bg-[#070b14] flex flex-col justify-between p-3 select-none">
      {/* Top Nav Links */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#0f213d] text-[#00e5ff] font-semibold border-l-2 border-[#00e5ff]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1524]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#00e5ff]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Progress Card & Mottos */}
      <div className="space-y-4 pt-4 border-t border-[#142036]">
        {/* Your Progress Widget */}
        <div className="p-3 rounded-xl bg-[#0b1322] border border-[#172640] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#06b6d4]" />
              <span>Your Progress</span>
            </div>
          </div>
          <div className="text-xs font-bold text-[#00e5ff]">
            3 / 12 Missions
          </div>
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#142036] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#00e5ff] rounded-full"
              style={{ width: '25%' }}
            ></div>
          </div>
        </div>

        {/* Motivational Motto */}
        <div className="px-1 text-[11px] leading-relaxed text-slate-400 space-y-0.5">
          <p>Better queries.</p>
          <p>Smarter decisions.</p>
          <p>Bigger opportunities.</p>
        </div>
      </div>
    </aside>
  );
};
