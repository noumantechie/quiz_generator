# QuizFlash - GitHub Setup Guide

## 🎯 Overview
This guide explains how to set up and deploy QuizFlash after cloning from GitHub.

---

## 📋 Prerequisites

- **Python 3.8+** installed
- **Node.js 14+** and npm installed
- **Groq API Key** (free from [console.groq.com](https://console.groq.com/keys))

---

## 🚀 Quick Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/quiz_generator.git
cd quiz_generator
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Or on Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux

# Edit .env and add your Groq API key
notepad .env  # Windows
# OR
nano .env     # Mac/Linux
```

**Required in .env:**
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3. Frontend Setup

```bash
cd ../quizapp

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

The default `.env` should work for local development:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
You should see:
```
🚀 QuizFlash Backend starting on port 5000...
```

**Terminal 2 - Frontend:**
```bash
cd quizapp
npm start
```
Browser will open automatically at `http://localhost:3000`

---

## 🔑 Getting Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up / Log in (free account)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the key and paste it in `backend/.env`

**Note:** Free tier includes generous limits for development!

---

## 📁 Project Structure

```
quiz_generator/
├── backend/                 # Flask API server
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment template
│   └── .env                # Your actual config (create this)
│
├── quizapp/                # React frontend
│   ├── src/
│   │   └── App.js         # Main React component
│   ├── public/
│   ├── package.json       # Node dependencies
│   ├── .env.example       # Environment template
│   └── .env               # Your actual config (create this)
│
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

---

## ✅ Features

- 📚 **Upload Documents** - PDF, DOCX, TXT
- 🎯 **Difficulty Levels** - Basic, Medium, Advanced
- 🌍 **Multi-Language** - English, Urdu, Spanish, French, Arabic
- ⏱️ **Timer Mode** - Optional session timer
- 🗂️ **Topic Filtering** - Filter by specific topics
- 💡 **Smart Feedback** - Explanations for each answer
- 📊 **Visual Analytics** - Charts and performance tracking
- 🗃️ **Flashcard Mode** - Study with flip cards

---

## 🔧 Troubleshooting

### "Module not found" errors
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd quizapp
npm install
```

### "Port 5000 already in use"
Edit `backend/.env`:
```
PORT=8000
```
And update `quizapp/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

### "404 model not found" from Groq
- Check your API key is correct in `backend/.env`
- Verify you have internet connection
- Check Groq console for API limits

### CORS errors
- Make sure backend is running on port 5000
- Make sure frontend .env has correct backend URL
- Restart both servers

---

## 🌐 Deployment

### Option 1: Local Network
Both servers run on `0.0.0.0`, accessible from other devices on your network:
- Backend: `http://YOUR_IP:5000`
- Frontend: Build and serve the React app

### Option 2: Cloud Deployment
- **Backend**: Deploy to Render, Railway, or Heroku
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- Update `quizapp/.env` with your deployed backend URL

---

## 🛡️ Security Notes

⚠️ **NEVER commit `.env` files to Git!**

The `.gitignore` file already excludes:
- `.env` files
- `node_modules/`
- `__pycache__/`
- `uploads/` folder

Always use `.env.example` templates and let users create their own `.env` files.

---

## 📝 Development

### Adding New Features

1. Backend changes go in `backend/app.py`
2. Frontend changes go in `quizapp/src/App.js`
3. Test locally before committing
4. Create pull requests for major changes

### Code Style
- Python: Follow PEP 8
- JavaScript: Use modern ES6+ syntax
- Components: Keep them modular and reusable

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use and modify!

---

## 💬 Support

Having issues? Check the troubleshooting section above or open an issue on GitHub.

**Happy Learning! 🎓**
