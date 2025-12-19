const mongoose = require('mongoose');

const readingMaterialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    wordCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate word count before saving
readingMaterialSchema.pre('save', function (next) {
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).length;
  }
  next();
});

// Index for faster queries
readingMaterialSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ReadingMaterial', readingMaterialSchema);
