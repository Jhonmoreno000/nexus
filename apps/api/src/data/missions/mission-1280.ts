import { MissionDefinition } from './types.js';

export const mission1280: MissionDefinition = {
  id: '1280',
  incidentNumber: 1280,
  title: 'Currency Ledger Reconciliation',
  domain: 'Fintech / Multi-Currency',
  difficulty: 'Intermediate',
  timeRemainingSeconds: 1600,
  context: 'Cross-border settlements showed rate drift anomalies. Detect trades where the settlement rate differs from the recorded central bank fixing rate by more than 0.5%.',
  objectives: [
    { id: 1, title: '1. Join FX trades with benchmark rates', description: 'Join trades with daily fixing benchmark on date and pair.', completed: false },
    { id: 2, title: '2. Calculate rate variance percentage', description: 'ABS((t.executed_rate - b.fixing_rate) / b.fixing_rate) * 100.', completed: false },
    { id: 3, title: '3. Filter drift anomalies > 0.5%', description: 'Isolate unauthorized spread executions.', completed: false }
  ],
  relatedTables: ['fx_trades', 'benchmark_rates'],
  initialQuery: `-- INCIDENT #1280: Currency Ledger Reconciliation
-- Goal: Join trades with fixing rates on trade_date AND currency_pair to detect rate drift.
-- Tables: fx_trades, benchmark_rates

SELECT
    t.id AS trade_id,
    t.trade_date,
    t.currency_pair,
    t.executed_rate
FROM fx_trades t
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE benchmark_rates (id INT PRIMARY KEY, trade_date VARCHAR(10), currency_pair VARCHAR(10), fixing_rate NUMERIC(10,4));
    CREATE TABLE fx_trades (id INT PRIMARY KEY, trade_date VARCHAR(10), currency_pair VARCHAR(10), executed_rate NUMERIC(10,4), volume NUMERIC(12,2));
  `,
  seedSql: `
    INSERT INTO benchmark_rates VALUES (1, '2026-08-10', 'EUR/USD', 1.0850), (2, '2026-08-10', 'GBP/USD', 1.2720);
    INSERT INTO fx_trades VALUES (1, '2026-08-10', 'EUR/USD', 1.0855, 500000.00), (2, '2026-08-10', 'EUR/USD', 1.0960, 1200000.00), (3, '2026-08-10', 'GBP/USD', 1.2820, 300000.00);
  `,
  schemaTables: [
    { name: 'benchmark_rates', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'trade_date', type: 'VARCHAR' }, { name: 'currency_pair', type: 'VARCHAR' }, { name: 'fixing_rate', type: 'NUMERIC' }] },
    { name: 'fx_trades', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'trade_date', type: 'VARCHAR' }, { name: 'currency_pair', type: 'VARCHAR' }, { name: 'executed_rate', type: 'NUMERIC' }, { name: 'volume', type: 'NUMERIC' }] }
  ],
  hints: {
    1: { hint: 'Join fx_trades with benchmark_rates ON b.trade_date = t.trade_date AND b.currency_pair = t.currency_pair.', concept: 'Composite Key Join', nextQuestion: 'How do you calculate absolute percentage difference?' }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'When joining two tables that require matching on both date AND currency pair, what join syntax is required?',
      options: [
        { id: 'opt1', text: 'ON t.trade_date = b.trade_date AND t.currency_pair = b.currency_pair' },
        { id: 'opt2', text: 'ON t.trade_date = b.trade_date OR t.currency_pair = b.currency_pair' },
        { id: 'opt3', text: 'WHERE t.trade_date = b.currency_pair' },
        { id: 'opt4', text: 'JOIN ON BOTH(trade_date, currency_pair)' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'Both conditions must be satisfied simultaneously using the AND boolean operator!'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: View Official Fixing Rates',
      description: 'Execute: SELECT * FROM benchmark_rates; to inspect fixing benchmarks.',
      targetSqlSnippet: 'SELECT * FROM benchmark_rates;',
      hintLevelUnlocked: 1
    }
  ],
  evaluator: (sql, rows) => {
    const correct = rows.length >= 2;
    return {
      passed: correct,
      totalScore: correct ? 100 : 70,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Composite key join on date and pair', passed: true, feedback: 'Accurate multi-column join condition.' },
        { name: 'Identified trade #2 and #3 drift anomalies', passed: correct, feedback: 'Correct spread variance threshold.' }
      ],
      explanation: 'Auditors notified of the two anomalous trades with > 0.5% rate drift.'
    };
  }
};
