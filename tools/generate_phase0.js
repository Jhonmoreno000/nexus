const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

// 1. Root documents
writeFile('AGENTS.md', `# NEXUS ENGINEERING RULES

## Product
NEXUS is a professional database engineering simulator.
Motto: **Don't study SQL. Use it.**

## Core Principles
1. TypeScript strict mode everywhere.
2. No any unless explicitly justified in architecture decision records.
3. No duplicated business logic.
4. No secrets in source code.
5. No direct database access from frontend.
6. Untrusted Student SQL: Never execute student SQL against the application database.
7. Isolated Sandboxes: All student SQL executes inside dedicated sandbox environments with strict CPU/memory/time limits.
8. Validate all external input with Zod.
9. Deterministic Evaluation: Evaluate answers via structured AST/Result comparison, never string matching.
10. AI assists as a mentor/tutor without giving solutions immediately.
`);

writeFile('PRODUCT_SPEC.md', `# PRODUCT SPECIFICATION: NEXUS

## 1. Executive Summary
- **Product Name**: NEXUS — Database Engineering Simulator
- **Motto**: *Don't study SQL. Use it.*
- **Category**: Professional Developer Education & Simulation Platform

## 2. Problem Statement
Traditional SQL tutorials are trivia-based, syntax-focused, and unrealistic. They fail to prepare engineers for production challenges: lock contention, null propagation, transaction isolation, missing ledger records, and query optimization.

## 3. The NEXUS Solution
NEXUS puts learners in real development environments:
- **Incident Scenarios**: Resolve actual production bugs with real databases.
- **Realistic IDE**: Full Monaco-based SQL editor with multi-tab support, explain plan analysis, and query history.
- **Multi-layer Evaluation**: Assesses Correctness, Relational Logic, Robustness, Performance, Readability, and Security.
- **Dynamic Skill Graph**: Continuous skill tracking across 5 domains (Fundamentals, Relational Thinking, Data Analysis, DB Engineering, Production/Security).
- **Progressive AI Tutor**: Socratic guidance across 5 hint tiers.
`);

writeFile('README.md', `# NEXUS — Database Engineering Simulator

> **Don't study SQL. Use it.**

NEXUS is a professional database engineering simulator where engineers master SQL, relational modeling, and query optimization by solving realistic production incidents.

---

## 🚀 Incident #1842: Payment Integrity

- **Status**: In Progress
- **Difficulty**: Advanced
- **Context**: 3.7% of orders appear as paid without associated ledger transaction records.
- **Objectives**:
  1. Identify affected records using relational JOINs and NULL checks.
  2. Determine root cause across \`orders\`, \`payments\`, \`transactions\`, and \`refunds\`.
  3. Propose schema and query fixes to prevent inconsistency.
  4. Verify data integrity and reconciliation.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Monaco Editor, Zustand.
- **Backend**: Node.js, Fastify, Zod, Drizzle ORM, PostgreSQL.
- **Sandbox**: Ephemeral PostgreSQL with AST parsing and execution policies.
- **Queue/Worker**: Redis + BullMQ.
`);

// 2. docs/ 01 to 13
const docs = [
  ['docs/01-product.md', '# 01 Product Overview\n\nNEXUS is a database engineering simulator simulating real-world engineering environments.'],
  ['docs/02-game-design.md', '# 02 Game Design & Career Simulation\n\nProgression tracks: Intern -> Junior -> Mid -> Senior -> Database Specialist. Incidents, tickets, and peer code reviews.'],
  ['docs/03-education.md', '# 03 Educational Methodology\n\nCognitive load theory, active recall through debugging, progressive disclosure of database complexity.'],
  ['docs/04-architecture.md', '# 04 System Architecture\n\nModular monolith API, Sandbox Manager, SQL Gateway, Evaluation Engine, and React Frontend.'],
  ['docs/05-database.md', '# 05 Database Architecture\n\nSeparation of concerns: Application DB (nexus_app) vs Sandbox Ephemeral DBs.'],
  ['docs/06-sandbox.md', '# 06 SQL Sandbox Specification\n\nResource isolation, statement timeout (3s), memory caps, row truncation, and security boundary.'],
  ['docs/07-security.md', '# 07 Security Architecture\n\nOWASP compliance, parameterized queries, non-root execution, AST forbidden statement filtering.'],
  ['docs/08-ai.md', '# 08 AI Integration Architecture\n\nAI Tutor, Mission Generator, and Qualitative Feedback Engine. Socratic 5-tier hint architecture.'],
  ['docs/09-api.md', '# 09 API Specifications\n\nREST endpoints for mission lifecycle, SQL execution, hint retrieval, and skill graph tracking.'],
  ['docs/10-testing.md', '# 10 Testing Strategy\n\nUnit tests for parser, integration tests for sandbox runners, evaluation accuracy testing, and UI validation.'],
  ['docs/11-docker.md', '# 11 Docker Infrastructure\n\nMulti-stage Docker builds, compose profiles for dev, test, and production.'],
  ['docs/12-observability.md', '# 12 Observability\n\nOpenTelemetry instrumentation, query timing metrics, sandbox provisioning latencies, and structured logs.'],
  ['docs/13-deployment.md', '# 13 Deployment Strategy\n\nContainer orchestration, Caddy/Nginx reverse proxy, and zero-downtime rolling updates.']
];
docs.forEach(([file, content]) => writeFile(file, content));

