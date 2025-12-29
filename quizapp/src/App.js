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
  AlertCircle
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

// A. Upload Stage
const UploadStage = ({ onUpload, mode, setMode, numQuestions, setNumQuestions, difficulty, setDifficulty, language, setLanguage, timerEnabled, setTimerEnabled, timeLimit, setTimeLimit, availableTopics, selectedTopic, setSelectedTopic }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          {mode === 'quiz' ? 'Generate Quiz' : 'Generate Flashcards'}
        </h1>
        <p className="text-gray-600">Upload your document and configure your learning session</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload').click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div>
            <p className="text-base font-medium text-gray-700">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PDF, DOCX, or TXT (Max 10MB)</p>
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

      {/* Settings */}
      <div className="space-y-6">
        {/* Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${mode === 'quiz'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setMode('flashcard')}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${mode === 'flashcard'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
            >
              Flashcards
            </button>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {['basic', 'medium', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-colors ${difficulty === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Questions: {numQuestions}
          </label>
          <input
            type="range"
            min="3"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3</span>
            <span>20</span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between py-3 border-t border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-700">Session Timer</p>
            <p className="text-xs text-gray-500">Set a time limit for this session</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-focus:outline-none after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        {timerEnabled && (
          <div className="pl-4 border-l-2 border-gray-200">
            <label className="block text-sm text-gray-600 mb-2">Time limit (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
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
  const [history, setHistory] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const currentQ = data[currentIndex];
  const isAnswered = selectedOption !== null;
  const timeLimitSeconds = timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;

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
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Question {currentIndex + 1} of {data.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">{currentQ.tag}</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{timerEnabled ? formatTime(timeRemaining) : formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
          />
        </div>
      </div>

      {isTimeUp && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Time's up! Quiz will be submitted automatically.
        </div>
      )}

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let className = "w-full text-left px-4 py-3 rounded-lg border transition-colors ";

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                className += "border-green-500 bg-green-50 text-green-900";
              } else if (idx === selectedOption) {
                className += "border-red-500 bg-red-50 text-red-900";
              } else {
                className += "border-gray-200 text-gray-400";
              }
            } else {
              className += "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isTimeUp}
                onClick={() => handleOptionClick(idx)}
                className={className}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && currentQ.explanation && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {selectedOption === currentQ.correctIndex ? 'Correct' : 'Explanation'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
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
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {currentIndex === data.length - 1 ? "View Results" : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
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
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Card {currentIndex + 1} of {data.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">{currentCard.tag}</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{timerEnabled ? formatTime(timeRemaining) : formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="perspective w-full h-80 cursor-pointer mb-8"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">Question</p>
              <h3 className="text-2xl font-medium text-gray-900">{currentCard.front}</h3>
              <p className="text-sm text-gray-400 mt-6">Click to reveal answer</p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gray-900 text-white rounded-lg flex items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">Answer</p>
              <h3 className="text-xl font-normal leading-relaxed">{currentCard.back}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex gap-3 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(false); }}
          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Didn't Know
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleRating(true); }}
          className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Knew This
        </button>
      </div>
    </div>
  );
};

// D. Summary View
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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Session Complete</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>

      {/* Score Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Your Score</p>
          <p className="text-6xl font-semibold text-gray-900 mb-3">{percentage}%</p>
          <p className="text-gray-600">
            {isQuiz ? `${results.score} out of ${results.total} correct` : `${results.known} out of ${results.total} known`}
          </p>
        </div>
        <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{isQuiz ? results.score : results.known}</p>
          <p className="text-xs text-gray-500">Correct</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <XCircle className="w-5 h-5 text-red-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{results.total - (isQuiz ? results.score : results.known)}</p>
          <p className="text-xs text-gray-500">Incorrect</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <FileText className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{results.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        {results.timeElapsed && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <Clock className="w-5 h-5 text-gray-500 mb-2" />
            <p className="text-2xl font-semibold text-gray-900">{Math.round(results.timeElapsed / results.total)}s</p>
            <p className="text-xs text-gray-500">Avg/Question</p>
          </div>
        )}
      </div>

      {/* Topic Performance */}
      {isQuiz && Object.keys(topicStats).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Performance by Topic</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(topicStats).map(([topic, stats]) => {
              const topicPercentage = Math.round((stats.correct / stats.total) * 100);
              return (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">{topic}</span>
                    <span className="text-sm text-gray-600">{stats.correct}/{stats.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-700"
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-medium text-gray-900">Areas to Review</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(weakTopics).map(([topic, count]) => (
              <div key={topic} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{topic}</span>
                <span className="text-amber-700">Missed {count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-gray-900">QuizFlash</span>
          </div>
          {stage !== 'upload' && stage !== 'summary' && (
            <span className="text-sm text-gray-500">
              {mode === 'quiz' ? 'Quiz Mode' : 'Flashcard Mode'}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
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
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Your Document</h3>
            <p className="text-sm text-gray-600">This may take 10-30 seconds</p>
          </div>
        )}

        {stage === 'error' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something Went Wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
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
