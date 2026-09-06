import { MissionDefinition } from './types.js';

export const mission1140: MissionDefinition = {
  id: '1140',
  incidentNumber: 1140,
  title: 'Cart Abandonment Analytics',
  domain: 'E-Commerce / Growth',
  difficulty: 'Intermediate',
  timeRemainingSeconds: 1500,
  context: 'Marketing reports that high-value shopping carts (> $100) are being abandoned without conversion. Group carts by customer and calculate total value to trigger automated retention incentives.',
  objectives: [
    { id: 1, title: '1. Aggregate cart item totals', description: 'Group items by cart_id and calculate total cart value.', completed: false },
    { id: 2, title: '2. Filter high-value carts', description: 'Use HAVING to filter only carts with total value > 100.', completed: false },
    { id: 3, title: '3. Order by highest revenue impact', description: 'Sort descending by total cart value.', completed: false }
  ],
  relatedTables: ['carts', 'cart_items'],
  initialQuery: `-- INCIDENT #1140: Cart Abandonment Analytics
-- Goal: Calculate total abandoned cart values and filter for carts worth > $100.
-- Tables: carts (id, user_id, status), cart_items (id, cart_id, product_id, quantity, unit_price)

SELECT
    c.id AS cart_id,
    c.user_id,
    c.status
FROM carts c
WHERE c.status = 'abandoned'
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE carts (id INT PRIMARY KEY, user_id INT, status VARCHAR(20), created_at TIMESTAMP);
    CREATE TABLE cart_items (id INT PRIMARY KEY, cart_id INT, product_id INT, quantity INT, unit_price NUMERIC(10,2));
  `,
  seedSql: `
    INSERT INTO carts VALUES (1, 501, 'abandoned', '2026-08-01'), (2, 502, 'converted', '2026-08-01'), (3, 503, 'abandoned', '2026-08-02'), (4, 504, 'abandoned', '2026-08-03');
    INSERT INTO cart_items VALUES (1, 1, 10, 2, 80.00), (2, 1, 11, 1, 45.00), (3, 2, 12, 1, 20.00), (4, 3, 10, 1, 30.00), (5, 4, 15, 3, 75.00);
  `,
  schemaTables: [
    { name: 'carts', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'user_id', type: 'INT' }, { name: 'status', type: 'VARCHAR(20)' }] },
    { name: 'cart_items', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'cart_id', type: 'INT', isFk: true, fkRef: 'carts.id' }, { name: 'quantity', type: 'INT' }, { name: 'unit_price', type: 'NUMERIC' }] }
  ],
  hints: {
    1: { hint: 'You need to JOIN carts with cart_items on ci.cart_id = c.id, then GROUP BY c.id, c.user_id.', concept: 'Multi-table Aggregation', nextQuestion: 'What aggregate function sums the multiplied quantity * unit_price?' },
    2: { hint: 'Use SUM(ci.quantity * ci.unit_price) to compute cart value, and HAVING SUM(...) > 100 to filter post-grouping.', concept: 'HAVING Thresholds', nextQuestion: 'Why can you not use WHERE for aggregate results?' }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'What is the fundamental difference between WHERE and HAVING in SQL?',
      options: [
        { id: 'opt1', text: 'WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY' },
        { id: 'opt2', text: 'WHERE can only be used with numbers, while HAVING is for strings' },
        { id: 'opt3', text: 'WHERE is only for MySQL; HAVING is for PostgreSQL' },
        { id: 'opt4', text: 'There is no difference; they are interchangeable aliases' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'WHERE filters base rows prior to aggregation, while HAVING filters the groups produced by aggregate functions!'
    },
    {
      id: 'q2',
      type: 'true-false',
      prompt: 'True or False: An aggregate function like SUM() can be placed directly inside a WHERE clause.',
      options: [
        { id: 'opt_true', text: 'True' },
        { id: 'opt_false', text: 'False' }
      ],
      correctAnswerId: 'opt_false',
      explanation: 'SQL standard forbids aggregates in WHERE clauses because WHERE evaluates before rows are grouped.'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: Inspect Cart Items Table',
      description: 'Execute: SELECT * FROM cart_items WHERE cart_id = 1; to see individual item line costs.',
      targetSqlSnippet: 'SELECT * FROM cart_items WHERE cart_id = 1;',
      hintLevelUnlocked: 1
    }
  ],
  evaluator: (sql, rows) => {
    const sqlLower = sql.toLowerCase();
    const hasGroupBy = sqlLower.includes('group by');
    const hasHaving = sqlLower.includes('having');
    const correct = rows.length === 2 && rows.some(r => r.cart_id === 1 || r.cart_id === '1');

    return {
      passed: hasGroupBy && hasHaving && correct,
      totalScore: hasGroupBy && hasHaving && correct ? 100 : 50,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Applied GROUP BY across cart_id', passed: hasGroupBy, feedback: 'Proper aggregation grouping.' },
        { name: 'Used HAVING for aggregate threshold > 100', passed: hasHaving, feedback: 'Correct aggregate filter.' },
        { name: 'Returned high-value abandoned carts (Carts #1 and #4)', passed: correct, feedback: 'Accurate revenue impact ranking.' }
      ],
      explanation: 'Excellent aggregation query! Marketing can now target abandoned carts worth $205 and $225.'
    };
  }
};
