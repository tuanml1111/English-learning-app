import React, { useState } from 'react';
import { MdDelete, MdVolumeUp, MdVisibility, MdEdit } from 'react-icons/md';

const FlashcardItem = ({ card, onDelete, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative group w-full">
      <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <MdEdit className="text-lg" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <MdDelete className="text-lg" />
        </button>
      </div>

      <div
        className="flashcard-container relative min-h-[260px] w-full cursor-pointer"
        onClick={() => setIsFlipped((prev) => !prev)}
      >
        <div className={`flashcard relative ${isFlipped ? 'flipped' : ''}`}>
          {/* Front side */}
          <div
            className="flashcard-front absolute inset-0 flex flex-col p-6 pb-14 rounded-xl text-slate-900 border border-slate-200 min-h-[220px] shadow-md"
            style={{ backgroundColor: '#b4b4b4' }}
          >
            <h3 className="text-3xl font-bold mb-2 leading-tight">{card.frontContent}</h3>
            {card.pronunciation && (
              <div className="flex items-center gap-2 text-base text-slate-700 mb-2">
                <span>{card.pronunciation}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(card.frontContent);
                  }}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <MdVolumeUp className="text-lg" />
                </button>
              </div>
            )}
            {card.partOfSpeech && (
              <p className="text-sm text-slate-600 italic mb-2">{card.partOfSpeech}</p>
            )}
            {card.example && showExample && (
              <div className="mt-2 bg-white/70 rounded-lg px-3 py-2 border border-slate-200 w-full">
                <p className="font-semibold text-slate-900 mb-1">Example</p>
                <p className="italic text-base break-words">"{card.example}"</p>
              </div>
            )}

            {card.example && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExample((prev) => !prev);
                }}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                <MdVisibility className="text-lg" />
                {showExample ? 'Hide example' : 'Show example'}
              </button>
            )}
          </div>

          {/* Back side */}
          <div
            className="flashcard-back absolute inset-0 flex flex-col p-6 pb-14 rounded-xl text-slate-900 border border-slate-200 min-h-[220px] shadow-md"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex-1 overflow-y-auto">
              <h4 className="font-semibold text-2xl mb-3">Definition</h4>
              <p className="text-lg leading-relaxed">{card.backContent}</p>

              {card.example && showExample && (
                <div className="mt-2 bg-white/70 rounded-lg px-3 py-2 border border-slate-200 w-full">
                  <p className="font-semibold text-slate-900 mb-1">Example</p>
                  <p className="italic text-base break-words">"{card.example}"</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 border-t border-slate-300 pt-2 mt-3">
              <div className="flex items-center gap-2">
                {card.reviewCount > 0 && <span>Reviewed: {card.reviewCount}</span>}
                {card.confidenceLevel !== undefined && (
                  <span>Confidence: {card.confidenceLevel}/5</span>
                )}
              </div>
            </div>

            {card.example && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExample((prev) => !prev);
                }}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
              >
                <MdVisibility className="text-lg" />
                {showExample ? 'Hide example' : 'Show example'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;
