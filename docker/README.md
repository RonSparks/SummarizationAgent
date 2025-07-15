# AI Agent Hub - Docker Setup

This document explains how to run the AI Agent Hub application using Docker containers.

## Architecture

The application is containerized with the following services:

- **Backend API** (.NET 9.0): Handles all AI agent operations
- **Frontend** (Nginx): Serves the web interface and proxies API requests
- **Ollama** (Optional): AI model service (can use external Ollama instance)

## Prerequisites

1. **Docker Desktop** installed and running
2. **Ollama** running (either in container or externally)

## Quick Start

### Option 1: Use Containerized Ollama (Recommended for Development)

1. Navigate to the docker directory:
   ```bash
   cd docker
   ```

2. Build and start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Frontend**: http://localhost:5010
   - **Backend API**: http://localhost:5002
   - **Swagger UI**: http://localhost:5002/swagger
   - **Ollama**: http://localhost:11434

### Option 2: Use External Ollama Instance

If you have Ollama running externally (e.g., on port 11434), modify the docker-compose.yml:

1. Comment out or remove the `ollama` service
2. Update the backend environment variable:
   ```yaml
   environment:
     - OLLAMA_URL=http://host.docker.internal:11434/
   ```

3. Run the services:
   ```bash
   docker-compose up --build backend frontend
   ```

## Service Details

### Backend API (Port 5002)
- **Framework**: .NET 8.0
- **Features**: 
  - **Meeting Summarizer Agent**: Transcript analysis with structured summaries
  - **User Story Creator Agent**: Requirements to Jira-ready user stories
  - **Email Classifier Agent**: Multi-category classification with color-coded badges
  - Swagger API documentation
- **Health Check**: Available at `/health`

### Frontend (Port 5010)
- **Server**: Nginx
- **Features**:
  - Modern web interface with agent switching
  - API request proxying to backend
  - Static file serving with caching
  - Gzip compression for performance
  - Color-coded email classification badges

### Ollama (Port 11434)
- **Purpose**: AI model inference
- **Models**: Supports any Ollama-compatible models
- **Persistence**: Model data stored in Docker volume

## Environment Variables

### Backend
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `ASPNETCORE_URLS`: HTTP/HTTPS URLs
- `OLLAMA_URL`: Ollama service URL

### Frontend
- Configured via nginx.conf
- Proxies API requests to backend
- Serves static files with caching

## Docker Commands

### Build and Start
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# Start specific services
docker-compose up backend frontend
```

### Management
```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Troubleshooting
```bash
# Check service status
docker-compose ps

# Execute commands in containers
docker-compose exec backend dotnet --version
docker-compose exec frontend nginx -t

# View container details
docker inspect ai-agent-hub-backend
```

## Development Workflow

### Making Changes
1. Modify source code
2. Rebuild containers: `docker-compose up --build`
3. Or rebuild specific service: `docker-compose up --build backend`

### Hot Reload (Development)
For development with hot reload, you can mount source code:

```yaml
# In docker-compose.yml, add volumes to backend service:
volumes:
  - ../backend:/src
  - /src/bin
  - /src/obj
```

### Debugging
1. Check container logs: `docker-compose logs backend`
2. Access container shell: `docker-compose exec backend sh`
3. View nginx logs: `docker-compose logs frontend`

## Production Considerations

### Security
- Use HTTPS in production
- Configure proper CORS policies
- Set secure environment variables
- Use secrets management

### Performance
- Enable nginx caching
- Configure proper timeouts
- Use load balancing for multiple instances
- Monitor resource usage

### Scaling
- Use Docker Swarm or Kubernetes
- Configure health checks
- Set up monitoring and logging
- Use external databases if needed

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 5010, 5002, 11434 are available
   - Change ports in docker-compose.yml if needed

2. **Ollama Connection Issues**
   - Verify Ollama is running: `curl http://localhost:11434/api/tags`
   - Check network connectivity between containers

3. **Frontend Not Loading**
   - Check nginx logs: `docker-compose logs frontend`
   - Verify backend is running: `docker-compose logs backend`

4. **API Errors**
   - Check backend logs: `docker-compose logs backend`
   - Verify Ollama models are available
   - Check API endpoints: `curl http://localhost:5002/api/health`

### Performance Issues
- Monitor container resources: `docker stats`
- Check nginx access logs
- Verify Ollama model loading
- Review API response times

## Latest Features

### Email Classifier Agent (Latest Update)
- **Multi-Category Classification**: 8 categories (Urgent, FYI, Action Required, Spam, Meeting, Follow-up, Newsletter, Other)
- **Color-Coded Visual System**: Distinct color badges for each category
- **Multiple Category Support**: Handles emails with multiple classifications (e.g., "Urgent/Action Required")
- **Smart Suggested Actions**: Context-aware recommendations based on category
- **Enhanced SPAM Detection**: Improved detection of phishing attempts and unsolicited marketing
- **Visual Confidence Indicators**: Color-coded badges with confidence scores

### Agent Features
- **Meeting Summarizer**: Structured summaries with action items, decisions, and speaker sentiments
- **User Story Creator**: Jira-ready user stories with acceptance criteria and story points
- **Email Classifier**: Multi-category classification with tone analysis and priority assessment

## Next Steps

1. **Add Models**: Pull Ollama models for your agents
2. **Configure Agents**: Update agent prompts and settings
3. **Add Authentication**: Implement user authentication
4. **Monitoring**: Add logging and monitoring
5. **CI/CD**: Set up automated deployment pipeline 