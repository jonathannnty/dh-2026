# PathFinder AI — Platform Upgrade Design

**Date:** 2026-06-09  
**Status:** Approved  
**Approach:** Parallel streams (B)

---

## Overview

This spec covers six feature areas delivered in three parallel streams:

- **Stream 1 (no deps):** UI polish — remove gradients, add miscellaneous track
- **Stream 2 (no deps):** Infrastructure — SQLite → Neon PostgreSQL, uAgents → DeepSeek
- **Stream 3 (depends on Stream 2):** Auth (OAuth) → User dashboard → Comparison page

---

## Stream 1: UI Polish

### 1.1 Remove Gradients

All `linear-gradient(...)` and `radial-gradient(...)` CSS declarations are replaced with flat solid colors. The dominant color in each gradient becomes the replacement solid. Affects:

- `frontend/src/index.css` — global gradient rules
- Tailwind gradient classes in route and component files: `bg-gradient-*`, `from-*`, `via-*`, `to-*`
- No changes to the color palette defined in `branding-spec.md`

### 1.2 Miscellaneous Track

New entry added to `api/src/services/tracks.ts`:

```ts
{
  id: 'misc',
  name: 'Miscellaneous',
  sponsor: 'General',
  description: "Not sure where you fit? Explore careers across all fields.",
  tags: ['open-ended', 'exploratory', 'multi-field'],
}
```

No custom adapter — falls back to the general enrichment path. Appears in the home page track picker alongside the existing four tracks.

---

## Stream 2: Infrastructure

### 2.1 PostgreSQL / Neon

**Driver swap:**
- Remove `better-sqlite3`
- Add `@neondatabase/serverless` + `ws` (WebSocket adapter for local dev)
- `api/src/db/client.ts` — replace BetterSQLite3 init with `neon(DATABASE_URL)` + `drizzle(neonClient)`
- `api/drizzle.config.ts` — dialect changed to `postgresql`

**Schema changes:**

New `users` table:
```ts
users: {
  id:         text('id').primaryKey(),          // UUID
  email:      text('email').unique().notNull(),
  name:       text('name'),
  avatarUrl:  text('avatar_url'),
  provider:   text('provider').notNull(),        // 'google' | 'github'
  providerId: text('provider_id').notNull(),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
}
```

Updated `sessions` table — one new nullable column:
```ts
userId: text('user_id').references(() => users.id)  // null for anonymous sessions
```

New `savedCareers` table (used by Stream 3 dashboard):
```ts
savedCareers: {
  id:          text('id').primaryKey(),
  userId:      text('user_id').notNull().references(() => users.id),
  sessionId:   text('session_id').notNull().references(() => sessions.id),
  careerTitle: text('career_title').notNull(),
  fitScore:    integer('fit_score'),
  savedAt:     timestamp('saved_at').defaultNow(),
}
```

**Environment:**
- `DATABASE_URL` — Neon connection string (replaces SQLite path)
- `dev.db` file deprecated; WAL-mode SQLite code removed

**Migrations:** Drizzle Kit generates and applies migrations via `npx drizzle-kit migrate`.

### 2.2 DeepSeek Agent Service

`agent_service.py` replaced entirely. New service: clean FastAPI app calling DeepSeek's OpenAI-compatible API.

**Endpoints (unchanged contract):**
- `POST /analyze/:sessionId` — receives `CareerProfile` JSON, returns `{ ok: true }`
- `GET /status/:sessionId` — returns `{ status, progress, stage, recommendations?, error? }`

**Implementation:**
- Uses `openai` Python SDK with `base_url="https://api.deepseek.com"` override
- Model: `deepseek-chat`
- Prompt: structured system prompt instructing the model to output a JSON array of `CareerRecommendation` objects given a `CareerProfile`
- Response parsed and stored; `/status` returns `complete` with recommendations once done

**Dependencies:**
- Remove: `uagents` and all uAgents-related packages
- Add: `openai>=1.0.0`
- `requirements.txt` updated accordingly

**Environment:**
- `DEEPSEEK_API_KEY` — new required env var for the agent service

**Docs updated:**
- `AGENTS.md` — rewritten to describe DeepSeek flow
- `docs/ARCHITECTURE.md` — agent service section updated
- `docs/DEPLOYMENT.md` — uAgents setup steps replaced with DeepSeek setup
- `QUICKSTART.md` — env var list updated

**Fastify backend unchanged** — `api/src/services/agent.ts` polling logic, timeout, and fallback behavior remain exactly as-is.

---

## Stream 3: Auth, Dashboard, Comparison

> Depends on Stream 2 (users + savedCareers tables must exist).

### 3.1 Auth — OAuth (Google + GitHub)

