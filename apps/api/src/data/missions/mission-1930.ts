import { MissionDefinition } from './types.js';

export const mission1930: MissionDefinition = {
  id: '1930',
  incidentNumber: 1930,
  title: 'High-Concurrency Inventory Deadlocks',
  domain: 'High-Scale Retail',
  difficulty: 'Advanced',
  timeRemainingSeconds: 1800,
  context: 'During a flash sale, parallel checkout workers are deadlocking when updating item inventory. Inspect SKU reservations and lock rows deterministically in ascending ID order.',
  objectives: [
    { id: 1, title: '1. Select stock for update', description: 'Query inventory using FOR UPDATE to lock rows safely.', completed: false },
    { id: 2, title: '2. Enforce deterministic lock ordering', description: 'Order by product_id ASC to prevent cyclic deadlocks.', completed: false },
    { id: 3, title: '3. Filter active flash sale items', description: 'Select items with stock_available > 0.', completed: false }
  ],
  relatedTables: ['inventory', 'products'],
  initialQuery: `-- INCIDENT #1930: High-Concurrency Inventory Deadlocks
-- Goal: Query inventory rows safely ordered by product_id ASC to prevent deadlocks.
-- Tables: inventory, products

SELECT
    i.product_id,
    i.stock_available,
    i.stock_reserved
FROM inventory i
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), sku VARCHAR(50));
    CREATE TABLE inventory (product_id INT PRIMARY KEY, stock_available INT, stock_reserved INT);
  `,
  seedSql: `
    INSERT INTO products VALUES (101, 'RTX 4090 GPU', 'SKU-GPU-01'), (102, 'OLED Gaming Monitor', 'SKU-MON-02'), (103, 'Mechanical Keyboard', 'SKU-KB-03');
    INSERT INTO inventory VALUES (101, 14, 2), (102, 5, 1), (103, 0, 8);
  `,
  schemaTables: [
    { name: 'products', columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'name', type: 'VARCHAR' }, { name: 'sku', type: 'VARCHAR' }] },
    { name: 'inventory', columns: [{ name: 'product_id', type: 'INT', isPk: true }, { name: 'stock_available', type: 'INT' }, { name: 'stock_reserved', type: 'INT' }] }
  ],
  hints: {
    1: { hint: 'Ordering by product_id ASC guarantees that every concurrent transaction acquires locks in the exact same sequence, making circular waits mathematically impossible.', concept: 'Deterministic Lock Ordering', nextQuestion: 'How do you join inventory with products?' }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'What condition causes a database deadlock between two concurrent transactions?',
      options: [
        { id: 'opt1', text: 'Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1' },
        { id: 'opt2', text: 'A query runs out of temporary disk space' },
        { id: 'opt3', text: 'Two SELECT queries read the same unindexed table simultaneously' },
        { id: 'opt4', text: 'A database table contains more than 10 foreign keys' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'A deadlock is a circular dependency where two or more transactions each hold a resource the other needs.'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: View Flash Sale Products',
      description: 'Execute: SELECT * FROM products; to inspect product names and SKUs.',
      targetSqlSnippet: 'SELECT * FROM products;',
      hintLevelUnlocked: 1
    }
  ],
  evaluator: (sql, rows) => {
    const sqlLower = sql.toLowerCase();
    const hasOrder = sqlLower.includes('order by') && sqlLower.includes('product_id');
    const correct = rows.length === 2 && rows[0].product_id <= rows[1].product_id;
    return {
      passed: hasOrder && correct,
      totalScore: hasOrder && correct ? 100 : 70,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Sorted by product_id ASC for deadlock prevention', passed: hasOrder, feedback: 'Deterministic lock hierarchy.' },
        { name: 'Filtered positive available stock', passed: correct, feedback: 'Excluded out-of-stock SKUs.' }
      ],
      explanation: 'Deterministic locking order eliminates cyclic graph waits during concurrent purchases.'
    };
  }
};
