# QuizFlash Generator - RAG-Powered Quiz & Flashcard App

A full-stack application that uses Retrieval-Augmented Generation (RAG) to transform your documents into interactive quizzes and flashcards powered by Google's Gemini AI.

## 🌟 Features

- **Document Upload**: Support for PDF, DOCX, and TXT files
- **Smart Processing**: RAG pipeline with text chunking and semantic embeddings
- **AI Generation**: Gemini-powered quiz and flashcard creation
- **Interactive UI**: Beautiful React interface with animations
- **Real-time Feedback**: Immediate answer validation and progress tracking
- **Topics Analytics**: Identify weak areas after quiz completion

## 🏗️ Architecture

### Backend (Python/Flask)
- **Document Processing**: PyPDF2, python-docx for text extraction
- **Embeddings**: SentenceTransformers (all-MiniLM-L6-v2)
- **RAG Pipeline**: Cosine similarity-based retrieval
- **LLM**: Google Gemini API (gemini-1.5-flash)

### Frontend (React)
- **UI Framework**: React 19 with Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Communication**: Fetch API

## 📋 Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm
- **Gemini API Key** (get one at https://ai.google.dev/)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Backend will start on **http://localhost:5000**

### 2. Frontend Setup

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd quizapp

# Install dependencies (if not already installed)
npm install

# Start development server
npm start
```

Frontend will open automatically at **http://localhost:3000**

## 🎯 Usage

1. **Upload a Document**
   - Drag & drop or click to upload PDF/DOCX/TXT
   - Choose Quiz or Flashcard mode
   - Select number of questions (3-10)

2. **Wait for Processing**
   - Backend extracts text and generates embeddings
   - RAG retrieves relevant content chunks
   - Gemini creates questions/flashcards

3. **Test Your Knowledge**
   - **Quiz Mode**: Answer multiple-choice questions with instant feedback
   - **Flashcard Mode**: Flip cards to test recall

4. **Review Results**
   - See your score and accuracy
   - Identify weak topics for targeted study

## 🔧 Configuration

### Backend (.env)
Located at `backend/.env`:
```env
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
PORT=5000
```

### Frontend (.env)
Located at `quizapp/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 📁 Project Structure

```
QuizFlash Generator/
├── backend/
│   ├── app.py              # Flask server with RAG pipeline
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables (API key)
│   └── .gitignore
├── quizapp/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── .env               # Frontend config
│   └── package.json
└── README.md
```

## 🛠️ API Endpoints

### GET /api/health
Health check endpoint
- **Response**: `{ status: "healthy", ... }`

### POST /api/upload
Upload and process document
- **Body**: FormData with 'file' field
- **Response**: `{ session_id, filename, chunks_count, text_length }`

### POST /api/generate
Generate quiz/flashcards
- **Body**: `{ session_id, mode: "quiz"|"flashcard", num_questions }`
- **Response**: `{ success: true, data: {...} }`

## 🐛 Troubleshooting

### Backend Issues

**"GEMINI_API_KEY not found"**
- Make sure `backend/.env` file exists with your API key

**"Module not found"**
- Run `pip install -r requirements.txt` in backend directory
- Make sure virtual environment is activated

**Port 5000 already in use**
- Change PORT in `backend/.env`
- Update REACT_APP_BACKEND_URL in `quizapp/.env` accordingly

### Frontend Issues

**"Failed to fetch"**
- Ensure backend server is running on port 5000
- Check CORS settings in `app.py`

**Environment variables not loaded**
- Restart the React dev server after changing `.env`
- Variables must start with `REACT_APP_`

**Build errors**
- Delete `node_modules` and run `npm install` again
- Clear cache: `npm cache clean --force`

## 🔐 Security Notes

- ⚠️ **Never commit `.env` files** to version control
- API keys are stored in `.env` and excluded via `.gitignore`
- For production, use environment variables on your hosting platform

## 📝 License

MIT License - Feel free to use this project for learning and development!

## 🙏 Credits

- **Google Gemini**: AI-powered content generation
- **Sentence Transformers**: Semantic embeddings
- **Lucide Icons**: Beautiful React icons
- **Tailwind CSS**: Utility-first CSS framework

---

**Made with ❤️ for better learning experiences**
