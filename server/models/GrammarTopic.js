const mongoose = require('mongoose');

const grammarTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Thì hiện tại', 'Thì quá khứ', 'Thì tương lai', 'Khác'],
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    rules: [{
      type: String,
    }],
    examples: [{
      english: {
        type: String,
        required: true,
      },
      vietnamese: {
        type: String,
        required: true,
      },
      note: {
        type: String,
        default: '',
      },
    }],
    exercises: [{
      question: {
        type: String,
        required: true,
      },
      options: [{
        type: String,
        required: true,
      }],
      correctAnswer: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        default: '',
      },
    }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
grammarTopicSchema.index({ category: 1, difficulty: 1 });
grammarTopicSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('GrammarTopic', grammarTopicSchema);
