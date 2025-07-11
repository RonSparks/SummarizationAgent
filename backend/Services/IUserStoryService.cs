using MeetingSummarizer.API.Models;

namespace MeetingSummarizer.API.Services;

public interface IUserStoryService
{
    Task<List<string>> GetAvailableModelsAsync();
    Task<UserStoryResponse> CreateUserStoryAsync(UserStoryRequest request);
} 