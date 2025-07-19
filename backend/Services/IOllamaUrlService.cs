namespace MeetingSummarizer.API.Services;

public interface IOllamaUrlService
{
    string GetCurrentOllamaUrl();
    void SetOllamaUrl(string url);
    string GetDefaultOllamaUrl();
} 