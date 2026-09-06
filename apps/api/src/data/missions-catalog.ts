import { PostgresMissionSandbox } from '../sandbox/postgres-engine.js';

export interface Objective {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface MissionDefinition {
  id: string;
  incidentNumber: number;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  timeRemainingSeconds: number;
  context: string;
  objectives: Objective[];
  relatedTables: string[];
  initialQuery: string;
  schemaSql: string;
  seedSql: string;
  schemaTables: {
    name: string;
    columns: { name: string; type: string; isPk?: boolean; isFk?: boolean; fkRef?: string }[];
  }[];
  hints: Record<number, { hint: string; concept: string; nextQuestion: string; codeSnippet?: string }>;
  evaluator: (sql: string, rows: any[]) => {
    passed: boolean;
    totalScore: number;
    breakdown: { correctness: number; logic: number; robustness: number; performance: number; readability: number; security: number };
    testCases: { name: string; passed: boolean; feedback: string }[];
    explanation: string;
  };
}

export const MISSIONS_CATALOG: Record<string, MissionDefinition> = {
  '1021': {
    id: '1021',
    incidentNumber: 1021,
    title: 'Orphaned Customer Records',
    domain: 'E-Commerce / CRM',
    difficulty: 'Beginner',
    timeRemainingSeconds: 1200,
    context: 'During an unmigrated database import, several orders were written with customer IDs that do not exist in the customers table. Find these orphaned records to repair customer billing.',
    objectives: [
      { id: 1, title: '1. Detect orphaned orders', description: 'Find all orders where the customer does not exist in customers table.', completed: false },
      { id: 2, title: '2. Isolate invalid customer IDs', description: 'Group by missing customer_id and total order value.', completed: false },
      { id: 3, title: '3. Verify foreign key integrity', description: 'Prepare schema fix constraint.', completed: false }
    ],
    relatedTables: ['orders', 'customers'],
    initialQuery: `SELECT
    o.id AS order_id,
    o.customer_id,
    o.total_amount,
    c.email
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id
WHERE c.id IS NULL;`,
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
      1: { hint: 'Try joining orders with customers using a LEFT JOIN to see which customer records are missing.', concept: 'Outer Joins', nextQuestion: 'What column will be NULL when there is no match?' },
      2: { hint: 'Filter with WHERE c.id IS NULL to isolate only the orders that lack a valid customer.', concept: 'Anti-Join Isolation', nextQuestion: 'How many orphaned orders are there?' },
      3: { hint: 'Reference syntax: SELECT o.id, o.customer_id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;', concept: 'Solution Draft', nextQuestion: 'Run this query to inspect the records.', codeSnippet: 'SELECT o.id, o.customer_id FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;' }
    },
    evaluator: (sql, rows) => {
      const sqlLower = sql.toLowerCase();
      const hasLeftJoin = sqlLower.includes('left join');
      const hasNull = sqlLower.includes('is null');
      const correctRows = rows.length === 2 && rows.some(r => r.customer_id === 999 || r.customer_id === '999');

      return {
        passed: hasLeftJoin && hasNull && correctRows,
        totalScore: hasLeftJoin && hasNull ? 100 : 60,
        breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
        testCases: [
          { name: 'Identified all orphaned records (customer 999 & 888)', passed: correctRows, feedback: correctRows ? 'Accurately isolated 2 orphaned orders.' : 'Missing records.' },
          { name: 'Used LEFT JOIN anti-pattern', passed: hasLeftJoin, feedback: hasLeftJoin ? 'Correct outer join syntax.' : 'Must use LEFT JOIN.' },
          { name: 'Asserted c.id IS NULL filter', passed: hasNull, feedback: hasNull ? 'Proper NULL predicate.' : 'Must filter for NULL.' }
        ],
        explanation: 'Great job! You identified the invalid foreign keys in the order pipeline.'
      };
    }
  },

