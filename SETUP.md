# QuizFlash Generator - Setup Instructions

Quick reference guide for setting up and deploying QuizFlash Generator.

## 📦 Files Created

### Docker Configuration
- ✅ `backend/Dockerfile` - Backend containerization
- ✅ `quizapp/Dockerfile` - Frontend multi-stage build
- ✅ `quizapp/nginx.conf` - Nginx config for React app
- ✅ `docker-compose.yml` - Local development setup
- ✅ `backend/.dockerignore` - Exclude files from backend build
- ✅ `quizapp/.dockerignore` - Exclude files from frontend build

### CI/CD Configuration
- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow

### Deployment Configuration
- ✅ `deploy/docker-compose.production.yml` - Production setup
- ✅ `deploy/nginx.conf` - Reverse proxy configuration
- ✅ `deploy/setup-droplet.sh` - Automated droplet setup
- ✅ `deploy/.env.production.example` - Environment template

### Documentation
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `README.md` - Updated with deployment section

---

## 🚀 Next Steps

### 1. Test Locally (Optional)

```bash
# Make sure backend is not running locally
# Stop your current python app.py and npm start processes

# Build and run with Docker
docker-compose build
docker-compose up

# Test in browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

### 2. Set Up GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret | Value | How to Get |
|--------|-------|------------|
| `DOCKER_USERNAME` | your_dockerhub_username | Your Docker Hub username |
| `DOCKER_PASSWORD` | your_access_token | [Create Docker Hub token](https://hub.docker.com/settings/security) |
| `DROPLET_IP` | your.droplet.ip | Your DigitalOcean droplet IP |
| `DROPLET_USER` | root | Usually `root` for new droplets |
| `DROPLET_SSH_KEY` | full_private_key | Content of `~/.ssh/id_rsa` |

**Important for SSH Key:**
- Copy the ENTIRE private key including:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [key content]
  -----END OPENSSH PRIVATE KEY-----
  ```

### 3. Set Up DigitalOcean Droplet

**Option A: Manual Setup**

```bash
# SSH into your droplet
ssh root@your_droplet_ip

# Download and run setup script
curl -fsSL https://raw.githubusercontent.com/noumantechie/quiz_generator/main/deploy/setup-droplet.sh -o setup.sh
chmod +x setup.sh
./setup.sh

# Configure environment
cd /opt/quizflash
cp .env.example .env
nano .env

# Add your credentials:
# DOCKER_USERNAME=your_dockerhub_username
# GROQ_API_KEY=your_groq_api_key
```

**Option B: Use Script from Repo**

```bash
# On your droplet
scp deploy/setup-droplet.sh root@your_droplet_ip:~/
ssh root@your_droplet_ip
chmod +x setup-droplet.sh
./setup-droplet.sh
```

### 4. Deploy

**Automated (Recommended):**
```bash
git add .
git commit -m "Add CI/CD configuration"
git push origin main
```

GitHub Actions will:
1. Build Docker images
2. Push to Docker Hub  
3. Deploy to your droplet
4. Start the application

**Manual:**
```bash
# On your droplet
cd /opt/quizflash
docker login
docker-compose pull
docker-compose up -d
```

### 5. Verify Deployment

```bash
# Check if containers are running
ssh root@your_droplet_ip
docker-compose ps

# View logs
docker-compose logs -f

# Test the application
curl http://your_droplet_ip
```

Access your app at: `http://your_droplet_ip`

---

## 🔍 Verification Checklist

- [ ] Docker Hub account created
- [ ] DigitalOcean droplet created and accessible via SSH
- [ ] GitHub Secrets configured (all 5 secrets)
- [ ] Setup script run on droplet
- [ ] Environment variables configured on droplet
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow completed successfully
- [ ] Application accessible via droplet IP
- [ ] Can upload document and generate quiz

---

## 📊 Monitoring

**View Application Logs:**
```bash
ssh root@your_droplet_ip
cd /opt/quizflash
docker-compose logs -f
```

**Check Container Status:**
```bash
docker-compose ps
docker stats
```

**Restart Application:**
```bash
docker-compose restart
```

---

## 🎯 Quick Commands Reference

```bash
# Local Development
docker-compose up              # Start in foreground
docker-compose up -d           # Start in background
docker-compose down            # Stop and remove containers
docker-compose logs -f         # View logs

# Production (on Droplet)
cd /opt/quizflash              # Navigate to app directory
docker-compose pull            # Pull latest images
docker-compose up -d           # Start/update containers
docker-compose restart         # Restart all services
docker-compose logs -f         # View logs
docker image prune -f          # Clean up old images

# Maintenance
git push origin main           # Trigger deployment
ssh root@your_droplet_ip       # Access droplet
docker stats                   # Monitor resources
```

---

## 🆘 Need Help?

1. **Deployment failing?** → Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. **GitHub Actions error?** → Verify all secrets are correctly set
3. **Can't access app?** → Check firewall: `sudo ufw status`
4. **Container issues?** → View logs: `docker-compose logs -f`

---

## 🎉 Success!

Once deployed, your QuizFlash Generator will be:
- ✅ Running on DigitalOcean
- ✅ Automatically updated on every push to main
- ✅ Accessible via your droplet IP
- ✅ Production-ready with proper configuration

**Share your deployed app:**
```
http://your_droplet_ip
```

Consider adding:
- Custom domain
- SSL certificate (HTTPS)
- Monitoring and alerts
- Database for session persistence
- Load balancing for scale

See [DEPLOYMENT.md](DEPLOYMENT.md) for advanced configurations!
