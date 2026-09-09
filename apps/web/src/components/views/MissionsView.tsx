import React, { useState, useEffect } from 'react';
import { Crosshair, Play, Filter, CheckCircle2, Clock, Signal, AlertCircle } from 'lucide-react';

interface MissionSummary {
  id: string;
  incidentNumber: number;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeRemainingSeconds: number;
  context: string;
  objectivesCount: number;
  completed: boolean;
  relatedTables: string[];
}

interface MissionsViewProps {
  onSelectMission: (missionId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onSelectMission }) => {
  const [filter, setFilter] = useState<string>('All');
  const [missions, setMissions] = useState<MissionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/missions')
      .then((r) => r.json())
      .then((data) => {
        setMissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredMissions = filter === 'All'
    ? missions
    : missions.filter((m) => m.difficulty.toLowerCase() === filter.toLowerCase());

  const getDifficultyColor = (d: string) => {
    switch (d.toLowerCase()) {
      case 'beginner': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'intermediate': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      case 'advanced': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'expert': return 'text-purple-400 border-purple-500/20 bg-purple-500/10';
      default: return 'text-slate-300 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-black space-y-8 select-none font-sans">
      {/* Header & Filter Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.1rem] bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Crosshair className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Missions Catalog</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Select a real-world database incident to debug in the IDE workspace</p>
          </div>
        </div>

        {/* Difficulty Filter Tabs - Native Pill Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-full text-[13px]">
          {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                filter === tab
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-2 gap-6 max-w-7xl">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            className="p-6 rounded-[2rem] bg-[#0a0e17] border border-white/10 hover:border-blue-500/50 hover:bg-[#111622] transition-all duration-300 space-y-5 flex flex-col justify-between shadow-xl group cursor-pointer"
            onClick={() => onSelectMission(m.id)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-blue-400 tracking-tight">Incident #{m.incidentNumber}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">{m.domain}</span>
                </div>
                <span className={`text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full border ${getDifficultyColor(m.difficulty)}`}>
                  {m.difficulty}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                  {m.title}
                </h3>
                <p className="text-[13px] text-slate-400 leading-relaxed font-medium line-clamp-2">
                  {m.context}
                </p>
              </div>

              {/* Related Tables Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {m.relatedTables.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-slate-300 text-[11px] font-semibold tracking-wide">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {Math.floor(m.timeRemainingSeconds / 60)} min
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 opacity-80" />
                  {m.objectivesCount} Objectives
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMission(m.id);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500 group-hover:bg-blue-400 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-blue-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};