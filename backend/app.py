from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import json
import numpy as np
from dotenv import load_dotenv
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
import docx
import secrets

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Enable CORS for React frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://159.65.65.181", "http://159.65.65.181:80"],
        "supports_credentials": True
    }
})

# Configure Google Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyDicurrYVbHzQvlxUAEuTLXcfWnJLzUCEw')
genai.configure(api_key=GEMINI_API_KEY)

# Gemini model - using gemini-1.5-flash (fast and reliable)
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# Initialize embedding model (cached globally)
print("Loading embedding model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("Embedding model loaded!")

# In-memory storage for session data (use Redis in production)
document_store = {}


# --- Helper Functions ---

def extract_text(file_path, file_type):
    """Extract text from uploaded document."""
    text = ""
    
    try:
        if file_type == 'application/pdf':
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
                
        elif file_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
            
        else:  # TXT
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
                
    except Exception as e:
        raise Exception(f"Error extracting text: {str(e)}")
    
    return text


def chunk_text(text, chunk_size=500, overlap=50):
    """Split text into overlapping chunks for better context."""
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        
        # Only add non-empty chunks
        if chunk.strip():
            chunks.append(chunk)
        
        start += (chunk_size - overlap)
    
    return chunks if chunks else [text]  # Return full text if chunking fails


def generate_embeddings(chunks):
    """Generate embeddings for text chunks."""
    try:
        embeddings = embedding_model.encode(chunks)
        return embeddings
    except Exception as e:
        raise Exception(f"Error generating embeddings: {str(e)}")


def retrieve_relevant_chunks(chunks, embeddings, num_chunks=4):
    """
    Retrieve most relevant chunks using RAG.
    Uses a general query to find dense/informative chunks.
    """
    # Query for key information
    query = "important concepts, definitions, key facts, and main ideas"
    query_embedding = embedding_model.encode([query])
    
    # Calculate similarities
    similarities = cosine_similarity(query_embedding, embeddings)[0]
    
    # Get top chunks
    top_indices = np.argsort(similarities)[::-1][:num_chunks]
    
    # Return selected chunks
    retrieved_chunks = [chunks[i] for i in top_indices]
    return "\n\n".join(retrieved_chunks)



def generate_quiz_with_gemini(context_text, num_questions=5, mode="quiz", difficulty="medium", language="en"):
    """Generate quiz or flashcards using Gemini API with RAG context."""
    
    # Language configurations
    language_names = {
        "en": "English",
        "ur": "Urdu",
        "es": "Spanish",
        "fr": "French",
        "ar": "Arabic"
    }
    
    # Difficulty configurations
    difficulty_instructions = {
        "basic": "Focus on simple recall questions, straightforward language, and fundamental concepts. Questions should test basic understanding and memorization.",
        "medium": "Include moderate complexity questions with some application-based scenarios. Balance between recall and understanding.",
        "advanced": "Create challenging questions requiring critical thinking, analysis, and multi-step reasoning. Include complex scenarios and deep conceptual understanding."
    }
    
    language_name = language_names.get(language, "English")
    difficulty_instruction = difficulty_instructions.get(difficulty, difficulty_instructions["medium"])
    
    if mode == "quiz":
        prompt = f"""You are a quiz generator. Analyze the provided text and generate exactly {num_questions} multiple-choice questions.

CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, no explanations.
LANGUAGE: Generate ALL content (questions, options, tags, explanations) in {language_name}.
DIFFICULTY: {difficulty_instruction}

Required JSON structure:
{{
    "quiz": [
        {{
            "id": 1,
            "question": "Clear, specific question about the content?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "tag": "Topic Name",
            "explanation": "Brief explanation of why the correct answer is right and why other options are incorrect"
        }}
    ]
}}

Rules:
1. Questions must be factual and answerable from the text
2. Each question must have exactly 4 options
3. correctIndex is 0-3 (the position of the correct answer)
4. tag should be a topic category from the content
5. Ensure only one option is clearly correct
6. explanation should provide learning value - explain the correct concept and clarify common misconceptions
7. Keep explanations concise but informative (1-2 sentences)
8. ALL text (including explanations) must be in {language_name}
9. Adjust complexity based on difficulty level: {difficulty}

Based on this content, generate {num_questions} quiz questions in {language_name} at {difficulty} difficulty level:

{context_text}

Generate the JSON now:"""
    
    else:  # flashcard mode
        prompt = f"""You are a flashcard generator. Analyze the provided text and generate exactly {num_questions} flashcards.

CRITICAL: Output ONLY valid JSON. No markdown, no code blocks, no explanations.
LANGUAGE: Generate ALL content (front, back, tags) in {language_name}.
DIFFICULTY: {difficulty_instruction}

Required JSON structure:
{{
    "flashcards": [
        {{
            "id": 1,
            "front": "Term or concept",
            "back": "Clear, concise definition or explanation",
            "tag": "Topic Name"
        }}
    ]
}}

Rules:
1. Front should be a key term, concept, or question
2. Back should be the definition, explanation, or answer
3. Keep explanations clear and concise based on difficulty
4. tag should be a topic category from the content
5. Focus on the most important concepts
6. ALL text must be in {language_name}
7. Adjust complexity based on difficulty level: {difficulty}

Based on this content, generate {num_questions} flashcards in {language_name} at {difficulty} difficulty level:

{context_text}

Generate the JSON now:"""
    
    try:
        # Call Gemini API
        response = gemini_model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            # Remove opening ```json or ```
            response_text = response_text.split('\n', 1)[1] if '\n' in response_text else response_text[3:]
            # Remove closing ```
            if response_text.endswith('```'):
                response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        # Parse JSON
        result = json.loads(response_text)
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response text: {response_text}")
        raise Exception(f"Failed to parse Gemini response as JSON: {str(e)}")
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise Exception(f"Error calling Gemini API: {str(e)}")



# --- API Routes ---

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "QuizFlash Backend is running!",
        "embedding_model": "all-MiniLM-L6-v2",
        "llm_model": GEMINI_MODEL,
        "llm_provider": "Google Gemini"
    }), 200


