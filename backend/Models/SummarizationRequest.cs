namespace MeetingSummarizer.API.Models;

public class SummarizationRequest
{
    public string Transcript { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public bool IncludeSentimentAnalysis { get; set; } = true;
} 