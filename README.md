# 🎓 QuizFlash Generator

> **AI-powered quiz and flashcard generator using RAG technology**

Transform any document (PDF, DOCX, TXT) into interactive quizzes and flashcards. Powered by Retrieval-Augmented Generation (RAG) and Groq's ultra-fast LLM.

---

## 💡 The Problem

Students often finish studying notes or slides but lack quick ways to test their understanding. QuizFlash enables users to upload study documents and instantly generate quizzes or flashcards for self-assessment.

## ✨ Our Solution

QuizFlash uses **RAG** to extract relevant content and generate contextually-accurate questions:
- 📄 Upload any document → Get personalized quizzes/flashcards
- �️ Adaptive difficulty (Basic/Medium/Advanced)
- 🌍 Multi-language support (English, Urdu, Spanish, French, Arabic)
- ⚡ Lightning-fast generation with Groq
- 📊 Track performance and identify weak topics

---

## 🚀 Features

- **Smart Document Processing** - Extracts text from PDF/DOCX/TXT
- **RAG Pipeline** - Semantic search finds most relevant content chunks
- **AI Generation** - Groq LLM creates high-quality questions
- **Difficulty Levels** - Choose Basic, Medium, or Advanced
- **Multi-Language** - 5 languages supported
- **Session Timer** - Track study time
- **Analytics** - Identify weak topics after each session

---

## 🛠️ Tech Stack

**Backend:** Flask • Groq API (llama-3.3-70b) • SentenceTransformers • scikit-learn  
**Frontend:** React 19 • Tailwind CSS • Lucide Icons

---

## ⚡ Quick Start

### Prerequisites
- Python 3.8+ and Node.js 16+
- [Groq API Key](https://console.groq.com/) (free)

### Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate                          # Windows
source venv/bin/activate                       # Mac/Linux
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
python app.py                                  # Runs on :5000
```

**Frontend:**
```bash
cd quizapp
npm install
echo "REACT_APP_BACKEND_URL=http://localhost:5000" > .env
npm start                                      # Opens on :3000
```

---

## 🎯 How It Works

1. **Upload** - User uploads document (PDF/DOCX/TXT)
2. **Process** - Text extracted and split into chunks
3. **Embed** - Semantic embeddings generated
4. **Retrieve** - RAG finds most relevant chunks
5. **Generate** - Groq creates quiz/flashcards
6. **Test** - Interactive quiz with instant feedback
7. **Analyze** - View results and weak topics

---

## � API Endpoints

**Upload Document**
```bash
POST /api/upload
# Returns: session_id
```

**Generate Quiz/Flashcards**
```bash
POST /api/generate
{
  "session_id": "...",
  "mode": "quiz",           # or "flashcard"
  "num_questions": 10,      # 3-20
  "difficulty": "medium",   # basic/medium/advanced
  "language": "en"         # en/ur/es/fr/ar
}
```

---

## 🏆 Why It's Special

✅ **RAG-powered** - Questions are contextually accurate, not generic  
✅ **Ultra-fast** - Groq delivers sub-second response times  
✅ **Accessible** - Multi-language support for diverse learners  
✅ **Smart** - Adapts difficulty and tracks learning gaps  
✅ **Production-ready** - Clean architecture, session-based design  

---

## 🚢 Deployment

This project includes a complete CI/CD pipeline for automated deployment to DigitalOcean.

**Quick Deploy:**
1. Set up GitHub Secrets (Docker Hub, DigitalOcean)
2. Push to `main` branch
3. GitHub Actions automatically builds and deploys

📖 **[Full Deployment Guide](DEPLOYMENT.md)** - Step-by-step instructions for:
- Docker containerization
- GitHub Actions CI/CD
- DigitalOcean setup
- Custom domain & SSL
- Monitoring & troubleshooting

**Docker Images:**
- Backend: `noumantechie/quizflash-backend`
- Frontend: `noumantechie/quizflash-frontend`

---

## 📝 License

MIT License

---

**Made with ❤️ for hackathons** | [Report Issue](https://github.com/yourusername/quizflash/issues)
