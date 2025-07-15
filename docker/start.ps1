# AI Agent Hub - Docker Startup Script
# This script builds and starts all Docker services

Write-Host "Starting AI Agent Hub with Docker..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Navigate to docker directory
Set-Location $PSScriptRoot

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Build and start services
Write-Host "Building and starting services..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait a moment for services to start
Start-Sleep -Seconds 10

# Check service status
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

# Show logs
Write-Host "Recent logs:" -ForegroundColor Yellow
docker-compose logs --tail=20

Write-Host ""
Write-Host "AI Agent Hub is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5010" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5002" -ForegroundColor White
Write-Host "   Swagger UI: http://localhost:5002/swagger" -ForegroundColor White
Write-Host "   Ollama: http://localhost:11434" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop services: docker-compose down" -ForegroundColor White
Write-Host "   Restart: docker-compose restart" -ForegroundColor White
Write-Host ""
Write-Host "Services are starting up. Please wait a moment before accessing..." -ForegroundColor Yellow 