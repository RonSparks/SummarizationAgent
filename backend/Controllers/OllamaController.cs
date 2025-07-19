using Microsoft.AspNetCore.Mvc;
using MeetingSummarizer.API.Services;

namespace MeetingSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OllamaController : ControllerBase
{
    private readonly IOllamaUrlService _ollamaUrlService;
    private readonly ILogger<OllamaController> _logger;

    public OllamaController(IOllamaUrlService ollamaUrlService, ILogger<OllamaController> logger)
    {
        _ollamaUrlService = ollamaUrlService;
        _logger = logger;
    }

    [HttpGet("url")]
    public ActionResult<object> GetCurrentUrl()
    {
        return Ok(new
        {
            currentUrl = _ollamaUrlService.GetCurrentOllamaUrl(),
            defaultUrl = _ollamaUrlService.GetDefaultOllamaUrl()
        });
    }

    [HttpPost("url")]
    public ActionResult SetUrl([FromBody] SetOllamaUrlRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Url))
            {
                return BadRequest("URL cannot be empty");
            }

            // Validate URL format
            if (!Uri.TryCreate(request.Url, UriKind.Absolute, out _))
            {
                return BadRequest("Invalid URL format");
            }

            _ollamaUrlService.SetOllamaUrl(request.Url);
            _logger.LogInformation($"Ollama URL updated to: {request.Url}");
            
            return Ok(new { message = "Ollama URL updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting Ollama URL");
            return StatusCode(500, "Error updating Ollama URL");
        }
    }

    [HttpPost("url/reset")]
    public ActionResult ResetToDefault()
    {
        try
        {
            var defaultUrl = _ollamaUrlService.GetDefaultOllamaUrl();
            _ollamaUrlService.SetOllamaUrl(defaultUrl);
            _logger.LogInformation($"Ollama URL reset to default: {defaultUrl}");
            
            return Ok(new { message = "Ollama URL reset to default" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting Ollama URL");
            return StatusCode(500, "Error resetting Ollama URL");
        }
    }
}

public class SetOllamaUrlRequest
{
    public string Url { get; set; } = string.Empty;
} 