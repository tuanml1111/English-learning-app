import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const CreateFlashcardModal = ({ onClose, onCreate }) => {
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [example, setExample] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      frontContent,
      backContent,
      pronunciation: pronunciation || undefined,
      partOfSpeech: partOfSpeech || undefined,
      example: example || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Flashcard</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Front content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front (Word/Question) *
            </label>
            <input
              type="text"
              value={frontContent}
              onChange={(e) => setFrontContent(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., Hello"
            />
          </div>

          {/* Pronunciation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pronunciation (Optional)
            </label>
            <input
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., /həˈloʊ/"
            />
          </div>

          {/* Part of speech */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part of Speech (Optional)
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Select...</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="pronoun">Pronoun</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
            </select>
          </div>

          {/* Back content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back (Definition/Answer) *
            </label>
            <textarea
              value={backContent}
              onChange={(e) => setBackContent(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="e.g., A greeting used when meeting someone"
            />
          </div>

          {/* Example */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Example Sentence (Optional)
            </label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder='e.g., "Hello! How are you today?"'
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlashcardModal;
