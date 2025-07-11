using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public class EmailClassifierService : IEmailClassifierService
{
    private readonly IOllamaClient _ollamaClient;
    private readonly ILogger<EmailClassifierService> _logger;

    public EmailClassifierService(IOllamaClient ollamaClient, ILogger<EmailClassifierService> logger)
    {
        _ollamaClient = ollamaClient;
        _logger = logger;
    }

    public async Task<List<string>> GetAvailableModelsAsync()
    {
        return await _ollamaClient.GetAvailableModelsAsync();
    }

    public async Task<EmailClassificationResponse> ClassifyEmailAsync(EmailClassificationRequest request)
    {
        var prompt = GenerateEmailClassificationPrompt(request.EmailBody, request.EmailMetadata);
        
        var response = await _ollamaClient.GenerateResponseAsync(request.ModelName, prompt);
        
        if (!string.IsNullOrEmpty(response))
        {
            return ParseEmailClassificationResponse(response, request.ModelName);
        }

        return new EmailClassificationResponse
        {
            Classification = new EmailClassification(),
            ModelUsed = request.ModelName
        };
    }

    private string GenerateEmailClassificationPrompt(string emailBody, string emailMetadata)
    {
        var metadataPrompt = string.IsNullOrWhiteSpace(emailMetadata) ? "" : $"\nEmail Metadata: {emailMetadata}";
        
        var prompt = @"
Please analyze the following email and classify it into appropriate categories in JSON format.

Email Body:
" + emailBody + metadataPrompt + @"

IMPORTANT: Respond ONLY with valid JSON. Do not include any thinking text, explanations, or markdown formatting. Start your response directly with { and end with }.

Please provide a JSON response with the following EXACT structure (do not modify the field names or structure):
{
  ""classification"": {
    ""label"": ""Urgent/FYI/Action Required/Spam/Meeting/Follow-up/Newsletter/Other"",
    ""confidence"": 0.85,
    ""explanation"": ""Brief explanation of why this classification was chosen"",
    ""tone"": ""Professional/Friendly/Urgent/Neutral/Formal/Informal"",
    ""priority"": ""High/Medium/Low"",
    ""suggestedAction"": ""What action should be taken based on this classification"",
    ""tags"": [""work"", ""personal"", ""urgent"", ""follow-up""]
  }
}

Classification Guidelines:
- Urgent: Time-sensitive matters, deadlines, critical issues
- FYI: Informational updates, announcements, general information
- Action Required: Tasks, requests, items needing response or action
- Spam: Unwanted emails, promotional content, suspicious messages
- Meeting: Meeting invitations, scheduling, calendar events
- Follow-up: Responses, updates on previous conversations
- Newsletter: Regular updates, marketing content, subscriptions
- Other: Miscellaneous emails that don't fit other categories

CRITICAL: Your response must be ONLY valid JSON. No thinking text, no explanations, no markdown formatting. Just the JSON object.";

        return prompt;
    }

    private EmailClassificationResponse ParseEmailClassificationResponse(string response, string modelName)
    {
        _logger.LogInformation($"Parsing email classification response length: {response.Length}");
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
                        var parsedResponse = JsonSerializer.Deserialize<EmailClassificationResponse>(jsonContent);
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
                    var parsedResponse = JsonSerializer.Deserialize<EmailClassificationResponse>(jsonContent);
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
                var parsedResponse = JsonSerializer.Deserialize<EmailClassificationResponse>(response);
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
            return new EmailClassificationResponse
            {
                Classification = new EmailClassification
                {
                    Label = "Other",
                    Confidence = 0.5,
                    Explanation = "Failed to parse classification response",
                    Tone = "Neutral",
                    Priority = "Medium",
                    SuggestedAction = "Review manually",
                    Tags = new List<string> { "error", "manual-review" }
                },
                ModelUsed = modelName
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing email classification response");
            return new EmailClassificationResponse
            {
                Classification = new EmailClassification
                {
                    Label = "Error",
                    Confidence = 0.0,
                    Explanation = "Error processing email classification",
                    Tone = "Neutral",
                    Priority = "Medium",
                    SuggestedAction = "Review manually",
                    Tags = new List<string> { "error", "manual-review" }
                },
                ModelUsed = modelName
            };
        }
    }
} 