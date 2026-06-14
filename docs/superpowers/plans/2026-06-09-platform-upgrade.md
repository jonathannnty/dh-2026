# Platform Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver UI polish (no gradients, misc track), infrastructure (Neon PostgreSQL + DeepSeek agent), and user features (OAuth auth, profile dashboard, flexible comparison page).

**Architecture:** Three parallel streams converging at Stream 3 — Streams 1 and 2 have no dependencies and can land in any order; Stream 3 requires Stream 2's database tables (users, savedCareers) to exist before auth is built.

**Tech Stack:** React 19, React Router 7, TanStack Query 5, Fastify 5, Drizzle ORM, @neondatabase/serverless, DeepSeek API (via openai SDK), Python FastAPI, JWT (jose), OAuth (Google + GitHub)

---

## Stream 1 — UI Polish

### Task 1: Remove gradients from index.css

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace `--pf-home-hero-bg` gradient with flat color**

In `frontend/src/index.css`, find and replace in `.home-hero-panel`:
```css
/* BEFORE */
--pf-home-hero-bg: linear-gradient(
  140deg,
  #0f1117 0%,
  #1a1d27 52%,
  #0f1117 100%
);

/* AFTER */
--pf-home-hero-bg: #0f1117;
```

- [ ] **Step 2: Replace `--pf-home-hero-phase-bg` gradient with flat color**

```css
/* BEFORE */
--pf-home-hero-phase-bg: linear-gradient(
  145deg,
  rgba(17, 21, 32, 0.9),
  rgba(20, 24, 34, 0.7)
);

/* AFTER */
--pf-home-hero-phase-bg: rgba(17, 21, 32, 0.9);
```

- [ ] **Step 3: Replace `html[data-theme="light"] .home-hero-panel` hero bg gradient**

```css
/* BEFORE */
--pf-home-hero-bg: linear-gradient(
  140deg,
  #f8faff 0%,
  #eef2ff 52%,
  #f8fafc 100%
);

/* AFTER */
--pf-home-hero-bg: #f8faff;
```

- [ ] **Step 4: Replace light mode `--pf-home-hero-phase-bg` gradient**

```css
/* BEFORE */
--pf-home-hero-phase-bg: linear-gradient(
  145deg,
  rgba(255, 255, 255, 0.94),
  rgba(244, 247, 255, 0.9)
);

/* AFTER */
--pf-home-hero-phase-bg: rgba(255, 255, 255, 0.94);
```

- [ ] **Step 5: Replace `.home-hero-glow-a` radial-gradient with solid tinted background**

```css
/* BEFORE */
.home-hero-glow-a {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--pf-color-brand-500) 42%, transparent),
    transparent 58%
  );
}

/* AFTER */
.home-hero-glow-a {
  background: color-mix(in srgb, var(--pf-color-brand-500) 28%, transparent);
}
```

- [ ] **Step 6: Replace `.home-hero-glow-b` radial-gradient**

```css
/* BEFORE */
.home-hero-glow-b {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--pf-color-success-500) 30%, transparent),
    transparent 62%
  );
}

/* AFTER */
.home-hero-glow-b {
  background: color-mix(in srgb, var(--pf-color-success-500) 18%, transparent);
}
```

- [ ] **Step 7: Replace `.home-hero-title-accent` gradient text with flat brand color**

```css
/* BEFORE */
.home-hero-title-accent {
  background: linear-gradient(
    120deg,
    var(--pf-color-brand-400),
    color-mix(in srgb, var(--pf-color-brand-500) 62%, #f97316),
    var(--pf-color-brand-500)
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: heroAccentFlow 8s ease-in-out infinite;
}

/* AFTER */
.home-hero-title-accent {
  color: var(--pf-color-brand-400);
}
```

- [ ] **Step 8: Replace light mode `.home-hero-title-accent` gradient**

```css
/* BEFORE */
html[data-theme="light"] .home-hero-panel .home-hero-title-accent {
  background: linear-gradient(
    120deg,
    #4f46e5,
    color-mix(in srgb, var(--pf-color-brand-500) 62%, #06b6d4),
    #0f766e
  );
  background-size: 200% 200%;
}

/* AFTER */
html[data-theme="light"] .home-hero-panel .home-hero-title-accent {
  color: #4f46e5;
}
```

- [ ] **Step 9: Replace `.ambient-bg` radial-gradient background with flat tinted color**

```css
/* BEFORE */
.ambient-bg {
  background:
    radial-gradient(circle at 18% 12%, rgba(99, 102, 241, 0.16), transparent 42%),
    radial-gradient(circle at 84% 14%, rgba(34, 197, 94, 0.1), transparent 36%),
    radial-gradient(circle at 62% 84%, rgba(245, 158, 11, 0.08), transparent 34%);
}

/* AFTER */
.ambient-bg {
  background: transparent;
}
```

- [ ] **Step 10: Replace `html[data-theme="light"] .ambient-bg` gradient**

```css
/* BEFORE */
html[data-theme="light"] .ambient-bg {
  background:
    radial-gradient(circle at 18% 12%, rgba(79, 70, 229, 0.11), transparent 42%),
    radial-gradient(circle at 84% 14%, rgba(21, 128, 61, 0.08), transparent 36%),
    radial-gradient(circle at 62% 84%, rgba(217, 119, 6, 0.08), transparent 34%);
}

/* AFTER */
html[data-theme="light"] .ambient-bg {
  background: transparent;
}
```

- [ ] **Step 11: Replace `.ambient-orb-a` radial-gradient**

```css
/* BEFORE */
.ambient-orb-a {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.3), rgba(99, 102, 241, 0));
}

/* AFTER */
.ambient-orb-a {
  background: rgba(99, 102, 241, 0.18);
}
```

- [ ] **Step 12: Replace `.ambient-orb-b` radial-gradient**

```css
/* BEFORE */
.ambient-orb-b {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.24), rgba(14, 165, 233, 0));
}

/* AFTER */
.ambient-orb-b {
  background: rgba(14, 165, 233, 0.14);
}
```

- [ ] **Step 13: Replace `.ambient-orb-c` radial-gradient**

```css
/* BEFORE */
.ambient-orb-c {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.18), rgba(139, 92, 246, 0));
}

/* AFTER */
.ambient-orb-c {
  background: rgba(139, 92, 246, 0.1);
}
```

- [ ] **Step 14: Replace `.ambient-cursor` radial-gradient background**

```css
/* BEFORE */
.ambient-cursor {
  background:
    radial-gradient(
      circle 220px at var(--pf-cursor-x) var(--pf-cursor-y),
      rgba(99, 102, 241, 0.18),
      rgba(99, 102, 241, 0.05) 40%,
      transparent 68%
    ),
    radial-gradient(
      circle 120px at var(--pf-cursor-x) var(--pf-cursor-y),
      rgba(255, 255, 255, 0.08),
      transparent 70%
    );
}

/* AFTER */
.ambient-cursor {
  background: rgba(99, 102, 241, 0.08);
}
```

