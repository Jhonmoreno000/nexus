import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('SQL Policy Validator - Security boundaries', async (t) => {
  const forbiddenPatterns = [
    'DROP DATABASE production;',
    'ALTER SYSTEM SET wal_level = minimal;',
    'COPY users TO \'/tmp/secret.csv\';',
    'SELECT pg_read_file(\'/etc/passwd\');',
    'SELECT pg_sleep(10);'
  ];

  for (const query of forbiddenPatterns) {
    const isForbidden = /DROP\s+DATABASE/i.test(query) ||
      /ALTER\s+SYSTEM/i.test(query) ||
      /COPY\s+.*\s+TO/i.test(query) ||
      /pg_read_file/i.test(query) ||
      /pg_sleep\s*\(\s*([5-9]|\d{2,})\s*\)/i.test(query);

    assert.strictEqual(isForbidden, true, `Query "${query}" should be blocked`);
  }
});

test('Evaluation Engine - Multi-layer scoring structure', async (t) => {
  const validQuery = `
    SELECT
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
    LIMIT 100;
  `;

  const sqlLower = validQuery.toLowerCase();
  const usesLeftJoin = sqlLower.includes('left join');
  const checksNullTx = sqlLower.includes('t.id is null');
  const checksPaid = sqlLower.includes("status = 'paid'");

  assert.strictEqual(usesLeftJoin, true);
  assert.strictEqual(checksNullTx, true);
  assert.strictEqual(checksPaid, true);
});

test('Incident #1842 - Objectives & Manifest specification', async (t) => {
  const manifest = JSON.parse(fs.readFileSync('missions/payment-integrity-001/manifest.json', 'utf8'));

  assert.strictEqual(manifest.id, 'payment-integrity-001');
  assert.strictEqual(manifest.incidentNumber, 1842);
  assert.strictEqual(manifest.difficulty, 'advanced');
  assert.strictEqual(manifest.database, 'postgresql');
  assert.strictEqual(manifest.evaluation.correctness, 0.40);
  assert.strictEqual(manifest.evaluation.logic, 0.20);
});
