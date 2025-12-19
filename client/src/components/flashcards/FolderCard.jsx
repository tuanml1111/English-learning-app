import React from 'react';
import { MdFolder, MdCheckCircle } from 'react-icons/md';

const FolderCard = ({ folder, onClick }) => {
  const totalCards = folder.flashcardCount || 0;
  const goodCards = folder.goodCount || 0;
  const progressPercentage = totalCards > 0 ? Math.round((goodCards / totalCards) * 100) : 0;

  return (
    <div
      onClick={() => onClick(folder.id)}
      className="bg-gray-100 hover:bg-gray-200 rounded-xl p-8 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-6 bg-primary/10 rounded-full">
          <MdFolder className="text-6xl text-primary" />
        </div>
        <div className="text-center w-full">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{folder.name}</h3>
          <p className="text-gray-600 mb-3">
            {totalCards} {totalCards === 1 ? 'card' : 'cards'}
          </p>

          {/* Progress indicator */}
          {totalCards > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <MdCheckCircle className="text-green-600" />
                <span className="font-semibold text-green-700">
                  {goodCards} / {totalCards} mastered
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{progressPercentage}% complete</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
