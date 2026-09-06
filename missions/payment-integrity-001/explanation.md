# Payment Integrity Incident Analysis

## Root Cause
When orders were processed during a gateway failover period, the payment record was marked 'paid' prematurely before the asynchronous settlement transaction webhook arrived. As a result, 3.7% of paid orders have no corresponding transaction ledger record in the `transactions` table.

## Identification Strategy
Performing a `LEFT JOIN` from `orders` through `payments` into `transactions` and asserting `t.id IS NULL` identifies all orders where the ledger transaction is absent.
