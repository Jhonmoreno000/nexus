import React, { useState } from 'react';
import { Settings, Sliders, Cpu, Save, RefreshCw, Sparkles } from 'lucide-react';

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
    <div className="flex-1 p-6 overflow-y-auto bg-[#070b14] space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[#14233c] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 border border-[#00e5ff]/40 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#00e5ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Simulator & Editor Settings</h1>
            <p className="text-xs text-slate-400">Configure IDE preferences, sandbox resource boundaries, and AI mentor providers</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs glow-cyan transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Editor Settings Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Monaco Editor Preferences</span>
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Editor Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full bg-[#070c17] border border-[#172742] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="12">12px (Compact)</option>
                <option value="13">13px (Default IDE)</option>
                <option value="14">14px (Comfort)</option>
                <option value="16">16px (Large)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Automatic Query Saving</label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <span className="text-slate-400">Save drafts on keystroke</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Guardrails Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>PostgreSQL Sandbox Policy Boundaries</span>
          </h3>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Statement Timeout Limit</label>
              <span className="text-cyan-400 font-mono font-bold">{statementTimeout} ms</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={statementTimeout}
              onChange={(e) => setStatementTimeout(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Statements exceeding this duration will be terminated by the SQL Gateway watchdog to prevent runaway joins.
            </p>
          </div>
        </div>

        {/* AI Tutor Provider Card */}
        <div className="p-5 rounded-2xl bg-[#090f1e] border border-[#172d54] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Tutor Inference Provider</span>
          </h3>

          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-medium">Active Model Provider</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full bg-[#070c17] border border-[#172742] rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
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
