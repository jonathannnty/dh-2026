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
