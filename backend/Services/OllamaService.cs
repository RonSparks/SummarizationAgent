using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public class OllamaService : IOllamaService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OllamaService> _logger;

    public OllamaService(HttpClient httpClient, ILogger<OllamaService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<List<string>> GetAvailableModelsAsync()
    {
        try
        {
            _logger.LogInformation("Fetching models from Ollama...");
            var response = await _httpClient.GetAsync("api/tags");
            _logger.LogInformation($"Ollama response status: {response.StatusCode}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Ollama response content: {content}");
                
                var modelsResponse = JsonSerializer.Deserialize<OllamaModelsResponse>(content);
                _logger.LogInformation($"Deserialized response: Models count = {modelsResponse?.Models?.Count ?? 0}");
                
                if (modelsResponse?.Models != null)
                {
                    foreach (var model in modelsResponse.Models)
                    {
                        _logger.LogInformation($"Model - Name: '{model.Name}', Model: '{model.Model}'");
                    }
                }
                
                var models = modelsResponse?.Models?.Select(m => !string.IsNullOrEmpty(m.Name) ? m.Name : m.Model).ToList() ?? new List<string>();
                _logger.LogInformation($"Parsed models: {string.Join(", ", models)}");
                return models;
            }
            else
            {
                _logger.LogError($"Ollama returned status code: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models from Ollama");
        }
        
        return new List<string>();
    }

    public async Task<SummarizationResponse> SummarizeTranscriptAsync(SummarizationRequest request)
    {
        var prompt = GenerateSummarizationPrompt(request.Transcript, request.IncludeSentimentAnalysis);
        
        var ollamaRequest = new OllamaGenerateRequest
        {
            Model = request.ModelName,
            Prompt = prompt,
            Stream = false
        };

        var json = JsonSerializer.Serialize(ollamaRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("api/generate", content);
        
        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"Ollama summarization response: {responseContent}");
            
            try
            {
                var ollamaResponse = JsonSerializer.Deserialize<OllamaGenerateResponse>(responseContent);
                _logger.LogInformation($"Deserialized Ollama response. Response field length: {ollamaResponse?.Response?.Length ?? 0}");
                
                if (ollamaResponse?.Response != null)
                {
                    return ParseSummarizationResponse(ollamaResponse.Response, request.ModelName);
                }
                else
                {
                    _logger.LogWarning("Ollama response is null or empty");
                    return new SummarizationResponse
                    {
                        Summary = "Failed to get response from Ollama",
                        ModelUsed = request.ModelName,
                        ActionItems = new List<ActionItem>(),
                        Decisions = new List<Decision>(),
                        KeyPoints = new List<KeyPoint>(),
                        SpeakerSentiments = new List<SpeakerSentiment>()
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize Ollama response");
                return new SummarizationResponse
                {
                    Summary = $"Failed to parse Ollama response: {ex.Message}",
                    ModelUsed = request.ModelName,
                    ActionItems = new List<ActionItem>(),
                    Decisions = new List<Decision>(),
                    KeyPoints = new List<KeyPoint>(),
                    SpeakerSentiments = new List<SpeakerSentiment>()
                };
            }
        }

        throw new Exception($"Failed to generate summary: {response.StatusCode}");
    }

    private string GenerateSummarizationPrompt(string transcript, bool includeSentiment)
    {
        var basePrompt = @"
Please analyze the following meeting transcript and provide a structured summary in JSON format.

Transcript:
" + transcript + @"

IMPORTANT: Respond ONLY with valid JSON. Do not include any thinking text, explanations, or markdown formatting. Start your response directly with { and end with }.

Please provide a JSON response with the following EXACT structure (do not modify the field names or structure):
{
  ""summary"": ""A concise summary of the meeting"",
  ""actionItems"": [
    {
      ""description"": ""Action item description"",
      ""assignee"": ""Person responsible"",
      ""dueDate"": null,
      ""priority"": ""High/Medium/Low""
    }
  ],
  ""decisions"": [
    {
      ""topic"": ""Topic discussed"",
      ""decision"": ""Decision made"",
      ""madeBy"": ""Person who made the decision""
    }
  ],
  ""keyPoints"": [
    {
      ""point"": ""Key point description"",
      ""category"": ""Category of the point""
    }
  ]";

        if (includeSentiment)
        {
            basePrompt += @",
  ""speakerSentiments"": [
    {
      ""speaker"": ""Speaker name"",
      ""sentiment"": ""Positive/Negative/Neutral"",
      ""confidence"": 0.85,
      ""notes"": ""Brief notes about the sentiment""
    }
  ]";
        }

        basePrompt += @"
}

CRITICAL: Your response must be ONLY valid JSON. No thinking text, no explanations, no markdown formatting. Just the JSON object.";

        return basePrompt;
    }

    private SummarizationResponse ParseSummarizationResponse(string response, string modelName)
    {
        _logger.LogInformation($"Parsing response length: {response.Length}");
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
                        var parsedResponse = JsonSerializer.Deserialize<SummarizationResponse>(jsonContent);
                        if (parsedResponse != null)
                        {
                            _logger.LogInformation($"Successfully parsed response with summary length: {parsedResponse.Summary?.Length ?? 0}");
                            parsedResponse.ModelUsed = modelName;
                            return parsedResponse;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"Failed to parse JSON from code block: {ex.Message}");
                    }
                }
            }
            
            // Try to find raw JSON in the response - look for the largest JSON object
            var jsonCandidates = new List<(int start, int end, string content)>();
            
            // Look for JSON objects in the response
            for (int i = 0; i < response.Length; i++)
            {
                if (response[i] == '{')
                {
                    var braceCount = 0;
                    var jsonEnd = -1;
                    
                    for (int j = i; j < response.Length; j++)
                    {
                        if (response[j] == '{') braceCount++;
                        else if (response[j] == '}') braceCount--;
                        
                        if (braceCount == 0)
                        {
                            jsonEnd = j + 1;
                            break;
                        }
                    }
                    
                    if (jsonEnd > i)
                    {
                        var jsonContent = response.Substring(i, jsonEnd - i);
                        jsonCandidates.Add((i, jsonEnd, jsonContent));
                        _logger.LogInformation($"Found JSON candidate at position {i}: {jsonContent.Substring(0, Math.Min(100, jsonContent.Length))}...");
                    }
                }
            }
            
            _logger.LogInformation($"Found {jsonCandidates.Count} JSON candidates");
            
            // Sort by length (largest first) and try to parse each candidate
            var sortedCandidates = jsonCandidates.OrderByDescending(x => x.content.Length);
            
            foreach (var candidate in sortedCandidates)
            {
                _logger.LogInformation($"Trying JSON candidate with length {candidate.content.Length}");
                
                try
                {
                    var parsedResponse = JsonSerializer.Deserialize<SummarizationResponse>(candidate.content);
                    if (parsedResponse != null && !string.IsNullOrEmpty(parsedResponse.Summary))
                    {
                        _logger.LogInformation($"Successfully parsed response with summary length: {parsedResponse.Summary.Length}");
                        parsedResponse.ModelUsed = modelName;
                        return parsedResponse;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Failed to parse JSON candidate: {ex.Message}");
                }
            }
            
            _logger.LogWarning($"No valid JSON found in response. Found {jsonCandidates.Count} candidates.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error parsing summarization response");
        }

        // Fallback: return a basic response with the raw text as summary
        return new SummarizationResponse
        {
            Summary = response,
            ModelUsed = modelName,
            ActionItems = new List<ActionItem>(),
            Decisions = new List<Decision>(),
            KeyPoints = new List<KeyPoint>(),
            SpeakerSentiments = new List<SpeakerSentiment>()
        };
    }
} 