# 🚀 Fully Automated Deployment Guide

**Zero manual steps on your droplet!** Just configure GitHub Secrets and push to deploy.

---

## ✅ What You Need

Before deploying, add these **6 GitHub Secrets**:

Go to: **Your Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `DOCKER_USERNAME` | Your Docker Hub username | [Docker Hub](https://hub.docker.com/) |
| `DOCKER_PASSWORD` | Docker Hub access token | [Create token](https://hub.docker.com/settings/security) |
| `DROPLET_IP` | Your droplet IP address | DigitalOcean dashboard |
| `DROPLET_USER` | SSH user (usually `root`) | Default is `root` for fresh droplets |
| `DROPLET_SSH_KEY` | Your **private** SSH key | `cat ~/.ssh/id_rsa` (full content) |
| `GROQ_API_KEY` | Your Groq API key | [Groq Console](https://console.groq.com/) |

**Important Notes:**
- For `DROPLET_SSH_KEY`, copy the ENTIRE private key including:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [all the key content]
  -----END OPENSSH PRIVATE KEY-----
  ```
- For `DOCKER_PASSWORD`, use an **access token**, not your password

---

## 🎯 Deploy in 3 Steps

### Step 1: Create a Fresh DigitalOcean Droplet

1. **Create Droplet:**
   - Ubuntu 22.04 LTS
   - Basic plan: $12/month (2GB RAM minimum)
   - **Add your SSH key** during creation

2. **Get Droplet IP:**
   - Copy the IP address from DigitalOcean dashboard

3. **Test SSH access:**
   ```bash
   ssh root@your_droplet_ip
   ```
   If you can login, you're good! Exit with `exit`.

### Step 2: Add GitHub Secrets

Add all 6 secrets listed above to your GitHub repository.

### Step 3: Deploy!

```bash
# In your QuizFlash Generator directory
git add .
git commit -m "Deploy with automated setup"
git push origin main
```

**That's it!** 🎉

The GitHub Actions workflow will:
1. ✅ Build Docker images
2. ✅ Push to Docker Hub
3. ✅ SSH to your droplet
4. ✅ Install Docker (if needed)
5. ✅ Configure firewall
6. ✅ Create app directory
7. ✅ Generate docker-compose.yml with your secrets
8. ✅ Pull and start containers
9. ✅ Make your app live!

---

## 📊 Monitor Deployment

### Watch GitHub Actions

Go to:
```
https://github.com/noumantechie/quiz_generator/actions
```

You'll see the workflow running. Takes ~5-10 minutes.

### Watch Logs (Optional)

```bash
ssh root@your_droplet_ip
cd /opt/quizflash
docker-compose logs -f
```

---

## 🌐 Access Your App

Once deployment completes:
```
http://your_droplet_ip
```

Test the app:
1. Upload a document
2. Generate a quiz
3. See it working! ✨

---

## 🔄 Update Your App

Every time you push to `main`, the app automatically updates:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
```

No manual steps needed! The workflow handles everything.

---

## 🛠️ Useful Commands

### On Your Droplet

```bash
# SSH to droplet
ssh root@your_droplet_ip

# Navigate to app
cd /opt/quizflash

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart services
docker-compose restart

# Check resource usage
docker stats

# Stop everything
docker-compose down
```

---

## 🐛 Troubleshooting

### GitHub Actions Fails

**"Permission denied (publickey)"**
- Check `DROPLET_SSH_KEY` includes BEGIN/END markers
- Verify SSH key matches the one added to droplet

**"Docker command not found"**
- First deployment? It installs Docker automatically (takes longer)
- Check Actions logs for setup progress

**"GROQ_API_KEY missing"**
- Add `GROQ_API_KEY` to GitHub Secrets

### App Not Accessible

**Can't reach http://droplet_ip**
```bash
# Check firewall
ssh root@your_droplet_ip
sudo ufw status

# Should show ports 22, 80, 443 allowed
```

**Backend errors**
```bash
# Check logs
docker-compose logs backend

# Verify API key
docker-compose exec backend env | grep GROQ
```

---

## 🎉 Success Checklist

- [ ] All 6 GitHub Secrets added
- [ ] Fresh Ubuntu 22.04 droplet created
- [ ] SSH key added to droplet
- [ ] Can SSH to droplet manually
- [ ] Pushed code to GitHub
- [ ] GitHub Actions completed successfully
- [ ] App accessible at http://droplet_ip
- [ ] Can upload document and generate quiz

---

## 🚀 Next Steps (Optional)

### Add Custom Domain

1. Point domain A record to droplet IP
2. SSH to droplet and edit nginx config
3. Install SSL with Let's Encrypt

### Enable HTTPS

```bash
ssh root@your_droplet_ip
apt-get install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting!
