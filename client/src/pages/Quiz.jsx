import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdQuiz, MdRefresh } from 'react-icons/md';

const Quiz = () => {
  const [dueCards, setDueCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/flashcards/due');
      setDueCards(response.data.data);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (error) {
      toast.error('Failed to load quiz cards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (confidence) => {
    const card = dueCards[currentIndex];

    try {
      await axios.put(`/api/flashcards/${card.id}/review`, {
        confidenceLevel: confidence,
      });

      // Move to next card
      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Finished all cards
        toast.success('Quiz completed! Great job!');
        loadDueCards();
      }
    } catch (error) {
      toast.error('Failed to save review');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <MdQuiz className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No cards due for review</h2>
          <p className="text-gray-600 mb-6">
            You're all caught up! Come back later or create more flashcards.
          </p>
          <button
            onClick={loadDueCards}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
          >
            <MdRefresh className="text-xl" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Card {currentIndex + 1} of {dueCards.length}
            </span>
            <button
              onClick={loadDueCards}
              className="text-sm text-primary hover:underline"
            >
              Restart Quiz
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 mb-6 min-h-[400px] flex flex-col items-center justify-center">
          {!showAnswer ? (
            // Front side - Question
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {currentCard.frontContent}
              </h2>
              {currentCard.pronunciation && (
                <p className="text-xl text-gray-500 mb-6">{currentCard.pronunciation}</p>
              )}
              {currentCard.partOfSpeech && (
                <p className="text-lg text-gray-600 italic">{currentCard.partOfSpeech}</p>
              )}
              <button
                onClick={() => setShowAnswer(true)}
                className="mt-8 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Show Answer
              </button>
            </div>
          ) : (
            // Back side - Answer
            <div className="text-center w-full">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {currentCard.frontContent}
              </h2>
              <div className="p-6 bg-gray-50 rounded-xl mb-6">
                <p className="text-xl text-gray-700 mb-4">{currentCard.backContent}</p>
                {currentCard.example && (
                  <p className="text-gray-600 italic">"{currentCard.example}"</p>
                )}
              </div>

              {/* Confidence buttons */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">How well did you know this?</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleAnswer(1)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleAnswer(3)}
                    className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Good
                  </button>
                  <button
                    onClick={() => handleAnswer(5)}
                    className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Easy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div>
            <span className="font-medium">Review count:</span> {currentCard.reviewCount || 0}
          </div>
          <div>
            <span className="font-medium">Confidence:</span> {currentCard.confidenceLevel}/5
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
