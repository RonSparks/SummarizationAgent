using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public interface IEmailClassifierService
{
    Task<List<string>> GetAvailableModelsAsync();
    Task<EmailClassificationResponse> ClassifyEmailAsync(EmailClassificationRequest request);
} 