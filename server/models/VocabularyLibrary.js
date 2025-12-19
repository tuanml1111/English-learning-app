const mongoose = require('mongoose');

const vocabularyLibrarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Business', 'Academic', 'Daily', 'Medical', 'Technology', 'Other'],
    },
    words: [{
      word: {
        type: String,
        required: true,
        trim: true,
      },
      pronunciation: {
        type: String,
        default: '',
      },
      meaning: {
        type: String,
        required: true,
      },
      partOfSpeech: {
        type: String,
        default: '',
      },
      example: {
        type: String,
        default: '',
      },
      imageUrl: {
        type: String,
        default: '',
      },
      audioUrl: {
        type: String,
        default: '',
      },
    }],
    wordCount: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Calculate word count before saving
vocabularyLibrarySchema.pre('save', function (next) {
  this.wordCount = this.words.length;
  next();
});

// Index for faster queries
vocabularyLibrarySchema.index({ category: 1, difficulty: 1 });
vocabularyLibrarySchema.index({ title: 'text', description: 'text' });
vocabularyLibrarySchema.index({ usageCount: -1 });

module.exports = mongoose.model('VocabularyLibrary', vocabularyLibrarySchema);
