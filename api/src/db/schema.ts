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
