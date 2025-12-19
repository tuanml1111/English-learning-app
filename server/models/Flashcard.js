const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Front side (Mặt trước)
    frontContent: {
      type: String,
      required: [true, 'Front content is required'],
      trim: true,
    },
    frontImage: {
      type: String,
      default: '',
    },
    // Back side (Mặt sau)
    backContent: {
      type: String,
      required: [true, 'Back content is required'],
      trim: true,
    },
    backImage: {
      type: String,
      default: '',
    },
    // Additional information
    pronunciation: {
      type: String,
      default: '',
    },
    partOfSpeech: {
      type: String,
      enum: ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'other', ''],
      default: '',
    },
    example: {
      type: String,
      default: '',
    },
    exampleSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReadingMaterial',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', ''],
      default: '',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    // Learning progress
    reviewCount: {
      type: Number,
      default: 0,
    },
    lastReviewed: {
      type: Date,
    },
    nextReview: {
      type: Date,
    },
    isKnown: {
      type: Boolean,
      default: false,
    },
    confidenceLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // Organization
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
flashcardSchema.index({ userId: 1, createdAt: -1 });
flashcardSchema.index({ userId: 1, folderId: 1 });
flashcardSchema.index({ userId: 1, isKnown: 1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
