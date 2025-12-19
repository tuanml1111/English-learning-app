import React, { useState, useEffect } from 'react';
import { MdClose, MdVolumeUp, MdVisibility } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudySession = ({ folderId, studyMode, onClose, onComplete }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studiedCount, setStudiedCount] = useState(0);

  useEffect(() => {
    loadCards();
  }, [folderId, studyMode]);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const params = { folderId };

      // Filter based on study mode
      if (studyMode === 'again') {
        params.confidenceLevel = '0,1,2'; // Again and Hard cards
      } else if (studyMode === 'hard') {
        params.confidenceLevel = '3'; // Only Hard cards
      }
      // studyMode === 'all' loads everything

      const response = await axios.get('/api/flashcards', { params });
      const shuffled = response.data.data.sort(() => Math.random() - 0.5);
      setCards(shuffled);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = async (confidence) => {
    const currentCard = cards[currentIndex];

    try {
      // Update card confidence level
      await axios.put(`/api/flashcards/${currentCard.id}`, {
        confidenceLevel: confidence,
        reviewCount: (currentCard.reviewCount || 0) + 1,
        lastReviewed: new Date(),
      });

      setStudiedCount(prev => prev + 1);

      // Move to next card or complete
      if (currentIndex + 1 >= cards.length) {
        toast.success('Study session completed!');
        onComplete();
      } else {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setShowExample(false);
      }
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">No cards to study</h3>
          <p className="text-gray-600 mb-6">
            {studyMode === 'again'
              ? 'No cards need review at this difficulty level.'
              : studyMode === 'hard'
              ? 'No hard cards to review.'
              : 'This folder is empty.'}
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Study Session</h2>
              <p className="text-gray-600">
                Card {currentIndex + 1} of {cards.length} • {studiedCount} studied
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="p-8">
          <div
            className="flashcard-container relative min-h-[350px] w-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`flashcard relative ${isFlipped ? 'flipped' : ''}`}>
              {/* Front side */}
              <div
                className="flashcard-front absolute inset-0 flex flex-col justify-center items-center p-8 rounded-xl border-2 border-slate-300 shadow-lg"
                style={{ backgroundColor: '#a6a6a6' }}
              >
                <div className="text-center w-full">
                  <h3 className="text-5xl font-bold mb-6 text-white leading-tight break-words overflow-wrap-anywhere">{currentCard.frontContent}</h3>
                  {currentCard.pronunciation && (
                    <div className="flex items-center justify-center gap-3 text-xl text-white/90 mb-3">
                      <span className="font-light">{currentCard.pronunciation}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(currentCard.frontContent);
                        }}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <MdVolumeUp className="text-2xl" />
                      </button>
                    </div>
                  )}
                  {currentCard.partOfSpeech && (
                    <p className="text-lg text-white/70 italic mb-4">{currentCard.partOfSpeech}</p>
                  )}

                  {currentCard.example && showExample && (
                    <div className="mt-6 bg-white/80 rounded-lg px-5 py-4 border-2 border-white">
                      <p className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Example</p>
                      <p className="italic text-base text-slate-700 break-words overflow-wrap-anywhere">"{currentCard.example}"</p>
                    </div>
                  )}
                </div>

                {currentCard.example && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExample(!showExample);
                    }}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-900/80 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    <MdVisibility className="text-lg" />
                    {showExample ? 'Hide' : 'Show'} example
                  </button>
                )}

                <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/20 rounded-lg">
                  <p className="text-sm text-white font-medium">Click to see answer</p>
                </div>
              </div>

              {/* Back side */}
              <div
                className="flashcard-back absolute inset-0 flex flex-col justify-center p-8 rounded-xl border-2 border-slate-300 shadow-lg"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="text-center w-full">
                  <h4 className="font-bold text-lg mb-4 text-gray-500 uppercase tracking-wide">Definition</h4>
                  <p className="text-2xl leading-relaxed mb-6 text-gray-800 font-medium break-words overflow-wrap-anywhere">{currentCard.backContent}</p>

                  {currentCard.example && showExample && (
                    <div className="mt-6 bg-slate-50 rounded-lg px-5 py-4 border-2 border-slate-200">
                      <p className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Example</p>
                      <p className="italic text-base text-slate-700 break-words overflow-wrap-anywhere">"{currentCard.example}"</p>
                    </div>
                  )}
                </div>

                {currentCard.example && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExample(!showExample);
                    }}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    <MdVisibility className="text-lg" />
                    {showExample ? 'Hide' : 'Show'} example
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Answer buttons (only show when flipped) */}
        {isFlipped && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-center text-gray-600 mb-4 font-medium">How well did you know this?</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleAnswer(1)}
                className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                <div className="text-lg mb-1">Again</div>
                <div className="text-sm opacity-90">Chưa nhớ</div>
              </button>
              <button
                onClick={() => handleAnswer(3)}
                className="px-6 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                <div className="text-lg mb-1">Hard</div>
                <div className="text-sm opacity-90">Nhớ vừa</div>
              </button>
              <button
                onClick={() => handleAnswer(5)}
                className="px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                <div className="text-lg mb-1">Easy</div>
                <div className="text-sm opacity-90">Nhớ rõ</div>
              </button>
            </div>
          </div>
        )}

        {!isFlipped && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-center text-gray-500">Click the card to flip and see the answer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;
