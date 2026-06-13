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
