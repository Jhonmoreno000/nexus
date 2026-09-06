export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
  statementType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'EXPLAIN' | 'FORBIDDEN';
}

const FORBIDDEN_PATTERNS = [
  /DROP\s+DATABASE/i,
  /ALTER\s+SYSTEM/i,
  /CREATE\s+USER/i,
  /DROP\s+USER/i,
  /GRANT\s+ALL/i,
  /REVOKE/i,
  /COPY\s+.*\s+TO/i,
  /COPY\s+.*\s+FROM/i,
  /pg_read_file/i,
  /pg_write_file/i,
  /pg_ls_dir/i,
  /dblink/i,
  /pg_sleep\s*\(\s*([5-9]|\d{2,})\s*\)/i, // block deliberate DOS sleep > 4s
  /information_schema\.user_mappings/i,
  /pg_shadow/i,
  /pg_authid/i
];

export class SqlPolicyValidator {
  static validate(sql: string): PolicyCheckResult {
    const trimmed = sql.trim();
    if (!trimmed) {
      return { allowed: false, reason: 'Empty query statement.', statementType: 'FORBIDDEN' };
    }

    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          allowed: false,
          reason: `Statement violates NEXUS SQL Sandbox Security Policy (Forbidden pattern detected).`,
          statementType: 'FORBIDDEN'
        };
      }
    }

    const firstWord = trimmed.split(/\s+/)[0].toUpperCase();
    if (firstWord === 'SELECT' || firstWord === 'WITH') {
      return { allowed: true, statementType: 'SELECT' };
    }
    if (firstWord === 'EXPLAIN') {
      return { allowed: true, statementType: 'EXPLAIN' };
    }
    if (firstWord === 'INSERT') {
      return { allowed: true, statementType: 'INSERT' };
    }
    if (firstWord === 'UPDATE') {
      return { allowed: true, statementType: 'UPDATE' };
    }
    if (firstWord === 'DELETE') {
      return { allowed: true, statementType: 'DELETE' };
    }

    return { allowed: true, statementType: 'SELECT' };
  }
}