- [ ] **Step 15: Remove `heroAccentFlow` keyframe animation (no longer used)**

Delete the entire `@keyframes heroAccentFlow { ... }` block from `index.css`.

- [ ] **Step 16: Scan for any remaining gradient classes in frontend source files**

Run:
```powershell
Select-String -Path "frontend\src\**\*.tsx","frontend\src\**\*.ts","frontend\src\**\*.css" -Pattern "gradient|from-|via-|to-" -Recurse | Select-Object Filename, LineNumber, Line
```

Fix any remaining hits by replacing with their flat-color equivalents using the dominant color in the gradient.

- [ ] **Step 17: Commit**

```bash
git add frontend/src/index.css
git commit -m "style: remove all gradients, replace with flat colors"
```

---

### Task 2: Add miscellaneous track

**Files:**
- Modify: `api/src/services/tracks.ts`

- [ ] **Step 1: Add misc entry to TRACK_REGISTRY**

In `api/src/services/tracks.ts`, append to the `TRACK_REGISTRY` array before the closing `]`:

```typescript
  {
    id: 'misc',
    name: 'Miscellaneous',
    sponsor: 'PathFinder AI',
    description: "Not sure where you fit? Explore careers across all fields.",
    icon: 'sparkles',
    color: '#8b5cf6',
    tags: ['open-ended', 'exploratory', 'multi-field'],
  },
```

- [ ] **Step 2: Verify tracks endpoint returns 5 tracks**

Start the API: `npm run dev --workspace api`

```bash
curl http://localhost:3001/tracks
```

Expected: JSON with 5 tracks including `id: "misc"`.

- [ ] **Step 3: Commit**

```bash
git add api/src/services/tracks.ts
git commit -m "feat: add miscellaneous sponsor track"
```

---

## Stream 2 — Infrastructure

### Task 3: Swap SQLite → Neon PostgreSQL

**Files:**
- Modify: `api/package.json`
- Modify: `api/src/db/client.ts`
- Modify: `api/src/db/schema.ts`
- Modify: `api/drizzle.config.ts`
- Modify: `api/src/env.ts`

- [ ] **Step 1: Install Neon driver, remove better-sqlite3**

```bash
cd api && npm uninstall better-sqlite3 @types/better-sqlite3 && npm install @neondatabase/serverless ws @types/ws
```

- [ ] **Step 2: Update `api/src/db/schema.ts` — replace SQLite imports and add new tables**

Replace the entire file:

```typescript
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  provider: text('provider').notNull(),
  providerId: text('provider_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  status: text('status').notNull().default('intake'),
  trackId: text('track_id'),
  userId: text('user_id').references(() => users.id),
  profile: text('profile').notNull().default('{}'),
  messages: text('messages').notNull().default('[]'),
  recommendations: text('recommendations'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const savedCareers = pgTable('saved_careers', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  careerTitle: text('career_title').notNull(),
  fitScore: integer('fit_score'),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
});
```

- [ ] **Step 3: Update `api/drizzle.config.ts`**

Replace the entire file:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
});
```

- [ ] **Step 4: Update `api/src/db/client.ts` — replace BetterSQLite3 with Neon**

Replace the entire file:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
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
    await real.execute('SELECT 1');
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
```

- [ ] **Step 5: Update `api/src/env.ts` — add new env vars, remove SQLite comment**

Replace the content of `api/src/env.ts`:

```typescript
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
  JWT_SECRET: z.string().min(32).optional(),

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
```

- [ ] **Step 6: Create `api/.env` with Neon DATABASE_URL**

Copy `api/.env.example` to `api/.env` and set:
```
DATABASE_URL=<your-neon-connection-string>
```

Get your Neon connection string from https://console.neon.tech — create a project, copy the connection string from the dashboard.

- [ ] **Step 7: Run Drizzle migrations to create tables**

```bash
cd api && npx drizzle-kit push
```

Expected output: tables `users`, `sessions`, `saved_careers` created in Neon.

- [ ] **Step 8: Fix `dbHealthCheck` callers — it is now async**

Search for `dbHealthCheck` usage:
```powershell
Select-String -Path "api\src\**\*.ts" -Pattern "dbHealthCheck" -Recurse
```

In any file that calls `dbHealthCheck()`, add `await`:
```typescript
// BEFORE
const healthy = dbHealthCheck();

// AFTER
const healthy = await dbHealthCheck();
```

- [ ] **Step 9: Build the API to catch type errors**

```bash
npm run build --workspace api
```

Expected: build succeeds with no errors. Fix any type errors before proceeding.

- [ ] **Step 10: Commit**

```bash
git add api/src/db/schema.ts api/src/db/client.ts api/drizzle.config.ts api/src/env.ts api/package.json api/package-lock.json
git commit -m "feat: swap SQLite for Neon PostgreSQL, add users and savedCareers tables"
```

---

### Task 4: Replace uAgents with DeepSeek agent service

**Files:**
- Replace: `agent_service.py`
- Modify: `requirements.txt`
- Modify: `AGENTS.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `QUICKSTART.md`

- [ ] **Step 1: Update `requirements.txt`**

Replace the entire file:

```
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
openai>=1.30.0
python-dotenv>=1.0.0
pydantic>=2.0.0
```

- [ ] **Step 2: Replace `agent_service.py` with DeepSeek implementation**

Replace the entire file:

```python
"""
Career analysis agent service using DeepSeek API.
Receives a CareerProfile, generates CareerRecommendation[] via DeepSeek chat.
"""

import os
import json
import asyncio
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    root = Path(__file__).resolve().parent
    for env_file in (root / ".env", root / "api" / ".env"):
        if env_file.exists():
            load_dotenv(dotenv_path=env_file, override=False)
except ImportError:
    pass

from openai import AsyncOpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PathFinder Career Analysis Service")

# Keyed by sessionId — holds analysis state
_sessions: dict[str, dict] = {}

client = AsyncOpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
    base_url="https://api.deepseek.com",
)

SYSTEM_PROMPT = """You are a career guidance expert. Given a user's CareerProfile JSON, generate exactly 5 career recommendations.

Respond ONLY with a valid JSON array. No markdown, no explanation, no extra text. The array must contain exactly 5 objects with this shape:
{
  "title": string,
  "summary": string,
  "fitScore": number (0-100),
  "reasons": string[] (3-5 items),
  "concerns": string[] (1-3 items),
  "nextSteps": string[] (3-5 items),
  "salaryRange": { "low": number, "high": number, "currency": "USD" }
}

Base fitScore on how well the profile's skills, interests, values, and constraints match the role. Higher scores for closer alignment. Vary scores realistically (50-95 range).
"""


class AnalysisRequest(BaseModel):
    sessionId: str
    profile: dict
    trackId: Optional[str] = None


class StatusResponse(BaseModel):
    status: str
    progress: int
    stage: str
    recommendations: Optional[list] = None
    error: Optional[str] = None


