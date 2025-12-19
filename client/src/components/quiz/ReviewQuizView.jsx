import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdArrowBack, MdCheckCircle, MdCancel } from 'react-icons/md';

const ReviewQuizView = ({ quiz, session, onBack }) => {
  const [quizData, setQuizData] = useState(quiz);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Fetch full quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/quizzes/${quiz.id}`);
        const fullQuiz = response.data.data;

        // Parse questions if string
        let parsedQuestions = fullQuiz.questions;
        if (typeof parsedQuestions === 'string') {
          parsedQuestions = JSON.parse(parsedQuestions);
        }

        setQuizData(fullQuiz);
        setQuestions(parsedQuestions || []);
      } catch (error) {
        console.error('Failed to load quiz:', error);
        toast.error('Failed to load quiz details');

        // Fallback to quiz prop or session
        let parsedQuestions = session?.questions || quiz.questions;
        if (typeof parsedQuestions === 'string') {
          parsedQuestions = JSON.parse(parsedQuestions);
        }
        setQuestions(parsedQuestions || []);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quiz, session]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MdCancel className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions available</h3>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const userAnswers = session?.answers || {};
  const hasSession = session !== null;

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <MdArrowBack className="text-xl" />
            <span>Back to Quizzes</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{quizData.title}</h1>
          <p className="text-gray-600 mb-4">{quizData.description}</p>

          {/* Session Results Summary */}
          {hasSession && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Your Results</h3>
                  <p className="text-sm text-gray-600">Session completed</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{session.score}%</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{session.correctAnswers}</div>
                    <div className="text-xs text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{session.totalQuestions - session.correctAnswers}</div>
                    <div className="text-xs text-gray-600">Incorrect</div>
                  </div>
                  <div className="px-4 py-2 rounded-full font-semibold text-sm">
                    {session.isPassed ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">✓ Passed</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">✗ Failed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {quizData.category}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {quizData.difficulty}
            </span>
            <span className="text-gray-600">
              📝 {questions.length} questions
            </span>
            <span className="text-gray-600">
              ⏱️ {quizData.timeLimit} minutes
            </span>
            <span className="text-gray-600">
              ✓ Pass: {quizData.passingScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {questions.map((question, qIdx) => {
            const userAnswer = userAnswers[qIdx];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === question.correct_answer;

            return (
              <div
                key={qIdx}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 transition-shadow ${
                  hasSession
                    ? isCorrect
                      ? 'border-green-500 hover:shadow-lg'
                      : isAnswered
                      ? 'border-red-500 hover:shadow-lg'
                      : 'border-gray-300'
                    : 'border-primary hover:shadow-lg'
                }`}
              >
                {/* Question Header */}
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex-1">
                    <span className="text-primary mr-2">Question {qIdx + 1}.</span>
                    {question.question}
                  </h3>
                  {hasSession && isAnswered && (
                    <div className="ml-4">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          <MdCheckCircle /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          <MdCancel /> Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3 mb-4">
                  {question.options.map((option, optIdx) => {
                    const isThisCorrect = optIdx === question.correct_answer;
                    const isUserAnswer = optIdx === userAnswer;

                    let optionClass = 'bg-gray-50 border-gray-200';
                    let iconElement = null;

                    if (hasSession) {
                      if (isThisCorrect) {
                        optionClass = 'bg-green-50 border-green-500';
                        iconElement = <MdCheckCircle className="text-2xl text-green-500 flex-shrink-0" />;
                      } else if (isUserAnswer && !isThisCorrect) {
                        optionClass = 'bg-red-50 border-red-500';
                        iconElement = <MdCancel className="text-2xl text-red-500 flex-shrink-0" />;
                      } else {
                        iconElement = (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                        );
                      }
                    } else {
                      if (isThisCorrect) {
                        optionClass = 'bg-green-50 border-green-500';
                        iconElement = <MdCheckCircle className="text-2xl text-green-500 flex-shrink-0" />;
                      } else {
                        iconElement = (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                        );
                      }
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-4 rounded-lg border-2 transition-all ${optionClass}`}
                      >
                        <div className="flex items-start gap-3">
                          {iconElement}
                          <div className="flex-1">
                            <p className={`${isThisCorrect ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {option}
                            </p>
                            {isThisCorrect && (
                              <span className="inline-block mt-1 text-xs text-green-600 font-medium">
                                ✓ Correct Answer
                              </span>
                            )}
                            {hasSession && isUserAnswer && !isThisCorrect && (
                              <span className="inline-block mt-1 text-xs text-red-600 font-medium">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {hasSession ? (
            <p className="text-gray-600">
              Review: <span className="font-semibold text-green-600">{session.correctAnswers} correct</span> out of <span className="font-semibold">{session.totalQuestions}</span>
            </p>
          ) : (
            <p className="text-gray-600">
              Total: <span className="font-semibold">{questions.length}</span> questions
            </p>
          )}
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewQuizView;
