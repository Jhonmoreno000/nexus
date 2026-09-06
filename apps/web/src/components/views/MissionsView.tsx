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
      case 'beginner': return 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30';
      case 'intermediate': return 'text-sky-400 border-sky-800/40 bg-sky-950/30';
      case 'advanced': return 'text-amber-400 border-amber-800/40 bg-amber-950/30';
      case 'expert': return 'text-purple-400 border-purple-800/40 bg-purple-950/30';
      default: return 'text-slate-300 border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      {/* Header & Filter Bar */}
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Crosshair className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Incident Simulator: Missions Catalog</h1>
            <p className="text-xs text-slate-400">Select a real-world database incident to debug in the IDE workspace</p>
          </div>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0a1324] border border-[#162744] rounded-xl text-xs">
          {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-[#00e5ff] text-[#070b14] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12223f]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-2 gap-5">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] hover:border-[#0284c7] transition-all space-y-4 flex flex-col justify-between shadow-lg group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#00e5ff]">INCIDENT #{m.incidentNumber}</span>
                  <span className="text-[10px] text-slate-500 font-sans">• {m.domain}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(m.difficulty)}`}>
                  {m.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {m.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {m.context}
              </p>

              {/* Related Tables Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.relatedTables.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-[#060c18] border border-[#172742] text-slate-300 text-[11px] font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#13233c] flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {Math.floor(m.timeRemainingSeconds / 60)} min
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  {m.objectivesCount} Objectives
                </span>
              </div>

              <button
                onClick={() => onSelectMission(m.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs tracking-wide transition-all active:scale-95 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>LAUNCH INCIDENT</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
