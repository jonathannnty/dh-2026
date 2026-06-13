# agent/ — Superseded

The files in this directory (`main.py`, `analyzer.py`) are the original uAgents/Anthropic-based agent implementation and are no longer active.

The current agent service is **`agent_service.py`** in the repository root, which uses the DeepSeek API via the OpenAI-compatible SDK.

## Running the current agent service

```bash
# From the repository root:

# Install dependencies
pip install -r requirements.txt

# Set your DeepSeek API key
export DEEPSEEK_API_KEY=sk-...      # macOS/Linux
$env:DEEPSEEK_API_KEY="sk-..."      # Windows PowerShell

# Start the service
python agent_service.py
```

The service starts on port 8000 by default. Override with `AGENT_PORT=<port>`.

See [AGENTS.md](../AGENTS.md) for endpoint documentation and architecture.
