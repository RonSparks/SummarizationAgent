namespace MeetingSummarizer.API.Models;

public class UserStoryRequest
{
    public string InputText { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string ProjectContext { get; set; } = string.Empty;
} 