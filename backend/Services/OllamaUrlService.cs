namespace MeetingSummarizer.API.Services;

public class OllamaUrlService : IOllamaUrlService
{
    private string _currentOllamaUrl;
    private readonly string _defaultOllamaUrl;

    public OllamaUrlService(IConfiguration configuration)
    {
        _defaultOllamaUrl = Environment.GetEnvironmentVariable("OLLAMA_URL") ?? "http://localhost:11434/";
        _currentOllamaUrl = _defaultOllamaUrl;
    }

    public string GetCurrentOllamaUrl()
    {
        return _currentOllamaUrl;
    }

    public void SetOllamaUrl(string url)
    {
        // Ensure the URL ends with a slash
        _currentOllamaUrl = url.EndsWith("/") ? url : url + "/";
    }

    public string GetDefaultOllamaUrl()
    {
        return _defaultOllamaUrl;
    }
} 