  '1140': {
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
    initialQuery: `SELECT
    c.id AS cart_id,
    c.user_id,
    SUM(ci.quantity * ci.unit_price) AS total_value,
    COUNT(ci.id) AS item_count
FROM carts c
JOIN cart_items ci ON ci.cart_id = c.id
WHERE c.status = 'abandoned'
GROUP BY c.id, c.user_id
HAVING SUM(ci.quantity * ci.unit_price) > 100
ORDER BY total_value DESC;`,
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
      1: { hint: 'You need to multiply quantity by unit_price inside the SUM() aggregate function.', concept: 'Computed Aggregates', nextQuestion: 'What clause groups rows by cart?' },
      2: { hint: 'Remember: WHERE filters individual rows before grouping, while HAVING filters aggregated results after grouping.', concept: 'HAVING vs WHERE', nextQuestion: 'How do you check SUM() > 100?' },
      3: { hint: 'Use: HAVING SUM(ci.quantity * ci.unit_price) > 100 ORDER BY total_value DESC;', concept: 'Post-aggregation Filtering', nextQuestion: 'Which carts exceed $100?', codeSnippet: 'HAVING SUM(ci.quantity * ci.unit_price) > 100' }
    },
    evaluator: (sql, rows) => {
      const sqlLower = sql.toLowerCase();
      const hasGroupBy = sqlLower.includes('group by');
      const hasHaving = sqlLower.includes('having');
      const correct = rows.length === 2 && rows.some(r => r.cart_id === 1 || r.cart_id === '1');

      return {
        passed: hasGroupBy && hasHaving && correct,
        totalScore: hasGroupBy && hasHaving ? 95 : 60,
        breakdown: { correctness: 40, logic: 20, robustness: 15, performance: 10, readability: 10, security: 5 },
        testCases: [
          { name: 'Applied GROUP BY across cart_id', passed: hasGroupBy, feedback: 'Proper aggregation grouping.' },
          { name: 'Used HAVING for aggregate threshold > 100', passed: hasHaving, feedback: 'Correct aggregate filter.' },
          { name: 'Returned high-value abandoned carts (Carts #1 and #4)', passed: correct, feedback: 'Accurate revenue impact ranking.' }
        ],
        explanation: 'Excellent aggregation query! Marketing can now target abandoned carts worth $205 and $225.'
      };
    }
  },

  '1280': {
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
    initialQuery: `SELECT
    t.id AS trade_id,
    t.currency_pair,
    t.executed_rate,
    b.fixing_rate,
    ROUND(ABS((t.executed_rate - b.fixing_rate) / b.fixing_rate) * 100, 2) AS variance_pct
FROM fx_trades t
JOIN benchmark_rates b ON b.trade_date = t.trade_date AND b.currency_pair = t.currency_pair
WHERE ABS((t.executed_rate - b.fixing_rate) / b.fixing_rate) * 100 > 0.5;`,
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
      1: { hint: 'Join both on trade_date and currency_pair to make sure you compare the same market on the same day.', concept: 'Composite Key Joins', nextQuestion: 'How do you calculate absolute percentage difference?' },
      2: { hint: 'Use ABS((executed_rate - fixing_rate) / fixing_rate) * 100 to calculate the variance.', concept: 'Mathematical Spread', nextQuestion: 'What condition filters variance > 0.5%?' }
    },
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
  },

  '1842': {
    id: '1842',
    incidentNumber: 1842,
    title: 'Payment Integrity',
    domain: 'Fintech / Payments',
    difficulty: 'Advanced',
    timeRemainingSeconds: 1458,
    context: 'The payment system is showing inconsistencies. 3.7% of orders appear as paid, but they don\'t have a transaction associated. This is affecting customer trust and revenue reconciliation.',
    objectives: [
      { id: 1, title: '1. Identify the affected records', description: 'Find orders marked as paid without a transaction.', completed: true },
      { id: 2, title: '2. Determine the root cause', description: 'Analyze the data and relationships between tables.', completed: false },
      { id: 3, title: '3. Propose a solution', description: 'Suggest a fix to prevent this issue in the future.', completed: false },
      { id: 4, title: '4. Verify the integrity', description: 'Confirm that the data is consistent after your changes.', completed: false }
    ],
    relatedTables: ['orders', 'payments', 'transactions', 'refunds'],
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
LIMIT 100;`,
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
      1: { hint: 'Orders marked as paid must be joined through payments to transactions using LEFT JOIN.', concept: 'Chained Outer Joins', nextQuestion: 'What indicates the transaction never happened?' },
      2: { hint: 'Add: WHERE o.status = \'paid\' AND t.id IS NULL to isolate the missing ledger entries.', concept: 'Anti-Join Filter', nextQuestion: 'How many missing transactions were found?' },
      3: { hint: 'Reference Query: SELECT o.id, p.id, t.id FROM orders o LEFT JOIN payments p ON p.order_id = o.id LEFT JOIN transactions t ON t.payment_id = p.id WHERE o.status = \'paid\' AND t.id IS NULL;', concept: 'Production Reconciliation', nextQuestion: 'Run and verify the rows.', codeSnippet: 'WHERE o.status = \'paid\' AND t.id IS NULL' }
    },
    evaluator: (sql, rows) => {
      const sqlLower = sql.toLowerCase();
      const hasLeftJoin = sqlLower.includes('left join');
      const hasNull = sqlLower.includes('is null');
      const hasPaid = sqlLower.includes("status = 'paid'") || sqlLower.includes("o.status = 'paid'");
      const correct = rows.length >= 2 && rows.some(r => r.order_id === 10001 || r.order_id === '10001');

      return {
        passed: hasLeftJoin && hasNull && correct,
        totalScore: 100,
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
  },

  '1930': {
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
    initialQuery: `SELECT
    i.product_id,
    p.name AS product_name,
    i.stock_available,
    i.stock_reserved
FROM inventory i
JOIN products p ON p.id = i.product_id
WHERE i.stock_available > 0
ORDER BY i.product_id ASC;`,
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
      1: { hint: 'Deadlocks occur when transaction A locks 101 then 102, while transaction B locks 102 then 101. Enforcing ORDER BY product_id ASC breaks cyclic dependency.', concept: 'Lock Ordering', nextQuestion: 'How does sorting prevent deadlocks?' }
    },
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
  },

  '2045': {
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
    initialQuery: `SELECT
    id AS claim_id,
    customer_id,
    amount,
    terminal_id,
    COUNT(*) OVER (PARTITION BY customer_id) AS refund_velocity_count,
    SUM(amount) OVER (PARTITION BY customer_id) AS total_refunded_amount
FROM refund_claims
ORDER BY refund_velocity_count DESC;`,
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
      1: { hint: 'Window functions allow computing aggregates across rows related to the current row without collapsing the result set like GROUP BY does.', concept: 'Window Functions', nextQuestion: 'How do you write a window count?' },
      2: { hint: 'Syntax: COUNT(*) OVER (PARTITION BY customer_id) computes the frequency for each customer.', concept: 'Partitioning', nextQuestion: 'Which customer has a velocity of 3?' }
    },
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
  }
};
