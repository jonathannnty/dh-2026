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
