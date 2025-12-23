#!/bin/bash

# QuizFlash Generator - DigitalOcean Droplet Setup Script
# Run this script on your fresh DigitalOcean droplet

set -e

echo "🚀 Setting up QuizFlash Generator on DigitalOcean Droplet..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/quizflash
sudo chown $USER:$USER /opt/quizflash
cd /opt/quizflash

# Copy docker-compose file
echo "📝 Setting up docker-compose..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: ${DOCKER_USERNAME}/quizflash-backend:latest
    container_name: quizflash-backend
    ports:
      - "5000:5000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GROQ_MODEL=llama-3.3-70b-versatile
      - FLASK_ENV=production
      - PORT=5000
    volumes:
      - backend_uploads:/app/uploads
    restart: always
    networks:
      - quizflash-network

  frontend:
    image: ${DOCKER_USERNAME}/quizflash-frontend:latest
    container_name: quizflash-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
    networks:
      - quizflash-network

volumes:
  backend_uploads:

networks:
  quizflash-network:
    driver: bridge
EOF

# Create .env file template
echo "🔐 Creating environment file template..."
cat > .env.example << 'EOF'
# Docker Hub Configuration
DOCKER_USERNAME=your_dockerhub_username

# API Keys
GROQ_API_KEY=your_groq_api_key_here
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create .env file: cp .env.example .env"
echo "2. Edit .env file with your credentials: nano .env"
echo "3. Login to Docker Hub: docker login"
echo "4. Pull images: docker-compose pull"
echo "5. Start services: docker-compose up -d"
echo ""
echo "🌐 Your app will be available at: http://$(curl -s ifconfig.me)"
echo ""
echo "📊 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Restart services: docker-compose restart"
echo "  - Stop services: docker-compose down"
echo "  - Update images: docker-compose pull && docker-compose up -d"