async def _run_analysis(session_id: str, profile: dict, track_id: Optional[str]) -> None:
    _sessions[session_id] = {"status": "in_progress", "progress": 10, "stage": "analyzing"}

    try:
        _sessions[session_id]["progress"] = 30
        _sessions[session_id]["stage"] = "generating recommendations"

        profile_text = json.dumps(profile, indent=2)
        track_hint = f"\n\nThe user is exploring the '{track_id}' career track — weight recommendations accordingly." if track_id else ""

        response = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"CareerProfile:\n{profile_text}{track_hint}"},
            ],
            temperature=0.7,
            max_tokens=2048,
        )

        raw = response.choices[0].message.content or "[]"
        recommendations = json.loads(raw)

        if not isinstance(recommendations, list):
            raise ValueError("DeepSeek response was not a JSON array")

        _sessions[session_id] = {
            "status": "completed",
            "progress": 100,
            "stage": "complete",
            "recommendations": recommendations,
        }
        logger.info("Analysis complete for session %s (%d recs)", session_id, len(recommendations))

    except Exception as exc:
        logger.exception("Analysis failed for session %s: %s", session_id, exc)
        _sessions[session_id] = {
            "status": "error",
            "progress": 0,
            "stage": "error",
            "error": str(exc),
        }


@app.post("/analyze")
async def start_analysis(request: AnalysisRequest) -> dict:
    if not client.api_key:
        raise HTTPException(status_code=500, detail="DEEPSEEK_API_KEY not set")
    asyncio.create_task(_run_analysis(request.sessionId, request.profile, request.trackId))
    return {"ok": True, "sessionId": request.sessionId}


@app.get("/status/{session_id}", response_model=StatusResponse)
async def get_status(session_id: str) -> StatusResponse:
    state = _sessions.get(session_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return StatusResponse(**state)


@app.get("/health")
async def health() -> dict:
    return {"status": "healthy", "provider": "deepseek", "timestamp": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AGENT_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
```

- [ ] **Step 3: Update `AGENTS.md` — replace uAgents content**

Replace the entire `AGENTS.md` file:

```markdown
# Agent Service

PathFinder AI uses a Python FastAPI service to generate career recommendations via the DeepSeek API.

## Architecture

```
Fastify API → POST /analyze → agent_service.py → DeepSeek API
           ← GET /status/:id ← polls until complete
```

The agent service is **optional** — the Fastify backend has a 20-second timeout and personalized fallback that activates automatically if the agent is unavailable.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variable:
   ```bash
   export DEEPSEEK_API_KEY=<your-key>
   ```

3. Run:
   ```bash
   python agent_service.py
   ```

The service starts on port 8000 by default. Set `AGENT_PORT` to override.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/analyze` | Start analysis for a session |
| GET | `/status/:sessionId` | Poll analysis progress |
| GET | `/health` | Health check |

## Model

Uses `deepseek-chat` via the DeepSeek API (OpenAI-compatible endpoint at `https://api.deepseek.com`).
```

- [ ] **Step 4: Test the new agent service locally**

```bash
pip install -r requirements.txt
DEEPSEEK_API_KEY=<your-key> python agent_service.py
```

In a second terminal:
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","profile":{"interests":["software","AI"],"hardSkills":["python","typescript"]}}'
```

Expected: `{"ok": true, "sessionId": "test-123"}`

Then poll:
```bash
curl http://localhost:8000/status/test-123
```

Expected after ~5s: `{"status": "completed", "progress": 100, "recommendations": [...]}`

- [ ] **Step 5: Commit**

```bash
git add agent_service.py requirements.txt AGENTS.md
git commit -m "feat: replace uAgents with DeepSeek API agent service"
```

---

## Stream 3 — Auth, Dashboard, Comparison

> Requires Stream 2 (Task 3) to be merged first — needs `users` and `savedCareers` tables in the database.

### Task 5: Install auth dependencies

**Files:**
- Modify: `api/package.json`

- [ ] **Step 1: Install auth packages**

```bash
cd api && npm install jose axios
```

- `jose` — JWT sign/verify (no native crypto deps, works in Vercel edge)
- `axios` — HTTP client for OAuth token exchange

- [ ] **Step 2: Commit**

```bash
git add api/package.json api/package-lock.json
git commit -m "chore: add jose and axios for OAuth auth"
```

---

### Task 6: Build the auth plugin (cookie + JWT helpers)

**Files:**
- Create: `api/src/plugins/auth-plugin.ts`

- [ ] **Step 1: Create `api/src/plugins/auth-plugin.ts`**

```typescript
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { SignJWT, jwtVerify } from 'jose';
import { loadEnv } from '../env.js';

export interface AuthUser {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

const COOKIE_NAME = 'pf_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const env = loadEnv();
  const secret = env.JWT_SECRET ?? 'dev-secret-change-in-production-min-32-chars';
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthCookie(reply: FastifyReply, token: string): void {
  reply.header(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  );
}

export function clearAuthCookie(reply: FastifyReply): void {
  reply.header(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
}

export function getAuthCookie(request: FastifyRequest): string | null {
  const header = request.headers.cookie ?? '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<AuthUser | null> {
  const token = getAuthCookie(request);
  if (!token) {
    reply.status(401).send({ error: 'Unauthorized' });
    return null;
  }
  const user = await verifyToken(token);
  if (!user) {
    reply.status(401).send({ error: 'Unauthorized' });
    return null;
  }
  return user;
}

async function authPlugin(app: FastifyInstance) {
  app.decorateRequest('authUser', null);
}

export default fp(authPlugin);
```

- [ ] **Step 2: Register the plugin in `api/src/app.ts`**

Add import and registration:
```typescript
// Add import at top
import authPlugin from './plugins/auth-plugin.js';

// Add registration after existing plugins (before route registrations)
app.register(authPlugin);
```

- [ ] **Step 3: Build to verify no type errors**

```bash
npm run build --workspace api
```

Expected: compiles without errors.

- [ ] **Step 4: Commit**

```bash
git add api/src/plugins/auth-plugin.ts api/src/app.ts
git commit -m "feat: add JWT auth plugin with cookie helpers"
```

---

### Task 7: Build OAuth routes (Google + GitHub)

**Files:**
- Create: `api/src/routes/auth.ts`
- Modify: `api/src/app.ts`

- [ ] **Step 1: Create `api/src/routes/auth.ts`**

```typescript
import type { FastifyInstance } from 'fastify';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { loadEnv } from '../env.js';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  getAuthCookie,
  verifyToken,
} from '../plugins/auth-plugin.js';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface GitHubTokenResponse {
  access_token: string;
}

interface GitHubUserInfo {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

interface GitHubEmailEntry {
  email: string;
  primary: boolean;
  verified: boolean;
}

async function upsertUser(params: {
  provider: string;
  providerId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.providerId, params.providerId),
  });

  if (existing) {
    return existing;
  }

  const id = randomUUID();
  const now = new Date();
  await db.insert(users).values({
    id,
    email: params.email,
    name: params.name,
    avatarUrl: params.avatarUrl,
    provider: params.provider,
    providerId: params.providerId,
    createdAt: now,
    updatedAt: now,
  });

  return db.query.users.findFirst({ where: eq(users.id, id) }) as Promise<typeof users.$inferSelect>;
}

export async function authRoutes(app: FastifyInstance) {
  const env = loadEnv();

  // ── Google OAuth ──────────────────────────────────────────────────

  app.get('/auth/google', async (_req, reply) => {
    if (!env.GOOGLE_CLIENT_ID) {
      return reply.status(501).send({ error: 'Google OAuth not configured' });
    }
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: `${env.APP_URL.replace('5173', '3001')}/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
    });
    reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  });

  app.get('/auth/google/callback', async (req, reply) => {
    const { code } = req.query as { code?: string };
    if (!code) return reply.redirect(`${env.APP_URL}/login?error=no_code`);

    try {
      const tokenRes = await axios.post<GoogleTokenResponse>(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: env.GOOGLE_CLIENT_ID!,
          client_secret: env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${env.APP_URL.replace('5173', '3001')}/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const userRes = await axios.get<GoogleUserInfo>(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } },
      );

      const user = await upsertUser({
        provider: 'google',
        providerId: userRes.data.id,
        email: userRes.data.email,
        name: userRes.data.name,
        avatarUrl: userRes.data.picture,
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
        name: user.name ?? null,
        avatarUrl: user.avatarUrl ?? null,
      });

      setAuthCookie(reply, token);
      reply.redirect(`${env.APP_URL}/dashboard`);
    } catch (err) {
      app.log.error(err, 'Google OAuth callback error');
      reply.redirect(`${env.APP_URL}/login?error=oauth_failed`);
    }
  });

  // ── GitHub OAuth ──────────────────────────────────────────────────

  app.get('/auth/github', async (_req, reply) => {
    if (!env.GITHUB_CLIENT_ID) {
      return reply.status(501).send({ error: 'GitHub OAuth not configured' });
    }
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: `${env.APP_URL.replace('5173', '3001')}/auth/github/callback`,
      scope: 'read:user user:email',
    });
    reply.redirect(`https://github.com/login/oauth/authorize?${params}`);
  });

  app.get('/auth/github/callback', async (req, reply) => {
    const { code } = req.query as { code?: string };
    if (!code) return reply.redirect(`${env.APP_URL}/login?error=no_code`);

    try {
      const tokenRes = await axios.post<GitHubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        { client_id: env.GITHUB_CLIENT_ID!, client_secret: env.GITHUB_CLIENT_SECRET!, code },
        { headers: { Accept: 'application/json' } },
      );

      const headers = { Authorization: `Bearer ${tokenRes.data.access_token}` };
      const [userRes, emailsRes] = await Promise.all([
        axios.get<GitHubUserInfo>('https://api.github.com/user', { headers }),
        axios.get<GitHubEmailEntry[]>('https://api.github.com/user/emails', { headers }),
      ]);

      const primaryEmail =
        emailsRes.data.find((e) => e.primary && e.verified)?.email ??
        userRes.data.email ??
        `${userRes.data.login}@users.noreply.github.com`;

      const user = await upsertUser({
        provider: 'github',
        providerId: String(userRes.data.id),
        email: primaryEmail,
        name: userRes.data.name ?? userRes.data.login,
        avatarUrl: userRes.data.avatar_url,
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
        name: user.name ?? null,
        avatarUrl: user.avatarUrl ?? null,
      });

      setAuthCookie(reply, token);
      reply.redirect(`${env.APP_URL}/dashboard`);
    } catch (err) {
      app.log.error(err, 'GitHub OAuth callback error');
      reply.redirect(`${env.APP_URL}/login?error=oauth_failed`);
    }
  });

  // ── Session ───────────────────────────────────────────────────────

  app.get('/auth/me', async (req, reply) => {
    const token = getAuthCookie(req);
    if (!token) return reply.status(401).send({ error: 'Unauthorized' });
    const user = await verifyToken(token);
    if (!user) return reply.status(401).send({ error: 'Unauthorized' });
    return reply.send(user);
  });

  app.post('/auth/logout', async (_req, reply) => {
    clearAuthCookie(reply);
    return reply.send({ ok: true });
  });
}
```

- [ ] **Step 2: Register auth routes in `api/src/app.ts`**

Add import and registration:
```typescript
// Add import at top
import { authRoutes } from './routes/auth.js';

