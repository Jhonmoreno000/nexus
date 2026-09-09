import React, { useState } from 'react';
import { Settings, Sliders, Cpu, Save, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [fontSize, setFontSize] = useState('13');
  const [autoSave, setAutoSave] = useState(true);
  const [statementTimeout, setStatementTimeout] = useState('3000');
  const [aiProvider, setAiProvider] = useState('local');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-[#0a0e17] space-y-8 select-none font-sans relative">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex items-center justify-between z-10 relative border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 border border-white/10 flex items-center justify-center shadow-lg shadow-black/40">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Simulator & Editor Settings</h1>
            <p className="text-[13px] font-medium text-slate-400 mt-1">Configure IDE preferences, sandbox resource boundaries, and AI mentor providers</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[13px] transition-all shadow-md active:scale-95 ${
            saved 
            ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Successfully' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="max-w-3xl space-y-6 z-10 relative">
        {/* Editor Settings Card */}
        <div className="p-6 rounded-[1.5rem] bg-[#121927]/80 backdrop-blur-xl border border-white/5 space-y-5 shadow-xl">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sliders className="w-4 h-4 text-blue-400" />
            </div>
            <span>Monaco Editor Preferences</span>
          </h3>

          <div className="grid grid-cols-2 gap-6 text-[13px]">
            <div className="space-y-2">
              <label className="text-slate-300 font-semibold tracking-tight">Editor Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full bg-[#0a0e17] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium appearance-none"
              >
                <option value="12">12px (Compact)</option>
                <option value="13">13px (Default IDE)</option>
                <option value="14">14px (Comfort)</option>
                <option value="16">16px (Large)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-semibold tracking-tight">Automatic Query Saving</label>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${autoSave ? 'bg-blue-500' : 'bg-white/10 border border-white/5'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${autoSave ? 'left-[22px]' : 'left-0.5'}`}></div>
                </button>
                <span className="text-slate-400 font-medium">Save drafts on keystroke</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Guardrails Card */}
        <div className="p-6 rounded-[1.5rem] bg-[#121927]/80 backdrop-blur-xl border border-white/5 space-y-5 shadow-xl">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <span>PostgreSQL Sandbox Policy Boundaries</span>
          </h3>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold tracking-tight">Statement Timeout Limit</label>
              <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{statementTimeout} ms</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={statementTimeout}
              onChange={(e) => setStatementTimeout(e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <p className="text-[12px] text-slate-500 font-medium mt-1.5">
              Statements exceeding this duration will be terminated by the SQL Gateway watchdog to prevent runaway joins.
            </p>
          </div>
        </div>

        {/* AI Tutor Provider Card */}
        <div className="p-6 rounded-[1.5rem] bg-[#121927]/80 backdrop-blur-xl border border-white/5 space-y-5 shadow-xl">
          <h3 className="text-[15px] font-bold text-white flex items-center gap-2.5 pb-3 border-b border-white/5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span>AI Tutor Inference Provider</span>
          </h3>

          <div className="space-y-2 text-[13px]">
            <label className="text-slate-300 font-semibold tracking-tight">Active Model Provider</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full bg-[#0a0e17] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium appearance-none"
            >
              <option value="local">Local Socratic Rules Engine (Deterministic)</option>
              <option value="ollama">Ollama (Local LLM via localhost:11434)</option>
              <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
              <option value="claude">Anthropic Claude 3.5 Sonnet</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};