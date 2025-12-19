const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// ==================== USER MODEL ====================
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'users',
});

User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// ==================== FOLDER MODEL ====================
const Folder = sequelize.define('Folder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  parentFolder: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'parent_folder_id',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#6366f1',
  },
  icon: {
    type: DataTypes.STRING(50),
  },
  flashcardCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'folders',
});

// ==================== FLASHCARD MODEL ====================
const Flashcard = sequelize.define('Flashcard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  folderId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'folder_id',
  },
  frontContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  frontImage: {
    type: DataTypes.STRING(255),
  },
  backContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  backImage: {
    type: DataTypes.STRING(255),
  },
  pronunciation: {
    type: DataTypes.STRING(100),
  },
  partOfSpeech: {
    type: DataTypes.STRING(50),
  },
  example: {
    type: DataTypes.TEXT,
  },
  exampleSource: {
    type: DataTypes.STRING(255),
  },
  audioUrl: {
    type: DataTypes.STRING(255),
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastReviewed: {
    type: DataTypes.DATE,
  },
  nextReview: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isKnown: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  confidenceLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  tableName: 'flashcards',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['folder_id'] },
    { fields: ['is_known'] },
    { fields: ['next_review'] },
  ],
});

// ==================== READING MATERIAL MODEL ====================
const ReadingMaterial = sequelize.define('ReadingMaterial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'general',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'reading_materials',
});

ReadingMaterial.beforeSave(async (reading) => {
  if (reading.content) {
    reading.wordCount = reading.content.trim().split(/\s+/).length;
  }
});

// ==================== GRAMMAR TOPIC MODEL ====================
const GrammarTopic = sequelize.define('GrammarTopic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('Present Tense', 'Past Tense', 'Future Tense', 'Other'),
    defaultValue: 'Other',
  },
  description: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
  rules: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
  },
  examples: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  exercises: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  difficulty: {
    type: DataTypes.ENUM('Present Tense', 'Past Tense', 'Future Tense', 'Other'),
  defaultValue: 'Other',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'grammar_topics',
});

// ==================== VOCABULARY LIBRARY MODEL ====================
const VocabularyLibrary = sequelize.define('VocabularyLibrary', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: 'General',
  },
  words: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  wordCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  difficulty: {
    type: DataTypes.ENUM('Present Tense', 'Past Tense', 'Future Tense', 'Other'),
  defaultValue: 'Other',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'vocabulary_libraries',
});

VocabularyLibrary.beforeSave(async (library) => {
  if (library.words && Array.isArray(library.words)) {
    library.wordCount = library.words.length;
  }
});

// ==================== USER PROGRESS MODEL ====================
const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  grammarProgress: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  vocabularyProgress: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'user_progress',
});

// ==================== STUDY SESSION MODEL ====================
const StudySession = sequelize.define('StudySession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  folderId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'folder_id',
  },
  cardsStudied: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'study_sessions',
});

// ==================== QUIZ MODEL ====================
const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.ENUM('TOEIC', 'IELTS', 'General English', 'Business English', 'Academic'),
    defaultValue: 'General English',
  },
  difficulty: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    defaultValue: 'Intermediate',
  },
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
  },
  totalAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'quizzes',
  indexes: [
    { fields: ['category'] },
    { fields: ['difficulty'] },
    { fields: ['is_public'] },
  ],
});

// ==================== QUIZ ATTEMPT MODEL ====================
const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'quiz_id',
  },
  answers: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPassed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'quiz_attempts',
  indexes: [
    { fields: ['user_id', 'quiz_id'] },
    { fields: ['user_id', 'completed_at'] },
  ],
});

// ==================== RELATIONSHIPS ====================

// User has many Folders
User.hasMany(Folder, { foreignKey: 'user_id', as: 'folders', onDelete: 'CASCADE' });
Folder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Folder can have parent Folder (self-referencing)
Folder.hasMany(Folder, { foreignKey: 'parent_folder_id', as: 'children', onDelete: 'CASCADE' });
Folder.belongsTo(Folder, { foreignKey: 'parent_folder_id', as: 'parent' });

// User has many Flashcards
User.hasMany(Flashcard, { foreignKey: 'user_id', as: 'flashcards', onDelete: 'CASCADE' });
Flashcard.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Folder has many Flashcards
Folder.hasMany(Flashcard, { foreignKey: 'folder_id', as: 'flashcards', onDelete: 'SET NULL' });
Flashcard.belongsTo(Folder, { foreignKey: 'folder_id', as: 'folder' });

// User has many ReadingMaterials
User.hasMany(ReadingMaterial, { foreignKey: 'user_id', as: 'readings', onDelete: 'CASCADE' });
ReadingMaterial.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User has one UserProgress
User.hasOne(UserProgress, { foreignKey: 'user_id', as: 'progress', onDelete: 'CASCADE' });
UserProgress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User has many StudySessions
User.hasMany(StudySession, { foreignKey: 'user_id', as: 'sessions', onDelete: 'CASCADE' });
StudySession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Folder has many StudySessions
Folder.hasMany(StudySession, { foreignKey: 'folder_id', as: 'sessions', onDelete: 'SET NULL' });
StudySession.belongsTo(Folder, { foreignKey: 'folder_id', as: 'folder' });

// User has many QuizAttempts
User.hasMany(QuizAttempt, { foreignKey: 'user_id', as: 'quizAttempts', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Quiz has many QuizAttempts
Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', as: 'attempts', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });

// ==================== EXPORT ====================
module.exports = {
  sequelize,
  User,
  Folder,
  Flashcard,
  ReadingMaterial,
  GrammarTopic,
  VocabularyLibrary,
  UserProgress,
  StudySession,
  Quiz,
  QuizAttempt,
};

