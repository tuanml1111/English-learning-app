import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdPlayArrow, MdQuiz } from 'react-icons/md';
import ReviewQuizView from '../components/quiz/ReviewQuizView';

const NewQuiz = () => {
  console.log('NewQuiz component rendered');
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'take', 'review'
  const [reviewSession, setReviewSession] = useState(null);
  
  console.log('Current state - view:', view, 'isLoading:', isLoading, 'quizzes:', quizzes.length);

  const loadQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading quizzes...');
      const response = await axios.get('/api/quizzes');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      console.log('Quiz data type:', typeof response.data.data);
      console.log('Quiz data length:', response.data.data?.length);
      
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.error('Invalid quiz data format!');
        setQuizzes([]);
        setIsLoading(false);
        return;
      }
      
      // Transform quizzes - parse questions if string
      const transformedQuizzes = response.data.data.map(quiz => {
        console.log('Processing quiz:', quiz);
        return {
          ...quiz,
          questions: typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions
        };
      });
      
      console.log('Transformed quizzes:', transformedQuizzes);
      console.log('Setting quizzes with count:', transformedQuizzes.length);
      setQuizzes(transformedQuizzes);
    } catch (error) {
      console.error('Failed to load quizzes - Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      toast.error('Failed to load quizzes: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const getCategoryColor = (category) => {
    const colors = {
      'TOEIC': 'bg-blue-100 text-blue-700',
      'IELTS': 'bg-purple-100 text-purple-700',
      'General English': 'bg-green-100 text-green-700',
      'Business English': 'bg-orange-100 text-orange-700',
      'Academic': 'bg-pink-100 text-pink-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'text-green-600',
      'Intermediate': 'text-yellow-600',
      'Advanced': 'text-red-600',
    };
    return colors[difficulty] || 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (view === 'list') {
    console.log('Rendering list view, quizzes count:', quizzes.length);
    return (
      <div className="h-full bg-gray-50 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quizzes</h1>
            <p className="text-gray-600">Test your English knowledge with our practice quizzes</p>
          </div>

          {/* Quiz Cards */}
          {quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <MdQuiz className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes available</h3>
              <p className="text-gray-500">Check back later for new quizzes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(quiz.category)}`}>
                        {quiz.category}
                      </span>
                      <span className={`text-sm font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {quiz.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {quiz.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>{quiz.questionCount || 0} questions</span>
                      <span>•</span>
                      <span>{quiz.timeLimit} min</span>
                      <span>•</span>
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setView('take');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <MdPlayArrow className="text-xl" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Take Quiz View
  if (view === 'take' && selectedQuiz) {
    return <TakeQuizView
      quiz={selectedQuiz}
      onBack={() => {
        setView('list');
        setSelectedQuiz(null);
        setReviewSession(null);
      }}
      onReview={(session) => {
        setReviewSession(session);
        setView('review');
      }}
    />;
  }

  // Review Quiz View
  if (view === 'review' && selectedQuiz) {
    return <ReviewQuizView
      quiz={selectedQuiz}
      session={reviewSession}
      onBack={() => {
        setView('list');
        setSelectedQuiz(null);
        setReviewSession(null);
      }}
    />;
  }

  return null;
};

// Take Quiz Component
const TakeQuizView = ({ quiz, onBack, onReview }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState(quiz);
  const [loading, setLoading] = useState(false);
  const [quizSession, setQuizSession] = useState(null);

  // Fetch full quiz data if questions are not available
  useEffect(() => {
    if (!quiz.questions || quiz.questions.length === 0) {
      setLoading(true);
      axios.get(`/api/quizzes/${quiz.id}`)
        .then(res => {
          const fullQuiz = res.data.data;
          // Parse questions if string
          if (typeof fullQuiz.questions === 'string') {
            fullQuiz.questions = JSON.parse(fullQuiz.questions);
          }
          setQuizData(fullQuiz);
        })
        .catch(err => {
          toast.error('Failed to load quiz questions');
        })
        .finally(() => setLoading(false));
    } else {
      // Parse questions if they're strings
      if (typeof quiz.questions === 'string') {
        setQuizData({
          ...quiz,
          questions: JSON.parse(quiz.questions)
        });
      } else {
        setQuizData(quiz);
      }
    }
  }, [quiz]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const questions = quizData.questions || [];

  const handleSelectAnswer = (questionIdx, optionIdx) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [questionIdx]: optionIdx,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Calculate correct answers before submitting
      let correct = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correct_answer) {
          correct++;
        }
      });

      // Submit to backend
      const response = await axios.post(`/api/quizzes/${quiz.id}/submit`, {
        answers, // Send answers object: { 0: 1, 1: 2, ... }
        timeSpent: 5, // You can implement actual timer later
      });

      if (response.data.success) {
        const { score: backendScore, correctAnswers, totalQuestions, isPassed } = response.data.data;
        setScore(backendScore);
        setSubmitted(true);
        // Store session data for review
        setQuizSession({
          answers,
          score: backendScore,
          correctAnswers,
          totalQuestions,
          isPassed,
          questions
        });
        toast.success('Quiz submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  if (submitted) {
    const correctCount = Object.keys(answers).filter(k => answers[k] === questions[k].correct_answer).length;
    
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
            
            <div className="my-8">
              <div className="text-6xl font-bold text-primary mb-4">{score}%</div>
              <p className="text-xl text-gray-600">
                {score >= quizData.passingScore ? '✓ Passed!' : '✗ Failed'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700">
                You answered {correctCount} out of {questions.length} questions correctly
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => onReview(quizSession)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Review Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizData.title}</h1>
          <p className="text-gray-600 mb-4">{quizData.description}</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <span>📝 {questions.length} questions</span>
            <span>⏱️ {quizData.timeLimit} minutes</span>
            <span>✓ Pass: {quizData.passingScore}%</span>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Progress: {Object.keys(answers).length}/{questions.length}
          </p>
        </div>
      </div>

      {/* Scrollable Questions Container */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {questions.map((question, qIdx) => (
            <div key={qIdx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
              {/* Question Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  <span className="text-primary mr-2">Q{qIdx + 1}.</span>
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-4">
                {question.options.map((option, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx;
                  const isCorrect = optIdx === question.correct_answer;
                  const isWrong = isSelected && !isCorrect && submitted;

                  let buttonClass = 'bg-gray-50 border-gray-200 hover:border-primary/50 cursor-pointer';
                  
                  if (isSelected && !submitted) {
                    buttonClass = 'bg-primary/10 border-primary';
                  }
                  
                  if (submitted) {
                    if (isCorrect) {
                      buttonClass = 'bg-green-50 border-green-500 cursor-default';
                    } else if (isWrong) {
                      buttonClass = 'bg-red-50 border-red-500 cursor-default';
                    } else {
                      buttonClass = 'bg-gray-50 border-gray-200 cursor-default';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(qIdx, optIdx)}
                      disabled={submitted}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${buttonClass}`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex items-center flex-1">
                          <span
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-all ${
                              submitted
                                ? isCorrect
                                  ? 'bg-green-500 border-green-500'
                                  : isWrong
                                  ? 'bg-red-500 border-red-500'
                                  : 'border-gray-300'
                                : isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {submitted && isCorrect && <span className="text-white text-sm">✓</span>}
                            {submitted && isWrong && <span className="text-white text-sm">✗</span>}
                            {!submitted && isSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          <span className="text-gray-800">{option}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation - Only show after submit */}
              {submitted && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  answers[qIdx] === question.correct_answer
                    ? 'bg-green-50 border-l-green-500'
                    : 'bg-orange-50 border-l-orange-500'
                }`}>
                  <p className={`font-semibold mb-2 ${
                    answers[qIdx] === question.correct_answer ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {answers[qIdx] === question.correct_answer ? '✓ Correct!' : '✗ Incorrect'}
                  </p>
                  <p className="text-gray-700 text-sm">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Submit Button */}
      <div className="bg-white border-t border-gray-200 p-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Exit Quiz
          </button>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {Object.keys(answers).length === questions.length 
              ? 'Submit Quiz' 
              : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewQuiz;
