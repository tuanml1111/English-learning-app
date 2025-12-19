import React, { useState, useRef, useEffect } from 'react';
import { MdAdd, MdEdit, MdSave, MdDelete, MdBook } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReadingViewer = ({ onWordSelect }) => {
  const [view, setView] = useState('list'); // 'list', 'create', 'read'
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/readings');
      setReadings(response.data.data || []);
    } catch (error) {
      console.error('Failed to load readings:', error);
      setReadings([]); // Set empty array on error
      toast.error('Failed to load readings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      // Pass selected text directly without dictionary lookup
      onWordSelect({
        word: selectedText,
        phonetic: '',
        meanings: [],
        examples: '',
      });
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter both title and content');
      return;
    }

    try {
      await axios.post('/api/readings', {
        title,
        content,
        category: 'general',
      });

      toast.success('Reading material saved!');
      setTitle('');
      setContent('');
      setView('list');
      loadReadings();
    } catch (error) {
      toast.error('Failed to save reading material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;

    try {
      await axios.delete(`/api/readings/${id}`);
      toast.success('Reading deleted!');
      loadReadings();
      if (selectedReading?.id === id) {
        setView('list');
        setSelectedReading(null);
      }
    } catch (error) {
      toast.error('Failed to delete reading');
    }
  };

  const startCreating = () => {
    setTitle('');
    setContent('');
    setView('create');
  };

  const viewReading = async (id) => {
    try {
      const response = await axios.get(`/api/readings/${id}`);
      setSelectedReading(response.data.data);
      setView('read');
    } catch (error) {
      toast.error('Failed to load reading');
    }
  };

  return (
    <div className="h-full bg-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {view === 'list' ? 'My Readings' : view === 'create' ? 'New Reading' : 'Reading'}
          </h2>
          <div className="flex gap-2">
            {view === 'list' && (
              <button
                onClick={startCreating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <MdAdd className="text-xl" />
                New Reading
              </button>
            )}
            {view === 'create' && (
              <>
                <button
                  onClick={() => setView('list')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MdSave className="text-xl" />
                  Save
                </button>
              </>
            )}
            {view === 'read' && (
              <button
                onClick={() => setView('list')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to List
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        {view === 'list' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : readings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MdBook className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No reading materials yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Click "New Reading" to add your first reading material
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {readings.map((reading) => (
                  <div
                    key={reading.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => viewReading(reading.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <MdBook className="text-3xl text-primary flex-shrink-0" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(reading.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {reading.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{reading.wordCount || 0} words</span>
                      <span>•</span>
                      <span>{new Date(reading.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-4 py-2 text-2xl font-bold border-b-2 border-gray-300 focus:border-primary outline-none"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleTextSelection}
              ref={contentRef}
              placeholder="Paste or type your reading material here..."
              className="w-full h-96 px-4 py-2 text-gray-700 leading-relaxed border border-gray-300 rounded-lg focus:border-primary outline-none resize-none"
            />
            <p className="text-sm text-gray-500">
              💡 Tip: Select any text (word or phrase) to add to your flashcards
            </p>
          </div>
        )}

        {view === 'read' && selectedReading && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedReading.title}</h1>
            <div className="text-sm text-gray-500 mb-6">
              {selectedReading.wordCount || 0} words • {new Date(selectedReading.createdAt).toLocaleDateString()}
            </div>
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"
              onMouseUp={handleTextSelection}
            >
              {selectedReading.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingViewer;
