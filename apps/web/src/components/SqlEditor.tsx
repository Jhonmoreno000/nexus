import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Lightbulb, CheckCircle2, Code2, Plus, X, Maximize2 } from 'lucide-react';

interface SqlEditorProps {
  sql: string;
  setSql: (val: string) => void;
  onRunQuery: () => void;
  onSubmitSolution: () => void;
  onOpenHint: () => void;
  isRunning: boolean;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  sql,
  setSql,
  onRunQuery,
  onSubmitSolution,
  onOpenHint,
  isRunning
}) => {
  const [tabs, setTabs] = useState([{ id: 'query-03', title: 'Query 03' }]);
  const [activeTab, setActiveTab] = useState('query-03');

  const addTab = () => {
    const newId = `query-0${tabs.length + 1}`;
    const newTitle = `Query 0${tabs.length + 1}`;
    setTabs([...tabs, { id: newId, title: newTitle }]);
    setActiveTab(newId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunQuery();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="flex flex-col h-full bg-[#0a0e17] border-b border-white/5 select-none font-sans"
    >
      {/* Tab Header Bar */}
      <div className="h-12 bg-[#0a0e17] border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 overflow-x-auto h-full">
          <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold mr-4">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-white tracking-tight">SQL Editor</span>
          </div>

          <div className="flex items-center h-full pt-2">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-[13px] cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/5 text-white font-medium shadow-sm border-t-2 border-blue-500'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-t-2 border-transparent'
                }`}
              >
                <span>{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTabs(tabs.filter((t) => t.id !== tab.id));
                    }}
                    className="hover:text-rose-400 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addTab}
              className="p-1.5 ml-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <span>PostgreSQL 16</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Auto-save
          </span>
          <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-[200px] relative">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={sql}
          onChange={(val) => setSql(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 22,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            formatOnPaste: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth'
          }}
        />
      </div>

      {/* Footer Action Bar */}
      <div className="h-14 bg-[#0a0e17] border-t border-white/5 px-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onRunQuery}
            disabled={isRunning}
            className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[13px] tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Query</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-600/50 text-[10px] text-white opacity-80 border border-blue-400/30">⌘ ↵</span>
          </button>

          <button
            onClick={onSubmitSolution}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold text-[13px] tracking-wide transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Solution</span>
          </button>
        </div>

        <button
          onClick={onOpenHint}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[13px] font-semibold tracking-wide transition-all active:scale-95"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Need a Hint?</span>
        </button>
      </div>
    </div>
  );
};