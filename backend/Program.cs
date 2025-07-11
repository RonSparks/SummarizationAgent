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
    client.BaseAddress = new Uri("http://localhost:11434/");
    client.Timeout = TimeSpan.FromMinutes(10); // 10 minutes timeout for large models
});

// Register agent-specific services
builder.Services.AddScoped<ISummarizationService, SummarizationService>();
builder.Services.AddScoped<IUserStoryService, UserStoryService>();
builder.Services.AddScoped<IEmailClassifierService, EmailClassifierService>();

// Configure the application to listen on all network interfaces
builder.WebHost.UseUrls("http://0.0.0.0:5000", "https://0.0.0.0:5001");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Serve static files from wwwroot
app.UseStaticFiles();

// Serve index.html for all non-API routes
app.MapFallbackToFile("index.html");

app.UseAuthorization();
app.MapControllers();

app.Run(); 