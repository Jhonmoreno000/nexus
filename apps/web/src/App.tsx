import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { IncidentHeader } from './components/IncidentHeader';
import { MissionBriefing } from './components/MissionBriefing';
import { SqlEditor } from './components/SqlEditor';
import { QueryResults } from './components/QueryResults';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { SkillsProgress } from './components/SkillsProgress';
import { HintUnlockModal } from './components/modals/HintUnlockModal';
import { EvaluationModal } from './components/EvaluationModal';
import { TablePreviewModal } from './components/modals/TablePreviewModal';
import { ToastNotification, ToastMessage } from './components/ui/ToastNotification';
import { UserProfileData } from './components/modals/ProfileModal';
import { DashboardView } from './components/views/DashboardView';
import { MissionsView } from './components/views/MissionsView';
import { DatabaseLabView } from './components/views/DatabaseLabView';
import { SkillsView } from './components/views/SkillsView';
import { CareerView } from './components/views/CareerView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsView } from './components/views/SettingsView';
import { QueryResult, EvaluationResult, SchemaTable } from './types';
import { ChevronLeft } from 'lucide-react';

const DEFAULT_STARTER_1842 = `-- Incident #1842: Payment Integrity Investigation
-- Write your diagnostic query to locate paid orders lacking transactions.

SELECT
    o.id AS order_id,
    o.customer_id,
    o.status AS order_status,
    p.id AS payment_id,
    t.id AS transaction_id
FROM orders o
-- HINT: Investigate the relationship with payments and transactions
-- Join tables and find missing records
LIMIT 25;`;

const INITIAL_ROWS = [
  { order_id: 10001, customer_id: 3421, status: 'paid', payment_id: 5601, payment_status: 'paid', transaction_id: null, transaction_status: null },
  { order_id: 10002, customer_id: 1876, status: 'paid', payment_id: 5602, payment_status: 'paid', transaction_id: 8821, transaction_status: 'completed' },
  { order_id: 10003, customer_id: 2390, status: 'paid', payment_id: 5603, payment_status: 'paid', transaction_id: null, transaction_status: null }
];

