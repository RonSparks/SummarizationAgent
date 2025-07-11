using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public class UserStoryService : IUserStoryService
{
    private readonly IOllamaClient _ollamaClient;
    private readonly ILogger<UserStoryService> _logger;

    public UserStoryService(IOllamaClient ollamaClient, ILogger<UserStoryService> logger)
    {
        _ollamaClient = ollamaClient;
        _logger = logger;
    }

    public async Task<List<string>> GetAvailableModelsAsync()
    {
        return await _ollamaClient.GetAvailableModelsAsync();
    }

    public async Task<UserStoryResponse> CreateUserStoryAsync(UserStoryRequest request)
    {
        var prompt = GenerateUserStoryPrompt(request.InputText, request.ProjectContext);
        
        var response = await _ollamaClient.GenerateResponseAsync(request.ModelName, prompt);
        
        if (!string.IsNullOrEmpty(response))
        {
            return ParseUserStoryResponse(response, request.ModelName);
        }

        return new UserStoryResponse
        {
            UserStory = new UserStory(),
            ModelUsed = request.ModelName
        };
    }

    private string GenerateUserStoryPrompt(string inputText, string projectContext)
    {
        var contextPrompt = string.IsNullOrWhiteSpace(projectContext) ? "" : $"\nProject Context: {projectContext}";
        
        var prompt = @"
Please analyze the following input text and create a comprehensive user story for Jira in JSON format.

Input Text:
" + inputText + contextPrompt + @"

IMPORTANT: Respond ONLY with valid JSON. Do not include any thinking text, explanations, or markdown formatting. Start your response directly with { and end with }.

Please provide a JSON response with the following EXACT structure (do not modify the field names or structure):
{
  ""userStory"": {
    ""title"": ""A concise, descriptive title for the user story"",
    ""story"": ""As a [persona] I want [want] so that [soThat]"",
    ""persona"": ""The user persona (e.g., 'registered user', 'admin', 'customer')"",
    ""want"": ""What the user wants to accomplish"",
    ""soThat"": ""The benefit or value the user will receive"",
    ""acceptanceCriteria"": [
      ""Given [context] when [action] then [expected result]"",
      ""Given [context] when [action] then [expected result]""
    ],
    ""epic"": ""Suggested epic name for this story"",
    ""storyType"": ""Story"",
    ""priority"": ""High/Medium/Low"",
    ""storyPoints"": 3,
    ""labels"": [""feature"", ""user-story""]
  }
}

CRITICAL: Your response must be ONLY valid JSON. No thinking text, no explanations, no markdown formatting. Just the JSON object.";

        return prompt;
    }

    private UserStoryResponse ParseUserStoryResponse(string response, string modelName)
    {
        _logger.LogInformation($"Parsing user story response length: {response.Length}");
        _logger.LogInformation($"Response starts with: {response.Substring(0, Math.Min(200, response.Length))}");
        _logger.LogInformation($"Response ends with: {response.Substring(Math.Max(0, response.Length - 200))}");
        
        try
        {
            // First, try to find JSON code blocks (```json ... ```)
            var jsonBlockStart = response.IndexOf("```json");
            if (jsonBlockStart >= 0)
            {
                var jsonBlockEnd = response.IndexOf("```", jsonBlockStart + 7);
                if (jsonBlockEnd > jsonBlockStart)
                {
                    var jsonContent = response.Substring(jsonBlockStart + 7, jsonBlockEnd - jsonBlockStart - 7).Trim();
                    _logger.LogInformation($"Extracted JSON from code block: {jsonContent}");
                    
                    try
                    {
                        var parsedResponse = JsonSerializer.Deserialize<UserStoryResponse>(jsonContent);
                        if (parsedResponse != null)
                        {
                            parsedResponse.ModelUsed = modelName;
                            return parsedResponse;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to deserialize JSON from code block");
                    }
                }
            }

            // Try to find JSON object directly
            var jsonStart = response.IndexOf('{');
            var jsonEnd = response.LastIndexOf('}');
            
            if (jsonStart >= 0 && jsonEnd > jsonStart)
            {
                var jsonContent = response.Substring(jsonStart, jsonEnd - jsonStart + 1);
                _logger.LogInformation($"Extracted JSON content: {jsonContent}");
                
                try
                {
                    var parsedResponse = JsonSerializer.Deserialize<UserStoryResponse>(jsonContent);
                    if (parsedResponse != null)
                    {
                        parsedResponse.ModelUsed = modelName;
                        return parsedResponse;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to deserialize JSON content");
                }
            }

            // If all else fails, try to parse the entire response
            try
            {
                var parsedResponse = JsonSerializer.Deserialize<UserStoryResponse>(response);
                if (parsedResponse != null)
                {
                    parsedResponse.ModelUsed = modelName;
                    return parsedResponse;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize entire response");
            }

            // Return a default response if parsing fails
            return new UserStoryResponse
            {
                UserStory = new UserStory
                {
                    Title = "Failed to parse user story",
                    Story = "As a user I want to see a proper user story so that I can understand the requirements",
                    Persona = "user",
                    Want = "to see a proper user story",
                    SoThat = "I can understand the requirements",
                    AcceptanceCriteria = new List<string> { "Given the system is working when I submit a request then I should see a valid user story" },
                    Epic = "System Improvement",
                    StoryType = "Story",
                    Priority = "Medium",
                    StoryPoints = 3,
                    Labels = new List<string> { "bug", "parsing" }
                },
                ModelUsed = modelName
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing user story response");
            return new UserStoryResponse
            {
                UserStory = new UserStory
                {
                    Title = "Error parsing response",
                    Story = "As a user I want the system to work properly so that I can create user stories",
                    Persona = "user",
                    Want = "the system to work properly",
                    SoThat = "I can create user stories",
                    AcceptanceCriteria = new List<string> { "Given the system is working when I submit a request then I should see a valid user story" },
                    Epic = "System Improvement",
                    StoryType = "Story",
                    Priority = "High",
                    StoryPoints = 5,
                    Labels = new List<string> { "bug", "error" }
                },
                ModelUsed = modelName
            };
        }
    }
} 