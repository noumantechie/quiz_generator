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
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Globe
} from 'lucide-react';

/* --- 1. API CONFIGURATION --- */
const API_BASE_URL = `http://${window.location.hostname}:5000`;

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

// A. Upload Stage - Improved Design (No Scrolling)
const UploadStage = ({ onUpload, mode, setMode, numQuestions, setNumQuestions, difficulty, setDifficulty, language, setLanguage, timerEnabled, setTimerEnabled, timeLimit, setTimeLimit }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section - Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-900">AI-Powered Learning Platform</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transform Your Documents into
            <span className="block mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Interactive Learning
            </span>
          </h1>
          <p className="text-base text-gray-600">
            Upload any document and instantly generate quizzes or flashcards
          </p>
        </div>

        {/* Upload Area - Compact */}
        <div className="mb-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
            className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer group ${isDragging
                ? 'bg-indigo-100 border-3 border-indigo-400 scale-105'
                : selectedFile
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-400'
                  : 'bg-white border-3 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 shadow-lg'
              }`}
          >
            <div className="px-6 py-6">
              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-xl transition-all duration-300 ${isDragging
                    ? 'bg-indigo-200 scale-110'
                    : selectedFile
                      ? 'bg-green-100'
                      : 'bg-gray-100 group-hover:bg-indigo-100 group-hover:scale-110'
                  }`}>
                  {selectedFile ? (
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-600 group-hover:text-indigo-600" />
                  )}
                </div>
                <div className="text-center">
                  {selectedFile ? (
                    <>
                      <p className="text-lg font-bold text-gray-900 mb-1">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">✓ Ready to generate • Click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-600">PDF, DOCX, or TXT • Max 10MB</p>
                    </>
                  )}
                </div>
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
        </div>

        {/* Configuration Section - Full Width with Flexbox */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Configure Your Learning Session</h2>

          {/* First Row - Learning Mode & Difficulty (Blue/Orange theme) */}
          <div className="flex flex-col lg:flex-row gap-4 mb-5">
            {/* Learning Mode */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Learning Mode</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setMode('quiz')}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${mode === 'quiz'
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Target className={`w-7 h-7 ${mode === 'quiz' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`text-sm font-bold ${mode === 'quiz' ? 'text-indigo-900' : 'text-gray-700'}`}>
                        Quiz
                      </p>
                      <p className="text-xs text-gray-600">Test your knowledge</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setMode('flashcard')}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${mode === 'flashcard'
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb className={`w-7 h-7 ${mode === 'flashcard' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`text-sm font-bold ${mode === 'flashcard' ? 'text-purple-900' : 'text-gray-700'}`}>
                        Flashcards
                      </p>
                      <p className="text-xs text-gray-600">Interactive learning</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Difficulty Level</h3>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'basic', label: 'Basic', desc: 'Simple questions', color: 'green' },
                  { value: 'medium', label: 'Medium', desc: 'Moderate complexity', color: 'blue' },
                  { value: 'advanced', label: 'Advanced', desc: 'Critical thinking', color: 'red' }
                ].map(({ value, label, desc, color }) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${difficulty === value
                        ? `bg-${color}-500 text-white shadow-md`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div>{label}</div>
                        <div className={`text-xs font-normal ${difficulty === value ? 'text-white opacity-90' : 'text-gray-500'}`}>
                          {desc}
                        </div>
                      </div>
                      {difficulty === value && <CheckCircle className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - Language & Questions (Teal/Purple theme) */}
          <div className="flex flex-col lg:flex-row gap-4 mb-5">
            {/* Language */}
            <div className="flex-1 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Globe className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Language</h3>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer hover:border-teal-300"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions */}
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart2 className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Questions</h3>
                </div>
                <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
                  {numQuestions}
                </div>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                <span>3 min</span>
                <span>20 max</span>
              </div>
            </div>
          </div>

          {/* Timer - Full Width (Pink theme) */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 rounded-lg p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Clock className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Session Timer</h3>
                  <p className="text-xs text-gray-600">Optional time limit</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-rose-500 peer-focus:ring-4 peer-focus:ring-rose-300 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>
            {timerEnabled && (
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-rose-200 bg-white text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Minutes (1-60)"
                />
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={!selectedFile}
            className={`group inline-flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 ${selectedFile
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate {mode === 'quiz' ? 'Quiz' : 'Flashcards'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Question {currentIndex + 1} of {data.length}</p>
                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1">{currentQ.tag}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-900">
                {timerEnabled ? formatTime(timeRemaining) : formatTime(timeElapsed)}
              </span>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isTimeUp && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="font-medium text-red-900">Time's up! Quiz will be submitted.</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              let className = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 ";

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  className += "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-105";
                } else if (idx === selectedOption) {
                  className += "border-red-500 bg-gradient-to-r from-red-50 to-rose-50";
                } else {
                  className += "border-gray-200 opacity-50";
                }
              } else {
                className += "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md hover:scale-102";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered || isTimeUp}
                  onClick={() => handleOptionClick(idx)}
                  className={className}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && currentQ.explanation && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-blue-900 mb-2">
                    {selectedOption === currentQ.correctIndex ? '✓ Correct!' : 'Explanation'}
                  </p>
                  <p className="text-blue-800 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {(isAnswered || isTimeUp) && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              {currentIndex === data.length - 1 ? "View Results" : "Next Question"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Card {currentIndex + 1} of {data.length}</p>
                <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mt-1">{currentCard.tag}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">
                {timerEnabled ? formatTime(timeRemaining) : formatTime(timeElapsed)}
              </span>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          className="perspective w-full h-96 cursor-pointer mb-8"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="relative w-full h-full transition-transform duration-700"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div
              className="absolute inset-0 bg-white border-2 border-purple-200 rounded-3xl flex items-center justify-center p-12 text-center shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-400 mb-6 font-semibold">Question</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">{currentCard.front}</h3>
                <p className="text-sm text-gray-400">Click to reveal answer</p>
              </div>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-3xl flex items-center justify-center p-12 text-center shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-purple-200 mb-6 font-semibold">Answer</p>
                <h3 className="text-2xl font-medium leading-relaxed">{currentCard.back}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); handleRating(false); }}
            className="px-8 py-4 bg-white border-2 border-red-300 text-red-700 font-semibold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all hover:scale-105 shadow-lg"
          >
            Didn't Know
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRating(true); }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-xl"
          >
            Knew This
          </button>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Session Complete</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Excellent Work!</h2>
          <p className="text-xl text-gray-600">Here's your performance summary</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 mb-10 shadow-2xl text-white">
          <div className="text-center">
            <p className="text-indigo-100 mb-3 text-lg">Your Score</p>
            <p className="text-8xl font-bold mb-4">{percentage}%</p>
            <p className="text-xl text-indigo-100">
              {isQuiz ? `${results.score} out of ${results.total} correct` : `${results.known} out of ${results.total} known`}
            </p>
          </div>
          <div className="mt-8 h-4 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-1000 rounded-full shadow-lg"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition-shadow">
            <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
            <p className="text-4xl font-bold text-gray-900">{isQuiz ? results.score : results.known}</p>
            <p className="text-sm text-gray-600 font-medium">Correct</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200 hover:shadow-xl transition-shadow">
            <XCircle className="w-8 h-8 text-red-500 mb-3" />
            <p className="text-4xl font-bold text-gray-900">{results.total - (isQuiz ? results.score : results.known)}</p>
            <p className="text-sm text-gray-600 font-medium">Incorrect</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
            <FileText className="w-8 h-8 text-blue-500 mb-3" />
            <p className="text-4xl font-bold text-gray-900">{results.total}</p>
            <p className="text-sm text-gray-600 font-medium">Total</p>
          </div>
          {results.timeElapsed && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <Clock className="w-8 h-8 text-purple-500 mb-3" />
              <p className="text-4xl font-bold text-gray-900">{Math.round(results.timeElapsed / results.total)}s</p>
              <p className="text-sm text-gray-600 font-medium">Avg/Question</p>
            </div>
          )}
        </div>

        {isQuiz && Object.keys(topicStats).length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-10 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">Performance by Topic</h3>
            </div>
            <div className="space-y-6">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const topicPercentage = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-800">{topic}</span>
                      <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {stats.correct}/{stats.total} ({topicPercentage}%)
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 rounded-full ${topicPercentage >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            topicPercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-rose-500'
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

        {isQuiz && Object.keys(weakTopics).length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg mb-10 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h3 className="text-2xl font-bold text-gray-900">Areas to Review</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(weakTopics).map(([topic, count]) => (
                <div key={topic} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm border border-amber-200">
                  <span className="font-semibold text-gray-800">{topic}</span>
                  <span className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-lg font-medium">
                    Missed {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-5 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-3"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Session
        </button>
      </div>
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
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-50">
        <div className="w-full px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="font-bold text-3xl text-white">QuizFlash</h1>
              <p className="text-sm text-white/80">AI Learning Assistant</p>
            </div>
          </div>
          {stage !== 'upload' && stage !== 'summary' && (
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-white">
                {mode === 'quiz' ? 'Quiz Mode' : 'Flashcard Mode'}
              </span>
            </div>
          )}
        </div>
      </header>

      <main>
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
          />
        )}

        {stage === 'processing' && (
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center">
            <div className="w-24 h-24 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-10"></div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Processing Your Document</h3>
            <p className="text-xl text-gray-600">Analyzing content and generating {mode}s with AI...</p>
            <p className="text-lg text-gray-500 mt-3">This may take 10-30 seconds</p>
          </div>
        )}

        {stage === 'error' && (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center px-8">
            <div className="max-w-2xl w-full bg-white rounded-3xl p-16 text-center shadow-2xl border-4 border-red-200">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Something Went Wrong</h3>
              <p className="text-xl text-gray-600 mb-10">{error}</p>
              <button
                onClick={handleReset}
                className="px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white text-lg font-semibold rounded-2xl transition-all hover:scale-110 shadow-2xl"
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