// 3. .ai/prompts/
const prompts = [
  ['.ai/prompts/sql-tutor.md', `# SQL TUTOR MASTER PROMPT

ROLE: You are NEXUS Tutor, an expert database engineering mentor.
MISSION: Help the learner develop SQL reasoning, not solve the challenge for them.

RULES:
1. Never provide the final query unless explicitly requested at Level 5.
2. Prefer questions over answers.
3. Identify the learner's misconception.
4. Give the minimum useful hint.
5. Only reference tables and columns available in the mission.
6. Maintain professional language without childish gamification.

OUTPUT SCHEMA:
- diagnosis: string
- hint_level: 0 | 1 | 2 | 3 | 4 | 5
- hint: string
- concept: string
- next_question: string
`],
  ['.ai/prompts/mission-designer.md', `# MISSION DESIGNER PROMPT

ROLE: You are the NEXUS Mission Designer.
Create professional database engineering challenges with realistic business context, clear objectives, controlled schema, deterministic evaluation, and hidden edge cases.
`],
  ['.ai/prompts/dataset-engineer.md', `# DATASET ENGINEER PROMPT

ROLE: You are a database dataset engineer.
Generate realistic synthetic data for PostgreSQL with referential integrity, controlled anomalies, and realistic cardinality.
`],
  ['.ai/prompts/evaluation-engine.md', `# EVALUATION ENGINE PROMPT

ROLE: You are the NEXUS SQL Evaluation Engine.
Determine: Correctness (40%), Relational Logic (20%), Edge Case Handling (15%), Performance (10%), Readability (10%), Security (5%).
Never evaluate based solely on string similarity.
`],
  ['.ai/prompts/engineer-rules.md', `# NEXUS ENGINEERING RULES PROMPT

ROLE: Principal Software Engineer for NEXUS.
Strict TypeScript, zero duplicated logic, isolated sandboxes, multi-stage Docker builds.
`]
];
prompts.forEach(([file, content]) => writeFile(file, content));

// 4. skills/
const skillList = [
  'architecture', 'frontend', 'backend', 'postgresql', 'sql-sandbox',
  'security', 'testing', 'docker', 'ai', 'game-design', 'educational-design', 'performance'
];
skillList.forEach(s => {
  writeFile(`skills/${s}/SKILL.md`, `# Skill: ${s.toUpperCase()}

Role: Specialized expert in ${s} for the NEXUS Database Engineering Simulator.
Guidance: Adhere to production engineering standards, strict isolation, and measurable outcomes.
`);
});

// 5. missions/payment-integrity-001/
writeFile('missions/payment-integrity-001/manifest.json', JSON.stringify({
  id: 'payment-integrity-001',
  incidentNumber: 1842,
  title: 'Payment Integrity',
  domain: 'Fintech / Payments',
  difficulty: 'advanced',
  database: 'postgresql',
  timeRemainingSeconds: 1458,
  skills: ['sql-reasoning', 'data-modeling', 'debugging', 'optimization'],
  evaluation: {
    correctness: 0.40,
    logic: 0.20,
    robustness: 0.15,
    performance: 0.10,
    readability: 0.10,
    security: 0.05
  }
}, null, 2));

writeFile('missions/payment-integrity-001/schema.sql', `-- Payment Integrity Incident Schema
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    status VARCHAR(50) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id),
    status VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`);

writeFile('missions/payment-integrity-001/seed.sql', `-- Seed Data for Incident #1842
INSERT INTO customers (id, name, email) VALUES
(3421, 'Sarah Connor', 'sconnor@cyberdyne.corp'),
(1876, 'Marcus Wright', 'mwright@skynet.org'),
(2390, 'Kyle Reese', 'kreese@resistance.net'),
(4502, 'John Connor', 'jconnor@resistance.net'),
(6123, 'Kate Brewster', 'kbrewster@darpa.mil');

INSERT INTO orders (id, customer_id, status, total_amount) VALUES
(10001, 3421, 'paid', 249.99),
(10002, 1876, 'paid', 120.00),
(10003, 2390, 'paid', 899.50),
(10004, 4502, 'paid', 45.00),
(10005, 6123, 'paid', 1340.00);

INSERT INTO payments (id, order_id, amount, status) VALUES
(5601, 10001, 249.99, 'paid'),
(5602, 10002, 120.00, 'paid'),
(5603, 10003, 899.50, 'paid'),
(5604, 10004, 45.00, 'paid'),
(5605, 10005, 1340.00, 'paid');

-- Note: Orders 10001 and 10003 have missing transaction records (payment gateway timeout anomaly)
INSERT INTO transactions (id, payment_id, status, amount) VALUES
(8821, 5602, 'completed', 120.00),
(8834, 5604, 'completed', 45.00),
(8835, 5605, 'completed', 1340.00);
`);

writeFile('missions/payment-integrity-001/solution.sql', `SELECT
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
LIMIT 100;
`);

writeFile('missions/payment-integrity-001/explanation.md', `# Payment Integrity Incident Analysis

## Root Cause
When orders were processed during a gateway failover period, the payment record was marked 'paid' prematurely before the asynchronous settlement transaction webhook arrived. As a result, 3.7% of paid orders have no corresponding transaction ledger record in the \`transactions\` table.

## Identification Strategy
Performing a \`LEFT JOIN\` from \`orders\` through \`payments\` into \`transactions\` and asserting \`t.id IS NULL\` identifies all orders where the ledger transaction is absent.
`);

console.log('Phase 0 files successfully generated.');