// Add inside buildApp(), after existing route registrations
app.register(authRoutes);
```

- [ ] **Step 3: Build to verify**

```bash
npm run build --workspace api
```

Expected: compiles without errors.

- [ ] **Step 4: Commit**

```bash
git add api/src/routes/auth.ts api/src/app.ts
git commit -m "feat: add Google and GitHub OAuth routes with JWT cookie auth"
```

---

### Task 8: Build saved-careers API routes

**Files:**
- Create: `api/src/routes/saved-careers.ts`
- Modify: `api/src/app.ts`

- [ ] **Step 1: Create `api/src/routes/saved-careers.ts`**

```typescript
import type { FastifyInstance } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from '../db/client.js';
import { savedCareers } from '../db/schema.js';
import { requireAuth } from '../plugins/auth-plugin.js';

export async function savedCareersRoutes(app: FastifyInstance) {
  app.get('/saved-careers', async (req, reply) => {
    const user = await requireAuth(req, reply);
    if (!user) return;

    const rows = await db.query.savedCareers.findMany({
      where: eq(savedCareers.userId, user.userId),
      orderBy: (t, { desc }) => [desc(t.savedAt)],
    });

    return reply.send({ savedCareers: rows });
  });

  app.post('/saved-careers', async (req, reply) => {
    const user = await requireAuth(req, reply);
    if (!user) return;

    const { sessionId, careerTitle, fitScore } = req.body as {
      sessionId: string;
      careerTitle: string;
      fitScore?: number;
    };

    if (!sessionId || !careerTitle) {
      return reply.status(400).send({ error: 'sessionId and careerTitle are required' });
    }

    const id = randomUUID();
    await db.insert(savedCareers).values({
      id,
      userId: user.userId,
      sessionId,
      careerTitle,
      fitScore: fitScore ?? null,
      savedAt: new Date(),
    });

    const row = await db.query.savedCareers.findFirst({
      where: eq(savedCareers.id, id),
    });

    return reply.status(201).send(row);
  });

  app.delete('/saved-careers/:id', async (req, reply) => {
    const user = await requireAuth(req, reply);
    if (!user) return;

    const { id } = req.params as { id: string };
    await db
      .delete(savedCareers)
      .where(and(eq(savedCareers.id, id), eq(savedCareers.userId, user.userId)));

    return reply.send({ ok: true });
  });
}
```

- [ ] **Step 2: Register in `api/src/app.ts`**

```typescript
// Add import at top
import { savedCareersRoutes } from './routes/saved-careers.js';

