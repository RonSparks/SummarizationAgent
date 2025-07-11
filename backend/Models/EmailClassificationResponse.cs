using System.Text.Json.Serialization;

namespace MeetingSummarizer.API.Models;

public class EmailClassificationResponse
{
    [JsonPropertyName("classification")]
    public EmailClassification Classification { get; set; } = new();
    [JsonPropertyName("modelUsed")]
    public string ModelUsed { get; set; } = string.Empty;
    [JsonPropertyName("processedAt")]
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}

public class EmailClassification
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;
    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }
    [JsonPropertyName("explanation")]
    public string Explanation { get; set; } = string.Empty;
    [JsonPropertyName("tone")]
    public string Tone { get; set; } = string.Empty;
    [JsonPropertyName("priority")]
    public string Priority { get; set; } = string.Empty;
    [JsonPropertyName("suggestedAction")]
    public string SuggestedAction { get; set; } = string.Empty;
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();
} 