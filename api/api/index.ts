import type { IncomingMessage, ServerResponse } from "node:http";
import { buildApp } from "../src/app.js";

// Vercel serverless entry for the Fastify app. buildApp() does NOT call
// listen(); we bridge each invocation into Fastify's router via the
// underlying http.Server. The app is built and readied once per cold start.
const app = buildApp();
const ready = app.ready();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await ready;
  app.server.emit("request", req, res);
}
