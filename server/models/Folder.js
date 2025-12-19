const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [100, 'Folder name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    color: {
      type: String,
      default: '#6B9BD1',
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code'],
    },
    icon: {
      type: String,
      default: 'folder',
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    flashcardCount: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
folderSchema.index({ userId: 1, parentFolder: 1 });
folderSchema.index({ userId: 1, createdAt: -1 });

// Pre-remove hook to handle nested folders and flashcards
folderSchema.pre('remove', async function (next) {
  // Remove all child folders
  await this.model('Folder').deleteMany({ parentFolder: this._id });

  // Update flashcards to remove folder reference
  await this.model('Flashcard').updateMany(
    { folderId: this._id },
    { $unset: { folderId: 1 } }
  );

  next();
});

module.exports = mongoose.model('Folder', folderSchema);
