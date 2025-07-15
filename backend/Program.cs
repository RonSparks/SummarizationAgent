using MeetingSummarizer.API.Services;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add configuration from appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

// Read logDebug from configuration
bool logDebug = builder.Configuration.GetValue<bool>("logDebug");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(logDebug ? LogLevel.Debug : LogLevel.Warning);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add HTTP client for Ollama (generic service for all agents)
builder.Services.AddHttpClient<IOllamaClient, OllamaClient>(client =>
{
    // Use environment variable for Ollama URL, fallback to localhost for development
    var ollamaUrl = Environment.GetEnvironmentVariable("OLLAMA_URL") ?? "http://localhost:11434/";
    client.BaseAddress = new Uri(ollamaUrl);
    client.Timeout = TimeSpan.FromMinutes(10); // 10 minutes timeout for large models
});

// Register agent-specific services
builder.Services.AddScoped<ISummarizationService, SummarizationService>();
builder.Services.AddScoped<IUserStoryService, UserStoryService>();
builder.Services.AddScoped<IEmailClassifierService, EmailClassifierService>();

// Configure the application to listen on all network interfaces
// In Docker, only use HTTP to avoid SSL certificate issues
var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS");
if (string.IsNullOrEmpty(urls))
{
    // Default URLs for local development
    builder.WebHost.UseUrls("http://0.0.0.0:5000", "https://0.0.0.0:5001");
}
else
{
    // Use environment variable URLs (Docker will set this to HTTP only)
    builder.WebHost.UseUrls(urls);
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only use HTTPS redirection if we're not in Docker (where we only use HTTP)
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowAll");

// Serve static files from wwwroot
app.UseStaticFiles();

// Serve index.html for all non-API routes
app.MapFallbackToFile("index.html");

app.UseAuthorization();
app.MapControllers();

app.Run(); 