@app.route('/api/upload', methods=['POST'])
def upload_document():
    """
    Upload and process document.
    Returns a session ID for subsequent generation requests.
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
        
        # Get file extension and validate
        file_type = file.content_type
        allowed_types = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ]
        
        if file_type not in allowed_types:
            return jsonify({"error": "Unsupported file type. Please upload PDF, DOCX, or TXT"}), 400
        
        # Save file temporarily
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        
        # Extract text
        print(f"Extracting text from {file.filename}...")
        text = extract_text(file_path, file_type)
        
        if not text or len(text.strip()) < 50:
            os.remove(file_path)
            return jsonify({"error": "Document appears to be empty or too short"}), 400
        
        print(f"Extracted {len(text)} characters")
        
        # Chunk text
        print("Chunking text...")
        chunks = chunk_text(text, chunk_size=500, overlap=50)
        print(f"Created {len(chunks)} chunks")
        
        # Generate embeddings
        print("Generating embeddings...")
        embeddings = generate_embeddings(chunks)
        print(f"Generated embeddings with shape {embeddings.shape}")
        
        # Generate session ID
        session_id = secrets.token_hex(16)
        
        # Store in memory (use Redis/DB in production)
        document_store[session_id] = {
            "filename": file.filename,
            "chunks": chunks,
            "embeddings": embeddings,
            "text_length": len(text)
        }
        
        # Clean up file
        os.remove(file_path)
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "filename": file.filename,
            "chunks_count": len(chunks),
            "text_length": len(text)
        }), 200
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/generate', methods=['POST'])
def generate_content():
    """
    Generate quiz or flashcards using RAG.
    Requires session_id from upload response.
    Supports difficulty levels and multiple languages.
    """
    try:
        data = request.get_json()
        
        # Validate request
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        session_id = data.get('session_id')
        mode = data.get('mode', 'quiz')  # 'quiz' or 'flashcard'
        num_questions = data.get('num_questions', 5)
        difficulty = data.get('difficulty', 'medium')  # 'basic', 'medium', 'advanced'
        language = data.get('language', 'en')  # 'en', 'ur', 'es', 'fr', 'ar'
        
        # Validate parameters
        if not session_id:
            return jsonify({"error": "session_id is required"}), 400
        
        if session_id not in document_store:
            return jsonify({"error": "Invalid session_id or session expired"}), 404
        
        # Validate difficulty
        valid_difficulties = ['basic', 'medium', 'advanced']
        if difficulty not in valid_difficulties:
            return jsonify({"error": f"Invalid difficulty. Must be one of: {', '.join(valid_difficulties)}"}), 400
        
        # Validate language
        valid_languages = ['en', 'ur', 'es', 'fr', 'ar']
        if language not in valid_languages:
            return jsonify({"error": f"Invalid language. Must be one of: {', '.join(valid_languages)}"}), 400
        
        # Validate num_questions
        if not isinstance(num_questions, int) or num_questions < 3 or num_questions > 20:
            return jsonify({"error": "num_questions must be between 3 and 20"}), 400
        
        # Retrieve document data
        doc_data = document_store[session_id]
        chunks = doc_data['chunks']
        embeddings = doc_data['embeddings']
        
        # RAG: Retrieve relevant chunks
        print(f"Retrieving relevant chunks for {mode} generation...")
        context_text = retrieve_relevant_chunks(chunks, embeddings, num_chunks=min(4, len(chunks)))
        
        print(f"Context length: {len(context_text)} characters")
        print(f"Difficulty: {difficulty}, Language: {language}, Questions: {num_questions}")
        
        # Generate using Gemini
        print(f"Generating {mode} with Gemini...")
        result = generate_quiz_with_gemini(context_text, num_questions, mode, difficulty, language)
        
        print(f"Successfully generated {mode}")
        
        return jsonify({
            "success": True,
            "data": result,
            "mode": mode,
            "difficulty": difficulty,
            "language": language
        }), 200
        
    except Exception as e:
        print(f"Generation error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# --- Run Server ---
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"\n🚀 QuizFlash Backend starting on port {port}...")
    print(f"📡 CORS enabled for http://localhost:3000")
    print(f"🤖 Using Gemini model: {GEMINI_MODEL}")
    print(f"🧠 Embedding model: all-MiniLM-L6-v2")
    print(f"⚡ Google Gemini API: Fast and reliable\n")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') == 'development'
    )
