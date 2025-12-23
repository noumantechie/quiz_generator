#!/bin/bash

# QuizFlash Generator - Direct Deployment on Droplet
# This script builds and runs everything directly on your droplet
# Skips GitHub Actions and Docker Hub entirely

set -e

echo "🚀 Deploying QuizFlash Generator on Droplet..."

# Navigate to app directory
cd /opt/quizflash

# Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
if [ ! -d ".git" ]; then
    # First time - clone the repo
    cd /opt
    git clone https://github.com/noumantechie/quiz_generator.git quizflash
    cd quizflash
else
    # Update existing repo
    git pull origin main
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
GROQ_API_KEY=${GROQ_API_KEY}
GROQ_MODEL=llama-3.3-70b-versatile
EOF
fi

# Create docker-compose.yml for local build
cat > docker-compose.yml << 'EOF'
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
    networks:
      - quizflash-network

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
    networks:
      - quizflash-network

volumes:
  backend_uploads:

networks:
  quizflash-network:
    driver: bridge
EOF

# Stop old containers
echo "🛑 Stopping old containers..."
docker-compose down 2>/dev/null || true

# Build and start services
echo "🏗️  Building images (this will take a few minutes on first run)..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Show status
echo ""
echo "✅ Deployment complete!"
echo "📊 Container Status:"
docker-compose ps

# Get droplet IP
DROPLET_IP=$(curl -s ifconfig.me)
echo ""
echo "🌐 Application is live at: http://$DROPLET_IP"
echo ""
echo "📊 View logs: docker-compose logs -f"
echo "🔄 Restart: docker-compose restart"
echo "🛑 Stop: docker-compose down"
