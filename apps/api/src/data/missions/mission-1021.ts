import { MissionDefinition } from './types.js';

export const mission1021: MissionDefinition = {
  id: '1021',
  incidentNumber: 1021,
  title: 'Orphaned Customer Records',
  domain: 'E-Commerce / CRM',
  difficulty: 'Beginner',
  timeRemainingSeconds: 1200,
  context: 'During an unmigrated database import, several orders were written with customer IDs that do not exist in the customers table. Find these orphaned records to repair customer billing.',
  objectives: [
    { id: 1, title: '1. Detect orphaned orders', description: 'Find all orders where the customer does not exist in customers table.', completed: false },
    { id: 2, title: '2. Isolate invalid customer IDs', description: 'Identify the missing customer IDs (999 & 888).', completed: false },
    { id: 3, title: '3. Propose integrity repair', description: 'Confirm that only invalid records are returned.', completed: false }
  ],
  relatedTables: ['orders', 'customers'],
  initialQuery: `-- INCIDENT #1021: Orphaned Customer Records
-- Goal: Find orders where the customer_id does not exist in customers.
-- Tables: orders (id, customer_id, total_amount, status), customers (id, name, email)

SELECT
    o.id AS order_id,
    o.customer_id,
    o.total_amount
FROM orders o
LIMIT 10;`,
  schemaSql: `
    CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));
    CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, total_amount NUMERIC(10,2), status VARCHAR(20));
  `,
  seedSql: `
    INSERT INTO customers VALUES (1, 'Alice', 'alice@corp.com'), (2, 'Bob', 'bob@corp.com'), (3, 'Charlie', 'charlie@corp.com');
    INSERT INTO orders VALUES (101, 1, 150.00, 'completed'), (102, 999, 320.00, 'pending'), (103, 2, 75.50, 'completed'), (104, 888, 410.00, 'pending'), (105, 3, 90.00, 'completed');
  `,
  schemaTables: [
    {
      name: 'customers',
      columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'name', type: 'VARCHAR(100)' }, { name: 'email', type: 'VARCHAR(100)' }]
    },
    {
      name: 'orders',
      columns: [{ name: 'id', type: 'INT', isPk: true }, { name: 'customer_id', type: 'INT', isFk: true, fkRef: 'customers.id' }, { name: 'total_amount', type: 'NUMERIC' }, { name: 'status', type: 'VARCHAR(20)' }]
    }
  ],
  hints: {
    1: { hint: 'When you perform a LEFT JOIN from orders to customers, what value will c.id have when no customer exists?', concept: 'Outer Join NULL Propagation', nextQuestion: 'How can you filter specifically for missing rows in WHERE?' },
    2: { hint: 'Use an Anti-Join pattern: orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL.', concept: 'Anti-Join Pattern', nextQuestion: 'Which orders have c.id IS NULL?' },
    3: { hint: 'Reference structure: SELECT o.id, o.customer_id, o.total_amount FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;', concept: 'Anti-Join Solution', nextQuestion: 'Run this query to isolate orders 102 and 104.' }
  },
  quizQuestions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'If an order has a customer_id that is NOT in the customers table, what happens when you use an INNER JOIN?',
      options: [
        { id: 'opt1', text: 'The order row is completely dropped and omitted from the results' },
        { id: 'opt2', text: 'The missing customer columns are filled with 0' },
        { id: 'opt3', text: 'The query throws a foreign key syntax exception' },
        { id: 'opt4', text: 'The order row is duplicated for every customer' }
      ],
      correctAnswerId: 'opt1',
      explanation: 'An INNER JOIN requires matches on both sides; without a match, the row is discarded!'
    },
    {
      id: 'q2',
      type: 'true-false',
      prompt: 'True or False: In SQL, comparing "c.id = NULL" is the correct way to test if a column has no value.',
      options: [
        { id: 'opt_true', text: 'True' },
        { id: 'opt_false', text: 'False (Must use "IS NULL")' }
      ],
      correctAnswerId: 'opt_false',
      explanation: 'NULL represents unknown in SQL. "= NULL" always evaluates to UNKNOWN/False. You must use "IS NULL".'
    }
  ],
  sideQuests: [
    {
      id: 'sq1',
      title: 'Side Quest: Count Total Registered Customers',
      description: 'Execute: SELECT COUNT(*) FROM customers; to verify how many valid customers exist in the ledger.',
      targetSqlSnippet: 'SELECT COUNT(*) FROM customers;',
      hintLevelUnlocked: 1
    }
  ],
  evaluator: (sql, rows) => {
    const sqlLower = sql.toLowerCase();
    const hasLeftJoin = sqlLower.includes('left join');
    const hasNull = sqlLower.includes('is null');
    const correctRows = rows.length === 2 && rows.some(r => r.customer_id === 999 || r.customer_id === '999');

    return {
      passed: hasLeftJoin && hasNull && correctRows,
      totalScore: hasLeftJoin && hasNull && correctRows ? 100 : 50,
      breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
      testCases: [
        { name: 'Identified all orphaned records (customer 999 & 888)', passed: correctRows, feedback: correctRows ? 'Accurately isolated 2 orphaned orders.' : 'Missing records.' },
        { name: 'Used LEFT JOIN anti-pattern', passed: hasLeftJoin, feedback: hasLeftJoin ? 'Correct outer join syntax.' : 'Must use LEFT JOIN.' },
        { name: 'Asserted c.id IS NULL filter', passed: hasNull, feedback: hasNull ? 'Proper NULL predicate.' : 'Must filter for NULL.' }
      ],
      explanation: 'Great job! You identified the invalid foreign keys in the order pipeline.'
    };
  }
};
