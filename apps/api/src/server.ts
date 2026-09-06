import fastify from 'fastify';
import cors from '@fastify/cors';
import { SandboxEngine } from './sandbox/sandbox-engine.js';
import { EvaluationEngine } from './evaluator/evaluation-engine.js';
import { AiTutorService } from './tutor/ai-tutor.js';
import { INCIDENT_SCHEMA } from './data/incident-1842-dataset.js';

const app = fastify({ logger: true });
const sandbox = new SandboxEngine();

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Health check
app.get('/api/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString(), service: 'nexus-api' };
});

// Mission 1842 manifest & schema
app.get('/api/missions/1842', async () => {
  return {
    id: 'payment-integrity-001',
    incidentNumber: 1842,
    title: 'Payment Integrity',
    domain: 'Fintech / Payments',
    difficulty: 'advanced',
    database: 'postgresql',
    timeRemainingSeconds: 1458, // 24:18
    context: 'The payment system is showing inconsistencies. 3.7% of orders appear as paid, but they don\'t have a transaction associated. This is affecting customer trust and revenue reconciliation.',
    objectives: [
      { id: 1, title: '1. Identify the affected records', description: 'Find orders marked as paid without a transaction.', completed: true },
      { id: 2, title: '2. Determine the root cause', description: 'Analyze the data and relationships between tables.', completed: false },
      { id: 3, title: '3. Propose a solution', description: 'Suggest a fix to prevent this issue in the future.', completed: false },
      { id: 4, title: '4. Verify the integrity', description: 'Confirm that the data is consistent after your changes.', completed: false }
    ],
    relatedTables: ['orders', 'payments', 'transactions', 'refunds'],
    schema: INCIDENT_SCHEMA,
    initialQuery: `SELECT
    o.id AS order_id,
    o.customer_id,
    o.status,
    p.id AS payment_id,
    p.status AS payment_status,
    t.id AS transaction_id,
    t.status AS transaction_status
FROM orders o
LEFT JOIN payments p ON p.order_id = o.id
LEFT JOIN transactions t ON t.payment_id = p.id
WHERE o.status = 'paid'
  AND t.id IS NULL
LIMIT 100;`
  };
});

// Execute SQL in Sandbox
app.post('/api/sql/execute', async (req, reply) => {
  const body = req.body as { sql: string };
  if (!body || !body.sql) {
    return reply.status(400).send({ error: 'SQL string is required' });
  }
  const result = sandbox.execute(body.sql);
  return result;
});

// Multi-layer Evaluation
app.post('/api/missions/1842/evaluate', async (req, reply) => {
  const body = req.body as { sql: string };
  if (!body || !body.sql) {
    return reply.status(400).send({ error: 'SQL query required for evaluation' });
  }
  const evaluation = EvaluationEngine.evaluate(body.sql);
  return evaluation;
});

// Socratic AI Tutor hint
app.post('/api/missions/1842/hint', async (req, reply) => {
  const body = req.body as { level: number; currentQuery?: string };
  const hint = AiTutorService.getHint(body.level || 0, body.currentQuery);
  return hint;
});

// Skill progress
app.get('/api/skills/:userId', async () => {
  return [
    { skillId: 'sql-reasoning', name: 'SQL Reasoning', percentage: 82, level: 'Advanced', icon: 'Cpu' },
    { skillId: 'data-modeling', name: 'Data Modeling', percentage: 67, level: 'Intermediate', icon: 'Database' },
    { skillId: 'debugging', name: 'Debugging', percentage: 74, level: 'Advanced', icon: 'Bug' },
    { skillId: 'optimization', name: 'Optimization', percentage: 51, level: 'Intermediate', icon: 'Gauge' }
  ];
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`NEXUS API running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