**Backend routes** added under `/auth` in Fastify:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/auth/google` | Redirect to Google OAuth consent |
| GET | `/auth/google/callback` | Exchange code → upsert user → set cookie |
| GET | `/auth/github` | Redirect to GitHub OAuth consent |
| GET | `/auth/github/callback` | Exchange code → upsert user → set cookie |
| GET | `/auth/me` | Return current user from cookie, or 401 |
| POST | `/auth/logout` | Clear auth cookie |

**Session cookie:** Signed JWT in an HTTP-only, `SameSite=Lax` cookie. Carries `{ userId, email, name, avatarUrl }`. No separate session table.

**New env vars:**
```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
JWT_SECRET
APP_URL        # e.g. https://pathfinder.vercel.app — used for OAuth redirect URIs and post-auth redirect
```

After setting the auth cookie, callbacks redirect to `APP_URL/dashboard`.

**Frontend — `/login` route:**
- Follows existing UI exactly: same card component, typography, flat colors, no gradients
- Two buttons: "Continue with Google" and "Continue with GitHub" with SVG provider icons
- No email/password fields
- On OAuth success → redirect to `/dashboard`

**Route protection:**
- `useAuth` hook wraps `GET /auth/me` via React Query
- `/dashboard` and `/compare` redirect to `/login` if unauthenticated
- `/onboarding` and `/results/:id` remain public (anonymous sessions supported)

**Session linking:** Sessions created while authenticated get `userId` set automatically. Pre-auth anonymous sessions keep `userId = null`.

### 3.2 User Profile Dashboard (`/dashboard`)

Four sections, all scoped to the authenticated `userId`:

**1. Past Sessions**
- List of sessions: track name, status badge, top career recommendation title, fit score, date
- Each row links to `/results/:sessionId`
- Source: `GET /sessions?userId=me` (new query param added to sessions route)

**2. Saved Careers**
- Grid of bookmarked career cards: title, fit score bar, session context, save date
- Unsave button on each card
- Save/unsave button added to recommendation cards on `/results/:sessionId`
- Source: `GET /saved-careers`, `POST /saved-careers`, `DELETE /saved-careers/:id`

**3. Profile Snapshot**
- Merged `CareerProfile` across all user sessions: latest non-null value per field
- Displayed as readable chips/tags grouped by category (skills, values, preferences, constraints)
- Source: computed from past sessions data on the backend

**4. Progress Stats**
- Tracks explored (count + track name chips)
- Average fit score across all completed sessions
- Total sessions completed
- Most recent activity date
- Source: computed from past sessions data on the backend

**New API routes:**
- `GET /sessions?userId=me` — list sessions for authenticated user
- `GET /saved-careers` — list saved careers for authenticated user
- `POST /saved-careers` — save a career `{ sessionId, careerTitle, fitScore }`
- `DELETE /saved-careers/:id` — unsave

### 3.3 Comparison Page (`/compare`)

**Item pools:**
- Tracks: any of the 5 sponsor tracks (general, tech-career, healthcare-pivot, creative-industry, misc)
- Careers: individual recommendations from the user's past sessions

**UI layout:**
- Left panel: picker — search/filter by name, click to add item to comparison (max 6)
- Main area: comparison view, toggled between two modes:
  - **Horizontal** — side-by-side columns, ideal for 2–3 items
  - **Grid** — card layout, ideal for 4+ items
- Toggle button top-right

**Comparison dimensions by type:**

*Track:* name, description, sponsor, tags, typical roles

*Career recommendation:* title, fit score (visual bar), salary range, reasons (fit points), concerns, next steps

**Mixed comparisons** (track + career on same screen) are supported — each item renders its own dimension set; shared dimensions (name, description) align across columns.

**URL persistence:** Selections encoded as `?items=tech-career,misc,Software+Engineer@<sessionId>` — shareable links restore the exact comparison state.

**Data sources:** Composed entirely from existing endpoints (`GET /tracks`, `GET /sessions/:id/recommendations`) — no new backend routes needed.

---

## Environment Variable Summary

| Variable | Stream | Service | Purpose |
|----------|--------|---------|---------|
| `DATABASE_URL` | 2 | API | Neon PostgreSQL connection string |
| `DEEPSEEK_API_KEY` | 2 | Agent | DeepSeek API key |
| `GOOGLE_CLIENT_ID` | 3 | API | Google OAuth app client ID |
| `GOOGLE_CLIENT_SECRET` | 3 | API | Google OAuth app client secret |
| `GITHUB_CLIENT_ID` | 3 | API | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | 3 | API | GitHub OAuth app client secret |
| `JWT_SECRET` | 3 | API | Signing key for auth cookies |
| `APP_URL` | 3 | API | Frontend base URL for OAuth redirect URIs |

---

## What Is Not In Scope

- Email/password auth
- PostgreSQL → Supabase or self-hosted (Neon only)
- Agent multi-step orchestration (single DeepSeek call per analysis)
- Dashboard for anonymous (unauthenticated) users
- Comparison page persistence to database (URL params only)
- Mobile-specific layout changes beyond what responsive CSS provides
