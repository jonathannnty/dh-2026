import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Load api/.env into process.env before each test file. The dev server
    // does this via `tsx --env-file`, but `vitest run` does not load env
    // files on its own, so buildApp() → loadEnv() would otherwise fail on the
    // required DATABASE_URL. setupFiles run inside each worker, which is where
    // the env needs to exist.
    setupFiles: ['./vitest.setup.ts'],

    // Integration suites run against a real Neon branch over HTTP, so each
    // query is a network round-trip (the old in-process SQLite was ~instant).
    // Full intake → analyze → SSE flows do many sequential round-trips plus
    // the demo SSE stream's own ~2.6s of staged delays, which blows past
    // Vitest's 5s default. Give them realistic headroom.
    testTimeout: 30000,
    hookTimeout: 30000,

    // All suites share ONE Neon branch (the old SQLite gave each worker its
    // own in-memory DB). Vitest parallelises test files by default, so the
    // destructive ops/db-admin suites (/ops/reset, restore — they wipe the
    // sessions table) would race other suites and delete rows they're mid-flow
    // on. Run files sequentially; within-file tests are already ordered and
    // each file manages its own data.
    fileParallelism: false,
  },
});
