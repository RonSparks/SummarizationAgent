# Meeting Summarizer Agent

An AI-powered meeting summarization tool that takes raw meeting transcripts and returns structured summaries with action items, decisions, and key points.

## Architecture

- **Frontend**: Simple HTML/JavaScript application
- **Backend**: .NET Core API with static file serving
- **AI**: Local LLM via Ollama in Docker container
- **Features**: Summarization, text parsing, sentiment analysis

## Project Structure

```
SummarizationAgent/
├── frontend/          # HTML source files
├── backend/           # .NET Core API with static file serving
├── docker/            # Docker configurations
└── docs/             # Documentation
```

## Getting Started

1. **Start the application** - Run `./start.ps1`
2. **Access the app** - Open http://localhost:5000
3. **Test with sample data** - Use transcripts from `docs/test-transcripts.md`

**Note**: This application uses your existing Ollama instance on port 11434 with models `phi4:latest` and `deepseek-r1:14b`.

## Features

- Raw transcript processing
- Structured markdown summaries
- Action item extraction
- Decision tracking
- Key points identification
- Speaker sentiment analysis
- Model selection from local Ollama instance 