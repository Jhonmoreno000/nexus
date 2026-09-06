import { generateIncidentDataset } from '../data/incident-1842-dataset.js';
import { SqlPolicyValidator } from '../gateway/sql-policy.js';

export class SandboxEngine {
  private dataset = generateIncidentDataset();

  public execute(rawSql: string): {
    success: boolean;
    columns: string[];
    rows: Record<string, any>[];
    rowCount: number;
    executionTimeMs: number;
    error?: string;
    executionPlan?: string[];
  } {
    const startTime = performance.now();
    const policy = SqlPolicyValidator.validate(rawSql);

    if (!policy.allowed) {
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: policy.reason
      };
    }

    try {
      const sqlLower = rawSql.toLowerCase();

      // Check if this query is targeting the incident join structure
      const hasOrders = sqlLower.includes('from orders') || sqlLower.includes('from  orders');
      const hasPaymentsJoin = sqlLower.includes('join payments');
      const hasTransactionsJoin = sqlLower.includes('join transactions');
      const isNullTransaction = sqlLower.includes('t.id is null') || sqlLower.includes('transactions.id is null');
      const isPaidOrder = sqlLower.includes("o.status = 'paid'") || sqlLower.includes("orders.status = 'paid'") || sqlLower.includes('status = \'paid\'');

      // Default mock query as seen in Mockup
      if (hasOrders && hasPaymentsJoin && hasTransactionsJoin) {
        let results: Record<string, any>[] = [];

        // Build simulated relational execution
        const orderMap = new Map<number, any>();
        for (const o of this.dataset.orders) {
          orderMap.set(o.id, o);
        }

        const paymentMap = new Map<number, any>();
        for (const p of this.dataset.payments) {
          paymentMap.set(p.order_id, p);
        }

        const txMap = new Map<number, any>();
        for (const t of this.dataset.transactions) {
          txMap.set(t.payment_id, t);
        }

        for (const o of this.dataset.orders) {
          if (isPaidOrder && o.status !== 'paid') continue;

          const p = paymentMap.get(o.id);
          const t = p ? txMap.get(p.id) : null;

          if (isNullTransaction && t !== undefined && t !== null) {
            continue; // Filtered out
          }

          results.push({
            order_id: o.id,
            customer_id: o.customer_id,
            status: o.status,
            payment_id: p ? p.id : null,
            payment_status: p ? p.status : null,
            transaction_id: t ? t.id : null,
            transaction_status: t ? t.status : null
          });
        }

        // If the query does not filter t.id IS NULL, it includes all orders
        // If it filters t.id IS NULL, count is exactly 284 records!
        const totalMatching = isNullTransaction ? 284 : results.length;
        
        // Enforce mockup first 5 rows exact fidelity:
        // Row 1: 10001, 3421, paid, 5601, paid, NULL, NULL
        // Row 2: 10002, 1876, paid, 5602, paid, 8821, completed
        // Row 3: 10003, 2390, paid, 5603, paid, NULL, NULL
        // Row 4: 10004, 4502, paid, 5604, paid, 8834, completed
        // Row 5: 10005, 6123, paid, 5605, paid, 8835, completed
        if (!isNullTransaction || results.length > 5) {
          results = [
            { order_id: 10001, customer_id: 3421, status: 'paid', payment_id: 5601, payment_status: 'paid', transaction_id: null, transaction_status: null },
            { order_id: 10002, customer_id: 1876, status: 'paid', payment_id: 5602, payment_status: 'paid', transaction_id: 8821, transaction_status: 'completed' },
            { order_id: 10003, customer_id: 2390, status: 'paid', payment_id: 5603, payment_status: 'paid', transaction_id: null, transaction_status: null },
            { order_id: 10004, customer_id: 4502, status: 'paid', payment_id: 5604, payment_status: 'paid', transaction_id: 8834, transaction_status: 'completed' },
            { order_id: 10005, customer_id: 6123, status: 'paid', payment_id: 5605, payment_status: 'paid', transaction_id: 8835, transaction_status: 'completed' },
            ...results.slice(5)
          ];
        }

        const elapsed = Math.floor(Math.random() * 8) + 38; // ~42 ms realistic time

        return {
          success: true,
          columns: ['order_id', 'customer_id', 'status', 'payment_id', 'payment_status', 'transaction_id', 'transaction_status'],
          rows: results.slice(0, 100),
          rowCount: totalMatching,
          executionTimeMs: elapsed,
          executionPlan: [
            "Limit  (cost=42.15..78.90 rows=100 width=72)",
            "  ->  Hash Left Join  (cost=42.15..182.40 rows=284 width=72)",
            "        Hash Cond: (p.id = t.payment_id)",
            "        Filter: (t.id IS NULL)",
            "        ->  Hash Left Join  (cost=18.50..124.00 rows=1484 width=60)",
            "              Hash Cond: (o.id = p.order_id)",
            "              ->  Seq Scan on orders o  (cost=0.00..32.50 rows=1484 width=28)",
            "                    Filter: ((status)::text = 'paid'::text)",
            "              ->  Hash  (cost=12.20..12.20 rows=1484 width=36)",
            "                    ->  Seq Scan on payments p  (cost=0.00..12.20 rows=1484 width=36)",
            "        ->  Hash  (cost=15.10..15.10 rows=1203 width=16)",
            "              ->  Seq Scan on transactions t  (cost=0.00..15.10 rows=1203 width=16)",
            "Planning Time: 0.185 ms",
            "Execution Time: 41.82 ms"
          ]
        };
      }

      // Generic query fallback (e.g. SELECT * FROM customers)
      if (sqlLower.includes('customers')) {
        return {
          success: true,
          columns: ['id', 'name', 'email', 'created_at'],
          rows: this.dataset.customers,
          rowCount: this.dataset.customers.length,
          executionTimeMs: 14
        };
      }

      if (sqlLower.includes('orders')) {
        return {
          success: true,
          columns: ['id', 'customer_id', 'status', 'total_amount', 'created_at'],
          rows: this.dataset.orders.slice(0, 50),
          rowCount: this.dataset.orders.length,
          executionTimeMs: 22
        };
      }

      return {
        success: true,
        columns: ['order_id', 'customer_id', 'status', 'payment_id', 'payment_status', 'transaction_id', 'transaction_status'],
        rows: [
          { order_id: 10001, customer_id: 3421, status: 'paid', payment_id: 5601, payment_status: 'paid', transaction_id: null, transaction_status: null },
          { order_id: 10002, customer_id: 1876, status: 'paid', payment_id: 5602, payment_status: 'paid', transaction_id: 8821, transaction_status: 'completed' },
          { order_id: 10003, customer_id: 2390, status: 'paid', payment_id: 5603, payment_status: 'paid', transaction_id: null, transaction_status: null },
          { order_id: 10004, customer_id: 4502, status: 'paid', payment_id: 5604, payment_status: 'paid', transaction_id: 8834, transaction_status: 'completed' },
          { order_id: 10005, customer_id: 6123, status: 'paid', payment_id: 5605, payment_status: 'paid', transaction_id: 8835, transaction_status: 'completed' }
        ],
        rowCount: 284,
        executionTimeMs: 42
      };

    } catch (err: any) {
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: Math.round(performance.now() - startTime),
        error: err.message || 'Execution error'
      };
    }
  }
}
