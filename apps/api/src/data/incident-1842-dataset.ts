export interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  payment_id: number;
  status: string;
  amount: number;
  created_at: string;
}

export interface Refund {
  id: number;
  transaction_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export interface SchemaTableColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
}

export interface SchemaTable {
  name: string;
  columns: SchemaTableColumn[];
}

export const INCIDENT_SCHEMA: SchemaTable[] = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'integer', isPk: true },
      { name: 'name', type: 'varchar(255)' },
      { name: 'email', type: 'varchar(255)' },
      { name: 'created_at', type: 'timestamp' }
    ]
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'integer', isPk: true },
      { name: 'customer_id', type: 'integer', isFk: true, fkRef: 'customers.id' },
      { name: 'status', type: 'varchar(50)' },
      { name: 'total_amount', type: 'numeric(12,2)' },
      { name: 'created_at', type: 'timestamp' }
    ]
  },
  {
    name: 'payments',
    columns: [
      { name: 'id', type: 'integer', isPk: true },
      { name: 'order_id', type: 'integer', isFk: true, fkRef: 'orders.id' },
      { name: 'amount', type: 'numeric(12,2)' },
      { name: 'status', type: 'varchar(50)' },
      { name: 'created_at', type: 'timestamp' }
    ]
  },
  {
    name: 'transactions',
    columns: [
      { name: 'id', type: 'integer', isPk: true },
      { name: 'payment_id', type: 'integer', isFk: true, fkRef: 'payments.id' },
      { name: 'status', type: 'varchar(50)' },
      { name: 'amount', type: 'numeric(12,2)' },
      { name: 'created_at', type: 'timestamp' }
    ]
  },
  {
    name: 'refunds',
    columns: [
      { name: 'id', type: 'integer', isPk: true },
      { name: 'transaction_id', type: 'integer', isFk: true, fkRef: 'transactions.id' },
      { name: 'amount', type: 'numeric(12,2)' },
      { name: 'status', type: 'varchar(50)' },
      { name: 'created_at', type: 'timestamp' }
    ]
  }
];

// Seed generator to yield exactly the mock data + remaining 284 rows
export function generateIncidentDataset() {
  const customers: Customer[] = [
    { id: 3421, name: 'Sarah Connor', email: 'sconnor@cyberdyne.corp', created_at: '2026-08-01 10:20:00' },
    { id: 1876, name: 'Marcus Wright', email: 'mwright@skynet.org', created_at: '2026-08-02 11:15:00' },
    { id: 2390, name: 'Kyle Reese', email: 'kreese@resistance.net', created_at: '2026-08-03 09:30:00' },
    { id: 4502, name: 'John Connor', email: 'jconnor@resistance.net', created_at: '2026-08-04 14:45:00' },
    { id: 6123, name: 'Kate Brewster', email: 'kbrewster@darpa.mil', created_at: '2026-08-05 16:00:00' }
  ];

  const orders: Order[] = [];
  const payments: Payment[] = [];
  const transactions: Transaction[] = [];
  const refunds: Refund[] = [];

  // Distinct known records from Mockup
  // Row 1: order 10001, customer 3421, paid, payment 5601, paid, transaction NULL
  // Row 2: order 10002, customer 1876, paid, payment 5602, paid, transaction 8821 completed
  // Row 3: order 10003, customer 2390, paid, payment 5603, paid, transaction NULL
  // Row 4: order 10004, customer 4502, paid, payment 5604, paid, transaction 8834 completed
  // Row 5: order 10005, customer 6123, paid, payment 5605, paid, transaction 8835 completed

  orders.push({ id: 10001, customer_id: 3421, status: 'paid', total_amount: 249.99, created_at: '2026-08-10 12:00:00' });
  payments.push({ id: 5601, order_id: 10001, amount: 249.99, status: 'paid', created_at: '2026-08-10 12:00:05' });
  // no transaction for 5601

  orders.push({ id: 10002, customer_id: 1876, status: 'paid', total_amount: 120.00, created_at: '2026-08-10 12:05:00' });
  payments.push({ id: 5602, order_id: 10002, amount: 120.00, status: 'paid', created_at: '2026-08-10 12:05:05' });
  transactions.push({ id: 8821, payment_id: 5602, status: 'completed', amount: 120.00, created_at: '2026-08-10 12:05:08' });

  orders.push({ id: 10003, customer_id: 2390, status: 'paid', total_amount: 899.50, created_at: '2026-08-10 12:10:00' });
  payments.push({ id: 5603, order_id: 10003, amount: 899.50, status: 'paid', created_at: '2026-08-10 12:10:05' });
  // no transaction for 5603

  orders.push({ id: 10004, customer_id: 4502, status: 'paid', total_amount: 45.00, created_at: '2026-08-10 12:15:00' });
  payments.push({ id: 5604, order_id: 10004, amount: 45.00, status: 'paid', created_at: '2026-08-10 12:15:05' });
  transactions.push({ id: 8834, payment_id: 5604, status: 'completed', amount: 45.00, created_at: '2026-08-10 12:15:08' });

  orders.push({ id: 10005, customer_id: 6123, status: 'paid', total_amount: 1340.00, created_at: '2026-08-10 12:20:00' });
  payments.push({ id: 5605, order_id: 10005, amount: 1340.00, status: 'paid', created_at: '2026-08-10 12:20:05' });
  transactions.push({ id: 8835, payment_id: 5605, status: 'completed', amount: 1340.00, created_at: '2026-08-10 12:20:08' });

  // Generate additional records reaching realistic incident dataset
  // Total affected discrepancy orders without transactions: 284 records
  let orderCursor = 10006;
  let paymentCursor = 5606;
  let txCursor = 8836;

  // We add 282 more affected orders (total 284 missing transactions)
  for (let i = 0; i < 282; i++) {
    const oId = orderCursor++;
    const pId = paymentCursor++;
    const custId = 1000 + (i % 50);
    orders.push({ id: oId, customer_id: custId, status: 'paid', total_amount: 50 + (i * 7) % 300, created_at: '2026-08-10 13:00:00' });
    payments.push({ id: pId, order_id: oId, amount: 50 + (i * 7) % 300, status: 'paid', created_at: '2026-08-10 13:00:04' });
    // NO transaction created for these (creates the 284 discrepancy total!)
  }

  // Add 1200 normal orders with completed transactions
  for (let i = 0; i < 1200; i++) {
    const oId = orderCursor++;
    const pId = paymentCursor++;
    const tId = txCursor++;
    const custId = 1000 + (i % 50);
    orders.push({ id: oId, customer_id: custId, status: 'paid', total_amount: 25 + (i * 3) % 250, created_at: '2026-08-10 14:00:00' });
    payments.push({ id: pId, order_id: oId, amount: 25 + (i * 3) % 250, status: 'paid', created_at: '2026-08-10 14:00:04' });
    transactions.push({ id: tId, payment_id: pId, status: 'completed', amount: 25 + (i * 3) % 250, created_at: '2026-08-10 14:00:06' });
  }

  // Add 50 pending orders (not paid)
  for (let i = 0; i < 50; i++) {
    const oId = orderCursor++;
    orders.push({ id: oId, customer_id: 1001, status: 'pending', total_amount: 75.00, created_at: '2026-08-10 15:00:00' });
  }

  return { customers, orders, payments, transactions, refunds };
}
