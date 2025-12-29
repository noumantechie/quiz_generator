import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Brain,
  RotateCcw,
  BarChart2,
  Lightbulb,
  ArrowRight,
  Clock,
  Globe,
  Zap,
  Filter,
  AlertCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';

/* --- 1. API CONFIGURATION --- */
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || `http://${window.location.hostname}:5000`;

/* --- 2. API FUNCTIONS --- */
const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return await response.json();
};

const generateQuizOrFlashcard = async (sessionId, mode, numQuestions, difficulty, language) => {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      mode: mode,
      num_questions: numQuestions,
      difficulty: difficulty,
      language: language,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Generation failed');
  }

  return await response.json();
};

/* --- 3. SUB-COMPONENTS --- */

// A. Upload Stage - Redesigned
const UploadStage = ({ onUpload, mode, setMode, numQuestions, setNumQuestions, difficulty, setDifficulty, language, setLanguage, timerEnabled, setTimerEnabled, timeLimit, setTimeLimit, availableTopics, selectedTopic, setSelectedTopic }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleGenerate = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const selectedLanguage = languages.find(l => l.code === language);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Learning Assistant</span>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          Transform Documents into {mode === 'quiz' ? 'Quizzes' : 'Flashcards'}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Upload your study materials and let AI create personalized learning content in seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Area (Larger) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
            className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer group
              ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' :
                selectedFile ? 'border-green-500 bg-green-50' :
                  'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
          >
            <div className="flex flex-col items-center gap-6">
              <div className={`p-6 rounded-2xl transition-all ${isDragging ? 'bg-blue-100 scale-110' :
                  selectedFile ? 'bg-green-100' :
                    'bg-slate-100 group-hover:bg-blue-50 group-hover:scale-105'
                }`}>
                {selectedFile ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
                )}
              </div>
              <div>
                {selectedFile ? (
                  <>
                    <p className="text-lg font-semibold text-green-700 mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">File ready • Click to change</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-slate-800 mb-2">Drop your document here</p>
                    <p className="text-slate-500 mb-1">or click to browse</p>
                    <p className="text-sm text-slate-400">Supports PDF, DOCX, TXT • Max 10MB</p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              id="file-upload"
              accept=".pdf,.docx,.txt"
            />
          </div>

          {/* Mode Toggle - Horizontal */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Generation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('quiz')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${mode === 'quiz'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Brain className={`w-5 h-5 ${mode === 'quiz' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${mode === 'quiz' ? 'text-blue-900' : 'text-slate-700'}`}>Quiz</span>
                </div>
                <p className="text-sm text-slate-500">Test your knowledge with questions</p>
              </button>
              <button
                onClick={() => setMode('flashcard')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${mode === 'flashcard'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className={`w-5 h-5 ${mode === 'flashcard' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${mode === 'flashcard' ? 'text-blue-900' : 'text-slate-700'}`}>Flashcards</span>
                </div>
                <p className="text-sm text-slate-500">Learn with interactive cards</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Difficulty */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Difficulty Level</label>
            <div className="space-y-2">
              {[
                { value: 'basic', label: 'Basic', color: 'green', desc: 'Simple recall' },
                { value: 'medium', label: 'Medium', color: 'blue', desc: 'Moderate complexity' },
                { value: 'advanced', label: 'Advanced', color: 'purple', desc: 'Critical thinking' }
              ].map(({ value, label, color, desc }) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${difficulty === value
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${difficulty === value ? `text-${color}-900` : 'text-slate-700'}`}>
                        {label}
                      </div>
                      <div className="text-xs text-slate-500">{desc}</div>
                    </div>
                    {difficulty === value && (
                      <CheckCircle className={`w-5 h-5 text-${color}-600`} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Dropdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-white border-2 border-slate-200 rounded-lg px-4 py-3 pr-10 font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Number of Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Number of Questions
            </label>
            <div className="flex items-center gap-4 mb-3">
              <input
                type="range"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{numQuestions}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Min: 3</span>
              <span>Max: 20</span>
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-slate-700">Session Timer</div>
                <div className="text-xs text-slate-500">Optional time limit</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {timerEnabled && (
              <div className="pt-4 border-t border-slate-100">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minutes"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate Button - Prominent CTA */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!selectedFile}
          className={`group relative px-12 py-5 rounded-xl font-semibold text-lg transition-all ${selectedFile
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          <span className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Generate {mode === 'quiz' ? 'Quiz' : 'Flashcards'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
};

// B. Quiz View - Improved
const QuizView = ({ data, onComplete, timerEnabled, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const currentQ = data[currentIndex];
  const isAnswered = selectedOption !== null;
  const timeLimitSeconds = timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;
  const progress = ((currentIndex + 1) / data.length) * 100;

  const scoreRef = React.useRef(score);
  const historyRef = React.useRef(history);
  const dataRef = React.useRef(data);

  React.useEffect(() => {
    scoreRef.current = score;
    historyRef.current = history;
    dataRef.current = data;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (timerEnabled && newTime >= timeLimitSeconds) {
          setIsTimeUp(true);
          clearInterval(interval);
          setTimeout(() => {
            setHistory(latestHistory => {
              onComplete({
                score: scoreRef.current,
                total: dataRef.current.length,
                history: latestHistory,
                type: 'quiz',
                timeElapsed: newTime
              });
              return latestHistory;
            });
          }, 1000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, timeLimitSeconds, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (index) => {
    if (isAnswered || isTimeUp) return;
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) setScore(s => s + 1);

    setHistory(prevHistory => [...prevHistory, { ...currentQ, userCorrect: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
    } else {
      setHistory(latestHistory => {
        onComplete({ score, total: data.length, history: latestHistory, type: 'quiz', timeElapsed });
        return latestHistory;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">
            Question {currentIndex + 1} of {data.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {currentQ.tag}
            </span>
            {timerEnabled ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${timeRemaining < 60 ? 'bg-red-100 text-red-700' :
                  timeRemaining < 180 ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isTimeUp && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <Clock className="w-6 h-6" />
          <span className="font-semibold">Time's up! Quiz completed.</span>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-10 mb-8 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let statusStyle = "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50";

            if (isAnswered) {
              if (idx === currentQ.correctIndex) statusStyle = "border-green-500 bg-green-50";
              else if (idx === selectedOption) statusStyle = "border-red-500 bg-red-50";
              else statusStyle = "border-slate-100 opacity-60";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isTimeUp}
                onClick={() => handleOptionClick(idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center group ${statusStyle}`}
              >
                <span className="font-medium text-slate-800">{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-6 h-6 text-green-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-6 h-6 text-red-600" />}
              </button>
            );
          })}
        </div>

        {isAnswered && currentQ.explanation && (
          <div className={`mt-8 p-6 rounded-xl border-2 ${selectedOption === currentQ.correctIndex
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
            }`}>
            <div className="flex gap-4">
              <AlertCircle className={`w-6 h-6 mt-0.5 flex-shrink-0 ${selectedOption === currentQ.correctIndex ? 'text-green-600' : 'text-blue-600'
                }`} />
              <div>
                <p className={`font-bold mb-2 ${selectedOption === currentQ.correctIndex ? 'text-green-900' : 'text-blue-900'
                  }`}>
                  {selectedOption === currentQ.correctIndex ? '✓ Correct!' : 'ℹ Learn More'}
                </p>
                <p className={`text-sm leading-relaxed ${selectedOption === currentQ.correctIndex ? 'text-green-800' : 'text-blue-800'
                  }`}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      {(isAnswered || isTimeUp) && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            {currentIndex === data.length - 1 ? "View Results" : "Next Question"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// C. Flashcard View - Improved
const FlashcardView = ({ data, onComplete, timerEnabled, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ known: 0, unknown: 0 });
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentCard = data[currentIndex];
  const timeLimitSeconds = timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;
  const progress = ((currentIndex + 1) / data.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRating = (known) => {
    setStats(prev => ({
      ...prev,
      [known ? 'known' : 'unknown']: prev[known ? 'known' : 'unknown'] + 1
    }));

    setIsFlipped(false);
    if (currentIndex < data.length - 1) {
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    } else {
      onComplete({ ...stats, total: data.length, type: 'flashcard', timeElapsed });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">
            Card {currentIndex + 1} of {data.length}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {currentCard.tag}
            </span>
            {timerEnabled ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${timeRemaining < 60 ? 'bg-red-100 text-red-700' :
                  timeRemaining < 180 ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div
        className="group perspective w-full h-96 cursor-pointer mb-8"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-all transform ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>

          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 shadow-xl rounded-3xl flex items-center justify-center p-12 text-center hover:shadow-2xl transition-shadow"
            style={{ backfaceVisibility: 'hidden' }}>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-6 font-semibold">Term / Question</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-8">{currentCard.front}</h3>
              <p className="text-sm text-slate-400">Click to flip</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl rounded-3xl flex items-center justify-center p-12 text-center rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-6 font-semibold">Definition / Answer</p>
              <h3 className="text-2xl font-medium leading-relaxed">{currentCard.back}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(false); }}
          className="flex-1 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-4 rounded-xl font-semibold shadow-sm transition-all hover:scale-105"
        >
          I didn't know
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(true); }}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
        >
          I knew this
        </button>
      </div>
    </div>
  );
};

// D. Summary View - Improved
const SummaryView = ({ results, onReset }) => {
  const isQuiz = results.type === 'quiz';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const percentage = isQuiz ? Math.round((results.score / results.total) * 100) : Math.round((results.known / results.total) * 100);

  const weakTopics = isQuiz ? results.history.reduce((acc, curr) => {
    if (!curr.userCorrect) {
      acc[curr.tag] = (acc[curr.tag] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  const topicStats = isQuiz ? results.history.reduce((acc, curr) => {
    if (!acc[curr.tag]) {
      acc[curr.tag] = { correct: 0, total: 0 };
    }
    acc[curr.tag].total++;
    if (curr.userCorrect) acc[curr.tag].correct++;
    return acc;
  }, {}) : {};

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <CheckCircle className="w-4 h-4" />
          <span>Session Complete</span>
        </div>
        <h2 className="text-5xl font-bold text-slate-900 mb-4">Great Work!</h2>
        <p className="text-xl text-slate-600">Here's how you performed</p>
      </div>

      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl border border-blue-100 shadow-lg mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-2">Your Score</p>
            <p className="text-7xl font-bold text-slate-900 mb-2">{percentage}%</p>
            <p className="text-lg text-slate-600">
              {isQuiz ? `${results.score} out of ${results.total} correct` : `${results.known} out of ${results.total} known`}
            </p>
          </div>
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90" width="160" height="160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e2e8f0"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(percentage / 100) * 439.82} 439.82`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart2 className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
          <p className="text-3xl font-bold text-slate-900">{isQuiz ? results.score : results.known}</p>
          <p className="text-sm text-slate-500 font-medium">Correct</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <XCircle className="w-6 h-6 text-red-500 mb-3" />
          <p className="text-3xl font-bold text-slate-900">{results.total - (isQuiz ? results.score : results.known)}</p>
          <p className="text-sm text-slate-500 font-medium">Incorrect</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="w-6 h-6 text-blue-500 mb-3" />
          <p className="text-3xl font-bold text-slate-900">{results.total}</p>
          <p className="text-sm text-slate-500 font-medium">Total</p>
        </div>
        {results.timeElapsed && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Clock className="w-6 h-6 text-purple-500 mb-3" />
            <p className="text-3xl font-bold text-slate-900">{Math.round(results.timeElapsed / results.total)}s</p>
            <p className="text-sm text-slate-500 font-medium">Avg/Question</p>
          </div>
        )}
      </div>

      {/* Topic Performance */}
      {isQuiz && Object.keys(topicStats).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-bold text-slate-900">Performance by Topic</h3>
          </div>
          <div className="space-y-5">
            {Object.entries(topicStats).map(([topic, stats]) => {
              const topicPercentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-800">{topic}</span>
                    <span className="text-sm font-bold text-slate-600">{stats.correct}/{stats.total} ({topicPercentage}%)</span>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${topicPercentage >= 70 ? 'bg-green-500' :
                          topicPercentage >= 50 ? 'bg-amber-500' :
                            'bg-red-500'
                        }`}
                      style={{ width: `${topicPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weak Topics */}
      {isQuiz && Object.keys(weakTopics).length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-bold text-slate-900">Focus Areas</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(weakTopics).map(([topic, count]) => (
              <div key={topic} className="flex justify-between items-center p-4 bg-white rounded-xl border border-amber-100">
                <span className="font-semibold text-slate-800">{topic}</span>
                <span className="text-sm text-amber-700 font-medium">Missed {count} question{count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isQuiz && Object.keys(weakTopics).length === 0 && (
        <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-200 text-center mb-10">
          <p className="font-semibold text-lg">🎉 Perfect score! No weak topics detected.</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg"
      >
        <RotateCcw className="w-5 h-5" />
        Start New Session
      </button>
    </div>
  );
};

/* --- 4. MAIN APP --- */
const App = () => {
  const [stage, setStage] = useState('upload');
  const [mode, setMode] = useState('quiz');
  const [data, setData] = useState(null);
  const [results, setResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState(5);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleUpload = async (file) => {
    setStage('processing');
    setError(null);

    try {
      console.log('Uploading document...');
      const uploadResponse = await uploadDocument(file);
      console.log('Upload response:', uploadResponse);

      setSessionId(uploadResponse.session_id);

      console.log(`Generating ${mode} with difficulty: ${difficulty}, language: ${language}...`);
      const generateResponse = await generateQuizOrFlashcard(
        uploadResponse.session_id,
        mode,
        numQuestions,
        difficulty,
        language
      );
      console.log('Generate response:', generateResponse);

      const generatedData = generateResponse.data;
      setData(generatedData);

      if (mode === 'quiz' && generatedData.quiz) {
        const topics = [...new Set(generatedData.quiz.map(q => q.tag))];
        setAvailableTopics(topics);
        console.log('Available topics:', topics);
      } else if (mode === 'flashcard' && generatedData.flashcards) {
        const topics = [...new Set(generatedData.flashcards.map(f => f.tag))];
        setAvailableTopics(topics);
        console.log('Available topics:', topics);
      }

      setStage(mode === 'quiz' ? 'quiz' : 'flashcard');

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setStage('error');
    }
  };

  const handleCompletion = (resultData) => {
    setResults(resultData);
    setStage('summary');
  };

  const handleReset = () => {
    setStage('upload');
    setResults(null);
    setData(null);
    setSessionId(null);
    setError(null);
    setAvailableTopics([]);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-slate-900">QuizFlash</h1>
              <p className="text-xs text-slate-500">AI-Powered Learning</p>
            </div>
          </div>
          {stage !== 'upload' && stage !== 'summary' && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              {mode === 'quiz' ? <Brain className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
              {mode === 'quiz' ? 'Quiz Mode' : 'Flashcard Mode'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {stage === 'upload' && (
          <UploadStage
            onUpload={handleUpload}
            mode={mode}
            setMode={setMode}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            language={language}
            setLanguage={setLanguage}
            timerEnabled={timerEnabled}
            setTimerEnabled={setTimerEnabled}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            availableTopics={availableTopics}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />
        )}

        {stage === 'processing' && (
          <div className="flex flex-col items-center justify-center pt-32">
            <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Your Document...</h3>
            <p className="text-slate-600 mb-1">Extracting text, analyzing content, and generating {mode}s with AI</p>
            <p className="text-sm text-slate-400">This may take 10-30 seconds</p>
          </div>
        )}

        {stage === 'error' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-red-200 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Oops! Something Went Wrong</h3>
              <p className="text-slate-600 mb-8">{error}</p>
              <button
                onClick={handleReset}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {stage === 'quiz' && data && (
          <QuizView
            data={selectedTopic ? data.quiz.filter(q => q.tag === selectedTopic) : data.quiz}
            onComplete={handleCompletion}
            timerEnabled={timerEnabled}
            timeLimit={timeLimit}
          />
        )}

        {stage === 'flashcard' && data && data.flashcards && (
          <FlashcardView
            data={selectedTopic ? data.flashcards.filter(f => f.tag === selectedTopic) : data.flashcards}
            onComplete={handleCompletion}
            timerEnabled={timerEnabled}
            timeLimit={timeLimit}
          />
        )}

        {stage === 'summary' && results && (
          <SummaryView results={results} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
