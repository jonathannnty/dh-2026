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
