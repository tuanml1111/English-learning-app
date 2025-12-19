import React from 'react';
import { MdFolder, MdFolderOpen, MdDelete } from 'react-icons/md';

const FolderTree = ({ folders, selectedFolder, onSelectFolder, onDeleteFolder }) => {
  // Build folder hierarchy
  const rootFolders = folders.filter((f) => !f.parentFolder);

  const renderFolder = (folder, level = 0) => {
    const isSelected = selectedFolder === folder.id;
    const childFolders = folders.filter((f) => f.parentFolder === folder.id);

    return (
      <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
        <div className="group relative">
          <button
            onClick={() => onSelectFolder(folder.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isSelected ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isSelected ? (
              <MdFolderOpen className="text-xl flex-shrink-0" />
            ) : (
              <MdFolder className="text-xl flex-shrink-0" />
            )}
            <span className="font-medium flex-1 text-left truncate">{folder.name}</span>
            <span
              className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}
            >
              {folder.flashcardCount}
            </span>
          </button>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteFolder(folder.id);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded"
          >
            <MdDelete className="text-lg" />
          </button>
        </div>

        {/* Child folders */}
        {childFolders.length > 0 && (
          <div className="mt-1">
            {childFolders.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {rootFolders.map((folder) => renderFolder(folder))}
    </div>
  );
};

export default FolderTree;
