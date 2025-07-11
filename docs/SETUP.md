# Meeting Summarizer Agent Setup Guide

## Prerequisites

1. **Docker Desktop** - Download and install from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **.NET 8.0 SDK** - Download and install from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
3. **Node.js 18+** - Download and install from [nodejs.org](https://nodejs.org/)

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd SummarizationAgent
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Ensure Ollama is running:**
   ```bash
   # Check if Ollama is running on port 11434
   curl http://localhost:11434/api/tags
   ```

4. **Run the startup script:**
   ```bash
   ./start.ps1
   ```

   Or manually start each component:

   ```bash
   # Start backend (in one terminal)
   cd backend
   dotnet run
   
   # Start frontend (in another terminal)
   cd frontend
   npm start
   ```

5. **Access the application:**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5000
   - Ollama: http://localhost:11434 (your existing instance)

## Using Your Existing Ollama Models

The application will use your existing Ollama instance with the models you have:

- **phi4:latest** - Good for general summarization tasks
- **deepseek-r1:14b** - Excellent for complex analysis and structured output

To verify your models are available:

```bash
# Check available models
curl http://localhost:11434/api/tags

# Or use Ollama CLI
ollama list
```

If you want to add more models:

```bash
# Pull additional models
ollama pull llama2:7b
ollama pull codellama:7b
```

## Usage

1. **Open the application** at http://localhost:3002
2. **Select a model** from the dropdown (phi4:latest or deepseek-r1:14b)
3. **Paste a meeting transcript** into the text area
4. **Choose options** (include sentiment analysis)
5. **Click "Generate Summary"** to process the transcript
6. **Review results** including:
   - Summary
   - Action items
   - Decisions
   - Key points
   - Speaker sentiments (if enabled)
7. **Download the results** as markdown

**Test Data**: Use the sample transcripts in `docs/test-transcripts.md` to test the application.

## Sample Transcript Format

The application works best with transcripts that include speaker names. Example:

```
John: Good morning everyone, let's start our weekly team meeting.
Sarah: Thanks John. I wanted to discuss the Q4 project timeline.
Mike: I think we need to push the deadline back by two weeks.
John: That's a good point Mike. Sarah, can you update the project plan?
Sarah: Absolutely, I'll have that ready by Friday.
Mike: Great, and I'll follow up with the client about the new timeline.
```

## Troubleshooting

### Ollama Connection Issues
- Ensure Docker is running
- Check if Ollama container is running: `docker ps`
- Verify Ollama is accessible: `curl http://localhost:11434/api/tags`

### Backend Issues
- Check if .NET 8.0 is installed: `dotnet --version`
- Ensure port 5000 is available
- Check backend logs for errors

### Frontend Issues
- Ensure Node.js is installed: `node --version`
- Check if dependencies are installed: `npm install`
- Verify port 3000 is available

### Model Issues
- Ensure models are pulled in Ollama
- Check model names match exactly
- Try a smaller model if larger ones are too slow

## Development

### Backend Development
```bash
cd backend
dotnet run --watch
```

### Frontend Development
```bash
cd frontend
npm start
```

### API Documentation
Access Swagger UI at: http://localhost:5000/swagger

## Architecture

- **Frontend**: React TypeScript with Tailwind CSS
- **Backend**: .NET Core 8.0 Web API
- **AI**: Ollama running in Docker container
- **Communication**: HTTP REST API between frontend and backend
- **AI Communication**: HTTP API calls from backend to Ollama

## Features

- ✅ Model selection from local Ollama instance
- ✅ Raw transcript processing
- ✅ Structured markdown summaries
- ✅ Action item extraction
- ✅ Decision tracking
- ✅ Key points identification
- ✅ Speaker sentiment analysis
- ✅ Download results as markdown
- ✅ Modern, responsive UI
- ✅ Error handling and validation 