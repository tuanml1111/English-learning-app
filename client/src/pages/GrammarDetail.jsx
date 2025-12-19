import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdArrowBack, MdCheck, MdClose } from 'react-icons/md';

const GrammarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadTopic();
  }, [id]);

  const loadTopic = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/grammar/${id}`);
      setTopic(response.data.data);
    } catch (error) {
      toast.error('Failed to load topic');
      navigate('/grammar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (exerciseIdx, answer) => {
    if (!showResults) {
      setSelectedAnswers({ ...selectedAnswers, [exerciseIdx]: answer });
    }
  };

  const handleSubmitExercises = () => {
    setShowResults(true);
    const correct = topic.exercises.filter(
      (ex, idx) => selectedAnswers[idx] === ex.correctAnswer
    ).length;
    toast.success(`You got ${correct} out of ${topic.exercises.length} correct!`);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div className="p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/grammar')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <MdArrowBack className="text-xl" />
          Back to Grammar
        </button>

        {/* Topic header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{topic.title}</h1>
              <p className="text-gray-600">{topic.description}</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {topic.difficulty}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {topic.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        </div>

        {/* Rules */}
        {topic.rules && topic.rules.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rules</h2>
            <ul className="space-y-3">
              {topic.rules.map((rule, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-bold text-primary">{idx + 1}.</span>
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {topic.examples && topic.examples.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Examples</h2>
            <div className="space-y-4">
              {topic.examples.map((example, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 font-medium mb-1">{example.english}</p>
                  <p className="text-gray-600 mb-2">{example.vietnamese}</p>
                  {example.note && (
                    <p className="text-sm text-gray-500 italic">💡 {example.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises */}
        {topic.exercises && topic.exercises.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Practice Exercises</h2>
              {showResults && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>

            <div className="space-y-6">
              {topic.exercises.map((exercise, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCorrect = selectedAnswers[idx] === exercise.correctAnswer;

                return (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800 mb-4">
                      {idx + 1}. {exercise.question}
                    </p>

                    <div className="space-y-2 mb-3">
                      {exercise.options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[idx] === option;
                        const isCorrectAnswer = option === exercise.correctAnswer;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(idx, option)}
                            disabled={showResults}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                              showResults
                                ? isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isSelected
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                : isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">{option}</span>
                              {showResults && isCorrectAnswer && (
                                <MdCheck className="text-green-600 text-xl" />
                              )}
                              {showResults && isSelected && !isCorrectAnswer && (
                                <MdClose className="text-red-600 text-xl" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {exercise.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showResults && (
              <button
                onClick={handleSubmitExercises}
                disabled={Object.keys(selectedAnswers).length !== topic.exercises.length}
                className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarDetail;
