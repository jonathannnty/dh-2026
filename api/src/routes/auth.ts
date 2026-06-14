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
