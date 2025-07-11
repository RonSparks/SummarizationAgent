# AI Agent Hub

A multi-agent AI platform that provides two specialized AI agents for different tasks:

1. **Meeting Summarizer Agent** - Analyzes meeting transcripts and creates structured summaries
2. **User Story Creator Agent** - Converts requirements into Jira-ready user stories

## Architecture

- **Frontend**: Modern HTML/JavaScript application with agent switching
- **Backend**: .NET Core API with static file serving
- **AI**: Local LLM via Ollama in Docker container
- **Features**: Dual-agent system, structured output, network accessibility

## Project Structure

```
SummarizationAgent/
├── frontend/          # HTML source files (development)
├── backend/           # .NET Core API with static file serving
│   ├── wwwroot/      # Production frontend files
│   ├── Controllers/  # API controllers
│   ├── Services/     # AI service implementations
│   └── Models/       # Data models
├── docker/            # Docker configurations
└── docs/             # Documentation
```

## Getting Started

### Prerequisites
- .NET 8.0 or later
- Ollama installed and running on port 11434
- At least one AI model downloaded in Ollama

### Quick Start
1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run the application**:
   ```bash
   dotnet run
   ```

3. **Access the app**:
   - Local: http://localhost:5000
   - Network: http://[your-computer-name]:5000 or http://[your-ip]:5000

4. **Test with sample data**:
   - Meeting Summarizer: Use "Load Sample" button
   - User Story Creator: Use "Load Sample" button for 5 different scenarios

## Features

### Meeting Summarizer Agent
- Raw transcript processing
- Structured markdown summaries
- Action item extraction with assignees and priorities
- Decision tracking with decision makers
- Key points identification by category
- Speaker sentiment analysis with confidence scores
- Model selection from local Ollama instance
- Download summaries as markdown files

### User Story Creator Agent
- Requirements to user story conversion
- Jira-ready user story format
- Acceptance criteria generation
- Epic and story type suggestions
- Priority and story point estimation
- Label suggestions for categorization
- Project context integration
- Download user stories as markdown files

### General Features
- **Agent Switching**: Seamless switching between agents
- **Network Accessibility**: Accessible from other computers on the network
- **Sample Data**: Built-in sample conversations for both agents
- **Real-time Processing**: Live elapsed time tracking
- **Error Handling**: Comprehensive error messages and fallbacks

## API Endpoints

### Meeting Summarizer
- `GET /api/summarization/models` - Get available AI models
- `POST /api/summarization/summarize` - Process meeting transcript

### User Story Creator
- `GET /api/userstory/models` - Get available AI models
- `POST /api/userstory/create` - Create user story from requirements

## Usage Examples

### Meeting Summarizer
1. Select an AI model from the dropdown
2. Paste your meeting transcript
3. Choose whether to include sentiment analysis
4. Click "Generate Summary" or "Load Sample"
5. Review the structured output with action items, decisions, and key points
6. Download the summary as a markdown file

### User Story Creator
1. Select an AI model from the dropdown
2. Describe the feature or requirement you want to convert
3. Optionally provide project context for better results
4. Click "Create User Story" or "Load Sample"
5. Review the generated user story with acceptance criteria
6. Download the user story as a markdown file

## Sample Data

### Meeting Summarizer Samples
- Product Development Meeting
- Technical Architecture Review
- Crisis Management Meeting

### User Story Creator Samples
- Mobile app login feature
- Customer support ticketing system
- E-commerce shopping cart
- Marketing email campaigns
- Real-time chat functionality

## Configuration

### Network Access
The application is configured to listen on all network interfaces (`0.0.0.0:5000`), making it accessible from other computers on your network.

### Ollama Configuration
- **Base URL**: http://localhost:11434
- **Timeout**: 10 minutes for large models
- **Models**: Any model available in your Ollama instance

### CORS Policy
The application allows all origins, methods, and headers for development purposes.

## Development

### Backend Structure
- **Controllers**: API endpoints for both agents
- **Services**: AI service implementations using Ollama
- **Models**: Request/response data structures
- **wwwroot**: Static frontend files served by the API

### Frontend Structure
- **Agent Switching**: JavaScript-based UI switching
- **Real-time Updates**: Live processing time tracking
- **Error Handling**: User-friendly error messages
- **Sample Loading**: Built-in sample data for testing

## Troubleshooting

### Common Issues
1. **"No models available"**: Ensure Ollama is running and has models installed
2. **Network access issues**: Check Windows Firewall settings for port 5000
3. **Processing timeouts**: Large models may take several minutes to process
4. **CORS errors**: The application is configured to allow all origins

### Debug Mode
Enable debug logging by setting `"logDebug": true` in `appsettings.json`.

## Security Notes

- **Development Only**: This configuration is suitable for development/testing
- **Network Access**: The application is accessible to anyone on your network
- **Production**: Use proper authentication, HTTPS, and firewall rules for production deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both agents thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 