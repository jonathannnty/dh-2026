import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Load env for tests, resolved relative to this file so it works regardless of
// the worker's cwd. dotenv's default override:false means already-set values
// win, so this load order establishes the precedence:
//
//   real env (CI secrets)  >  .env.test (local test-DB isolation)  >  .env (dev)
//
// To run the suite against a dedicated Neon branch instead of your dev DB, put
// a DATABASE_URL in api/.env.test (gitignored — see .env.test.example). In CI,
// set DATABASE_URL in the environment and it overrides both files.
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, '.env.test') });
config({ path: resolve(here, '.env') });
