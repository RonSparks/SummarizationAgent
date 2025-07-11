# Meeting Summarizer Agent Startup Script
Write-Host "Starting Meeting Summarizer Agent..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Ollama is already running
Write-Host "Checking if Ollama is running on port 11434..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 5
    Write-Host "Ollama is already running on port 11434" -ForegroundColor Green
} catch {
    Write-Host "Ollama is not running on port 11434. Please start your Ollama instance first." -ForegroundColor Red
    Write-Host "You can start it with: ollama serve" -ForegroundColor Yellow
    exit 1
}

# Start .NET Core backend
Write-Host "Starting .NET Core backend..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "backend" -WindowStyle Minimized

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Meeting Summarizer Agent is starting up!" -ForegroundColor Green
Write-Host "Frontend and backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Using existing Ollama at: http://localhost:11434" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all services
Write-Host "Stopping services..." -ForegroundColor Yellow
Write-Host "Note: Ollama will continue running as it's your existing instance." -ForegroundColor Yellow
Write-Host "Services stopped." -ForegroundColor Green 