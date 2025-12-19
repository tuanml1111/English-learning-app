import React, { useState } from 'react';
import ReadingViewer from '../components/dashboard/ReadingViewer';
import FlashcardPanel from '../components/dashboard/FlashcardPanel';

const Dashboard = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [recentCards, setRecentCards] = useState([]);

  const handleWordSelect = (wordData) => {
    setSelectedWord(wordData);
  };

  const handleCardCreated = (newCard) => {
    setRecentCards([newCard, ...recentCards].slice(0, 5));
    setSelectedWord(null);
  };

  return (
    <div className="flex h-full">
      {/* Main content - Reading viewer */}
      <div className="flex-1 overflow-y-auto">
        <ReadingViewer onWordSelect={handleWordSelect} />
      </div>

      {/* Right panel - Flashcard preview and recent cards */}
      <div className="w-96 border-l border-gray-200 bg-white">
        <FlashcardPanel
          selectedWord={selectedWord}
          recentCards={recentCards}
          onCardCreated={handleCardCreated}
        />
      </div>
    </div>
  );
};

export default Dashboard;
