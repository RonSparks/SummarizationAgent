using Microsoft.AspNetCore.Mvc;
using MeetingSummarizer.API.Models;
using MeetingSummarizer.API.Services;

namespace MeetingSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SummarizationController : ControllerBase
{
    private readonly IOllamaService _ollamaService;
    private readonly ILogger<SummarizationController> _logger;

    public SummarizationController(IOllamaService ollamaService, ILogger<SummarizationController> logger)
    {
        _ollamaService = ollamaService;
        _logger = logger;
    }

    [HttpGet("models")]
    public async Task<ActionResult<List<string>>> GetAvailableModels()
    {
        _logger.LogInformation("GetAvailableModels endpoint called");
        try
        {
            var models = await _ollamaService.GetAvailableModelsAsync();
            _logger.LogInformation($"Returning {models.Count} models: {string.Join(", ", models)}");
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models");
            return StatusCode(500, "Error retrieving available models");
        }
    }

    [HttpPost("summarize")]
    public async Task<ActionResult<SummarizationResponse>> SummarizeTranscript([FromBody] SummarizationRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Transcript))
            {
                return BadRequest("Transcript cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(request.ModelName))
            {
                return BadRequest("Model name is required");
            }

            var result = await _ollamaService.SummarizeTranscriptAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error summarizing transcript");
            return StatusCode(500, "Error processing summarization request");
        }
    }
} 