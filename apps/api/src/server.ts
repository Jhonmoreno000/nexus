import fastify from 'fastify';
import cors from '@fastify/cors';
import { MISSIONS_CATALOG } from './data/missions-catalog.js';
import { PostgresMissionSandbox } from './sandbox/postgres-engine.js';
import { SqlPolicyValidator } from './gateway/sql-policy.js';
import { UserStore } from './data/user-store.js';

const app = fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

const sandboxes = new Map<string, PostgresMissionSandbox>();

function getSandbox(missionId: string): PostgresMissionSandbox {
  if (!sandboxes.has(missionId)) {
    const mission = MISSIONS_CATALOG[missionId] || MISSIONS_CATALOG['1842'];
    sandboxes.set(missionId, new PostgresMissionSandbox(mission.schemaSql, mission.seedSql));
  }
  return sandboxes.get(missionId)!;
}

// 1. Health check
app.get('/api/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString(), service: 'nexus-api', engine: 'PostgreSQL 16 (pg-mem)' };
});

// 2. Real User Profile & Stats (Starts at 0% unless played)
app.get('/api/user/profile', async () => {
  return UserStore.get();
});

// 3. Reset User Progress
app.post('/api/user/reset', async () => {
  return UserStore.reset();
});

// 4. Complete Objective manually
app.post('/api/user/objective-complete', async (req) => {
  const { missionId, objectiveId } = req.body as { missionId: string; objectiveId: number };
  return UserStore.completeObjective(missionId, objectiveId);
});

// 5. Unlock Hint via Quiz / Side Quest
app.post('/api/user/unlock-hint', async (req) => {
  const { missionId, level } = req.body as { missionId: string; level: number };
  return UserStore.unlockHint(missionId, level);
});

// 6. List all playable missions / levels
app.get('/api/missions', async () => {
  const user = UserStore.get();
  return Object.values(MISSIONS_CATALOG).map((m) => ({
    id: m.id,
    incidentNumber: m.incidentNumber,
    title: m.title,
    domain: m.domain,
    difficulty: m.difficulty,
    timeRemainingSeconds: m.timeRemainingSeconds,
    context: m.context,
    objectivesCount: m.objectives.length,
    completed: user.completedMissions.includes(m.id),
    relatedTables: m.relatedTables
  }));
});

// 7. Get single mission details (including clean starter query, quizzes, and side quests)
app.get('/api/missions/:id', async (req) => {
  const { id } = req.params as { id: string };
  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  const user = UserStore.get();
  const completedObjs = user.completedObjectives[id] || [];

  return {
    id: mission.id,
    incidentNumber: mission.incidentNumber,
    title: mission.title,
    domain: mission.domain,
    difficulty: mission.difficulty,
    timeRemainingSeconds: mission.timeRemainingSeconds,
    context: mission.context,
    objectives: mission.objectives.map((o) => ({
      ...o,
      completed: completedObjs.includes(o.id)
    })),
    relatedTables: mission.relatedTables,
    initialQuery: mission.initialQuery,
    schema: mission.schemaTables,
    quizQuestions: mission.quizQuestions,
    sideQuests: mission.sideQuests,
    unlockedHints: user.unlockedHints[id] || []
  };
});

// 8. Execute SQL against the mission's real PostgreSQL instance
app.post('/api/missions/:id/execute', async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = req.body as { sql: string };
  if (!body || !body.sql) {
    return reply.status(400).send({ error: 'SQL query required' });
  }

  const policy = SqlPolicyValidator.validate(body.sql);
  if (!policy.allowed) {
    return reply.status(403).send({ success: false, error: policy.reason, columns: [], rows: [], rowCount: 0, executionTimeMs: 5 });
  }

  const sandbox = getSandbox(id);
  const result = sandbox.execute(body.sql);

  // Record real query in persistent user store
  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  UserStore.recordQuery({
    missionId: id,
    missionTitle: mission.title,
    sql: body.sql,
    executionTimeMs: result.executionTimeMs,
    rowCount: result.rowCount,
    status: result.success ? 'SUCCESS' : 'ERROR'
  });

  return result;
});

// Fallback execute
app.post('/api/sql/execute', async (req) => {
  const body = req.body as { sql: string };
  const sandbox = getSandbox('1842');
  return sandbox.execute(body.sql);
});

