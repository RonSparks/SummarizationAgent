namespace MeetingSummarizer.API.Models;

public class EmailClassificationRequest
{
    public string EmailBody { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public string EmailMetadata { get; set; } = string.Empty;
} 