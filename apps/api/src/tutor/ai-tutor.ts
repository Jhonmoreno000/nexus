export interface TutorHintResponse {
  diagnosis: string;
  hintLevel: number;
  hint: string;
  concept: string;
  nextQuestion: string;
  codeSnippet?: string;
}

export class AiTutorService {
  private static HINTS: Record<number, { hint: string; concept: string; nextQuestion: string; codeSnippet?: string }> = {
    0: {
      hint: 'Take a close look at the Database Explorer ERD. Notice the relationship chain: customers -> orders -> payments -> transactions.',
      concept: 'Relational Graph Traversal',
      nextQuestion: 'Which table holds the actual bank settlement record?'
    },
    1: {
      hint: 'The incident notes that orders appear as \'paid\', yet have no transaction record. When you do an INNER JOIN, what happens to rows that have no match on the right side?',
      concept: 'Preserving Unmatched Rows',
      nextQuestion: 'What JOIN type allows you to keep the left table rows even when the right table has no record?'
    },
    2: {
      hint: 'Remember that an INNER JOIN drops unmatched records, hiding the problem! A LEFT JOIN will preserve the order and payment, and fill the missing transaction columns with NULL.',
      concept: 'Anti-Join Analysis',
      nextQuestion: 'How can you test in your WHERE clause that the transaction never occurred?'
    },
    3: {
      hint: 'You can chain two LEFT JOINs: orders LEFT JOIN payments ON p.order_id = o.id, and payments LEFT JOIN transactions ON t.payment_id = p.id.',
      concept: 'Multi-table Chained Joins',
      nextQuestion: 'What condition filters only paid orders where t.id does not exist?',
      codeSnippet: 'LEFT JOIN payments p ON p.order_id = o.id\nLEFT JOIN transactions t ON t.payment_id = p.id'
    },
    4: {
      hint: 'To filter for only the broken orders, combine: WHERE o.status = \'paid\' AND t.id IS NULL. This isolates the exact 284 records.',
      concept: 'SQL Anti-Pattern Detection',
      nextQuestion: 'Can you now run the query and check the column values?',
      codeSnippet: 'WHERE o.status = \'paid\'\n  AND t.id IS NULL'
    },
    5: {
      hint: 'Full Reference Query: Select order details, left join payments and transactions, then filter where o.status = \'paid\' and t.id IS NULL with a LIMIT 100.',
      concept: 'Comprehensive Anti-Join Resolution',
      nextQuestion: 'Now review the EXPLAIN plan to see how the Hash Left Join executes.',
      codeSnippet: `SELECT
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
LIMIT 100;`
    }
  };

  public static getHint(requestedLevel: number, currentQuery?: string): TutorHintResponse {
    const level = Math.min(Math.max(0, requestedLevel), 5);
    const data = this.HINTS[level];

    return {
      diagnosis: `Analyzing query structure. Current level: ${level}/5.`,
      hintLevel: level,
      hint: data.hint,
      concept: data.concept,
      nextQuestion: data.nextQuestion,
      codeSnippet: data.codeSnippet
    };
  }
}
