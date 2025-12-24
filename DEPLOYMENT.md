# Deployment Guide

## 📋 Quick Reference for DevOps

**TL;DR - Production Deployment with SSL:**

```bash
# 1. Clone and setup
git clone <repo-url>
cd debtbox
chmod +x deploy.sh

# 2. Get SSL certificates (Let's Encrypt)
sudo certbot certonly --standalone -d debtbox.sa
mkdir -p ssl
sudo cp /etc/letsencrypt/live/debtbox.sa/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/debtbox.sa/privkey.pem ssl/key.pem
sudo chmod 644 ssl/cert.pem && sudo chmod 600 ssl/key.pem

# 3. Deploy with SSL
./deploy.sh ssl

# 4. Verify
curl -I https://debtbox.sa
```

**Key Points:**
- ✅ Build tool: `pnpm run build` (requires Node.js 20+ and pnpm)
- ✅ Output: `dist/` directory
- ✅ Server: Nginx in Docker container
- ✅ Domain: `debtbox.sa` (update DNS A record)
- ✅ SSL: Use `nginx-ssl.conf` (auto-mounted with SSL profile)
- ✅ API: `https://api.debtbox.sa/v0.0.1/api` (set `VITE_API_BASE_URL` at build time)
- ✅ WebSocket: `wss://api.debtbox.sa/debts`
- ⚠️ Environment variables must be set at **build time** (not runtime)

---

## 🚀 Production Deployment Guide for DevOps

This section provides essential information for deploying the Debtbox frontend to production with SSL and domain configuration.

### Project Overview
- **Type**: React + Vite Single Page Application (SPA)
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Production Server**: Nginx (Alpine-based Docker container)
- **Target Domain**: `https://debtbox.sa`
- **Build Output**: `dist/` directory

### Critical Production Requirements

#### 1. **Build Process**
```bash
# Install dependencies (requires pnpm)
pnpm install --frozen-lockfile

# Build for production
pnpm run build
# This runs: tsc -b && vite build
# Output: dist/ directory with optimized production assets
```

**Important Notes:**
- The build process requires **Node.js 20+** and **pnpm**
- Build output goes to `dist/` directory
- The application is a SPA, so all routes must be handled by `index.html` (configured in nginx)

#### 2. **Environment Variables**
The application uses the following environment variable:
- `VITE_API_BASE_URL` - API endpoint (defaults to `https://api.debtbox.sa/v0.0.1/api` if not set)

**To set during Docker build:**
```bash
# Option 1: Set in docker-compose.yml
environment:
  - VITE_API_BASE_URL=https://api.debtbox.sa/v0.0.1/api

# Option 2: Build with --build-arg
docker build --build-arg VITE_API_BASE_URL=https://api.debtbox.sa/v0.0.1/api -t debtbox-app .
```

**⚠️ Important**: Vite environment variables must be set at **build time**, not runtime. They are embedded in the JavaScript bundle during the build process.

#### 3. **API and WebSocket Endpoints**
The frontend connects to:
- **REST API**: `https://api.debtbox.sa/v0.0.1/api` (configurable via `VITE_API_BASE_URL`)
- **WebSocket**: `wss://api.debtbox.sa/debts` (hardcoded in socket.ts)

**Ensure these endpoints are:**
- Accessible from the production domain
- CORS configured to allow requests from `https://debtbox.sa`
- SSL certificates valid and trusted

#### 4. **Docker Production Deployment with SSL**

