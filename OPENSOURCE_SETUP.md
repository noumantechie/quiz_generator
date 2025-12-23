# Open-Source Setup Guide

## ✅ No API Keys Required!

This version uses **100% open-source tools** - no Gemini API needed!

## How It Works

The backend now supports **two modes**:

### 1. **Template-Based Generation** (Works Immediately - No Setup)
- Uses intelligent text processing
- Creates quizzes and flashcards from your documents
- No internet required, completely private
- Good for basic quizzes

### 2. **Ollama (Optional - Better Quality)**
- Uses local open-source LLMs (Llama2, Mistral, etc.)
- Much better question quality
- Still 100% free and private
- Requires Ollama installation

## Quick Start (Template Mode - No Setup!)

The app **already works** without any additional setup! It will use template-based generation.

1. **Backend is already updated** - the Gemini dependency is removed
2. **Just restart the backend server**:
   ```bash
   # Stop current server (Ctrl+C in backend terminal)
   # Then restart:
   python app.py
   ```

3. **Upload a document** and it will work immediately!

## Optional: Install Ollama for Better Results

If you want higher quality quiz generation:

1. **Download Ollama**: https://ollama.ai/download
2. **Install it** (simple installer for Windows)
3. **Pull a model**:
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   ```
4. **Restart backend** - it will automatically detect and use Ollama!

## Updated Configuration

Edit `backend/.env` to remove the Gemini API key line and add:

```env
FLASK_ENV=development
PORT=5000

# Optional Ollama settings (if installed)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## What Changed

### Removed:
- ❌ Gemini API (paid service)
- ❌ google-generativeai dependency
- ❌ API key requirement

### Added:
- ✅ Template-based generation (always works)
- ✅ Ollama support (optional, open-source)
- ✅ Automatic fallback system
- ✅ 100% privacy (everything runs locally)

## Testing

1. **Stop the current backend** (Ctrl+C)
2. **Restart it**: `python app.py`
3. **Check health**: Visit http://localhost:5000/api/health
4. **Upload a document** in the React app
5. **Generate quiz** - it will use template mode or Ollama if available!

## Troubleshooting

**"Template-based generation" in results?**
- This means Ollama is not installed
- Quizzes are created using intelligent text processing
- Questions may be simpler but still useful
- Install Ollama for better quality (optional)

**Want better quizzes without Ollama?**
- Use shorter, more focused documents
- The template system works best with clear, structured text
- Try the sample_document.txt provided

## Why This Is Better

1. **100% Free** - No API costs ever
2. **Privacy** - Everything runs on your machine
3. **No Internet Required** - Works offline
4. **Open Source** - All tools are open and auditable
5. **Flexible** - Works immediately, improves with Ollama
