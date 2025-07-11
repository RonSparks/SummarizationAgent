using Microsoft.AspNetCore.Mvc;
using MeetingSummarizer.API.Models;
using MeetingSummarizer.API.Services;

namespace MeetingSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailClassifierController : ControllerBase
{
    private readonly IEmailClassifierService _emailClassifierService;
    private readonly ILogger<EmailClassifierController> _logger;

    public EmailClassifierController(IEmailClassifierService emailClassifierService, ILogger<EmailClassifierController> logger)
    {
        _emailClassifierService = emailClassifierService;
        _logger = logger;
    }

    [HttpGet("models")]
    public async Task<ActionResult<List<string>>> GetAvailableModels()
    {
        _logger.LogInformation("GetAvailableModels endpoint called for Email Classifier service");
        try
        {
            var models = await _emailClassifierService.GetAvailableModelsAsync();
            _logger.LogInformation($"Returning {models.Count} models: {string.Join(", ", models)}");
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models for Email Classifier service");
            return StatusCode(500, "Error retrieving available models");
        }
    }

    [HttpPost("classify")]
    public async Task<ActionResult<EmailClassificationResponse>> ClassifyEmail([FromBody] EmailClassificationRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.EmailBody))
            {
                return BadRequest("Email body cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(request.ModelName))
            {
                return BadRequest("Model name is required");
            }

            var result = await _emailClassifierService.ClassifyEmailAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error classifying email");
            return StatusCode(500, "Error processing email classification request");
        }
    }
} 