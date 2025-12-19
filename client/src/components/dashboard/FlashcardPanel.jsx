import React, { useState, useEffect } from 'react';
import { MdVolumeUp, MdCheck } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import FolderSelectorModal from '../flashcards/FolderSelectorModal';

const FlashcardPanel = ({ selectedWord, recentCards, onCardCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFolderSelector, setShowFolderSelector] = useState(false);

  // Editable fields
  const [frontContent, setFrontContent] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [backContent, setBackContent] = useState('');
  const [example, setExample] = useState('');

  // Update fields when selectedWord changes
  useEffect(() => {
    if (selectedWord) {
      setFrontContent(selectedWord.word || '');
      setPronunciation('');
      setPartOfSpeech('');
      setBackContent('');
      setExample('');
    }
  }, [selectedWord]);

  const handleAddToDeck = () => {
    if (!selectedWord) return;
    setShowFolderSelector(true);
  };

  const handleFolderSelected = async (folderId) => {
    if (!frontContent.trim()) {
      toast.error('Please enter the word/phrase');
      return;
    }

    if (!backContent.trim()) {
      toast.error('Please enter the definition');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/flashcards', {
        frontContent: frontContent.trim(),
        backContent: backContent.trim(),
        pronunciation: pronunciation.trim(),
        partOfSpeech: partOfSpeech,
        example: example.trim(),
        folderId: folderId,
      });

      onCardCreated(response.data.data);
      toast.success('Card added to folder!');

      // Reset fields
      setFrontContent('');
      setPronunciation('');
      setPartOfSpeech('');
      setBackContent('');
      setExample('');
    } catch (error) {
      toast.error('Failed to add card');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsKnown = async () => {
    toast.success('Marked as known!');
    // Optional: Could track known words in backend
  };

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Flashcard creator section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Flashcard</h3>

        {selectedWord ? (
          <div className="space-y-4">
            {/* Front Content (Word/Phrase) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word/Phrase <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={frontContent}
                  onChange={(e) => setFrontContent(e.target.value)}
                  placeholder="Enter word or phrase"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => speakWord(frontContent)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={!frontContent}
                >
                  <MdVolumeUp className="text-xl text-gray-600" />
                </button>
              </div>
            </div>

            {/* Pronunciation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pronunciation
              </label>
              <input
                type="text"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                placeholder="e.g., /həˈloʊ/"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Part of Speech */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part of Speech
              </label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="Noun">Noun</option>
                <option value="Verb">Verb</option>
                <option value="Adjective">Adjective</option>
                <option value="Adverb">Adverb</option>
                <option value="Pronoun">Pronoun</option>
                <option value="Preposition">Preposition</option>
                <option value="Conjunction">Conjunction</option>
                <option value="Interjection">Interjection</option>
                <option value="Phrase">Phrase</option>
              </select>
            </div>

            {/* Definition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Definition <span className="text-red-500">*</span>
              </label>
              <textarea
                value={backContent}
                onChange={(e) => setBackContent(e.target.value)}
                placeholder="Enter definition"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Example */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Example Sentence
              </label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Enter example sentence"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleAddToDeck}
              disabled={isLoading || !frontContent.trim() || !backContent.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add to Folder'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Select text to create a flashcard</p>
          </div>
        )}
      </div>

      {/* Folder selector modal */}
      <FolderSelectorModal
        isOpen={showFolderSelector}
        onClose={() => setShowFolderSelector(false)}
        onSelectFolder={handleFolderSelected}
        selectedWord={selectedWord}
      />

      {/* Recent cards section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Cards</h3>

        {recentCards.length > 0 ? (
          <div className="space-y-3">
            {recentCards.map((card, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer"
              >
                <h4 className="font-semibold text-gray-800">{card.frontContent}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {card.backContent}
                </p>
                {card.pronunciation && (
                  <p className="text-xs text-gray-500 mt-1">{card.pronunciation}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No recent cards yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardPanel;