**Prerequisites:**
- Docker and Docker Compose installed
- Domain `debtbox.sa` DNS pointing to server IP
- SSL certificates (Let's Encrypt recommended)

**Step-by-Step SSL Setup:**

1. **Obtain SSL Certificates** (Let's Encrypt with Certbot):
```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Obtain certificates
sudo certbot certonly --standalone -d debtbox.sa

# Certificates will be in:
# /etc/letsencrypt/live/debtbox.sa/fullchain.pem
# /etc/letsencrypt/live/debtbox.sa/privkey.pem
```

2. **Prepare SSL Directory:**
```bash
# Create ssl directory in project root
mkdir -p ssl

# Copy certificates (adjust paths as needed)
sudo cp /etc/letsencrypt/live/debtbox.sa/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/debtbox.sa/privkey.pem ssl/key.pem

# Set proper permissions
sudo chmod 644 ssl/cert.pem
sudo chmod 600 ssl/key.pem
sudo chown $USER:$USER ssl/*
```

3. **SSL Nginx Configuration:**
The project includes `nginx-ssl.conf` which is automatically used when deploying with the SSL profile. This file includes:
- HTTP to HTTPS redirect (port 80 → 443)
- Full SSL/TLS configuration with modern ciphers
- Security headers including HSTS
- React Router support (`try_files` directive)
- Gzip compression and static asset caching

**The SSL config is automatically mounted** when using `docker-compose --profile ssl`, so no manual configuration needed.

4. **Deploy with SSL:**
```bash
# Using the deployment script
./deploy.sh ssl

# Or manually
docker-compose --profile ssl up -d --build
```

#### 5. **Nginx Configuration Details**

**Current Configuration (`nginx.conf`):**
- Listens on port 80 (HTTP only)
- Serves static files from `/usr/share/nginx/html`
- **Critical**: `try_files $uri $uri/ /index.html;` - This handles React Router client-side routing
- Gzip compression enabled
- Static asset caching (1 year)
- Security headers configured

**For Production with SSL, you need:**
- Port 443 (HTTPS) configuration
- HTTP to HTTPS redirect
- SSL certificate paths: `/etc/nginx/ssl/cert.pem` and `/etc/nginx/ssl/key.pem`
- Updated `server_name` to `debtbox.sa` (currently set to `localhost`)

#### 6. **Domain Configuration**

**DNS Requirements:**
- A record: `debtbox.sa` → Server IP address
- Or CNAME: `debtbox.sa` → Your server hostname

**After DNS is configured:**
- Wait for DNS propagation (can take up to 48 hours, usually much faster)
- Verify with: `dig debtbox.sa` or `nslookup debtbox.sa`

#### 7. **Docker Compose Production Profile**

The project uses Docker Compose profiles:
- `dev`: Development environment (port 5173)
- `prod`: Production HTTP only (port 80)
- `ssl`: Production with SSL (ports 80 and 443)

**Production deployment command:**
```bash
docker-compose --profile ssl up -d --build
```

#### 8. **Port Configuration**

**Default Ports:**
- HTTP: 80
- HTTPS: 443

**If ports are already in use, modify `docker-compose.yml`:**
```yaml
ports:
  - "8080:80"   # HTTP on custom port
  - "8443:443"  # HTTPS on custom port
```

**⚠️ Important**: If using custom ports, you'll need to configure your reverse proxy (if any) or update firewall rules.

#### 9. **Firewall Configuration**

Ensure these ports are open:
```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Or iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

#### 10. **SSL Certificate Renewal (Let's Encrypt)**

Let's Encrypt certificates expire every 90 days. Set up auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab (runs twice daily)
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet --deploy-hook "docker-compose --profile ssl restart debtbox-prod-ssl"
```

**After renewal, restart the container:**
```bash
./deploy.sh restart
# Or
docker-compose --profile ssl restart debtbox-prod-ssl
```

#### 11. **Health Checks and Monitoring**

**Check if container is running:**
```bash
docker ps | grep debtbox
./deploy.sh status
```

**View logs:**
```bash
./deploy.sh logs ssl
# Or
docker-compose --profile ssl logs -f
```

**Test the application:**
```bash
# HTTP (should redirect to HTTPS)
curl -I http://debtbox.sa

# HTTPS
curl -I https://debtbox.sa
```

#### 12. **Troubleshooting Production Issues**

**Container won't start:**
```bash
# Check logs
docker-compose --profile ssl logs debtbox-prod-ssl

# Check if ports are in use
sudo netstat -tulpn | grep -E ':(80|443)'
```

**SSL certificate errors:**
- Verify certificate files exist and are readable
- Check certificate expiration: `openssl x509 -in ssl/cert.pem -noout -dates`
- Ensure nginx can read the certificate files

**Routes not working (404 errors):**
- Verify `try_files $uri $uri/ /index.html;` is in nginx config
- Check that React Router is properly configured
- Ensure base path is `/` in `vite.config.ts`

**API connection issues:**
- Verify `VITE_API_BASE_URL` was set during build
- Check CORS configuration on API server
- Test API endpoint: `curl https://api.debtbox.sa/v0.0.1/api/health`

**Build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose --profile ssl build --no-cache
```

#### 13. **Security Considerations**

- ✅ Security headers configured in nginx (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ SSL/TLS encryption required for production
- ✅ Nginx version hidden (`server_tokens off`)
- ⚠️ Ensure SSL certificates are kept secure (600 permissions on private key)
- ⚠️ Regularly update Docker images and dependencies
- ⚠️ Set up firewall rules to restrict access

#### 14. **Performance Optimization**

Already configured:
- Gzip compression for text assets
- Long-term caching for static assets (1 year)
- Multi-stage Docker build (smaller production image ~87MB)

Additional recommendations:
- Enable HTTP/2 (already in SSL config with `http2`)
- Consider CDN for static assets
- Monitor server resources: `docker stats`

---

## Overview
This project supports multiple deployment methods:

1. **GitHub Pages**: Static hosting for simple deployments
2. **Docker**: Containerized deployment for servers and cloud platforms
3. **Custom Domain Configuration**: Configured for `https://debtbox.sa`
4. **Build Output**: Configured to output to `dist/` directory
5. **Router Configuration**: React Router configured with proper base path

## Deployment Options

### Option 1: Docker Deployment (Recommended for Servers)

This method is ideal for deploying to your own server, VPS, or cloud platforms like AWS, DigitalOcean, etc.

#### Prerequisites
- Docker and Docker Compose installed on your server
- Domain name pointing to your server (optional)

#### Quick Start (Automated)
```bash
# Clone your repository on the server
git clone https://github.com/your-username/debtbox.git
cd debtbox

# Make the deployment script executable and run it
chmod +x deploy.sh
./deploy.sh
```

#### Quick Start (Manual)
```bash
# Clone your repository on the server
git clone https://github.com/your-username/debtbox.git
cd debtbox

# Build and start the application
docker-compose up -d

# Check if the container is running
docker-compose ps
```

#### Manual Docker Build
```bash
# Build the Docker image
docker build -t debtbox-app .

# Run the container
docker run -d -p 80:80 --name debtbox-frontend debtbox-app
```

#### Production Deployment with SSL (Optional)
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Uncomment SSL-related lines in `docker-compose.yml`
3. Mount your SSL certificates:
   ```bash
   # Create ssl directory and copy certificates
   mkdir ssl
   cp your-cert.pem ssl/
   cp your-key.pem ssl/
   
   # Update docker-compose.yml to mount SSL certificates
   # Then restart the container
   docker-compose down && docker-compose up -d
   ```

#### Deployment Script Commands
The project includes a convenient deployment script (`deploy.sh`) that automates the deployment process:

```bash
# Deploy/update the application
./deploy.sh

# Stop the application
./deploy.sh stop

# Restart the application
./deploy.sh restart

# View application logs
./deploy.sh logs

# Check container status
./deploy.sh status

# Show help
./deploy.sh help
```

#### Manual Docker Commands Reference
```bash
# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# Update the application
git pull
docker-compose down
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

#### Server Requirements
- **Minimum**: 1GB RAM, 1 CPU core, 10GB storage
- **Recommended**: 2GB RAM, 2 CPU cores, 20GB storage
- **OS**: Ubuntu 20.04+ (recommended), CentOS 8+, or any Linux distribution with Docker support

#### Installing Docker on Ubuntu
```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, for running without sudo)
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

#### Troubleshooting Docker Deployment

**Container won't start:**
```bash
# Check container logs
docker-compose logs debtbox-app

# Check if port 80 is already in use
sudo netstat -tulpn | grep :80
```

**Build fails:**
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

**Permission issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**SSL Certificate issues:**
- Ensure certificates are in PEM format
- Check certificate file permissions (should be readable by nginx user)
- Verify certificate chain is complete

### Option 2: GitHub Pages Deployment

## Deployment Steps

### Option 1: Manual Deployment
1. Build the project:
   ```bash
   pnpm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   pnpm run deploy
   ```

### Option 2: Automatic Deployment (Recommended)
1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Check the Actions tab in your repository for deployment status

## Important Notes

### Custom Domain
- **Development**: Uses `/` as base path
- **Production**: Uses `/` as base path (served from custom domain `debtbox.sa`)

### Router Configuration
- React Router is configured with the correct base path for GitHub Pages
- All routes will work correctly in both development and production

### Build Output
- Files are built to the `dist/` directory
- GitHub Pages serves from this directory via the `gh-pages` branch

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs in the Actions tab
2. Ensure your repository has GitHub Pages enabled
3. Verify your custom domain `debtbox.sa` is properly configured in DNS
4. Check that the `gh-pages` branch was created

### If the site loads but routes don't work:
1. Ensure you're using `Link` components from React Router
2. Check that the base path is correctly set in `vite.config.ts`
3. Verify the router basename in `App.tsx`

## Repository Settings

Make sure GitHub Pages is configured in your repository:
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `/(root)`
4. Custom domain: Enter `debtbox.sa`
5. Check "Enforce HTTPS" if available
6. Save the configuration

## Local Testing

To test the production build locally:
```bash
pnpm run build
pnpm run preview
```

This will serve the built files locally to verify everything works before deployment.
