using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public interface IOllamaService
{
    Task<List<string>> GetAvailableModelsAsync();
    Task<SummarizationResponse> SummarizeTranscriptAsync(SummarizationRequest request);
} 