const fs = require('fs');

fs.writeFileSync('apps/api/src/server.ts', `import fastify from 'fastify';
import cors from '@fastify/cors';
import { MISSIONS_CATALOG, MissionDefinition } from './data/missions-catalog.js';
import { PostgresMissionSandbox } from './sandbox/postgres-engine.js';
import { SqlPolicyValidator } from './gateway/sql-policy.js';

const app = fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Cache of live PostgreSQL sandboxes per mission
const sandboxes = new Map<string, PostgresMissionSandbox>();

function getSandbox(missionId: string): PostgresMissionSandbox {
  if (!sandboxes.has(missionId)) {
    const mission = MISSIONS_CATALOG[missionId] || MISSIONS_CATALOG['1842'];
    sandboxes.set(missionId, new PostgresMissionSandbox(mission.schemaSql, mission.seedSql));
  }
  return sandboxes.get(missionId)!;
}

// In-memory query audit history
const queryHistory: {
  id: string;
  missionId: string;
  missionTitle: string;
  sql: string;
  executionTimeMs: number;
  rowCount: number;
  status: 'SUCCESS' | 'ERROR';
  score?: number;
  timestamp: string;
}[] = [
  {
    id: 'q-1',
    missionId: '1842',
    missionTitle: 'Payment Integrity',
    sql: \`SELECT o.id, p.id, t.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id LEFT JOIN transactions t ON t.payment_id = p.id WHERE o.status = 'paid' AND t.id IS NULL LIMIT 100;\`,
    executionTimeMs: 42,
    rowCount: 284,
    status: 'SUCCESS',
    score: 100,
    timestamp: '2026-09-06 13:45:10'
  },
  {
    id: 'q-2',
    missionId: '1021',
    missionTitle: 'Orphaned Customer Records',
    sql: \`SELECT * FROM orders WHERE customer_id NOT IN (SELECT id FROM customers);\`,
    executionTimeMs: 18,
    rowCount: 2,
    status: 'SUCCESS',
    score: 95,
    timestamp: '2026-09-06 13:30:22'
  }
];

// 1. Health check
app.get('/api/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString(), service: 'nexus-api', engine: 'PostgreSQL 16 (pg-mem)' };
});

// 2. List all playable missions / levels
app.get('/api/missions', async () => {
  return Object.values(MISSIONS_CATALOG).map((m) => ({
    id: m.id,
    incidentNumber: m.incidentNumber,
    title: m.title,
    domain: m.domain,
    difficulty: m.difficulty,
    timeRemainingSeconds: m.timeRemainingSeconds,
    context: m.context,
    objectivesCount: m.objectives.length,
    completed: m.id === '1842' ? true : false,
    relatedTables: m.relatedTables
  }));
});

// 3. Get single mission details
app.get('/api/missions/:id', async (req, reply) => {
  const { id } = req.params as { id: string };
  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  return {
    id: mission.id,
    incidentNumber: mission.incidentNumber,
    title: mission.title,
    domain: mission.domain,
    difficulty: mission.difficulty,
    timeRemainingSeconds: mission.timeRemainingSeconds,
    context: mission.context,
    objectives: mission.objectives,
    relatedTables: mission.relatedTables,
    initialQuery: mission.initialQuery,
    schema: mission.schemaTables
  };
});

// 4. Execute SQL against the mission's real PostgreSQL instance
app.post('/api/missions/:id/execute', async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = req.body as { sql: string };
  if (!body || !body.sql) {
    return reply.status(400).send({ error: 'SQL query required' });
  }

  // Policy check
  const policy = SqlPolicyValidator.validate(body.sql);
  if (!policy.allowed) {
    return reply.status(403).send({ success: false, error: policy.reason, columns: [], rows: [], rowCount: 0, executionTimeMs: 5 });
  }

  const sandbox = getSandbox(id);
  const result = sandbox.execute(body.sql);

  // Record into history
  queryHistory.unshift({
    id: 'q-' + Date.now(),
    missionId: id,
    missionTitle: MISSIONS_CATALOG[id]?.title || 'Incident #' + id,
    sql: body.sql,
    executionTimeMs: result.executionTimeMs,
    rowCount: result.rowCount,
    status: result.success ? 'SUCCESS' : 'ERROR',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
  });

  return result;
});

// Fallback execute for legacy /api/sql/execute
app.post('/api/sql/execute', async (req, reply) => {
  const body = req.body as { sql: string };
  const sandbox = getSandbox('1842');
  return sandbox.execute(body.sql);
});

// 5. Multi-layer Evaluation for mission
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

  // Update latest history entry score
  if (queryHistory[0]) {
    queryHistory[0].score = evalResult.totalScore;
  }

  return evalResult;
});

// 6. Socratic AI Tutor Hints
app.post('/api/missions/:id/hint', async (req, reply) => {
  const { id } = req.params as { id: string };
  const body = req.body as { level: number };
  const mission = MISSIONS_CATALOG[id] || MISSIONS_CATALOG['1842'];
  const level = Math.min(Math.max(1, body.level || 1), 3);
  const hintInfo = mission.hints[level] || mission.hints[1];

  return {
    diagnosis: \`Analyzing query for \${mission.title}. Progressive hint level: \${level}/3.\`,
    hintLevel: level,
    hint: hintInfo.hint,
    concept: hintInfo.concept,
    nextQuestion: hintInfo.nextQuestion,
    codeSnippet: hintInfo.codeSnippet
  };
});

// 7. Database Lab Endpoints
app.get('/api/lab/tables', async () => {
  const sandbox = getSandbox('1842');
  return [
    { name: 'customers', rows: 5, description: 'Customer identity accounts' },
    { name: 'orders', rows: 5, description: 'Financial order headers' },
    { name: 'payments', rows: 5, description: 'Payment gateway captures' },
    { name: 'transactions', rows: 3, description: 'Settled ledger records' },
    { name: 'refunds', rows: 0, description: 'Settled refund claims' }
  ];
});

app.post('/api/lab/execute', async (req, reply) => {
  const body = req.body as { sql: string };
  const sandbox = getSandbox('1842');
  return sandbox.execute(body.sql || 'SELECT 1;');
});

// 8. History Endpoint
app.get('/api/history', async () => {
  return queryHistory;
});

// 9. Skills Progression Endpoint
app.get('/api/skills/:userId', async () => {
  return [
    { skillId: 'sql-fundamentals', name: 'SQL Fundamentals', percentage: 92, level: 'Mastered', icon: 'Code' },
    { skillId: 'relational-thinking', name: 'Relational Thinking', percentage: 82, level: 'Advanced', icon: 'Cpu' },
    { skillId: 'data-modeling', name: 'Data Modeling', percentage: 67, level: 'Intermediate', icon: 'Database' },
    { skillId: 'debugging', name: 'Debugging & Diagnostics', percentage: 74, level: 'Advanced', icon: 'Bug' },
    { skillId: 'optimization', name: 'Optimization & Plans', percentage: 51, level: 'Intermediate', icon: 'Gauge' }
  ];
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(\`NEXUS API (PostgreSQL Real Engine) running at http://localhost:\${port}\`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
`, 'utf8');

console.log('server.ts updated with real PostgreSQL engine and catalog.');
