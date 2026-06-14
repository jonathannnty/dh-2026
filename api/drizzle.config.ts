import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env', override: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
