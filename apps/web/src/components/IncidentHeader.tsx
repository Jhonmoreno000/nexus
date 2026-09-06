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
    <div className="border-b border-slate-800/60 bg-[#080d1a]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between select-none">
      {/* Left: Incident Title, Badge, Description */}
      <div className="max-w-3xl space-y-1">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <h1 className="text-lg font-bold text-slate-100 tracking-wide flex items-center gap-2.5">
            <span>INCIDENT #{incidentNumber} — {title}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Difficulty</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400/90">
            <Signal className="w-3.5 h-3.5" />
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Live Countdown Timer with Translucent Glass */}
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Time Remaining</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-200 font-mono text-sm font-semibold shadow-inner">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className={seconds < 300 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}>
              {formatTime(seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
