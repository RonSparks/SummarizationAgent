using Microsoft.AspNetCore.Mvc;
using MeetingSummarizer.API.Models;
using MeetingSummarizer.API.Services;

namespace MeetingSummarizer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserStoryController : ControllerBase
{
    private readonly IUserStoryService _userStoryService;
    private readonly ILogger<UserStoryController> _logger;

    public UserStoryController(IUserStoryService userStoryService, ILogger<UserStoryController> logger)
    {
        _userStoryService = userStoryService;
        _logger = logger;
    }

    [HttpGet("models")]
    public async Task<ActionResult<List<string>>> GetAvailableModels()
    {
        _logger.LogInformation("GetAvailableModels endpoint called for User Story service");
        try
        {
            var models = await _userStoryService.GetAvailableModelsAsync();
            _logger.LogInformation($"Returning {models.Count} models: {string.Join(", ", models)}");
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available models for User Story service");
            return StatusCode(500, "Error retrieving available models");
        }
    }

    [HttpPost("create")]
    public async Task<ActionResult<UserStoryResponse>> CreateUserStory([FromBody] UserStoryRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.InputText))
            {
                return BadRequest("Input text cannot be empty");
            }

            if (string.IsNullOrWhiteSpace(request.ModelName))
            {
                return BadRequest("Model name is required");
            }

            var result = await _userStoryService.CreateUserStoryAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user story");
            return StatusCode(500, "Error processing user story creation request");
        }
    }
} 