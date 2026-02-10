# Docker Setup for Debtbox

This document explains how to run the Debtbox application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose (or Docker Compose V2) installed

## Quick Start

### Development Environment
```bash
# Start development server with hot reload
./deploy.sh dev

# Application will be available at: http://localhost:5173
```

### Production Environment
```bash
# Start production server with nginx
./deploy.sh prod

# Application will be available at: http://localhost
```

## Available Commands

The `deploy.sh` script provides several commands for managing your Docker environment:

```bash
# Development
./deploy.sh dev              # Start development environment (port 5173)

# Production
./deploy.sh prod             # Start production environment (port 80)
./deploy.sh ssl              # Start production with SSL (port 443)

# Management
./deploy.sh stop             # Stop all services
./deploy.sh restart          # Restart production services
./deploy.sh logs [env]       # Show logs (dev|prod|ssl)
./deploy.sh status           # Show container and image status
./deploy.sh cleanup          # Remove all containers, images, and volumes
./deploy.sh help             # Show help message
```

## Manual Docker Commands

If you prefer to use Docker commands directly:

### Development
```bash
docker compose --profile dev up -d --build
docker compose --profile dev logs -f
docker compose --profile dev down
```

### Production
```bash
docker compose --profile prod up -d --build
docker compose --profile prod logs -f
docker compose --profile prod down
```

### Build and Run Manually
```bash
# Build the image
docker build -t debtbox-app .

# Run development
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules debtbox-app

# Run production
docker run -p 80:80 debtbox-app
```

## File Structure

- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Docker Compose configuration with profiles
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files to exclude from Docker build context
- `deploy.sh` - Deployment script for easy management

## Docker Images

The build process creates two images:

1. **Development Image** (~494MB)
   - Based on Node.js 20 Alpine
   - Includes all dependencies and development tools
   - Supports hot reload with volume mounting

2. **Production Image** (~87MB)
   - Multi-stage build with nginx
   - Optimized for production deployment
   - Includes built assets and nginx configuration

## Environment Variables

You can set environment variables in the docker-compose.yml file:

```yaml
environment:
  - NODE_ENV=production
  - VITE_API_URL=https://api.debtbox.sa
```

## SSL Configuration (Optional)

To enable SSL in production:

1. Create an `ssl/` directory
2. Add your SSL certificates:
   - `ssl/cert.pem` - SSL certificate
   - `ssl/key.pem` - Private key
3. Run: `./deploy.sh ssl`

## Troubleshooting

### Container won't start
```bash
# Check logs
./deploy.sh logs prod

# Check container status
docker ps -a
```

### Build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache
```

### Port conflicts
If port 80 or 5173 is already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Use port 8080 instead of 80
```

### Permission issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Performance Tips

1. **Use .dockerignore** - Reduces build context size
2. **Multi-stage builds** - Smaller production images
3. **Layer caching** - Dependencies are cached separately
4. **Volume mounting** - Faster development with hot reload

## Security Considerations

- The production image runs as non-root user
- Security headers are configured in nginx
- SSL/TLS support for production deployments
- No sensitive data in Docker images

## Monitoring

Monitor your containers with:
```bash
# Resource usage
docker stats

# Container logs
./deploy.sh logs prod

# Container status
./deploy.sh status
```
