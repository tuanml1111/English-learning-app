import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdAdd, MdFolder, MdEdit, MdDelete, MdSchool, MdArrowDropDown, MdRefresh } from 'react-icons/md';
import FlashcardItem from '../components/flashcards/FlashcardItem';
import FolderTree from '../components/flashcards/FolderTree';
import FolderCard from '../components/flashcards/FolderCard';
import StudySession from '../components/flashcards/StudySession';
import CreateFolderModal from '../components/flashcards/CreateFolderModal';
import CreateFlashcardModal from '../components/flashcards/CreateFlashcardModal';
import EditFlashcardModal from '../components/flashcards/EditFlashcardModal';

const Flashcards = () => {
  const [folders, setFolders] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showStudySession, setShowStudySession] = useState(false);
  const [studyMode, setStudyMode] = useState('all');
  const [showStudyDropdown, setShowStudyDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadFolders();
    if (selectedFolder !== null) {
      loadFlashcards();
    } else {
      setFlashcards([]);
      setIsLoading(false);
    }
  }, [selectedFolder]);

  const loadFolders = async () => {
    try {
      const response = await axios.get('/api/folders');
      setFolders(response.data.data);
    } catch (error) {
      toast.error('Failed to load folders');
    }
  };

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      const params = selectedFolder ? { folderId: selectedFolder } : {};
      const response = await axios.get('/api/flashcards', { params });
      setFlashcards(response.data.data);
    } catch (error) {
      toast.error('Failed to load flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (folderData) => {
    try {
      const response = await axios.post('/api/folders', folderData);
      setFolders([...folders, response.data.data]);
      setShowFolderModal(false);
      toast.success('Folder created!');
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  const handleCreateCard = async (cardData) => {
    try {
      const data = selectedFolder ? { ...cardData, folderId: selectedFolder } : cardData;
      const response = await axios.post('/api/flashcards', data);
      setFlashcards([response.data.data, ...flashcards]);
      setShowCardModal(false);
      toast.success('Flashcard created!');
    } catch (error) {
      toast.error('Failed to create flashcard');
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  const handleUpdateCard = async (cardId, cardData) => {
    try {
      const response = await axios.put(`/api/flashcards/${cardId}`, cardData);
      setFlashcards(flashcards.map((card) =>
        card.id === cardId ? response.data.data : card
      ));
      setShowEditModal(false);
      setEditingCard(null);
      toast.success('Flashcard updated!');
    } catch (error) {
      toast.error('Failed to update flashcard');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await axios.delete(`/api/flashcards/${cardId}`);
      setFlashcards(flashcards.filter((card) => card.id !== cardId));
      toast.success('Flashcard deleted');
    } catch (error) {
      toast.error('Failed to delete flashcard');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure? This will delete all cards in this folder.')) return;

    try {
      await axios.delete(`/api/folders/${folderId}`);
      setFolders(folders.filter((folder) => folder.id !== folderId));
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
      toast.success('Folder deleted');
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  const handleStartStudy = (mode) => {
    setStudyMode(mode);
    setShowStudySession(true);
    setShowStudyDropdown(false);
  };

  const handleResetProgress = async () => {
    if (!confirm('Are you sure you want to reset all progress in this folder? This cannot be undone.')) return;

    try {
      await axios.post('/api/flashcards/reset-progress', { folderId: selectedFolder });
      toast.success('Progress reset successfully');
      loadFlashcards(); // Reload to show updated cards
    } catch (error) {
      toast.error('Failed to reset progress');
    }
  };

  const handleStudyComplete = () => {
    setShowStudySession(false);
    loadFlashcards(); // Reload to show updated confidence levels
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStudyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-full">
      {/* Left sidebar - Folders */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Folders</h2>
          <button
            onClick={() => setShowFolderModal(true)}
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <MdAdd className="text-xl" />
          </button>
        </div>

        <div className="space-y-2">
          {/* All cards option */}
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              selectedFolder === null
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MdFolder className="text-xl" />
            <span className="font-medium">All Folders</span>
          </button>

          {/* Folder list */}
          <FolderTree
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>
      </div>

      {/* Main content - Flashcards */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedFolder
                  ? folders.find((f) => f.id === selectedFolder)?.name || 'Folder'
                  : 'All Folders'}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedFolder ? `${flashcards.length} cards` : `${folders.length} folders`}
              </p>
            </div>
            {selectedFolder && (
              <div className="flex items-center gap-3">
                {/* Study button with dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowStudyDropdown(!showStudyDropdown)}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <MdSchool className="text-xl" />
                    Study
                    <MdArrowDropDown className="text-xl" />
                  </button>

                  {/* Dropdown menu */}
                  {showStudyDropdown && (
                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-64 z-50">
                      <button
                        onClick={() => handleStartStudy('all')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-800">Study All Cards</div>
                        <div className="text-sm text-gray-600">Review all flashcards</div>
                      </button>
                      <button
                        onClick={() => handleStartStudy('again')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-800">Study Again & Hard</div>
                        <div className="text-sm text-gray-600">Cards needing more practice</div>
                      </button>
                      <button
                        onClick={() => handleStartStudy('hard')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-gray-800">Study Hard Only</div>
                        <div className="text-sm text-gray-600">Focus on difficult cards</div>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleResetProgress}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
                      >
                        <div className="flex items-center gap-2">
                          <MdRefresh className="text-lg" />
                          <span className="font-semibold">Reset Progress</span>
                        </div>
                        <div className="text-sm ml-6">Start learning from scratch</div>
                      </button>
                    </div>
                  )}
                </div>

                {/* New Card button */}
                <button
                  onClick={() => setShowCardModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MdAdd className="text-xl" />
                  New Card
                </button>
              </div>
            )}
          </div>

          {/* Content - Show folders or flashcards based on selection */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : selectedFolder === null ? (
            // Show folders when no folder is selected
            folders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={setSelectedFolder}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MdFolder className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No folders yet
                </h3>
                <p className="text-gray-500">
                  Click the "+" button in the sidebar to create your first folder
                </p>
              </div>
            )
          ) : (
            // Show flashcards when a folder is selected
            flashcards.length > 0 ? (
              <div className="flex flex-col gap-6 max-w-5xl w-full mx-auto">
                {flashcards.map((card) => (
                  <FlashcardItem
                    key={card.id}
                    card={card}
                    onDelete={handleDeleteCard}
                    onEdit={handleEditCard}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MdFolder className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No flashcards yet
                </h3>
                <p className="text-gray-500">
                  Click "New Card" to create your first flashcard
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modals */}
      {showFolderModal && (
        <CreateFolderModal
          onClose={() => setShowFolderModal(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {showCardModal && (
        <CreateFlashcardModal
          onClose={() => setShowCardModal(false)}
          onCreate={handleCreateCard}
        />
      )}

      {showEditModal && editingCard && (
        <EditFlashcardModal
          card={editingCard}
          onClose={() => {
            setShowEditModal(false);
            setEditingCard(null);
          }}
          onUpdate={handleUpdateCard}
        />
      )}

      {/* Study Session */}
      {showStudySession && selectedFolder && (
        <StudySession
          folderId={selectedFolder}
          studyMode={studyMode}
          onClose={() => setShowStudySession(false)}
          onComplete={handleStudyComplete}
        />
      )}
    </div>
  );
};

export default Flashcards;
