import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdLibraryBooks, MdDownload, MdExpandMore, MdExpandLess } from 'react-icons/md';

const Vocabulary = () => {
  const [libraries, setLibraries] = useState([]);
  const [expandedLibrary, setExpandedLibrary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibraries();
  }, []);

  const loadLibraries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/vocabulary');
      setLibraries(response.data.data);
    } catch (error) {
      toast.error('Failed to load vocabulary libraries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportToFlashcards = async (libraryId) => {
    try {
      const response = await axios.post(`/api/vocabulary/${libraryId}/import`);
      toast.success(`Imported ${response.data.data.imported} words to flashcards!`);
    } catch (error) {
      toast.error('Failed to import vocabulary');
    }
  };

  const toggleExpand = (libraryId) => {
    setExpandedLibrary(expandedLibrary === libraryId ? null : libraryId);
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Libraries</h1>
          <p className="text-gray-600">
            Pre-built word lists to expand your vocabulary
          </p>
        </div>

        {/* Libraries */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : libraries.length > 0 ? (
          <div className="space-y-6">
            {libraries.map((library) => {
              const isExpanded = expandedLibrary === library.id;

              return (
                <div
                  key={library.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Library header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MdLibraryBooks className="text-3xl text-primary" />
                          <h2 className="text-2xl font-bold text-gray-800">
                            {library.title}
                          </h2>
                        </div>
                        <p className="text-gray-600">{library.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            difficultyColors[library.difficulty] ||
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {library.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">
                          {library.wordCount} words
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {library.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleImportToFlashcards(library.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <MdDownload className="text-xl" />
                        Import to Flashcards
                      </button>
                      <button
                        onClick={() => toggleExpand(library.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <MdExpandLess className="text-xl" />
                            Hide Words
                          </>
                        ) : (
                          <>
                            <MdExpandMore className="text-xl" />
                            View Words
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Words list */}
                  {isExpanded && library.words && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {library.words.map((word, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-primary">
                                {word.word}
                              </h3>
                              {word.partOfSpeech && (
                                <span className="text-sm text-gray-500 italic">
                                  {word.partOfSpeech}
                                </span>
                              )}
                            </div>
                            {word.pronunciation && (
                              <p className="text-sm text-gray-500 mb-2">
                                {word.pronunciation}
                              </p>
                            )}
                            <p className="text-gray-700 mb-2">{word.meaning}</p>
                            {word.example && (
                              <p className="text-sm text-gray-600 italic">
                                "{word.example}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <MdLibraryBooks className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No vocabulary libraries yet
            </h3>
            <p className="text-gray-500">Check back later for new content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;
