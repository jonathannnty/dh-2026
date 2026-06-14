import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from './schema.js';
import { loadEnv } from '../env.js';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function ensureInit() {
  if (_db) return _db;
  const env = loadEnv();
  const sql = neon(env.DATABASE_URL);
  _db = drizzle(sql, { schema });
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const real = ensureInit();
    const value = Reflect.get(real, prop, receiver);
    if (typeof value === 'function') return value.bind(real);
    return value;
  },
});

export async function dbHealthCheck(): Promise<boolean> {
  try {
    const real = ensureInit();
    await real.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export function createTestDb() {
  throw new Error('createTestDb not supported with Neon — use a test DATABASE_URL env var pointing to a test Neon branch');
}

export function closeDb(): void {
  _db = null;
}