export function App() {
  const [activeTab, setActiveTab] = useState('missions');
  const [activeMissionId, setActiveMissionId] = useState('1842');
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

  // Real Persistent User State (Starts clean from 0)
  const [user, setUser] = useState<UserProfileData>({
    name: 'Jhon Moreno',
    username: 'Jhonmoreno000',
    role: 'Database Engineering Trainee',
    level: 1,
    xp: 0,
    rankTitle: 'Level 1 Trainee',
    completedMissions: [],
    queriesExecuted: 0,
    badges: []
  });

  // Real-time Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Mission State
  const [missionData, setMissionData] = useState<{
    id: string;
    incidentNumber: number;
    title: string;
    domain: string;
    difficulty: string;
    timeRemainingSeconds: number;
    context: string;
    objectives: { id: number; title: string; description: string; completed: boolean }[];
    relatedTables: string[];
    initialQuery: string;
    schema: SchemaTable[];
    quizQuestions?: any[];
    sideQuests?: any[];
    unlockedHints?: number[];
  }>({
    id: '1842',
    incidentNumber: 1842,
    title: 'Payment Integrity',
    domain: 'Fintech / Payments',
    difficulty: 'Advanced',
    timeRemainingSeconds: 1458,
    context: "The payment system is showing inconsistencies. 3.7% of orders appear as paid, but they do not have a transaction associated. This is affecting customer trust and revenue reconciliation.",
    objectives: [
      { id: 1, title: '1. Identify the affected records', description: 'Find orders marked as paid without a transaction.', completed: false },
      { id: 2, title: '2. Determine the root cause', description: 'Analyze the data and relationships between tables.', completed: false },
      { id: 3, title: '3. Propose a solution', description: 'Suggest a fix to prevent this issue in the future.', completed: false },
      { id: 4, title: '4. Verify the integrity', description: 'Confirm that the data is consistent after your changes.', completed: false }
    ],
    relatedTables: ['orders', 'payments', 'transactions', 'refunds'],
    initialQuery: DEFAULT_STARTER_1842,
    schema: []
  });

  const [sql, setSql] = useState(DEFAULT_STARTER_1842);
  const [isRunning, setIsRunning] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isEvalOpen, setIsEvalOpen] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [previewTable, setPreviewTable] = useState<string | null>(null);
  const [activeObjectiveId, setActiveObjectiveId] = useState(1);

  const [queryResults, setQueryResults] = useState<QueryResult>({
    columns: ['order_id', 'customer_id', 'status', 'payment_id', 'payment_status', 'transaction_id', 'transaction_status'],
    rows: INITIAL_ROWS,
    rowCount: 3,
    executionTimeMs: 24,
    success: true
  });

  // Fetch real user profile from backend
  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    loadMission('1842');
  }, []);

  // Load Mission from API
  const loadMission = async (id: string) => {
    setActiveMissionId(id);
    setIsWorkspaceOpen(true);
    setActiveTab('missions');
    try {
      const res = await fetch(`/api/missions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMissionData(data);
        setSql(data.initialQuery || '');
      }
    } catch (e) {
      console.error('Failed to load mission:', e);
    }
  };

  // Reset Progress Handler
  const handleResetProgress = async () => {
    try {
      const res = await fetch('/api/user/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        await loadMission(activeMissionId);
        addToast({
          type: 'info',
          title: 'Simulation Reset',
          message: 'All scores, unlocked hints, and completed objectives have been reset to zero.'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Query against Real PostgreSQL Engine
  const handleRunQuery = async () => {
    setIsRunning(true);
    try {
      const res = await fetch(`/api/missions/${activeMissionId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      if (res.ok) {
        const data = await res.json();
        setQueryResults(data);
        addToast({
          type: 'query',
          title: 'Query Executed',
          message: `PostgreSQL executed in ${data.executionTimeMs}ms (${data.rowCount} rows returned).`
        });
        fetchUserProfile();
      } else {
        const err = await res.json();
        setQueryResults({
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 12,
          success: false,
          error: err.error || 'PostgreSQL Engine execution error'
        });
        addToast({
          type: 'info',
          title: 'Query Error',
          message: err.error || 'Syntax or relational validation failed.'
        });
      }
    } catch (err: any) {
      setQueryResults({
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 8,
        success: false,
        error: err.message || 'Network error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution against Real Multi-layer Evaluator
  const handleSubmitSolution = async () => {
    try {
      const res = await fetch(`/api/missions/${activeMissionId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql })
      });
      if (res.ok) {
        const data = await res.json();
        setEvalResult(data);
        if (data.passed) {
          addToast({
            type: 'mission',
            title: 'Incident Resolved!',
            message: `All test cases passed with a score of ${data.totalScore}/100. Progress saved!`,
            xp: 200
          });
          // Refresh user data (XP, level, completed missions)
          await fetchUserProfile();
          // Update mission data objectives as completed
          setMissionData((prev) => ({
            ...prev,
            objectives: prev.objectives.map((o) => ({ ...o, completed: true }))
          }));
        } else {
          addToast({
            type: 'info',
            title: 'Evaluation Incomplete',
            message: 'Some assertions did not pass. Check the evaluation report for details.'
          });
        }
      } else {
        const err = await res.json();
        setEvalResult({
          passed: false,
          totalScore: 0,
          breakdown: { correctness: 0, logic: 0, robustness: 0, performance: 0, readability: 0, security: 0 },
          testCases: [{ name: 'PostgreSQL Engine Validation', passed: false, feedback: err.error || 'Syntax or evaluation error' }],
          explanation: 'PostgreSQL rejected the query: ' + (err.error || 'Execution failure')
        });
      }
    } catch (err: any) {
      console.error(err);
    }
    setIsEvalOpen(true);
  };

  // Handle Hint Unlocked via Quiz or Side Quest
  const handleHintUnlocked = async (level: number) => {
    try {
      const res = await fetch('/api/user/unlock-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: activeMissionId, level })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        addToast({
          type: 'hint',
          title: `Hint Level ${level} Unlocked!`,
          message: 'Quiz/Side Quest passed! Socratic architectural hint is now available.',
          xp: 25
        });
        setMissionData((prev: any) => ({
          ...prev,
          unlockedHints: [...(prev.unlockedHints || []), level]
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSidebarTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'missions') {
      setIsWorkspaceOpen(true);
    } else {
      setIsWorkspaceOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b14] overflow-hidden text-slate-100">
      {/* 1. Top Navbar with Modals and User Profile */}
      <TopNavbar
        user={user}
        onOpenIncident={(id) => loadMission(id)}
        onResetProgress={handleResetProgress}
      />

      {/* 2. Main Layout (Sidebar + Body) */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleSidebarTabChange}
          completedMissionsCount={user.completedMissions.length}
          totalMissionsCount={6}
        />

        {/* 3. Main Views Router */}
        {activeTab === 'dashboard' && (
          <DashboardView onSelectMission={loadMission} user={user} />
        )}
        {activeTab === 'database-lab' && <DatabaseLabView />}
        {activeTab === 'skills' && <SkillsView user={user} />}
        {activeTab === 'career' && <CareerView user={user} />}
        {activeTab === 'history' && (
          <HistoryView
            onLoadQuery={(mId, qSql) => {
              loadMission(mId);
              setSql(qSql);
            }}
          />
        )}
        {activeTab === 'settings' && <SettingsView />}

        {/* 4. Missions Tab (either Missions Selector or Full IDE Workspace) */}
        {activeTab === 'missions' && !isWorkspaceOpen && (
          <MissionsView onSelectMission={loadMission} />
        )}

        {activeTab === 'missions' && isWorkspaceOpen && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#070b14]">
            {/* Incident Header */}
            <div className="relative">
              <IncidentHeader
                incidentNumber={missionData.incidentNumber}
                title={missionData.title}
                subtitle={missionData.context}
                difficulty={missionData.difficulty}
                initialSeconds={missionData.timeRemainingSeconds}
              />
              <button
                onClick={() => setIsWorkspaceOpen(false)}
                className="absolute right-72 top-3.5 flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 font-medium px-2.5 py-1 rounded-lg bg-[#0c1527] border border-[#172b4c] transition-colors"
                title="View all 6 incidents"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>All Incidents</span>
              </button>
            </div>

            {/* 3-Column IDE Workspace Layout */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
              {/* Column 1: Mission Briefing */}
              <div className="col-span-3 h-full overflow-hidden">
                <MissionBriefing
                  context={missionData.context}
                  objectives={missionData.objectives}
                  relatedTables={missionData.relatedTables}
                  activeObjectiveId={activeObjectiveId}
                  onObjectiveSelect={setActiveObjectiveId}
                  onTableClick={(tbl) => setPreviewTable(tbl)}
                />
              </div>

              {/* Column 2: Center Editor & Live Query Results */}
              <div className="col-span-6 h-full flex flex-col overflow-hidden border-r border-[#15233d]">
                <div className="h-[52%] overflow-hidden">
                  <SqlEditor
                    sql={sql}
                    setSql={setSql}
                    onRunQuery={handleRunQuery}
                    onSubmitSolution={handleSubmitSolution}
                    onOpenHint={() => setIsHintOpen(true)}
                    isRunning={isRunning}
                  />
                </div>

                <div className="h-[48%] overflow-hidden">
                  <QueryResults results={queryResults} />
                </div>
              </div>

              {/* Column 3: Database Explorer & Skills Progress */}
              <div className="col-span-3 h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <DatabaseExplorer schema={missionData.schema} />
                </div>

                <div className="shrink-0">
                  <SkillsProgress completedMissionsCount={user.completedMissions.length} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gamified Hint Unlock Modal (Fisher-Yates Randomized Quiz & Side Quests) */}
      <HintUnlockModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        missionId={activeMissionId}
        missionTitle={missionData.title}
        quizQuestions={missionData.quizQuestions || []}
        sideQuests={missionData.sideQuests || []}
        unlockedHintLevels={missionData.unlockedHints || []}
        onHintUnlocked={handleHintUnlocked}
        onRunSideQuest={(snippet) => {
          setSql(snippet);
          addToast({
            type: 'info',
            title: 'Diagnostic Snippet Loaded',
            message: 'Side quest SQL copied to editor. Click "Run Query" to inspect records.'
          });
        }}
      />

      <EvaluationModal
        isOpen={isEvalOpen}
        onClose={() => setIsEvalOpen(false)}
        result={evalResult}
      />

      <TablePreviewModal
        isOpen={Boolean(previewTable)}
        onClose={() => setPreviewTable(null)}
        tableName={previewTable}
        schema={missionData.schema}
      />

      {/* Real-time Progress and Action Alerts */}
      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
