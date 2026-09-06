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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
