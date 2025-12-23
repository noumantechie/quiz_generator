# 🚀 Quick Start Guide - QuizFlash Generator

This guide will get you up and running in **5 minutes**!

## Step 1: Install Backend Dependencies

Open a terminal in the project root:

```bash
cd backend
pip install -r requirements.txt
```

⏱️ **This may take 2-5 minutes** (downloads ML models)

## Step 2: Start Backend Server

```bash
python app.py
```

You should see:
```
🚀 QuizFlash Backend starting on port 5000...
📡 CORS enabled for http://localhost:3000
🤖 Using Gemini model: gemini-1.5-flash
🧠 Embedding model: all-MiniLM-L6-v2
```

✅ **Leave this terminal running!**

## Step 3: Start Frontend (New Terminal)

Open a **NEW terminal**:

```bash
cd quizapp
npm start
```

🌐 Browser should automatically open to **http://localhost:3000**

## Step 4: Test the App

1. **Upload a test document** (PDF, DOCX, or TXT)
2. **Choose mode**: Quiz or Flashcard
3. **Select questions**: 3-10
4. **Click or drag & drop** your file
5. **Wait 10-30 seconds** for AI processing
6. **Start learning!** 🎓

## ✅ Quick Verification

Test if backend is running:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "healthy",
  "message": "QuizFlash Backend is running!",
  ...
}
```

## 🐛 Common Issues

### Backend won't start?

**Check Python version:**
```bash
python --version
# Should be 3.8 or higher
```

**Try with python3:**
```bash
python3 app.py
```

### Frontend won't start?

**Install dependencies first:**
```bash
cd quizapp
npm install
npm start
```

### "GEMINI_API_KEY not found"?

Your API key is already configured in `backend/.env`:
```
GEMINI_API_KEY=AIzaSyB2DZXGN7aXx9i3YFd2dddS2xNNJ5aWz5I
```

If you want to use a different key, edit that file.

### Still having issues?

Check the full [README.md](../README.md) for detailed troubleshooting.

## 📝 Development Tips

### Both servers running?
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Check backend logs
The terminal running `python app.py` will show:
- File uploads
- Text extraction progress
- Embedding generation
- Gemini API calls
- Any errors

### Check frontend console
Open browser DevTools (F12):
- Network tab: See API requests
- Console tab: See frontend logs

## 🎉 You're All Set!

Now you can:
- ✅ Upload documents
- ✅ Generate AI quizzes
- ✅ Create flashcards
- ✅ Track your learning progress

**Happy Learning! 🚀**
