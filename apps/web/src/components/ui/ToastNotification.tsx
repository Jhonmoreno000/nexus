import React from 'react';
import { CheckCircle2, Trophy, Award, Zap, Lightbulb, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'objective' | 'mission' | 'level_up' | 'hint' | 'query' | 'info';
  title: string;
  message: string;
  xp?: number;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none select-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 shadow-2xl flex items-start gap-3 text-xs animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'mission' ? (
                <Trophy className="w-5 h-5 text-amber-400" />
              ) : toast.type === 'objective' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'level_up' ? (
                <Award className="w-5 h-5 text-indigo-400" />
              ) : toast.type === 'hint' ? (
                <Lightbulb className="w-5 h-5 text-sky-400" />
              ) : (
                <Zap className="w-5 h-5 text-sky-400" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100 text-xs tracking-wide">{toast.title}</span>
                {toast.xp && (
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 font-mono font-bold text-[10px] border border-sky-500/25">
                    +{toast.xp} XP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug font-normal">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5 shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
