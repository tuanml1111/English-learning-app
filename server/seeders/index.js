/* eslint-disable no-console */
// Ensure env is loaded from server/.env even when run from repo root
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const {
  sequelize,
  GrammarTopic,
  VocabularyLibrary,
} = require('../models');

const grammarTopics = [
  {
    title: 'Simple Present Tense',
    category: 'Present Tense',
    description: 'Use for habits, facts, and scheduled events.',
    content: 'The Simple Present describes habits, facts, and schedules. Example: "I go to school every day."',
    rules: [
      'Add -s/-es for third person singular',
      'Use do/does for negatives and questions',
    ],
    examples: [
      { english: 'She plays tennis on Sundays.', vietnamese: 'Cô ấy chơi tennis vào Chủ nhật.' },
      { english: 'Water boils at 100°C.', vietnamese: 'Nước sôi ở 100°C.' },
    ],
    exercises: [
      {
        question: '___ you like coffee?',
        options: ['Do', 'Does', 'Did', 'Will'],
        correctAnswer: 'Do',
        explanation: 'Use "Do" for I/you/we/they in present simple questions.',
      },
    ],
    difficulty: 'beginner',
    tags: ['present', 'basic'],
  },
  {
    title: 'Simple Past Tense',
    category: 'Past Tense',
    description: 'Use for finished actions in the past.',
    content: 'Simple Past is used for completed actions in the past. Example: "I visited Paris last year."',
    rules: [
      'Add -ed for regular verbs',
      'Use the second form for irregular verbs',
    ],
    examples: [
      { english: 'They watched a movie yesterday.', vietnamese: 'Họ đã xem phim hôm qua.' },
      { english: 'He went to the store.', vietnamese: 'Anh ấy đã đi tới cửa hàng.' },
    ],
    exercises: [
      {
        question: 'She ___ (go) to school yesterday.',
        options: ['go', 'goes', 'went', 'gone'],
        correctAnswer: 'went',
        explanation: '"Went" is the past form of "go".',
      },
    ],
    difficulty: 'beginner',
    tags: ['past', 'basic'],
  },
  {
    title: 'Simple Future Tense',
    category: 'Future Tense',
    description: 'Use for decisions, predictions, and future facts.',
    content: 'Simple Future uses "will" or "be going to" for future actions. Example: "It will rain tomorrow."',
    rules: [
      'Use "will" for decisions/predictions',
      'Use "be going to" for plans/intents',
    ],
    examples: [
      { english: 'I will call you later.', vietnamese: 'Tôi sẽ gọi cho bạn sau.' },
      { english: 'She is going to start a new job.', vietnamese: 'Cô ấy sắp bắt đầu công việc mới.' },
    ],
    exercises: [
      {
        question: 'They ___ travel to Japan next month.',
        options: ['will', 'are', 'was', 'did'],
        correctAnswer: 'will',
        explanation: 'Use "will" for a neutral future plan.',
      },
    ],
    difficulty: 'beginner',
    tags: ['future', 'basic'],
  },
];

const vocabularyLibraries = [
  {
    title: 'Daily Life Basics',
    description: 'Common words for everyday conversations.',
    category: 'Daily',
    difficulty: 'easy',
    tags: ['daily', 'basic'],
    words: [
      { word: 'morning', meaning: 'the early part of the day', example: 'I exercise every morning.' },
      { word: 'breakfast', meaning: 'the first meal of the day', example: 'She has eggs for breakfast.' },
      { word: 'commute', meaning: 'travel some distance to work or school', example: 'He commutes by bus.' },
    ],
  },
  {
    title: 'Business Essentials',
    description: 'Vocabulary for office and meetings.',
    category: 'Business',
    difficulty: 'medium',
    tags: ['business', 'work'],
    words: [
      { word: 'agenda', meaning: 'a list of items to be discussed', example: 'Please share the meeting agenda.' },
      { word: 'deadline', meaning: 'the latest time for completion', example: 'The deadline is Friday.' },
      { word: 'contract', meaning: 'a written or spoken agreement', example: 'We signed the contract yesterday.' },
    ],
  },
];

const seed = async () => {
  try {
    console.log('Connecting to PostgreSQL…');
    await sequelize.authenticate();

    // Ensure schema is in sync (dev only)
    await sequelize.sync({ alter: true });

    console.log('Clearing existing sample data…');
    await GrammarTopic.destroy({ where: {} });
    await VocabularyLibrary.destroy({ where: {} });

    console.log('Seeding grammar topics…');
    await GrammarTopic.bulkCreate(grammarTopics);

    console.log('Seeding vocabulary libraries…');
    await VocabularyLibrary.bulkCreate(vocabularyLibraries);

    console.log('✅ Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
