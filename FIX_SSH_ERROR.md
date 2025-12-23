# Fix SSH Authentication Error - GitHub Actions

## The Problem
```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

This means your `DROPLET_SSH_KEY` GitHub secret is not configured correctly.

## Solution: Set Up SSH Key Properly

### Step 1: Generate SSH Key (if you don't have one)

On your local machine or directly on GitHub:

```bash
ssh-keygen -t ed25519 -C "github-actions@quizflash" -f ~/.ssh/quizflash_deploy
```

This creates two files:
- `~/.ssh/quizflash_deploy` (private key) - for GitHub secret
- `~/.ssh/quizflash_deploy.pub` (public key) - for DigitalOcean droplet

### Step 2: Add Public Key to DigitalOcean Droplet

SSH into your droplet and add the public key:

```bash
# On your local machine, copy the public key
cat ~/.ssh/quizflash_deploy.pub

# SSH to your droplet
ssh root@YOUR_DROPLET_IP

# Add the public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**OR** use DigitalOcean's web interface:
1. Go to DigitalOcean → Droplet Settings → Access
2. Add your SSH public key there

### Step 3: Add Private Key to GitHub Secrets

1. **Get the full private key** (including headers):
   ```bash
   cat ~/.ssh/quizflash_deploy
   ```

2. **Copy the ENTIRE output**, which should look like:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz
   c2gtZWQyNTUxOQAAACBj...
   ...multiple lines...
   ...of encoded key data...
   -----END OPENSSH PRIVATE KEY-----
   ```

3. **Add to GitHub Secrets**:
   - Go to: https://github.com/noumantechie/quiz_generator/settings/secrets/actions
   - Click "New repository secret"
   - Name: `DROPLET_SSH_KEY`
   - Value: Paste the ENTIRE private key (including `-----BEGIN` and `-----END` lines)
   - Click "Add secret"

### Step 4: Verify Other Secrets

Make sure you have all required secrets:

Go to: https://github.com/noumantechie/quiz_generator/settings/secrets/actions

You should have:
- ✅ `DOCKER_USERNAME` - Your Docker Hub username
- ✅ `DOCKER_PASSWORD` - Your Docker Hub password/token
- ✅ `DROPLET_IP` - Your DigitalOcean droplet IP address
- ✅ `DROPLET_USER` - Usually `root` or your droplet username
- ✅ `DROPLET_SSH_KEY` - Your SSH private key (full content)
- ✅ `GROQ_API_KEY` - Your Groq API key

### Step 5: Test SSH Connection Manually

Before running the workflow again, test the SSH connection:

```bash
ssh -i ~/.ssh/quizflash_deploy root@YOUR_DROPLET_IP
```

If this works, the GitHub Actions SSH should work too.

### Step 6: Re-run GitHub Actions

After setting up the SSH key correctly:
1. Go to: https://github.com/noumantechie/quiz_generator/actions
2. Click on the failed workflow
3. Click "Re-run all jobs"

---

## Common Issues

### Issue 1: Private key format is wrong
**Solution**: Make sure you copy the ENTIRE key including headers:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...key content...
-----END OPENSSH PRIVATE KEY-----
```

### Issue 2: Wrong file permissions on droplet
**Solution**: 
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Issue 3: Using RSA key instead of ED25519
**Solution**: ED25519 is recommended, but RSA works too. Just make sure it's at least 2048 bits:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@quizflash" -f ~/.ssh/quizflash_deploy
```

### Issue 4: DROPLET_USER is wrong
**Solution**: Usually it's `root` for DigitalOcean droplets. Check with:
```bash
ssh YOUR_USER@YOUR_DROPLET_IP whoami
```

---

## Quick Fix Checklist

- [ ] Generate SSH key pair (or use existing)
- [ ] Add public key to droplet's `~/.ssh/authorized_keys`
- [ ] Copy FULL private key (with headers)
- [ ] Add private key to GitHub secret: `DROPLET_SSH_KEY`
- [ ] Verify `DROPLET_USER` is correct (usually `root`)
- [ ] Verify `DROPLET_IP` is correct
- [ ] Test SSH connection manually
- [ ] Re-run GitHub Actions workflow

---

## Need Help?

If you're still stuck, share:
1. Output of: `cat ~/.ssh/quizflash_deploy.pub` (public key is safe to share)
2. Your droplet username (what you use to SSH in)
3. Whether you can SSH manually: `ssh -i ~/.ssh/quizflash_deploy YOUR_USER@YOUR_DROPLET_IP`
