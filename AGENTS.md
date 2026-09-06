# NEXUS ENGINEERING RULES

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
