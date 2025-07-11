using System.Text.Json;
using System.Text.Json.Serialization;

namespace MeetingSummarizer.API.Models;

public class SummarizationResponse
{
    [JsonPropertyName("summary")]
    public string Summary { get; set; } = string.Empty;
    [JsonPropertyName("actionItems")]
    public List<ActionItem> ActionItems { get; set; } = new();
    [JsonPropertyName("decisions")]
    public List<Decision> Decisions { get; set; } = new();
    [JsonPropertyName("keyPoints")]
    public List<KeyPoint> KeyPoints { get; set; } = new();
    [JsonPropertyName("speakerSentiments")]
    public List<SpeakerSentiment> SpeakerSentiments { get; set; } = new();
    [JsonPropertyName("modelUsed")]
    public string ModelUsed { get; set; } = string.Empty;
    [JsonPropertyName("processedAt")]
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}

public class ActionItem
{
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("assignee")]
    public string Assignee { get; set; } = string.Empty;
    [JsonPropertyName("dueDate")]
    public string DueDate { get; set; } = string.Empty;
    [JsonPropertyName("priority")]
    public string Priority { get; set; } = "Medium";
}

public class Decision
{
    [JsonPropertyName("topic")]
    public string Topic { get; set; } = string.Empty;
    [JsonPropertyName("decision")]
    public string DecisionText { get; set; } = string.Empty;
    [JsonPropertyName("madeBy")]
    public string MadeBy { get; set; } = string.Empty;
}

[JsonConverter(typeof(KeyPointConverter))]
public class KeyPoint
{
    [JsonPropertyName("point")]
    public string Point { get; set; } = string.Empty;
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    [JsonPropertyName("madeBy")]
    public string? MadeBy { get; set; }
}

public class KeyPointConverter : JsonConverter<KeyPoint>
{
    public override KeyPoint Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            // Handle string values (when keyPoints is an array of strings)
            var stringValue = reader.GetString();
            return new KeyPoint { Point = stringValue ?? "", Category = "General" };
        }
        else if (reader.TokenType == JsonTokenType.StartObject)
        {
            // Handle object values (normal case)
            var jsonElement = JsonElement.ParseValue(ref reader);
            var point = jsonElement.TryGetProperty("point", out var pointElement) ? pointElement.GetString() ?? "" : "";
            var category = jsonElement.TryGetProperty("category", out var categoryElement) ? categoryElement.GetString() ?? "" : "";
            var description = jsonElement.TryGetProperty("description", out var descElement) ? descElement.GetString() : null;
            var madeBy = jsonElement.TryGetProperty("madeBy", out var madeByElement) ? madeByElement.GetString() : null;
            
            return new KeyPoint 
            { 
                Point = point, 
                Category = category, 
                Description = description, 
                MadeBy = madeBy 
            };
        }
        
        throw new JsonException($"Unexpected token type: {reader.TokenType}");
    }

    public override void Write(Utf8JsonWriter writer, KeyPoint value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();
        writer.WriteString("point", value.Point);
        writer.WriteString("category", value.Category);
        if (value.Description != null)
            writer.WriteString("description", value.Description);
        if (value.MadeBy != null)
            writer.WriteString("madeBy", value.MadeBy);
        writer.WriteEndObject();
    }
}

public class SpeakerSentiment
{
    [JsonPropertyName("speaker")]
    public string Speaker { get; set; } = string.Empty;
    [JsonPropertyName("sentiment")]
    public string Sentiment { get; set; } = string.Empty;
    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }
    [JsonPropertyName("notes")]
    public string Notes { get; set; } = string.Empty;
} 