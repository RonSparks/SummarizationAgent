using System.Text.Json.Serialization;

namespace MeetingSummarizer.API.Models;

public class UserStoryResponse
{
    [JsonPropertyName("userStory")]
    public UserStory UserStory { get; set; } = new();
    [JsonPropertyName("modelUsed")]
    public string ModelUsed { get; set; } = string.Empty;
    [JsonPropertyName("processedAt")]
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}

public class UserStory
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("story")]
    public string Story { get; set; } = string.Empty;
    [JsonPropertyName("persona")]
    public string Persona { get; set; } = string.Empty;
    [JsonPropertyName("want")]
    public string Want { get; set; } = string.Empty;
    [JsonPropertyName("soThat")]
    public string SoThat { get; set; } = string.Empty;
    [JsonPropertyName("acceptanceCriteria")]
    public List<string> AcceptanceCriteria { get; set; } = new();
    [JsonPropertyName("epic")]
    public string Epic { get; set; } = string.Empty;
    [JsonPropertyName("storyType")]
    public string StoryType { get; set; } = "Story";
    [JsonPropertyName("priority")]
    public string Priority { get; set; } = "Medium";
    [JsonPropertyName("storyPoints")]
    public int? StoryPoints { get; set; }
    [JsonPropertyName("labels")]
    public List<string> Labels { get; set; } = new();
} 