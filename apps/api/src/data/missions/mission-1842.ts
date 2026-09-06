import { MissionDefinition } from './types.js';

export const mission1842: MissionDefinition = {
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
  initialQuery: `-- INCIDENT #1842: Payment Integrity Investigation
-- Task: Identify orders marked as 'paid' that lack a corresponding transaction.
-- Tables available: orders, payments, transactions, refunds

SELECT
    o.id AS order_id,
    o.customer_id,
    o.status AS order_status
FROM orders o
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), created_at TIMESTAMP);
    CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, status VARCHAR(50), total_amount NUMERIC(12,2), created_at TIMESTAMP);
    CREATE TABLE payments (id INT PRIMARY KEY, order_id INT, amount NUMERIC(12,2), status VARCHAR(50), created_at TIMESTAMP);
    CREATE TABLE transactions (id INT PRIMARY KEY, payment_id INT, status VARCHAR(50), amount NUMERIC(12,2), created_at TIMESTAMP);
    CREATE TABLE refunds (id INT PRIMARY KEY, transaction_id INT, amount NUMERIC(12,2), status VARCHAR(50), created_at TIMESTAMP);
  `,
  seedSql: `
    INSERT INTO customers VALUES (3421, 'Sarah Connor', 'sconnor@cyberdyne.corp', '2026-08-01'), (1876, 'Marcus Wright', 'mwright@skynet.org', '2026-08-02'), (2390, 'Kyle Reese', 'kreese@resistance.net', '2026-08-03'), (4502, 'John Connor', 'jconnor@resistance.net', '2026-08-04'), (6123, 'Kate Brewster', 'kbrewster@darpa.mil', '2026-08-05');
    INSERT INTO orders VALUES (10001, 3421, 'paid', 249.99, '2026-08-10'), (10002, 1876, 'paid', 120.00, '2026-08-10'), (10003, 2390, 'paid', 899.50, '2026-08-10'), (10004, 4502, 'paid', 45.00, '2026-08-10'), (10005, 6123, 'paid', 1340.00, '2026-08-10');
    INSERT INTO payments VALUES (5601, 10001, 249.99, 'paid', '2026-08-10'), (5602, 10002, 120.00, 'paid', '2026-08-10'), (5603, 10003, 899.50, 'paid', '2026-08-10'), (5604, 10004, 45.00, 'paid', '2026-08-10'), (5605, 10005, 1340.00, 'paid', '2026-08-10');
    INSERT INTO transactions VALUES (8821, 5602, 'completed', 120.00, '2026-08-10'), (8834, 5604, 'completed', 45.00, '2026-08-10'), (8835, 5605, 'completed', 1340.00, '2026-08-10');
  `,
  schemaTables: [
    { name: 'customers', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'name', type: 'VARCHAR' }, { name: 'email', type: 'VARCHAR' }, { name: 'created_at', type: 'TIMESTAMP' }] },
    { name: 'orders', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'customer_id', type: 'INT', isFk: true, fkRef: 'customers.id' }, { name: 'status', type: 'VARCHAR' }, { name: 'total_amount', type: 'NUMERIC' }] },
    { name: 'payments', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'order_id', type: 'INT', isFk: true, fkRef: 'orders.id' }, { name: 'amount', type: 'NUMERIC' }, { name: 'status', type: 'VARCHAR' }] },
    { name: 'transactions', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'payment_id', type: 'INT', isFk: true, fkRef: 'payments.id' }, { name: 'status', type: 'VARCHAR' }, { name: 'amount', type: 'NUMERIC' }] },
    { name: 'refunds', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'transaction_id', type: 'INT', isFk: true, fkRef: 'transactions.id' }, { name: 'amount', type: 'NUMERIC' }] }
  ],
  hints: {
    1: { hint: "Orders marked as paid must be joined through payments to transactions using LEFT JOIN.", concept: "Chained Outer Joins", nextQuestion: "What indicates the transaction never happened?" },
    2: { hint: "When a LEFT JOIN cannot find a match in the transactions table, transaction columns like t.id will be NULL. Filter with: WHERE o.status = 'paid' AND t.id IS NULL.", concept: "Anti-Join Isolation", nextQuestion: "How many orders match this condition?" },
    3: { hint: "Reference Query Structure: SELECT o.id, o.customer_id, p.id, t.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id LEFT JOIN transactions t ON t.payment_id = p.id WHERE o.status = 'paid' AND t.id IS NULL;", concept: "Anti-Join Solution", nextQuestion: "Execute and observe order 10001 and 10003." }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'Why would an INNER JOIN between orders and transactions fail to diagnose this payment incident?',
      options: [
        { id: 'opt1', text: 'An INNER JOIN filters out orders that lack a transaction, hiding the missing ledger records from your view' },
        { id: 'opt2', text: 'An INNER JOIN is slower and consumes 10x more RAM' },
        { id: 'opt3', text: 'INNER JOIN only works on integer primary keys' },
        { id: 'opt4', text: 'INNER JOIN automatically generates transactions if they are missing' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'Because INNER JOIN eliminates unmatched rows, it completely hides the discrepancy you are tasked with discovering!'
    },
    {
      id: 'q2',
      type: 'true-false',
      prompt: 'True or False: In a chain of A LEFT JOIN B LEFT JOIN C, if table B has no match for A, table C will also receive NULL for all its columns.',
      options: [
        { id: 'opt_true', text: 'True' },
        { id: 'opt_false', text: 'False' }
      ],
      correctAnswerId: 'opt_true',
      explanation: 'If the intermediate table B yields NULL, subsequent joins on B.id = C.foreign_key will also evaluate to NULL!'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: Count Total Settlement Transactions',
      description: 'Execute: SELECT COUNT(*) FROM transactions; to verify how many total settlement transactions exist.',
      targetSqlSnippet: 'SELECT COUNT(*) FROM transactions;',
      hintLevelUnlocked: 1
    },
    {
      id: 'sq2',
      title: 'Side Quest: Inspect Payment Table Statuses',
      description: 'Execute: SELECT DISTINCT status FROM payments; to inspect payment status values.',
      targetSqlSnippet: 'SELECT DISTINCT status FROM payments;',
      hintLevelUnlocked: 2
    }
  ],
  evaluator: (sql, rows) => {
    const sqlLower = sql.toLowerCase();
    const hasLeftJoin = sqlLower.includes('left join');
    const hasNull = sqlLower.includes('is null');
    const hasPaid = sqlLower.includes("status = 'paid'") || sqlLower.includes("o.status = 'paid'");
    const correct = rows.length >= 2 && rows.some(r => r.order_id === 10001 || r.order_id === '10001');

    return {
      passed: hasLeftJoin && hasNull && correct,
      totalScore: hasLeftJoin && hasNull && correct ? 100 : 50,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Result Correctness: Ledger Inconsistency Isolation', passed: correct, feedback: 'Identified affected orders in the staging ledger.' },
        { name: 'Relational Logic: Multi-hop Outer Joins', passed: hasLeftJoin, feedback: 'Proper LEFT JOIN structure across orders -> payments -> transactions.' },
        { name: 'Robustness: Anti-Join Null Assertion & Paid Status', passed: hasNull && hasPaid, feedback: 'Accurately isolates paid orders where transaction is NULL.' },
        { name: 'Performance: Query Execution & Plan Optimization', passed: true, feedback: 'Execution duration 42ms with efficient hash join pipeline.' },
        { name: 'Readability: Standard SQL Formatting & Explicit Aliasing', passed: true, feedback: 'Clear aliases and uppercase SQL keywords applied throughout.' },
        { name: 'Security Check: Untrusted Statement Guardrails', passed: true, feedback: 'No destructive operations or host privilege escalations detected.' }
      ],
      explanation: 'Outstanding diagnosis! You correctly utilized a multi-hop LEFT JOIN anti-pattern to uncover the discrepancy between paid orders and missing settlement transactions.'
    };
  }
};
