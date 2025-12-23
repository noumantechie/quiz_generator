# QuizFlash Generator - Deployment Guide

Complete guide for deploying QuizFlash Generator to DigitalOcean using Docker and GitHub Actions.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ **Docker Hub Account** - [Sign up here](https://hub.docker.com/)
- ✅ **DigitalOcean Account** - [Sign up here](https://www.digitalocean.com/)
- ✅ **DigitalOcean Droplet** - Ubuntu 22.04 LTS (minimum 2GB RAM recommended)
- ✅ **Groq API Key** - [Get it here](https://console.groq.com/)
- ✅ **GitHub Repository** - Your QuizFlash Generator repo

---

## 🚀 Quick Start Deployment

### Step 1: Set Up DigitalOcean Droplet

1. **Create a Droplet:**
   - Go to DigitalOcean Dashboard
   - Create Droplet → Ubuntu 22.04 LTS
   - Choose plan: Basic ($12/month, 2GB RAM recommended)
   - Add your SSH key
   - Create Droplet

2. **SSH into your droplet:**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Run setup script:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/noumantechie/quiz_generator/main/deploy/setup-droplet.sh -o setup.sh
   chmod +x setup.sh
   ./setup.sh
   ```

4. **Configure environment:**
   ```bash
   cd /opt/quizflash
   cp .env.example .env
   nano .env
   ```
   
   Update with your credentials:
   ```env
   DOCKER_USERNAME=your_dockerhub_username
   GROQ_API_KEY=your_groq_api_key
   ```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKER_USERNAME` | your_dockerhub_username | Your Docker Hub username |
| `DOCKER_PASSWORD` | your_dockerhub_token | Docker Hub access token ([create here](https://hub.docker.com/settings/security)) |
| `DROPLET_IP` | your_droplet_ip | Your DigitalOcean droplet IP address |
| `DROPLET_USER` | root | SSH user (usually `root` or `ubuntu`) |
| `DROPLET_SSH_KEY` | your_private_key | Full content of your SSH private key |

**Getting your SSH private key:**
```bash
# On Windows (Git Bash)
cat ~/.ssh/id_rsa

# On Mac/Linux
cat ~/.ssh/id_rsa
```

### Step 3: Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Build Docker images
   - Push to Docker Hub
   - Deploy to your droplet
   - Start the application

3. **Access your app:**
   ```
   http://your_droplet_ip
   ```

---

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

### On Your Droplet:

```bash
# 1. Pull the latest images
docker pull your_username/quizflash-backend:latest
docker pull your_username/quizflash-frontend:latest

# 2. Navigate to app directory
cd /opt/quizflash

# 3. Start services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

---

## 📊 Monitoring & Management

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Status
```bash
docker-compose ps
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

### Clean Up Old Images
```bash
docker image prune -f
```

---

## 🔐 Security Best Practices

### 1. Use Environment Variables
Never hardcode API keys in your code. Always use environment variables.

### 2. Configure Firewall
```bash
sudo ufw status
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS (if using SSL)
sudo ufw enable
```

### 3. Set Up SSL/HTTPS (Recommended)

Using Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is already configured by Certbot
```

### 4. Regular Updates
```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Update Docker images
docker-compose pull && docker-compose up -d
```

### 5. Backup Data
```bash
# Backup uploads volume
docker run --rm -v quizflash_backend_uploads:/data -v $(pwd):/backup ubuntu tar czf /backup/uploads-backup.tar.gz /data
```

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check logs:**
```bash
docker-compose logs backend
```

**Common issues:**
- Missing `GROQ_API_KEY` - Check `.env` file
- Port 5000 already in use - Stop conflicting services
- Out of memory - Upgrade droplet to 2GB+ RAM

### Frontend Not Accessible

**Check logs:**
```bash
docker-compose logs frontend
```

**Common issues:**
- Backend not running - Start backend first
- Port 80 blocked - Check firewall settings
- Image build failed - Check Docker Hub for successful push

### GitHub Actions Failing

**Common issues:**
- Missing secrets - Verify all GitHub secrets are set
- SSH connection failed - Check `DROPLET_SSH_KEY` format (must include `-----BEGIN` and `-----END` lines)
- Docker Hub authentication - Verify `DOCKER_PASSWORD` is an access token, not your password

### Connection Timeout on Upload

**Increase nginx timeout:**
Edit `/opt/quizflash/deploy/nginx.conf`:
```nginx
proxy_connect_timeout 900;
proxy_send_timeout 900;
proxy_read_timeout 900;
```

Then restart:
```bash
docker-compose restart
```

---

## 🌐 Custom Domain Setup

1. **Point your domain to droplet IP:**
   - Add an A record: `@ → your_droplet_ip`
   - Add a CNAME record: `www → @`

2. **Update nginx configuration:**
   ```bash
   nano /opt/quizflash/deploy/nginx.conf
   ```
   
   Change `server_name _;` to `server_name yourdomain.com www.yourdomain.com;`

3. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

4. **Restart services:**
   ```bash
   docker-compose restart
   ```

---

## 📈 Performance Optimization

### 1. Enable Docker BuildKit
Add to GitHub Actions workflow:
```yaml
env:
  DOCKER_BUILDKIT: 1
```

### 2. Use Docker Layer Caching
Already configured in Dockerfiles with proper layer ordering.

### 3. Optimize Images
- Backend: Uses `python:3.11-slim` (smaller than full Python image)
- Frontend: Multi-stage build (build + nginx alpine)

### 4. Monitor Resource Usage
```bash
docker stats
```

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure GitHub secrets are correctly set
4. Check firewall rules: `sudo ufw status`
5. Verify Docker is running: `docker ps`

---

## 🎯 Quick Reference Commands

```bash
# Deployment
git push origin main                    # Trigger auto-deployment

# On Droplet
cd /opt/quizflash                      # Navigate to app
docker-compose up -d                   # Start services
docker-compose down                    # Stop services
docker-compose restart                 # Restart services
docker-compose logs -f                 # View logs
docker-compose pull                    # Pull latest images
docker image prune -f                  # Clean up old images
docker stats                           # Monitor resources

# Maintenance
sudo apt-get update                    # Update system
docker system prune -a                 # Clean Docker completely
sudo systemctl restart docker          # Restart Docker daemon
```

---

**🎉 Your QuizFlash Generator is now live and accessible to the world!**
