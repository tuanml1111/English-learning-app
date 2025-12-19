const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    grammarProgress: [{
      topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GrammarTopic',
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastStudied: {
        type: Date,
        default: Date.now,
      },
    }],
    vocabularyProgress: [{
      libraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VocabularyLibrary',
        required: true,
      },
      wordsLearned: {
        type: Number,
        default: 0,
      },
      totalWords: {
        type: Number,
        required: true,
      },
      lastStudied: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userProgressSchema.index({ userId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
