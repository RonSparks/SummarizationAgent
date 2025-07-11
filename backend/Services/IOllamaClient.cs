using System.Text.Json;

namespace MeetingSummarizer.API.Services;

public interface IOllamaClient
{
    Task<List<string>> GetAvailableModelsAsync();
    Task<string> GenerateResponseAsync(string model, string prompt);
} 