const { Quiz, sequelize } = require('../models');

const quizData = {
  title: 'IELTS Reading Practice Test',
  description: 'A comprehensive IELTS reading practice test covering various question types including multiple choice, true/false/not given, and matching headings.',
  category: 'IELTS',
  difficulty: 'Intermediate',
  timeLimit: 20,
  passingScore: 70,
  isPublic: true,
  questions: [
    {
      question: 'According to the passage, what is the main benefit of renewable energy sources?',
      options: [
        'They are cheaper than fossil fuels',
        'They produce minimal greenhouse gas emissions',
        'They are easier to implement',
        'They require less maintenance',
      ],
      correct_answer: 1,
      explanation: 'The passage emphasizes that renewable energy sources are beneficial primarily because they produce minimal greenhouse gas emissions, helping to combat climate change.',
    },
    {
      question: 'The author suggests that solar panels are becoming more popular because:',
      options: [
        'They are now affordable for most homeowners',
        'They last longer than traditional power sources',
        'Governments mandate their installation',
        'They work in all weather conditions',
      ],
      correct_answer: 0,
      explanation: 'The text indicates that decreasing costs have made solar panels accessible to more homeowners, driving their popularity.',
    },
    {
      question: 'Which statement is TRUE according to the text?',
      options: [
        'Wind energy can only be harnessed in coastal areas',
        'Hydroelectric power is the most efficient renewable energy',
        'Battery technology is crucial for storing renewable energy',
        'All countries have adopted renewable energy policies',
      ],
      correct_answer: 2,
      explanation: 'The passage clearly states that advances in battery technology are essential for storing energy generated from renewable sources.',
    },
    {
      question: 'What does the author imply about fossil fuels?',
      options: [
        'They will be completely replaced within a decade',
        'They are still necessary during the transition period',
        'They are becoming more environmentally friendly',
        'They are cheaper than all renewable alternatives',
      ],
      correct_answer: 1,
      explanation: 'The author acknowledges that fossil fuels will continue to play a role during the transition to renewable energy sources.',
    },
    {
      question: 'The word "intermittent" in paragraph 3 is closest in meaning to:',
      options: [
        'Continuous',
        'Irregular',
        'Reliable',
        'Powerful',
      ],
      correct_answer: 1,
      explanation: 'In context, "intermittent" refers to the irregular nature of renewable energy sources like solar and wind, which don\'t produce energy constantly.',
    },
    {
      question: 'According to the passage, which is NOT mentioned as a renewable energy source?',
      options: [
        'Solar power',
        'Wind energy',
        'Nuclear energy',
        'Hydroelectric power',
      ],
      correct_answer: 2,
      explanation: 'Nuclear energy is not mentioned in the passage as one of the renewable energy sources discussed.',
    },
    {
      question: 'The passage suggests that the future of energy will most likely involve:',
      options: [
        'Complete reliance on a single renewable source',
        'A combination of different renewable technologies',
        'A return to traditional fossil fuels',
        'Only solar and wind power',
      ],
      correct_answer: 1,
      explanation: 'The text implies that a diverse mix of renewable energy technologies will be necessary for a sustainable energy future.',
    },
    {
      question: 'What challenge does the author identify regarding renewable energy?',
      options: [
        'Public opposition to new technology',
        'The need for significant infrastructure investment',
        'Lack of scientific research',
        'Insufficient natural resources',
      ],
      correct_answer: 1,
      explanation: 'The passage discusses the need for substantial investment in infrastructure to support widespread adoption of renewable energy.',
    },
    {
      question: 'The author\'s attitude toward renewable energy can best be described as:',
      options: [
        'Skeptical',
        'Optimistic but realistic',
        'Neutral',
        'Highly critical',
      ],
      correct_answer: 1,
      explanation: 'The author presents renewable energy positively while acknowledging challenges, showing an optimistic yet realistic perspective.',
    },
    {
      question: 'Which of the following can be inferred from the passage?',
      options: [
        'Renewable energy will solve all environmental problems',
        'Government support is important for renewable energy adoption',
        'Traditional energy companies oppose all renewable initiatives',
        'Renewable energy is only suitable for developed countries',
      ],
      correct_answer: 1,
      explanation: 'The passage implies that policy support and government initiatives play a crucial role in promoting renewable energy adoption.',
    },
  ],
};

async function seedQuizzes() {
  try {
    console.log('🌱 Starting quiz seeding...');

    // Create quiz
    const quiz = await Quiz.create(quizData);
    console.log('✅ Quiz created successfully');
    console.log(`Quiz ID: ${quiz.id}`);
    console.log(`Title: ${quiz.title}`);
    console.log(`Questions: ${quiz.questions.length}`);

    console.log('\n🎉 Quiz seeding completed successfully!');
    return quiz;
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedQuizzes()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

module.exports = seedQuizzes;
