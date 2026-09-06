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
      className="flex flex-col h-full bg-[#080d19] border-b border-[#15233d] select-none"
    >
      {/* Tab Header Bar */}
      <div className="h-10 bg-[#060a14] border-b border-[#15233d] flex items-center justify-between px-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mr-2">
            <Code2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span className="font-semibold text-white">SQL Editor</span>
          </div>

          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer transition-all border-t-2 ${
                activeTab === tab.id
                  ? 'bg-[#0b1322] text-[#00e5ff] border-[#00e5ff] font-semibold'
                  : 'text-slate-400 border-transparent hover:bg-[#0c1527] hover:text-slate-200'
              }`}
            >
              <span>{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTabs(tabs.filter((t) => t.id !== tab.id));
                  }}
                  className="hover:text-red-400 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addTab}
            title="New query tab"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#111e33] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>PostgreSQL 16</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            Auto-save
          </span>
          <button title="Toggle Fullscreen" className="text-slate-400 hover:text-slate-200">
            <Maximize2 className="w-3 h-3" />
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
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            formatOnPaste: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth'
          }}
        />
      </div>

      {/* Footer Action Bar */}
      <div className="h-12 bg-[#060a14] border-t border-[#15233d] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onRunQuery}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#00bcd4] hover:bg-[#00acc1] text-[#070b14] font-bold text-xs tracking-wide transition-all duration-150 glow-cyan-sm active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>RUN QUERY</span>
            <span className="ml-1 text-[10px] opacity-75 font-mono">Ctrl + Enter</span>
          </button>

          <button
            onClick={onSubmitSolution}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0d1627] hover:bg-[#132038] border border-[#1e2f4e] text-slate-200 font-semibold text-xs tracking-wide transition-all active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>SUBMIT SOLUTION</span>
          </button>
        </div>

        <button
          onClick={onOpenHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1627] hover:bg-[#132038] border border-[#1e2f4e] text-slate-300 hover:text-cyan-300 text-xs font-semibold tracking-wide transition-all active:scale-95"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>HINT</span>
        </button>
      </div>
    </div>
  );
};