// 9. Multi-layer Evaluation for mission
app.post('/api/missions/:id/evaluate', async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = req.body as { sql: string };
  if (!body || !body.sql) {
    return reply.status(400).send({ error: 'SQL query required for evaluation' });
  }

  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  const sandbox = getSandbox(id);
  const execResult = sandbox.execute(body.sql);

  if (!execResult.success) {
    return reply.status(400).send({
      passed: false,
      totalScore: 0,
      breakdown: { correctness: 0, logic: 0, robustness: 0, performance: 0, readability: 0, security: 0 },
      testCases: [{ name: 'Syntax Check', passed: false, feedback: execResult.error || 'SQL syntax error in PostgreSQL' }],
      explanation: 'Your query produced a PostgreSQL error: ' + execResult.error
    });
  }

  const evalResult = mission.evaluator(body.sql, execResult.rows);

  if (evalResult.passed) {
    // Persist real progress: mark objectives and mission completed!
    UserStore.completeObjective(id, 1);
    UserStore.completeObjective(id, 2);
    UserStore.completeMission(id);
  }

  return evalResult;
});

// 10. Socratic AI Tutor Hints (Only available if unlocked!)
app.post('/api/missions/:id/hint', async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = req.body as { level: number };
  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  const level = Math.min(Math.max(1, body.level || 1), 3);
  const hintInfo = mission.hints[level] || mission.hints[1];

  const user = UserStore.get();
  const unlocked = (user.unlockedHints[id] || []).includes(level);

  return {
    diagnosis: `Analyzing query for ${mission.title}. Progressive hint level: ${level}/3.`,
    hintLevel: level,
    isUnlocked: unlocked,
    hint: unlocked ? hintInfo.hint : 'Hint locked. Complete the Concept Verification Quiz or Side Quest to unlock this hint!',
    concept: hintInfo.concept,
    nextQuestion: unlocked ? hintInfo.nextQuestion : 'Take the quiz to test your SQL reasoning.',
    codeSnippet: unlocked ? hintInfo.codeSnippet : undefined
  };
});

// 11. Database Lab Endpoints
app.get('/api/lab/tables', async () => {
  return [
    { name: 'customers', rows: 5, description: 'Customer identity accounts' },
    { name: 'orders', rows: 5, description: 'Financial order headers' },
    { name: 'payments', rows: 5, description: 'Payment gateway captures' },
    { name: 'transactions', rows: 3, description: 'Settled ledger records' },
    { name: 'refunds', rows: 0, description: 'Settled refund claims' }
  ];
});

app.post('/api/lab/execute', async (req) => {
  const body = req.body as { sql: string };
  const sandbox = getSandbox('1842');
  const result = sandbox.execute(body.sql || 'SELECT 1;');
  UserStore.recordQuery({
    missionId: 'lab',
    missionTitle: 'Database Lab Scratchpad',
    sql: body.sql,
    executionTimeMs: result.executionTimeMs,
    rowCount: result.rowCount,
    status: result.success ? 'SUCCESS' : 'ERROR'
  });
  return result;
});

// 12. History Endpoint (Real persistent history)
app.get('/api/history', async () => {
  return UserStore.get().queryHistory;
});

// 13. Skills Progression Endpoint
app.get('/api/skills/:userId', async () => {
  const user = UserStore.get();
  const progressRatio = user.completedMissions.length / 6;
  return [
    { skillId: 'sql-fundamentals', name: 'SQL Fundamentals', percentage: Math.min(100, Math.round(progressRatio * 100)), level: 'Mastered', icon: 'Code' },
    { skillId: 'relational-thinking', name: 'Relational Thinking', percentage: Math.min(100, Math.round(progressRatio * 85)), level: 'Advanced', icon: 'Cpu' },
    { skillId: 'data-modeling', name: 'Data Modeling', percentage: Math.min(100, Math.round(progressRatio * 75)), level: 'Intermediate', icon: 'Database' },
    { skillId: 'debugging', name: 'Debugging & Diagnostics', percentage: Math.min(100, Math.round(progressRatio * 80)), level: 'Advanced', icon: 'Bug' },
    { skillId: 'optimization', name: 'Optimization & Plans', percentage: Math.min(100, Math.round(progressRatio * 60)), level: 'Intermediate', icon: 'Gauge' }
  ];
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`NEXUS API (Persistent Store Active) running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