// Add inside buildApp(), after authRoutes registration
app.register(savedCareersRoutes);
```

- [ ] **Step 3: Update sessions route to accept `?userId=me` query and attach userId on creation**

In `api/src/routes/sessions.ts`:

Find the `GET /sessions` route handler (or add one if missing). The sessions list endpoint needs to filter by the authenticated user. Add a query param handler:

```typescript
// In the GET /sessions/:id handler, keep as-is.
// Add a new GET /sessions route that supports ?userId=me:
app.get('/sessions', async (req, reply) => {
  const { userId: userIdParam } = req.query as { userId?: string };

  if (userIdParam === 'me') {
    const user = await requireAuth(req, reply);
    if (!user) return;

    const rows = await db.query.sessions.findMany({
      where: eq(sessions.userId, user.userId),
      orderBy: (t, { desc }) => [desc(t.updatedAt)],
    });

    return reply.send({
      sessions: rows.map((s) => ({
        id: s.id,
        status: s.status,
        trackId: s.trackId,
        userId: s.userId,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: JSON.parse(s.messages || '[]').length,
        profile: s.profile,
      })),
    });
  }

  return reply.status(400).send({ error: 'userId=me is required' });
});
```

Also in the `POST /sessions` handler, attach userId from cookie if present:
```typescript
// At the top of POST /sessions handler, before inserting:
const token = getAuthCookie(req);
const authUser = token ? await verifyToken(token) : null;

// Then when inserting the new session, include userId:
await db.insert(sessions).values({
  // ...existing fields...
  userId: authUser?.userId ?? null,
});
```

Add the required imports to `sessions.ts`:
```typescript
import { getAuthCookie, verifyToken, requireAuth } from '../plugins/auth-plugin.js';
import { eq } from 'drizzle-orm';
```

- [ ] **Step 4: Build**

```bash
npm run build --workspace api
```

- [ ] **Step 5: Commit**

```bash
git add api/src/routes/saved-careers.ts api/src/routes/sessions.ts api/src/app.ts
git commit -m "feat: add saved-careers routes and userId on session creation"
```

---

### Task 9: Build the frontend auth layer

**Files:**
- Create: `frontend/src/hooks/useAuth.ts`
- Create: `frontend/src/routes/login.tsx`
- Modify: `frontend/src/main.tsx` (add /login route + protected route wrapper)

- [ ] **Step 1: Create `frontend/src/hooks/useAuth.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AuthUser {
  userId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE_URL}/auth/me`, { credentials: 'include' });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = useMutation({
    mutationFn: async () => {
      await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    },
    onSuccess: () => {
      qc.setQueryData(['auth', 'me'], null);
      window.location.href = '/login';
    },
  });

  return { user: user ?? null, isLoading, logout: logout.mutate };
}
```

- [ ] **Step 2: Create `frontend/src/routes/login.tsx`**

```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function Login() {
  const { user, isLoading } = useAuth();
  const nav = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isLoading && user) nav('/dashboard', { replace: true });
  }, [user, isLoading, nav]);

  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.3, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--pf-surface-card-bg)',
          border: '1px solid var(--pf-surface-card-border)',
          borderRadius: 'var(--pf-radius-md)',
          padding: '40px 36px',
        }}
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'var(--pf-font-family-display)',
              marginBottom: 8,
            }}
          >
            PathFinder AI
          </h1>
          <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.9rem' }}>
            Sign in to save your career insights
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '10px 14px',
              background: 'color-mix(in srgb, var(--pf-color-danger-500) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--pf-color-danger-500) 30%, transparent)',
              borderRadius: 'var(--pf-radius-sm)',
              fontSize: '0.85rem',
              color: 'var(--pf-color-danger-500)',
            }}
          >
            Sign in failed. Please try again.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={`${BASE_URL}/auth/google`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '11px 20px',
              background: 'var(--pf-btn-secondary-bg)',
              border: '1px solid var(--pf-btn-secondary-border)',
              borderRadius: 'var(--pf-radius-sm)',
              color: 'var(--pf-btn-secondary-text)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <a
            href={`${BASE_URL}/auth/github`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '11px 20px',
              background: 'var(--pf-btn-secondary-bg)',
              border: '1px solid var(--pf-btn-secondary-border)',
              borderRadius: 'var(--pf-radius-sm)',
              color: 'var(--pf-btn-secondary-text)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </a>
        </div>

        <p
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--pf-color-text-muted)',
          }}
        >
          You can also use PathFinder without signing in.{' '}
          <a href="/" style={{ color: 'var(--pf-color-brand-500)' }}>
            Start assessment
          </a>
        </p>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Add `/login` route to the router**

Find the router configuration in `frontend/src/main.tsx` (or wherever routes are defined). Add the login route:

```tsx
import Login from './routes/login.tsx';

// Add to route list:
{ path: '/login', element: <Login /> }
```

- [ ] **Step 4: Add route guard component**

Add this component above the route definitions in `main.tsx`:

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.ts';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

Wrap the `/dashboard` and `/compare` routes with `<RequireAuth>`:
```tsx
{ path: '/dashboard', element: <RequireAuth><Dashboard /></RequireAuth> }
{ path: '/compare', element: <RequireAuth><Compare /></RequireAuth> }
```

- [ ] **Step 5: Install `@tanstack/react-query` devtools if not already present, then verify build**

```bash
npm run build --workspace frontend
```

Expected: builds with no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/hooks/useAuth.ts frontend/src/routes/login.tsx frontend/src/main.tsx
git commit -m "feat: add login page, useAuth hook, and protected route guard"
```

---

### Task 10: Build the user profile dashboard

**Files:**
- Modify: `frontend/src/routes/dashboard.tsx`

- [ ] **Step 1: Replace `frontend/src/routes/dashboard.tsx` with the full authenticated dashboard**

Replace the entire file:

```tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BookmarkX, GitCompareArrows, PencilLine } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createSession, getTracks } from '@/lib/api';
import type { SponsorTrack } from '@/schemas/career';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface SessionSummary {
  id: string;
  status: string;
  trackId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  profile?: string;
}

interface SavedCareer {
  id: string;
  sessionId: string;
  careerTitle: string;
  fitScore: number | null;
  savedAt: string;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const wrap: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '32px 20px', width: '100%' };
const card: React.CSSProperties = {
  background: 'var(--pf-surface-card-bg)',
  border: '1px solid var(--pf-surface-card-border)',
  borderRadius: 'var(--pf-radius-md)',
  padding: '24px',
  marginBottom: 20,
};
const sectionTitle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: 16,
  fontFamily: 'var(--pf-font-family-display)',
};
const chip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  background: 'var(--pf-chip-bg)',
  border: '1px solid var(--pf-chip-border)',
  borderRadius: 'var(--pf-radius-pill)',
  fontSize: '0.78rem',
  color: 'var(--pf-chip-text)',
  margin: '3px',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'sessions' | 'saved' | 'profile' | 'stats'>('sessions');

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'me'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/sessions?userId=me`, { credentials: 'include' });
      if (!res.ok) return { sessions: [] };
      return res.json() as Promise<{ sessions: SessionSummary[] }>;
    },
  });

  const { data: savedData, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-careers'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/saved-careers`, { credentials: 'include' });
      if (!res.ok) return { savedCareers: [] };
      return res.json() as Promise<{ savedCareers: SavedCareer[] }>;
    },
  });

  const { data: tracksData } = useQuery({
    queryKey: ['tracks'],
    queryFn: getTracks,
  });

  const tracksMap = new Map<string, SponsorTrack>((tracksData ?? []).map((t) => [t.id, t]));
  const sessions: SessionSummary[] = sessionsData?.sessions ?? [];
  const saved: SavedCareer[] = savedData?.savedCareers ?? [];
  const completed = sessions.filter((s) => s.status === 'complete');

  const avgFitScore = (() => {
    // Use fit score from saved careers as a proxy
    const scores = saved.map((s) => s.fitScore).filter((n): n is number => n !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const tracksExplored = [...new Set(sessions.map((s) => s.trackId).filter(Boolean))] as string[];

  const unsave = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${BASE_URL}/saved-careers/${id}`, { method: 'DELETE', credentials: 'include' });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-careers'] }),
  });

  async function handleNew() {
    const session = await createSession();
    nav(`/onboarding?session=${session.id}&track=general`);
  }

  const tabs = [
    { key: 'sessions' as const, label: `Sessions (${sessions.length})` },
    { key: 'saved' as const, label: `Saved Careers (${saved.length})` },
    { key: 'profile' as const, label: 'Profile Snapshot' },
    { key: 'stats' as const, label: 'Stats' },
  ];

  return (
    <motion.div
      style={wrap}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.28, ease: 'easeOut' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
          {user && (
            <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              {user.name ?? user.email}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleNew}
            style={{
              padding: '9px 18px',
              background: 'var(--pf-btn-primary-bg)',
              color: 'var(--pf-btn-primary-text)',
              border: 'none',
              borderRadius: 'var(--pf-radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            + New Assessment
          </button>
          <button
            onClick={() => logout()}
            style={{
              padding: '9px 18px',
              background: 'none',
              color: 'var(--pf-color-text-muted)',
              border: '1px solid var(--pf-surface-card-border)',
              borderRadius: 'var(--pf-radius-sm)',
              fontWeight: 500,
              fontSize: '0.88rem',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--pf-surface-card-border)', paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--pf-color-brand-500)' : '2px solid transparent',
              color: activeTab === t.key ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)',
              fontWeight: activeTab === t.key ? 600 : 400,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sessions tab */}
      {activeTab === 'sessions' && (
        <div>
          {sessionsLoading && <p style={{ color: 'var(--pf-color-text-muted)' }}>Loading…</p>}
          {!sessionsLoading && sessions.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ color: 'var(--pf-color-text-muted)', marginBottom: 16 }}>No sessions yet.</p>
              <button onClick={handleNew} style={{ padding: '9px 22px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600 }}>
                Start first assessment
              </button>
            </div>
          )}
          {sessions.map((s) => {
            const track = s.trackId ? tracksMap.get(s.trackId) : null;
            return (
              <motion.div
                key={s.id}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                onClick={() => nav(s.status === 'complete' ? `/results/${s.id}` : `/onboarding?session=${s.id}`)}
                style={{ ...card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--pf-font-family-mono)' }}>
                      {s.id.slice(0, 8)}
                    </span>
                    <span style={{ ...chip, color: s.status === 'complete' ? 'var(--pf-color-success-500)' : 'var(--pf-color-text-muted)', borderColor: s.status === 'complete' ? 'var(--pf-color-success-500)' : 'var(--pf-surface-card-border)' }}>
                      {s.status}
                    </span>
                    {track && (
                      <span style={{ ...chip, color: track.color ?? 'var(--pf-color-brand-500)', borderColor: track.color ?? 'var(--pf-color-brand-500)' }}>
                        {track.name}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--pf-color-text-muted)' }}>
                    {s.messageCount} message{s.messageCount !== 1 ? 's' : ''} · {relativeTime(s.updatedAt)}
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--pf-color-brand-500)', flexShrink: 0 }} />
              </motion.div>
            );
          })}
          {completed.length >= 2 && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link
                to="/compare"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid var(--pf-color-brand-500)', borderRadius: 'var(--pf-radius-sm)', color: 'var(--pf-color-brand-400)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}
              >
                <GitCompareArrows size={15} />
                Compare sessions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Saved Careers tab */}
      {activeTab === 'saved' && (
        <div>
          {savedLoading && <p style={{ color: 'var(--pf-color-text-muted)' }}>Loading…</p>}
          {!savedLoading && saved.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ color: 'var(--pf-color-text-muted)' }}>No saved careers yet. Bookmark careers from your results pages.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {saved.map((sc) => (
              <div key={sc.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem', flex: 1 }}>{sc.careerTitle}</p>
                  <button
                    onClick={() => unsave.mutate(sc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-color-text-muted)', padding: 4 }}
                    aria-label="Remove saved career"
                  >
                    <BookmarkX size={15} />
                  </button>
                </div>
                {sc.fitScore !== null && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>
                      Fit score: {sc.fitScore}%
                    </div>
                    <div style={{ height: 4, background: 'var(--pf-color-bg-subtle)', borderRadius: 2 }}>
                      <div style={{ width: `${sc.fitScore}%`, height: '100%', background: 'var(--pf-color-brand-500)', borderRadius: 2 }} />
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <Link
                    to={`/results/${sc.sessionId}`}
                    style={{ fontSize: '0.75rem', color: 'var(--pf-color-brand-500)', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View results <ArrowUpRight size={12} />
                  </Link>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)' }}>
                    {relativeTime(sc.savedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Snapshot tab */}
      {activeTab === 'profile' && (
        <div style={card}>
          <p style={sectionTitle}>Career Profile Snapshot</p>
          {sessions.length === 0 ? (
            <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.88rem' }}>
              Complete at least one assessment to see your profile snapshot.
            </p>
          ) : (
            (() => {
              // Merge profiles: take latest non-null value per field
              const merged: Record<string, unknown> = {};
              for (const s of [...sessions].reverse()) {
                try {
                  const p = JSON.parse((s as unknown as { profile?: string }).profile ?? '{}');
                  for (const [k, v] of Object.entries(p)) {
                    if (v !== null && v !== undefined && !(Array.isArray(v) && (v as unknown[]).length === 0)) {
                      merged[k] = v;
                    }
                  }
                } catch { /* skip malformed */ }
              }

              const renderField = (label: string, value: unknown) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                const items = Array.isArray(value) ? value : [String(value)];
                return (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--pf-color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {label}
                    </p>
                    <div>
                      {items.map((item) => (
                        <span key={String(item)} style={chip}>{String(item)}</span>
                      ))}
                    </div>
                  </div>
                );
              };

              return (
                <div>
                  {renderField('Interests', merged.interests)}
                  {renderField('Values', merged.values)}
                  {renderField('Hard Skills', merged.hardSkills)}
                  {renderField('Soft Skills', merged.softSkills)}
                  {renderField('Working Style', merged.workingStyle)}
                  {renderField('Risk Tolerance', merged.riskTolerance)}
                  {renderField('Geographic Flexibility', merged.geographicFlexibility)}
                  {renderField('Timeline', merged.timelineUrgency)}
                  {Object.keys(merged).length === 0 && (
                    <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.88rem' }}>No profile data collected yet.</p>
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Assessments completed', value: completed.length },
            { label: 'Total sessions', value: sessions.length },
            { label: 'Careers saved', value: saved.length },
            { label: 'Avg fit score', value: avgFitScore !== null ? `${avgFitScore}%` : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ ...card, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--pf-color-brand-400)', fontFamily: 'var(--pf-font-family-display)' }}>
                {value}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--pf-color-text-muted)', marginTop: 4 }}>
                {label}
              </p>
            </div>
          ))}

          {tracksExplored.length > 0 && (
            <div style={{ ...card, gridColumn: '1 / -1' }}>
              <p style={{ ...sectionTitle, marginBottom: 10 }}>Tracks explored</p>
              <div>
                {tracksExplored.map((tid) => {
                  const t = tracksMap.get(tid);
                  return (
                    <span key={tid} style={{ ...chip, color: t?.color ?? 'var(--pf-color-brand-500)', borderColor: t?.color ?? 'var(--pf-surface-card-border)' }}>
                      {t?.name ?? tid}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add save button to results page**

In `frontend/src/routes/results.tsx` (or wherever recommendations are rendered), add a save button on each recommendation card. Find the recommendations render loop and add after the title element:

```tsx
import { useAuth } from '@/hooks/useAuth';

// Inside the Results component (add near top with other hooks):
const { user } = useAuth();
const qc = useQueryClient();
const { sessionId } = useParams<{ sessionId: string }>();  // already present in Results component

const saveCareer = async (title: string, fitScore: number) => {
  if (!user || !sessionId) return;
  await fetch(`${BASE_URL}/saved-careers`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, careerTitle: title, fitScore }),
  });
  qc.invalidateQueries({ queryKey: ['saved-careers'] });
};

