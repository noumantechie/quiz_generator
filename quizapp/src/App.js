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
  AlertCircle
} from 'lucide-react';

/* --- 1. API CONFIGURATION --- */
// Use the same host as frontend, but port 5000 for backend
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

// A. Upload Stage
const UploadStage = ({ onUpload, mode, setMode, numQuestions, setNumQuestions, difficulty, setDifficulty, language, setLanguage, timerEnabled, setTimerEnabled, timeLimit, setTimeLimit, availableTopics, selectedTopic, setSelectedTopic }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate file acceptance
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">
          {mode === 'quiz' ? 'Document to Quiz' : 'Document to FlashCards'}
        </h2>
        <p className="text-slate-500">Upload your notes and let AI test your knowledge.</p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer relative
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-400 mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
          id="file-upload"
          accept=".pdf,.docx,.txt"
        />
      </div>

      {/* Mode Toggle */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-800">Generation Mode</h3>
            <p className="text-sm text-slate-500">Choose how you want to learn</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'quiz' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Quiz
          </button>
          <button
            onClick={() => setMode('flashcard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'flashcard' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Flashcards
          </button>
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-semibold text-slate-800">Difficulty Level</h3>
            <p className="text-sm text-slate-500">Adjust question complexity</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setDifficulty('basic')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${difficulty === 'basic' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300 text-slate-600'}`}
          >
            <div className="font-bold">Basic</div>
            <div className="text-xs opacity-75">Simple recall</div>
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${difficulty === 'medium' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-600'}`}
          >
            <div className="font-bold">Medium</div>
            <div className="text-xs opacity-75">Moderate</div>
          </button>
          <button
            onClick={() => setDifficulty('advanced')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${difficulty === 'advanced' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-red-300 text-slate-600'}`}
          >
            <div className="font-bold">Advanced</div>
            <div className="text-xs opacity-75">Complex</div>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-semibold text-slate-800">Language</h3>
            <p className="text-sm text-slate-500">Select quiz language</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 flex items-center justify-center gap-2 ${language === lang.code ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-300 text-slate-600'}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Number of Questions</label>
        <input
          type="range"
          min="3"
          max="20"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between mt-2 text-sm text-slate-500">
          <span>3</span>
          <span className="font-bold text-blue-600">{numQuestions}</span>
          <span>20</span>
        </div>
      </div>

      {/* Topic Filter - Only show after topics are available */}
      {availableTopics && availableTopics.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="font-semibold text-slate-800">Topic Filter</h3>
              <p className="text-sm text-slate-500">Select specific topics or all</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopic(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${selectedTopic === null
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                }`}
            >
              All Topics
            </button>
            {availableTopics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${selectedTopic === topic
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                  }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-semibold text-slate-800">Session Timer</h3>
              <p className="text-sm text-slate-500">Optional time limit</p>
            </div>
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
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm text-slate-600 mb-2">Time limit (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// B. Quiz View
const QuizView = ({ data, onComplete, timerEnabled, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]); // To track weak topics
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const currentQ = data[currentIndex];
  const isAnswered = selectedOption !== null;
  const timeLimitSeconds = timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;

  // Timer effect - Fixed with useRef to avoid stale closures
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
          // Auto-complete quiz when time is up
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

    // Save history for analytics - use functional update to avoid race condition
    setHistory(prevHistory => [...prevHistory, { ...currentQ, userCorrect: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
    } else {
      // Use functional state update to get the latest history
      setHistory(latestHistory => {
        onComplete({ score, total: data.length, history: latestHistory, type: 'quiz', timeElapsed });
        return latestHistory; // Return unchanged to avoid unnecessary updates
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress and Timer */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-slate-500">Question {currentIndex + 1} of {data.length}</span>
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{currentQ.tag}</span>
          {timerEnabled ? (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm ${timeRemaining < 60 ? 'bg-red-100 text-red-700' :
              timeRemaining < 180 ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>
      </div>

      {isTimeUp && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Time's up! Quiz completed.</span>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let baseStyle = "w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ";
            let statusStyle = "border-slate-100 hover:border-blue-200 hover:bg-slate-50"; // Default

            if (isAnswered) {
              if (idx === currentQ.correctIndex) statusStyle = "border-green-500 bg-green-50 text-green-700";
              else if (idx === selectedOption) statusStyle = "border-red-500 bg-red-50 text-red-700";
              else statusStyle = "border-slate-100 opacity-50";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isTimeUp}
                onClick={() => handleOptionClick(idx)}
                className={baseStyle + statusStyle}
              >
                <span className="font-medium">{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Smart Feedback - Show explanation after answering */}
        {isAnswered && currentQ.explanation && (
          <div className={`mt-6 p-4 rounded-lg border-2 animate-in fade-in slide-in-from-bottom-2 ${selectedOption === currentQ.correctIndex
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
            }`}>
            <div className="flex gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedOption === currentQ.correctIndex ? 'text-green-600' : 'text-blue-600'
                }`} />
              <div>
                <p className={`font-semibold mb-1 ${selectedOption === currentQ.correctIndex ? 'text-green-800' : 'text-blue-800'
                  }`}>
                  {selectedOption === currentQ.correctIndex ? '✓ Correct!' : 'ℹ Learn More'}
                </p>
                <p className={`text-sm leading-relaxed ${selectedOption === currentQ.correctIndex ? 'text-green-700' : 'text-blue-700'
                  }`}>
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end h-12">
        {(isAnswered || isTimeUp) && (
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors animate-in fade-in"
          >
            {currentIndex === data.length - 1 ? "Finish Quiz" : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// C. Flashcard View
const FlashcardView = ({ data, onComplete, timerEnabled, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ known: 0, unknown: 0 });
  const [timeElapsed, setTimeElapsed] = useState(0);

  const currentCard = data[currentIndex];
  const timeLimitSeconds = timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;

  // Timer effect
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
      setTimeout(() => setCurrentIndex(c => c + 1), 150); // Slight delay for smooth transition
    } else {
      onComplete({ ...stats, total: data.length, type: 'flashcard', timeElapsed });
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 text-sm font-medium text-slate-500">
        <span>Card {currentIndex + 1} of {data.length}</span>
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{currentCard.tag}</span>
          {timerEnabled ? (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm ${timeRemaining < 60 ? 'bg-red-100 text-red-700' :
              timeRemaining < 180 ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Container */}
      <div
        className="group perspective w-full h-80 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-all transform ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>

          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 shadow-md rounded-2xl flex items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">Term / Question</p>
              <h3 className="text-2xl font-bold text-slate-800">{currentCard.front}</h3>
              <p className="text-sm text-slate-400 mt-8">(Click to flip)</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-slate-800 text-white shadow-md rounded-2xl flex items-center justify-center p-8 text-center rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">Definition / Answer</p>
              <h3 className="text-xl font-medium leading-relaxed">{currentCard.back}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`mt-8 flex gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(false); }}
          className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-medium shadow-sm w-32 justify-center flex"
        >
          I didn't know
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(true); }}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl font-medium shadow-sm w-32 justify-center flex"
        >
          I knew this
        </button>
      </div>
    </div>
  );
};

// D. Dashboard / Summary View
const SummaryView = ({ results, onReset }) => {
  const isQuiz = results.type === 'quiz';

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculate statistics
  const percentage = isQuiz ? Math.round((results.score / results.total) * 100) : Math.round((results.known / results.total) * 100);

  // Calculate weak topics if quiz
  const weakTopics = isQuiz ? results.history.reduce((acc, curr) => {
    if (!curr.userCorrect) {
      acc[curr.tag] = (acc[curr.tag] || 0) + 1;
    }
    return acc;
  }, {}) : {};

  // Calculate topic statistics for visualization
  const topicStats = isQuiz ? results.history.reduce((acc, curr) => {
    if (!acc[curr.tag]) {
      acc[curr.tag] = { correct: 0, total: 0 };
    }
    acc[curr.tag].total++;
    if (curr.userCorrect) acc[curr.tag].correct++;
    return acc;
  }, {}) : {};

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
        <p className="text-slate-500">Here is how you performed.</p>
      </div>

      {/* Main Score Card with Visual Progress */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-600 mb-1">Your Score</p>
            <p className="text-5xl font-bold text-slate-800">{percentage}%</p>
            <p className="text-sm text-slate-500 mt-1">
              {isQuiz ? `${results.score} out of ${results.total} correct` : `${results.known} out of ${results.total} known`}
            </p>
          </div>
          <div className="relative w-32 h-32">
            {/* Circular Progress Ring */}
            <svg className="transform -rotate-90" width="128" height="128">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e2e8f0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(percentage / 100) * 351.86} 351.86`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${percentage >= 70 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              percentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{isQuiz ? results.score : results.known}</p>
          <p className="text-xs text-slate-500">Correct</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <XCircle className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{results.total - (isQuiz ? results.score : results.known)}</p>
          <p className="text-xs text-slate-500">Incorrect</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <FileText className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{results.total}</p>
          <p className="text-xs text-slate-500">Total</p>
        </div>
        {results.timeElapsed && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-5 h-5 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-slate-800">{Math.round(results.timeElapsed / results.total)}s</p>
            <p className="text-xs text-slate-500">Avg/Question</p>
          </div>
        )}
      </div>

      {/* Topic Performance Chart - Visual Bars */}
      {isQuiz && Object.keys(topicStats).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Performance by Topic</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(topicStats).map(([topic, stats]) => {
              const topicPercentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">{topic}</span>
                    <span className="text-sm font-bold text-slate-800">{stats.correct}/{stats.total} ({topicPercentage}%)</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
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

      {/* Weak Topics Section (Quiz Only) */}
      {isQuiz && Object.keys(weakTopics).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">Focus Areas - Review These Topics</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(weakTopics).map(([topic, count]) => (
              <div key={topic} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">{topic}</span>
                <span className="text-sm text-red-500 font-medium">Missed {count} question{count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isQuiz && Object.keys(weakTopics).length === 0 && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center mb-8">
          <p className="font-medium">Perfect score! No weak topics detected.</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Start New Session
      </button>
    </div>
  );
};

/* --- 3. MAIN APP --- */
const App = () => {
  const [stage, setStage] = useState('upload'); // upload, processing, quiz, flashcard, summary, error
  const [mode, setMode] = useState('quiz');
  const [data, setData] = useState(null);
  const [results, setResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);

  // New state variables
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLimit, setTimeLimit] = useState(5); // in minutes

  // Topic filtering
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleUpload = async (file) => {
    setStage('processing');
    setError(null);

    try {
      // Upload document to backend
      console.log('Uploading document...');
      const uploadResponse = await uploadDocument(file);
      console.log('Upload response:', uploadResponse);

      // Store session ID
      setSessionId(uploadResponse.session_id);

      // Generate quiz/flashcard with new parameters
      console.log(`Generating ${mode} with difficulty: ${difficulty}, language: ${language}...`);
      const generateResponse = await generateQuizOrFlashcard(
        uploadResponse.session_id,
        mode,
        numQuestions,
        difficulty,
        language
      );
      console.log('Generate response:', generateResponse);

      // Set data based on mode
      const generatedData = generateResponse.data;
      setData(generatedData);

      // Extract unique topics for filtering (only for quiz mode)
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>DocuQuiz</span>
          </div>
          {stage !== 'upload' && stage !== 'summary' && (
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {mode === 'quiz' ? 'Quiz Mode' : 'Flashcard Mode'}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12">
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
          <div className="flex flex-col items-center justify-center pt-20 animate-in fade-in duration-700">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-800">Processing Your Document...</h3>
            <p className="text-slate-500 mt-2">Extracting text, analyzing content, and generating {mode}s with AI</p>
            <p className="text-xs text-slate-400 mt-4">This may take 10-30 seconds depending on document size</p>
          </div>
        )}

        {stage === 'error' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Oops! Something Went Wrong</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
