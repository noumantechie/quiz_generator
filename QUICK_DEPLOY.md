# 🚀 Quick Deployment (Skip GitHub Actions)

**Problem:** GitHub Actions builds are taking too long or failing?

**Solution:** Build directly on your droplet! Much faster and simpler.

---

## ⚡ Super Fast Deployment

### One-Time Setup (5 minutes)

1. **SSH to your droplet:**
   ```bash
   ssh root@your_droplet_ip
   ```

2. **Install Docker (if not already installed):**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

3. **Set up SSH key for GitHub (to pull code):**
   ```bash
   # Generate SSH key (press Enter for all prompts)
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Display public key
   cat ~/.ssh/id_ed25519.pub
   
   # Copy the output and add to GitHub:
   # https://github.com/settings/keys
   ```

4. **Clone your repo:**
   ```bash
   cd /opt
   git clone git@github.com:noumantechie/quiz_generator.git quizflash
   cd quizflash
   ```

5. **Create .env file:**
   ```bash
   nano .env
   ```
   
   Add:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
   
   Save: `Ctrl+O`, `Enter`, `Ctrl+X`

### Deploy (30 seconds!)

```bash
cd /opt/quizflash
git pull origin main
docker-compose build
docker-compose up -d
```

That's it! ✅

---

## 📋 docker-compose.yml

Create this in `/opt/quizflash/docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: quizflash-backend
    ports:
      - "5000:5000"
    env_file:
      - .env
    environment:
      - FLASK_ENV=production
      - PORT=5000
    volumes:
      - backend_uploads:/app/uploads
    restart: always

  frontend:
    build:
      context: ./quizapp
      dockerfile: Dockerfile
    container_name: quizflash-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  backend_uploads:
```

---

## 🔄 Update Your App

Every time you make changes:

```bash
# On your local machine
git add .
git commit -m "Update feature"
git push origin main

# On your droplet
ssh root@your_droplet_ip
cd /opt/quizflash
git pull origin main
docker-compose up -d --build
```

---

## ⚡ Why This is Faster

**GitHub Actions (slow):**
- Build on GitHub servers: 5-10 minutes ⏰
- Push to Docker Hub: 1 minute
- Pull to droplet: 30 seconds
- **Total: 6-12 minutes**

**Direct Build (fast):**
- Build on droplet: 3-5 minutes first time ⏱️
- Rebuild with cache: **30 seconds** 🚀
- **Total: 30 seconds for updates!**

---

## 🛠️ Useful Commands

```bash
# Update and restart
cd /opt/quizflash
git pull
docker-compose up -d --build

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Check status
docker-compose ps

# Clean up old images
docker image prune -f
```

---

## 🎯 When to Use Each Approach

**Use Direct Build (Recommended for Hackathons):**
- ✅ Fastest deployment
- ✅ Simple and direct
- ✅ No GitHub Actions issues
- ✅ Works every time

**Use GitHub Actions (Recommended for Production):**
- ✅ Automated on git push
- ✅ No manual steps
- ✅ Professional workflow
- ❌ Takes longer
- ❌ Requires proper setup

---

## 💡 Pro Tip

Create an alias for quick deploys:

```bash
# Add to ~/.bashrc
echo 'alias deploy="cd /opt/quizflash && git pull && docker-compose up -d --build"' >> ~/.bashrc
source ~/.bashrc

# Now just type:
deploy
```

---

**Your app will be live at: http://your_droplet_ip** 🎉
