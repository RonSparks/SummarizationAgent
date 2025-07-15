# AI Agent Hub Setup Guide

## Prerequisites

1. **Docker Desktop** - Download and install from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **.NET 8.0 SDK** - Download and install from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
3. **Node.js 18+** - Download and install from [nodejs.org](https://nodejs.org/)

## Quick Start

### Option 1: Docker (Recommended)
1. **Navigate to the docker directory:**
   ```bash
   cd docker
   ```

2. **Build and start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:5010
   - Backend API: http://localhost:5002
   - Swagger UI: http://localhost:5002/swagger
   - Ollama: http://localhost:11434 (your existing instance)

### Option 2: Local Development
1. **Clone and navigate to the project:**
   ```bash
   cd SummarizationAgent
   ```

2. **Ensure Ollama is running:**
   ```bash
   # Check if Ollama is running on port 11434
   curl http://localhost:11434/api/tags
   ```

3. **Start the backend:**
   ```bash
   cd backend
   dotnet run
   ```

4. **Access the application:**
   - Backend API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger
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

### Three AI Agents Available

1. **Meeting Summarizer Agent**
   - Select a model from the dropdown
   - Paste a meeting transcript
   - Choose whether to include sentiment analysis
   - Click "Generate Summary" or "Load Sample"
   - Review structured output with action items, decisions, and key points
   - Download results as markdown

2. **User Story Creator Agent**
   - Select a model from the dropdown
   - Describe the feature or requirement
   - Optionally provide project context
   - Click "Create User Story" or "Load Sample"
   - Review generated user story with acceptance criteria
   - Download results as markdown

3. **Email Classifier Agent**
   - Select a model from the dropdown
   - Paste email content to classify
   - Choose whether to include tone analysis and metadata
   - Click "Classify Email" or "Load Sample"
   - Review color-coded classification with multiple categories
   - See smart suggested actions based on category
   - Download results as markdown

**Test Data**: Use the "Load Sample" buttons for each agent to test with built-in sample data.

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

- **Frontend**: HTML/JavaScript with modern UI and agent switching
- **Backend**: .NET Core 8.0 Web API with static file serving
- **AI**: Ollama running locally or in Docker container
- **Communication**: HTTP REST API between frontend and backend
- **AI Communication**: HTTP API calls from backend to Ollama
- **Docker**: Optional containerized deployment with nginx frontend

## Features

### Meeting Summarizer Agent
- ✅ Model selection from local Ollama instance
- ✅ Raw transcript processing
- ✅ Structured markdown summaries
- ✅ Action item extraction with assignees and priorities
- ✅ Decision tracking with decision makers
- ✅ Key points identification by category
- ✅ Speaker sentiment analysis with confidence scores
- ✅ Download results as markdown

### User Story Creator Agent
- ✅ Requirements to user story conversion
- ✅ Jira-ready user story format
- ✅ Acceptance criteria generation
- ✅ Epic and story type suggestions
- ✅ Priority and story point estimation
- ✅ Label suggestions for categorization
- ✅ Download results as markdown

### Email Classifier Agent
- ✅ Multi-category classification (8 categories)
- ✅ Color-coded visual badges for categories
- ✅ Multiple category support with "/" separation
- ✅ Tone analysis (Professional, Casual, Formal, etc.)
- ✅ Priority assessment (High, Medium, Low)
- ✅ Smart suggested actions based on category
- ✅ Enhanced SPAM detection
- ✅ Download results as markdown

### General Features
- ✅ Agent switching with modern UI
- ✅ Network accessibility
- ✅ Built-in sample data for all agents
- ✅ Real-time processing time tracking
- ✅ Comprehensive error handling 