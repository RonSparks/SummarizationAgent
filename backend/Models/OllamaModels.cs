using System.Text.Json.Serialization;

namespace MeetingSummarizer.API.Models;

public class OllamaGenerateRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;
    [JsonPropertyName("prompt")]
    public string Prompt { get; set; } = string.Empty;
    [JsonPropertyName("stream")]
    public bool Stream { get; set; } = false;
}

public class OllamaGenerateResponse
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;
    [JsonPropertyName("created_at")]
    public string CreatedAt { get; set; } = string.Empty;
    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;
    [JsonPropertyName("done")]
    public bool Done { get; set; }
    [JsonPropertyName("done_reason")]
    public string DoneReason { get; set; } = string.Empty;
    [JsonPropertyName("context")]
    public List<int> Context { get; set; } = new();
    [JsonPropertyName("total_duration")]
    public long TotalDuration { get; set; }
    [JsonPropertyName("load_duration")]
    public long LoadDuration { get; set; }
    [JsonPropertyName("prompt_eval_count")]
    public int PromptEvalCount { get; set; }
    [JsonPropertyName("prompt_eval_duration")]
    public long PromptEvalDuration { get; set; }
    [JsonPropertyName("eval_count")]
    public int EvalCount { get; set; }
    [JsonPropertyName("eval_duration")]
    public long EvalDuration { get; set; }
}

public class OllamaModelsResponse
{
    [JsonPropertyName("models")]
    public List<OllamaModel> Models { get; set; } = new();
}

public class OllamaModel
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("model")]
    public string Model { get; set; } = string.Empty;
} 