const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
    cardsStudied: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
      comment: 'Duration in seconds',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
studySessionSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('StudySession', studySessionSchema);
