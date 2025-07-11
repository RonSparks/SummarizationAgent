using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public class OllamaClient : IOllamaClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OllamaClient> _logger;

    public OllamaClient(HttpClient httpClient, ILogger<OllamaClient> logger)
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

    public async Task<string> GenerateResponseAsync(string model, string prompt)
    {
        var ollamaRequest = new OllamaGenerateRequest
        {
            Model = model,
            Prompt = prompt,
            Stream = false
        };

        var json = JsonSerializer.Serialize(ollamaRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("api/generate", content);
        
        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"Ollama response: {responseContent}");
            
            try
            {
                var ollamaResponse = JsonSerializer.Deserialize<OllamaGenerateResponse>(responseContent);
                _logger.LogInformation($"Deserialized Ollama response. Response field length: {ollamaResponse?.Response?.Length ?? 0}");
                
                if (ollamaResponse?.Response != null)
                {
                    return ollamaResponse.Response;
                }
                else
                {
                    _logger.LogWarning("Ollama response is null or empty");
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to deserialize Ollama response");
                return string.Empty;
            }
        }

        throw new Exception($"Failed to generate response: {response.StatusCode}");
    }
} 