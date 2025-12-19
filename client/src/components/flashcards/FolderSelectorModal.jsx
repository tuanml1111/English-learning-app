import React, { useState, useEffect } from 'react';
import { MdClose, MdFolder, MdFolderOpen } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';

const FolderSelectorModal = ({ isOpen, onClose, onSelectFolder, selectedWord }) => {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      loadFolders();
    }
  }, [isOpen]);

  const loadFolders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/folders');
      setFolders(response.data.data);
    } catch (error) {
      toast.error('Failed to load folders');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleSelectFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleConfirm = () => {
    if (selectedFolderId) {
      onSelectFolder(selectedFolderId);
      onClose();
    } else {
      toast.error('Please select a folder');
    }
  };

  const buildFolderTree = (folders, parentId = null, level = 0) => {
    return folders
      .filter((folder) => folder.parentFolder === parentId)
      .map((folder) => {
        const children = buildFolderTree(folders, folder.id, level + 1);
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;

        return (
          <div key={folder.id}>
            <div
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
              style={{ paddingLeft: `${level * 16 + 12}px` }}
              onClick={() => handleSelectFolder(folder.id)}
            >
              {children.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folder.id);
                  }}
                  className="p-1"
                >
                  {isExpanded ? (
                    <MdFolderOpen className="text-lg" />
                  ) : (
                    <MdFolder className="text-lg" />
                  )}
                </button>
              )}
              {children.length === 0 && <MdFolder className="text-lg ml-6" />}
              <span className="flex-1 font-medium">{folder.name}</span>
              <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {folder.flashcardCount || 0} cards
              </span>
            </div>
            {isExpanded && children.length > 0 && (
              <div className="ml-4">{children}</div>
            )}
          </div>
        );
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Select Folder</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-2xl text-gray-600" />
            </button>
          </div>
          {selectedWord && (
            <p className="text-gray-600 text-sm">
              Adding "<span className="font-semibold">{selectedWord.word}</span>" to folder
            </p>
          )}
        </div>

        {/* Folder list */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-12">
              <MdFolder className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No folders yet</p>
              <p className="text-gray-400 text-sm mt-2">Create a folder first to organize your flashcards</p>
            </div>
          ) : (
            <div className="space-y-1">
              {buildFolderTree(folders)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedFolderId}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderSelectorModal;