// In each recommendation card, add:
{user && (
  <button
    onClick={() => saveCareer(rec.title, rec.fitScore)}
    style={{
      background: 'none',
      border: '1px solid var(--pf-surface-card-border)',
      borderRadius: 'var(--pf-radius-pill)',
      padding: '3px 10px',
      fontSize: '0.75rem',
      color: 'var(--pf-color-text-muted)',
      cursor: 'pointer',
    }}
  >
    Save
  </button>
)}
```

- [ ] **Step 3: Build**

```bash
npm run build --workspace frontend
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/routes/dashboard.tsx frontend/src/routes/results.tsx
git commit -m "feat: full authenticated dashboard with sessions, saved careers, profile snapshot, and stats"
```

---

### Task 11: Build the comparison page

**Files:**
- Modify: `frontend/src/routes/compare.tsx`

- [ ] **Step 1: Replace `frontend/src/routes/compare.tsx` with the full comparison page**

Replace the entire file:

```tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { LayoutGrid, Columns, X, Plus } from 'lucide-react';
import { getTracks } from '@/lib/api';
import type { SponsorTrack, CareerRecommendation } from '@/schemas/career';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type ItemType = 'track' | 'career';

interface CompareItem {
  key: string;
  type: ItemType;
  label: string;
  data: SponsorTrack | CareerRecommendation;
  sessionId?: string;
}

type Layout = 'horizontal' | 'grid';

const MAX_ITEMS = 6;

function encodeItems(items: CompareItem[]): string {
  return items
    .map((i) => (i.type === 'track' ? `t:${i.key}` : `c:${i.label}@${i.sessionId}`))
    .join(',');
}

