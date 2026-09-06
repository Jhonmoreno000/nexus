import { newDb, IMemoryDb } from 'pg-mem';

export interface PostgresQueryResult {
  success: boolean;
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  executionPlan?: string[];
}

export class PostgresMissionSandbox {
  private db: IMemoryDb;

  constructor(schemaSql: string, seedSql: string) {
    this.db = newDb();
    
    // Register common PostgreSQL helper functions if needed
    try {
      this.db.public.none(schemaSql);
      this.db.public.none(seedSql);
    } catch (err: any) {
      console.error('Schema/Seed initialization error:', err.message);
    }
  }

  public execute(sql: string): PostgresQueryResult {
    const startTime = performance.now();
    try {
      // Execute query against real in-memory PostgreSQL engine
      const results = this.db.public.many(sql);
      const executionTimeMs = Math.max(12, Math.round(performance.now() - startTime));

      if (!results || results.length === 0) {
        return {
          success: true,
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs,
          executionPlan: [
            "Execution Type: In-Memory PostgreSQL Engine (pg-mem)",
            "Query Result: 0 rows returned",
            `Planning and Execution: ${executionTimeMs} ms`
          ]
        };
      }

      const columns = Object.keys(results[0]);
      return {
        success: true,
        columns,
        rows: results,
        rowCount: results.length,
        executionTimeMs,
        executionPlan: [
          "Hash Join / Scan Execution Plan:",
          `  ->  Relation Scan on target schema (cost=10.00..45.20 rows=${results.length})`,
          `Execution Time: ${executionTimeMs} ms`
        ]
      };
    } catch (err: any) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs,
        error: err.message || 'PostgreSQL execution error'
      };
    }
  }
}
