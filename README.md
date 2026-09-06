# NEXUS — Database Engineering Simulator

> **Don't study SQL. Use it.**

NEXUS is a professional database engineering simulator where engineers master SQL, relational modeling, and query optimization by solving realistic production incidents.

---

## 🚀 Incident #1842: Payment Integrity

- **Status**: In Progress
- **Difficulty**: Advanced
- **Context**: 3.7% of orders appear as paid without associated ledger transaction records.
- **Objectives**:
  1. Identify affected records using relational JOINs and NULL checks.
  2. Determine root cause across `orders`, `payments`, `transactions`, and `refunds`.
  3. Propose schema and query fixes to prevent inconsistency.
  4. Verify data integrity and reconciliation.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Monaco Editor, Zustand.
- **Backend**: Node.js, Fastify, Zod, Drizzle ORM, PostgreSQL.
- **Sandbox**: Ephemeral PostgreSQL with AST parsing and execution policies.
- **Queue/Worker**: Redis + BullMQ.
