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
  initialSeconds = 1458
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-b border-white/5 bg-[#0f141f] px-8 py-5 flex items-center justify-between select-none font-sans">
      {/* Left: Incident Title, Badge, Description */}
      <div className="max-w-3xl space-y-1.5">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-[17px] font-semibold text-white tracking-tight flex items-center gap-3">
            <span>Incident #{incidentNumber} — {title}</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              In Progress
            </span>
          </h1>
        </div>
        <p className="text-[13px] text-slate-400 font-medium leading-relaxed pl-[46px]">
          {subtitle}
        </p>
      </div>

      {/* Right: Difficulty & Live Countdown Timer */}
      <div className="flex items-center gap-6 pl-4">
        {/* Difficulty */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide">Difficulty</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
            <Signal className="w-4 h-4" />
            <span>{difficulty}</span>
          </div>
        </div>

        <div className="w-px h-10 bg-white/10"></div>

        {/* Live Countdown Timer with Native Pill Style */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide">Time Remaining</span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 text-slate-200 text-sm font-semibold tracking-tight border border-white/5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className={seconds < 300 ? 'text-rose-400' : 'text-slate-200'}>
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};