const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. apps/web/src/types.ts
write('apps/web/src/types.ts', `
export interface TableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
}

export interface SchemaTable {
  name: string;
  columns: TableColumn[];
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  success: boolean;
  error?: string;
  executionPlan?: string[];
}

export interface EvaluationResult {
  passed: boolean;
  totalScore: number;
  breakdown: {
    correctness: number;
    logic: number;
    robustness: number;
    performance: number;
    readability: number;
    security: number;
  };
  testCases: {
    name: string;
    passed: boolean;
    feedback: string;
  }[];
  explanation: string;
}

export interface TutorHint {
  diagnosis: string;
  hintLevel: number;
  hint: string;
  concept: string;
  nextQuestion: string;
  codeSnippet?: string;
}
`);

// 2. apps/web/src/index.css
write('apps/web/src/index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

/* Custom Scrollbar for IDE look */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0B1120;
}
::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

.glow-cyan {
  box-shadow: 0 0 15px -3px rgba(6, 182, 212, 0.3);
}

.glow-cyan-sm {
  box-shadow: 0 0 8px -2px rgba(6, 182, 212, 0.4);
}
`);

// 3. apps/web/src/components/TopNavbar.tsx
write('apps/web/src/components/TopNavbar.tsx', `
import React from 'react';
import { Bell, Database } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  return (
    <header className="h-14 border-b border-[#15233d] bg-[#070b14] px-4 flex items-center justify-between z-20 select-none">
      {/* Left: Brand Logo + Environments */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#064e3b]/30 border border-[#059669]/40 text-[#10b981] font-medium tracking-wide text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            STAGING ENVIRONMENT
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1627] border border-[#1e2e4a] text-slate-300 font-medium text-[11px]">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>PostgreSQL 16</span>
          </div>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#111e33] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#06b6d4]"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1a2942]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#06b6d4] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0a1120] rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
              AR
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-100">Alex Rivera</span>
            <span className="text-[10px] text-slate-400">Junior Developer</span>
          </div>
        </div>
      </div>
    </header>
  );
};
`);

// 4. apps/web/src/components/Sidebar.tsx
write('apps/web/src/components/Sidebar.tsx', `
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
              className={\`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative \${
                isActive
                  ? 'bg-[#0f213d] text-[#00e5ff] font-semibold border-l-2 border-[#00e5ff]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1524]'
              }\`}
            >
              <Icon className={\`w-4 h-4 \${isActive ? 'text-[#00e5ff]' : 'text-slate-400'}\`} />
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
`);

// 5. apps/web/src/components/IncidentHeader.tsx
write('apps/web/src/components/IncidentHeader.tsx', `
import React, { useState, useEffect } from 'react';
import { FileText, Clock, Signal } from 'lucide-react';

interface IncidentHeaderProps {
  incidentNumber?: number;
  title?: string;
  subtitle?: string;
  difficulty?: string;
  initialSeconds?: number;
}

export const IncidentHeader: React.FC<IncidentHeaderProps> = ({
  incidentNumber = 1842,
  title = 'Payment Integrity',
  subtitle = "The payment system is showing inconsistencies. Some orders are marked as paid, but they don't have an associated transaction. Your task is to identify the root cause and propose a solution.",
  difficulty = 'Advanced',
  initialSeconds = 1458 // 24:18
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="border-b border-[#15233d] bg-[#090f1d] px-6 py-3 flex items-center justify-between select-none">
      {/* Left: Incident Title, Badge, Description */}
      <div className="max-w-3xl space-y-1">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-300" />
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2.5">
            <span>INCIDENT #{incidentNumber} — {title}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#032e22] text-[#34d399] border border-[#059669]/50 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              IN PROGRESS
            </span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-normal leading-relaxed pl-8">
          {subtitle}
        </p>
      </div>

      {/* Right: Difficulty & Live Countdown Timer */}
      <div className="flex items-center gap-8 pl-4">
        {/* Difficulty */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Difficulty</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Signal className="w-4 h-4 text-[#00e5ff]" />
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Time Remaining */}
        <div
          onClick={() => setIsRunning(!isRunning)}
          title="Click to pause/resume countdown"
          className="flex flex-col items-start gap-0.5 cursor-pointer group"
        >
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider group-hover:text-slate-300">Time Remaining</span>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 font-mono">
            <Clock className="w-4 h-4 text-slate-400 group-hover:text-cyan-300" />
            <span className="text-base tracking-wider">{formatTime(seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
`);

// 6. apps/web/src/components/MissionBriefing.tsx
write('apps/web/src/components/MissionBriefing.tsx', `
import React from 'react';
import { BookOpen } from 'lucide-react';

interface Objective {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface MissionBriefingProps {
  context: string;
  objectives: Objective[];
  relatedTables: string[];
  activeObjectiveId: number;
  onObjectiveSelect: (id: number) => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  context,
  objectives,
  relatedTables,
  activeObjectiveId,
  onObjectiveSelect
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#0a101f] border-r border-[#15233d] overflow-y-auto select-none">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm border-b border-[#142036] pb-3">
          <BookOpen className="w-4 h-4 text-[#00e5ff]" />
          <span>Mission Briefing</span>
        </div>

        {/* Context */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Context</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {context}
          </p>
        </div>

        {/* Your Objectives */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Your Objectives</h3>
          <div className="space-y-2.5">
            {objectives.map((obj) => {
              const isSelected = activeObjectiveId === obj.id;
              return (
                <div
                  key={obj.id}
                  onClick={() => onObjectiveSelect(obj.id)}
                  className={\`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer \${
                    isSelected
                      ? 'bg-[#0f1d36] border-[#0284c7]/60 shadow-sm'
                      : 'bg-[#080d19] border-[#15233d] hover:border-[#1e3357]'
                  }\`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Circle Stepper Number */}
                    <div
                      className={\`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 \${
                        obj.completed
                          ? 'bg-[#06b6d4] text-[#070b14]'
                          : isSelected
                          ? 'bg-[#0284c7] text-white'
                          : 'bg-[#142036] text-slate-400'
                      }\`}
                    >
                      {obj.id}
                    </div>
                    <div className="space-y-0.5">
                      <div className={\`text-xs font-semibold \${isSelected ? 'text-white' : 'text-slate-200'}\`}>
                        {obj.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Tables */}
      <div className="pt-4 border-t border-[#142036] space-y-2">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Tables</h4>
        <div className="flex flex-wrap gap-1.5">
          {relatedTables.map((tbl) => (
            <span
              key={tbl}
              className="px-2.5 py-1 rounded bg-[#0d1627] border border-[#1c2c48] text-slate-300 text-xs font-mono font-medium hover:border-[#06b6d4] hover:text-[#00e5ff] transition-colors cursor-pointer"
            >
              {tbl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
`);

console.log('Web types, navbar, sidebar, header, briefing written.');
