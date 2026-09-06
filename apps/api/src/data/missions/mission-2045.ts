import { MissionDefinition } from './types.js';

export const mission2045: MissionDefinition = {
  id: '2045',
  incidentNumber: 2045,
  title: 'Fraudulent Refund Velocity',
  domain: 'Cyber-Fraud Defense',
  difficulty: 'Expert',
  timeRemainingSeconds: 2000,
  context: 'Fraudulent syndicates are executing automated refund bursts across multiple merchant terminals. Use window functions (COUNT(*) OVER (PARTITION BY ...)) to flag velocity anomalies exceeding 2 refunds within 1 hour.',
  objectives: [
    { id: 1, title: '1. Partition by customer account', description: 'Use OVER (PARTITION BY customer_id) to count refunds per user.', completed: false },
    { id: 2, title: '2. Compute refund velocity', description: 'Calculate total count and sum per partition.', completed: false },
    { id: 3, title: '3. Flag syndicate accounts', description: 'Filter accounts with velocity count >= 3.', completed: false }
  ],
  relatedTables: ['refund_claims', 'merchant_terminals'],
  initialQuery: `-- INCIDENT #2045: Fraudulent Refund Velocity
-- Goal: Detect automated refund burst velocity using Window Functions.
-- Tables: refund_claims, merchant_terminals

SELECT
    id AS claim_id,
    customer_id,
    amount,
    claim_time
FROM refund_claims
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE refund_claims (id INT PRIMARY KEY, customer_id INT, terminal_id INT, amount NUMERIC(10,2), claim_time TIMESTAMP);
    CREATE TABLE merchant_terminals (id INT PRIMARY KEY, terminal_name VARCHAR(100), location VARCHAR(100));
  `,
  seedSql: `
    INSERT INTO merchant_terminals VALUES (1, 'POS-NYC-01', 'New York'), (2, 'POS-LON-02', 'London');
    INSERT INTO refund_claims VALUES (1, 808, 1, 450.00, '2026-08-12 10:00:00'), (2, 808, 2, 490.00, '2026-08-12 10:15:00'), (3, 808, 1, 475.00, '2026-08-12 10:30:00'), (4, 102, 1, 35.00, '2026-08-12 11:00:00');
  `,
  schemaTables: [
    { name: 'refund_claims', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'customer_id', type: 'INT' }, { name: 'terminal_id', type: 'INT' }, { name: 'amount', type: 'NUMERIC' }] },
    { name: 'merchant_terminals', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'terminal_name', type: 'VARCHAR' }, { name: 'location', type: 'VARCHAR' }] }
  ],
  hints: {
    1: { hint: 'Use: COUNT(*) OVER (PARTITION BY customer_id) AS velocity_count. This retains row-level claim details while calculating customer-level totals.', concept: 'Window Functions OVER', nextQuestion: 'What does PARTITION BY do?' }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'How does a Window Function differ from a standard GROUP BY aggregation in SQL?',
      options: [
        { id: 'opt1', text: 'Window functions calculate aggregate values while retaining individual row identity; GROUP BY collapses rows' },
        { id: 'opt2', text: 'Window functions only operate on date columns' },
        { id: 'opt3', text: 'Window functions can only be used in UPDATE queries' },
        { id: 'opt4', text: 'Window functions bypass foreign key constraints' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'Window functions compute across a set of table rows without grouping the output into a single summary row!'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: View All Terminals',
      description: 'Execute: SELECT * FROM merchant_terminals; to inspect active POS locations.',
      targetSqlSnippet: 'SELECT * FROM merchant_terminals;',
      hintLevelUnlocked: 1
    }
  ],
  evaluator: (sql, rows) => {
    const sqlLower = sql.toLowerCase();
    const hasOver = sqlLower.includes('over') && sqlLower.includes('partition by');
    const correct = rows.length >= 3 && rows.some(r => r.customer_id === 808 || r.customer_id === '808');
    return {
      passed: hasOver && correct,
      totalScore: hasOver && correct ? 100 : 75,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Window function partitioning by customer_id', passed: hasOver, feedback: 'Correct OVER (PARTITION BY ...) syntax.' },
        { name: 'Identified syndicate account #808 with 3 rapid refunds', passed: correct, feedback: 'Velocity anomaly detected.' }
      ],
      explanation: 'Suspicious burst behavior on account #808 flagged. Terminal authorizations temporarily halted.'
    };
  }
};