function FitBar({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--pf-color-success-500)' : score >= 60 ? 'var(--pf-color-brand-500)' : 'var(--pf-color-warning-500)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>
        <span>Fit score</span><span style={{ color, fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--pf-color-bg-subtle)', borderRadius: 3 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function TrackCard({ track }: { track: SponsorTrack }) {
  return (
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Sponsor</p>
      <p style={{ fontSize: '0.88rem', marginBottom: 12 }}>{track.sponsor}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Description</p>
      <p style={{ fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 12 }}>{track.description}</p>
      {track.tags && track.tags.length > 0 && (
        <>
          <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {track.tags.map((tag) => (
              <span key={tag} style={{ padding: '2px 8px', background: 'var(--pf-chip-bg)', border: '1px solid var(--pf-chip-border)', borderRadius: 'var(--pf-radius-pill)', fontSize: '0.72rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CareerCard({ rec }: { rec: CareerRecommendation }) {
  return (
    <div>
      <FitBar score={rec.fitScore} />
      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Summary</p>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 12 }}>{rec.summary}</p>
      </div>
      {rec.salaryRange && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Salary range</p>
          <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            ${rec.salaryRange.low.toLocaleString()} – ${rec.salaryRange.high.toLocaleString()}
          </p>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Why it fits</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.reasons.map((r, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{r}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Concerns</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.concerns.map((c, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Next steps</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.nextSteps.map((ns, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{ns}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CompareItem[]>([]);
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const reduceMotion = useReducedMotion();

  const { data: tracks = [] } = useQuery({ queryKey: ['tracks'], queryFn: getTracks });

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions', 'me'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/sessions?userId=me`, { credentials: 'include' });
      if (!res.ok) return { sessions: [] };
      return res.json();
    },
  });

  const completedSessions: { id: string; trackId: string | null }[] =
    (sessionsData?.sessions ?? []).filter((s: { status: string }) => s.status === 'complete');

  const recsQueries = useQuery({
    queryKey: ['compare-recs', completedSessions.map((s) => s.id)],
    queryFn: async () => {
      const results: Record<string, CareerRecommendation[]> = {};
      await Promise.all(
        completedSessions.map(async (s) => {
          const res = await fetch(`${BASE_URL}/sessions/${s.id}/recommendations`);
          if (res.ok) {
            const data = await res.json();
            results[s.id] = data.recommendations ?? [];
          }
        }),
      );
      return results;
    },
    enabled: completedSessions.length > 0,
  });

  const allRecs = recsQueries.data ?? {};

  // Restore items from URL on load
  useEffect(() => {
    const param = searchParams.get('items');
    if (!param || tracks.length === 0) return;
    const restored: CompareItem[] = [];
    for (const part of param.split(',')) {
      if (part.startsWith('t:')) {
        const id = part.slice(2);
        const track = tracks.find((t) => t.id === id);
        if (track) restored.push({ key: `t:${id}`, type: 'track', label: track.name, data: track });
      } else if (part.startsWith('c:')) {
        const [label, sessionId] = part.slice(2).split('@');
        const recs = allRecs[sessionId] ?? [];
        const rec = recs.find((r) => r.title === label);
        if (rec) restored.push({ key: `c:${label}@${sessionId}`, type: 'career', label, data: rec, sessionId });
      }
    }
    if (restored.length > 0) setItems(restored);
  }, [tracks, allRecs]);

  function addItem(item: CompareItem) {
    if (items.length >= MAX_ITEMS) return;
    if (items.find((i) => i.key === item.key)) return;
    const next = [...items, item];
    setItems(next);
    setSearchParams({ items: encodeItems(next) }, { replace: true });
    setPickerOpen(false);
    setPickerQuery('');
  }

  function removeItem(key: string) {
    const next = items.filter((i) => i.key !== key);
    setItems(next);
    setSearchParams(next.length ? { items: encodeItems(next) } : {}, { replace: true });
  }

  const pickerOptions: CompareItem[] = [
    ...tracks
      .filter((t) => !items.find((i) => i.key === `t:${t.id}`))
      .filter((t) => !pickerQuery || t.name.toLowerCase().includes(pickerQuery.toLowerCase()))
      .map((t): CompareItem => ({ key: `t:${t.id}`, type: 'track', label: t.name, data: t })),
    ...Object.entries(allRecs).flatMap(([sid, recs]) =>
      recs
        .filter((r) => !items.find((i) => i.key === `c:${r.title}@${sid}`))
        .filter((r) => !pickerQuery || r.title.toLowerCase().includes(pickerQuery.toLowerCase()))
        .map((r): CompareItem => ({ key: `c:${r.title}@${sid}`, type: 'career', label: r.title, data: r, sessionId: sid })),
    ),
  ];

  const colWidth = layout === 'horizontal' ? `${Math.max(240, Math.floor(860 / items.length))}px` : undefined;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.28, ease: 'easeOut' }}
      style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Compare</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setLayout('horizontal')}
            title="Horizontal layout"
            style={{ padding: 8, background: layout === 'horizontal' ? 'var(--pf-chip-selected-bg)' : 'none', border: `1px solid ${layout === 'horizontal' ? 'var(--pf-color-brand-500)' : 'var(--pf-surface-card-border)'}`, borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', color: layout === 'horizontal' ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <Columns size={15} />
          </button>
          <button
            onClick={() => setLayout('grid')}
            title="Grid layout"
            style={{ padding: 8, background: layout === 'grid' ? 'var(--pf-chip-selected-bg)' : 'none', border: `1px solid ${layout === 'grid' ? 'var(--pf-color-brand-500)' : 'var(--pf-surface-card-border)'}`, borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', color: layout === 'grid' ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <LayoutGrid size={15} />
          </button>
          {items.length < MAX_ITEMS && (
            <button
              onClick={() => setPickerOpen((p) => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add item
            </button>
          )}
        </div>
      </div>

      {/* Picker dropdown */}
      {pickerOpen && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ background: 'var(--pf-surface-card-bg)', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-md)', padding: 16, maxHeight: 320, overflowY: 'auto' }}>
            <input
              autoFocus
              placeholder="Search tracks or careers…"
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--pf-color-bg-subtle)', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-sm)', color: 'var(--pf-color-text-primary)', fontSize: '0.88rem', marginBottom: 10, boxSizing: 'border-box' }}
            />
            {pickerOptions.length === 0 && (
              <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>No options available</p>
            )}
            {pickerOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => addItem(opt)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'none', border: 'none', borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', textAlign: 'left', color: 'var(--pf-color-text-primary)', fontSize: '0.88rem' }}
              >
                <span style={{ fontSize: '0.68rem', padding: '1px 7px', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-pill)', color: 'var(--pf-color-text-muted)', flexShrink: 0 }}>
                  {opt.type === 'track' ? 'Track' : 'Career'}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-md)', color: 'var(--pf-color-text-muted)' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Nothing to compare yet</p>
          <p style={{ fontSize: '0.88rem', marginBottom: 20 }}>Add 2 or more tracks or career recommendations to compare them.</p>
          <button
            onClick={() => setPickerOpen(true)}
            style={{ padding: '9px 22px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600 }}
          >
            Add item
          </button>
        </div>
      )}

      {/* Comparison view */}
      {items.length > 0 && (
        <div
          style={
            layout === 'horizontal'
              ? { display: 'flex', gap: 14, overflowX: 'auto', alignItems: 'flex-start', paddingBottom: 8 }
              : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }
          }
        >
          {items.map((item) => (
            <motion.div
              key={item.key}
              layout
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                flexShrink: 0,
                width: layout === 'horizontal' ? colWidth : undefined,
                background: 'var(--pf-surface-card-bg)',
                border: '1px solid var(--pf-surface-card-border)',
                borderRadius: 'var(--pf-radius-md)',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: '0.68rem', padding: '1px 7px', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-pill)', color: 'var(--pf-color-text-muted)', display: 'inline-block', marginBottom: 4 }}>
                    {item.type === 'track' ? 'Track' : 'Career'}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{item.label}</p>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-color-text-muted)', padding: 4, flexShrink: 0 }}
                  aria-label={`Remove ${item.label}`}
                >
                  <X size={14} />
                </button>
              </div>

              {item.type === 'track'
                ? <TrackCard track={item.data as SponsorTrack} />
                : <CareerCard rec={item.data as CareerRecommendation} />
              }
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify `CareerRecommendation` type has `summary` field in `frontend/src/schemas/career.ts`**

Check that `CareerRecommendation` includes `summary: string`. If not, add it:
```typescript
summary: z.string(),
```

- [ ] **Step 3: Build**

```bash
npm run build --workspace frontend
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/routes/compare.tsx
git commit -m "feat: flexible comparison page with horizontal/grid layout and URL persistence"
```

---

## Final: Integration check

- [ ] **Step 1: Run full dev stack**

Terminal 1 — API:
```bash
npm run dev --workspace api
```

Terminal 2 — Frontend:
```bash
npm run dev --workspace frontend
```

Terminal 3 — Agent service:
```bash
DEEPSEEK_API_KEY=<your-key> python agent_service.py
```

- [ ] **Step 2: Smoke test the golden path**

1. Open `http://localhost:5173`
2. Verify no gradient backgrounds visible
3. Verify "Miscellaneous" track appears in track picker
4. Click "Sign in" → should redirect to `/login`
5. Sign in with Google or GitHub → should redirect to `/dashboard`
6. Start a new assessment from dashboard → complete 12-step intake → trigger analysis
7. Check `/results/:id` — verify recommendations appear, save one career
8. Go to `/dashboard` → verify session shows, saved career shows, profile snapshot has data, stats tab shows
9. Go to `/compare` → add 2 items, toggle horizontal/grid, verify URL updates

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: platform upgrade complete — Neon, DeepSeek, OAuth, dashboard, comparison"
```
