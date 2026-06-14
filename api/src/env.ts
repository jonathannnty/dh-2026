import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: z.string().min(1),

  AGENT_SERVICE_URL: z.string().url().default('http://localhost:8000'),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEMO_MODE: z
    .enum(['true', 'false', '1', '0', ''])
    .default('')
    .transform((v) => v === 'true' || v === '1'),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  // Empty string in .env (JWT_SECRET=) means "unset" — coerce to undefined so
  // .optional() applies and the auth plugin's dev fallback kicks in. A short
  // but non-empty value is still a real misconfiguration and stays rejected.
  JWT_SECRET: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(32).optional(),
  ),

  // Post-OAuth redirect base URL (e.g. https://pathfinder.vercel.app)
  APP_URL: z.string().url().default('http://localhost:5173'),
});

export type Env = z.infer<typeof EnvSchema>;

let _env: Env | null = null;

export function loadEnv(): Env {
  if (_env) return _env;
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${formatted}`);
  }
  _env = result.data;
  return _env;
}
