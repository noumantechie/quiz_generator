# 🎓 QuizFlash Generator

> **AI-powered quiz and flashcard generator using RAG technology**

Transform any document (PDF, DOCX, TXT) into interactive quizzes and flashcards. Powered by Retrieval-Augmented Generation (RAG) and Groq's ultra-fast LLM.

---

## 💡 The Problem

Students often finish studying notes or slides but lack quick ways to test their understanding. QuizFlash enables users to upload study documents and instantly generate quizzes or flashcards for self-assessment.

## ✨ Our Solution

QuizFlash uses **RAG** to extract relevant content and generate contextually-accurate questions:
- 📄 Upload any document → Get personalized quizzes/flashcards
- 🎯 Adaptive difficulty (Basic/Medium/Advanced)
- 🌍 Multi-language support (English, Urdu, Spanish, French, Arabic)
- ⏱️ Session timer to track study time
- ⚡ Lightning-fast generation with Groq
- 📊 Track performance and identify weak topics

---

## 🚀 Features

### Core Features
- **Smart Document Processing** - Extracts text from PDF/DOCX/TXT files
- **RAG Pipeline** - Semantic search finds most relevant content chunks using sentence transformers
- **AI Generation** - Groq LLM (llama-3.3-70b-versatile) creates high-quality questions

### Customization Options
- **Difficulty Levels** - Choose from:
  - **Basic**: Simple recall questions, fundamental concepts
  - **Medium**: Moderate complexity with application scenarios
  - **Advanced**: Critical thinking, analysis, and multi-step reasoning
  
- **Multi-Language Support** - Generate quizzes in 5 languages:
  - 🇬🇧 English
  - 🇵🇰 Urdu
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇸🇦 Arabic

- **Flexible Question Count** - Generate 3-20 questions per session

### Study Features
- **Session Timer** - Track your study time automatically
- **Instant Feedback** - Get explanations for correct and incorrect answers
- **Analytics Dashboard** - Identify weak topics after each session
- **Quiz & Flashcard Modes** - Choose your preferred study method

---

## 🛠️ Tech Stack

**Backend:**
- Flask (Python web framework)
- Groq API (llama-3.3-70b-versatile)
- SentenceTransformers (all-MiniLM-L6-v2)
- scikit-learn (cosine similarity)
- PyPDF2, python-docx (document processing)

**Frontend:**
- React 19
- Tailwind CSS
- Lucide Icons
- Modern responsive design

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- DigitalOcean Droplet
- Nginx (reverse proxy)

---

## ⚡ Quick Start

### Prerequisites
- Python 3.8+ and Node.js 16+
- [Groq API Key](https://console.groq.com/) (free tier available)

### Local Development Setup

**1. Clone the repository:**
```bash
git clone https://github.com/noumantechie/quiz_generator.git
cd quiz_generator
```

**2. Backend Setup:**
```bash
cd backend
python -m venv venv

# Activate virtual environment
venv\Scripts\activate                          # Windows
source venv/bin/activate                       # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Run backend server
python app.py                                  # Runs on http://localhost:5000
```

**3. Frontend Setup:**
```bash
cd quizapp
npm install

# Create .env file (optional - defaults to localhost:5000)
echo "REACT_APP_BACKEND_URL=http://localhost:5000" > .env

# Run frontend
npm start                                      # Opens on http://localhost:3000
```

---

## 🎯 How It Works

1. **Upload** - User uploads a document (PDF/DOCX/TXT)
2. **Process** - Text is extracted and split into semantic chunks
3. **Embed** - Sentence embeddings are generated for each chunk
4. **Retrieve** - RAG finds the most relevant chunks based on query
5. **Generate** - Groq LLM creates quiz questions or flashcards
6. **Test** - Interactive quiz with instant feedback and explanations
7. **Analyze** - View results and identify weak topics

---

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
# Returns: { status, llm_model, llm_provider, embedding_model }
```

### Upload Document
```bash
POST /api/upload
Content-Type: multipart/form-data

# Body: file (PDF/DOCX/TXT)
# Returns: { session_id, filename, num_chunks }
```

### Generate Quiz/Flashcards
```bash
POST /api/generate
Content-Type: application/json

{
  "session_id": "abc123...",
  "mode": "quiz",              # or "flashcard"
  "num_questions": 10,         # 3-20
  "difficulty": "medium",      # basic/medium/advanced
  "language": "en"            # en/ur/es/fr/ar
}

# Returns: { success, data, mode, difficulty, language }
```

---

## 🏆 Why It's Special

✅ **RAG-powered** - Questions are contextually accurate from your documents, not generic  
✅ **Ultra-fast** - Groq delivers sub-second response times with llama-3.3-70b  
✅ **Accessible** - Multi-language support for diverse learners worldwide  
✅ **Smart** - Adapts difficulty level and tracks learning gaps  
✅ **Production-ready** - Clean architecture, session-based design, fully containerized  
✅ **Open Source** - MIT licensed, free to use and modify  

---

## 🚢 Deployment

This project includes a complete **CI/CD pipeline** for automated deployment.

### Automated Deployment (GitHub Actions)

**Setup:**
1. Fork/clone this repository
2. Add GitHub Secrets:
   - `DOCKER_USERNAME` - Your Docker Hub username
   - `DOCKER_PASSWORD` - Your Docker Hub password/token
   - `DROPLET_IP` - Your DigitalOcean droplet IP
   - `DROPLET_USER` - SSH user (usually `root`)
   - `DROPLET_SSH_KEY` - Your private SSH key
   - `GROQ_API_KEY` - Your Groq API key

3. Push to `main` branch - GitHub Actions will automatically:
   - Build Docker images for frontend and backend
   - Push images to Docker Hub
   - Deploy to your DigitalOcean droplet
   - Start containers with docker-compose

**Docker Images:**
- Backend: `noman071/quizflash-backend:latest`
- Frontend: `noman071/quizflash-frontend:latest`

### Manual Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed instructions on:
- Setting up a DigitalOcean droplet
- Configuring Docker and Docker Compose
- Setting up custom domains and SSL
- Monitoring and troubleshooting

---

## 📁 Project Structure

```
quiz_generator/
├── backend/                 # Flask backend
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend container
│   └── uploads/            # Uploaded documents
├── quizapp/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── index.css      # Tailwind styles
│   ├── public/
│   ├── Dockerfile         # Frontend container
│   └── package.json       # Node dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile  # Optional, this is default
FLASK_ENV=production                # or development
PORT=5000                           # Optional, default is 5000
```

**Frontend (.env):**
```bash
REACT_APP_BACKEND_URL=http://localhost:5000  # Backend URL
```

---

## 🐛 Troubleshooting

### Backend won't start
- Verify `GROQ_API_KEY` is set in `.env`
- Check Python version: `python --version` (needs 3.8+)
- Install dependencies: `pip install -r requirements.txt`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `REACT_APP_BACKEND_URL` in frontend `.env`
- Verify CORS settings in `backend/app.py`

### Docker deployment issues
- Check GitHub Secrets are correctly set
- Verify SSH key has correct permissions
- Check droplet firewall allows ports 80, 443, 5000

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project for learning, hackathons, or production!

---

## 🙏 Acknowledgments

- **Groq** for providing ultra-fast LLM inference
- **Sentence Transformers** for semantic embeddings
- **React** and **Flask** communities for excellent documentation

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/noumantechie/quiz_generator/issues)
- **Repository**: [github.com/noumantechie/quiz_generator](https://github.com/noumantechie/quiz_generator)

---

**Made with ❤️ for students and learners worldwide**
