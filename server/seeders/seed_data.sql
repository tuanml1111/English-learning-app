-- ====================================================
-- BRAINHUB - SAMPLE DATA FOR PUBLIC SCHEMA
-- ====================================================
-- Inserts sample data into the Sequelize-created tables

-- ====================================================
-- INSERT TEST USER
-- ====================================================
INSERT INTO public.users (id, username, email, password, created_at, updated_at) VALUES
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'testuser',
  'test@example.com',
  '$2a$10$qjYRR3.68J4Dj0rWJTJC5eHNXqCvBv8dJPXvEw8cZXVG2B1mfJJrK', -- password: 'password123' hashed
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT GRAMMAR TOPICS
-- ====================================================
INSERT INTO public.grammar_topics (id, title, category, description, content, difficulty, created_at, updated_at) VALUES
-- Topic 1: Present Tense
(
  'g1111111-1111-1111-1111-111111111111'::UUID,
  'Simple Present Tense',
  'Present Tense',
  'Learn how to use the simple present tense in English',
  '<h2>Simple Present Tense</h2><p>The simple present tense is used to express habits, general truths, and repeated actions.</p><h3>Formation</h3><p>Subject + Base Verb + (s/es for third person)</p><h3>Examples</h3><ul><li>I play football every day</li><li>She plays football every day</li><li>They go to school</li></ul>',
  'Beginner',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Topic 2: Past Tense
(
  'g2222222-2222-2222-2222-222222222222'::UUID,
  'Simple Past Tense',
  'Past Tense',
  'Learn how to use the simple past tense in English',
  '<h2>Simple Past Tense</h2><p>The simple past tense is used to express completed actions in the past.</p><h3>Formation</h3><p>Subject + Base Verb + ed</p><h3>Examples</h3><ul><li>I played football yesterday</li><li>She went to school last week</li></ul>',
  'Beginner',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Topic 3: Future Tense
(
  'g3333333-3333-3333-3333-333333333333'::UUID,
  'Simple Future Tense',
  'Future Tense',
  'Learn how to use the simple future tense in English',
  '<h2>Simple Future Tense</h2><p>The simple future tense is used to express actions that will happen in the future.</p><h3>Formation</h3><p>Will + Subject + Base Verb</p><h3>Examples</h3><ul><li>I will play football tomorrow</li><li>She will go to school next week</li></ul>',
  'Intermediate',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Topic 4: Present Continuous
(
  'g4444444-4444-4444-4444-444444444444'::UUID,
  'Present Continuous Tense',
  'Present Tense',
  'Learn how to use the present continuous tense',
  '<h2>Present Continuous Tense</h2><p>The present continuous tense is used to express actions happening right now.</p><h3>Formation</h3><p>Is/Am/Are + Subject + Base Verb + ing</p><h3>Examples</h3><ul><li>I am playing football now</li><li>She is going to school</li></ul>',
  'Intermediate',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Topic 5: Conditionals
(
  'g5555555-5555-5555-5555-555555555555'::UUID,
  'Conditional Sentences',
  'Other',
  'Learn how to use conditional sentences in English',
  '<h2>Conditional Sentences</h2><p>Conditional sentences are used to express what could happen or have happened.</p><h3>Types</h3><ul><li>First Conditional: If + present simple, will + base verb</li><li>Second Conditional: If + past simple, would + base verb</li><li>Third Conditional: If + past perfect, would have + past participle</li></ul>',
  'Advanced',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT VOCABULARY LIBRARIES
-- ====================================================
INSERT INTO public.vocabulary_libraries (id, title, description, category, difficulty, is_public, usage_count, created_at, updated_at) VALUES
-- Vocabulary 1: Business English
(
  'v1111111-1111-1111-1111-111111111111'::UUID,
  'Business English - Essential 20 Words',
  'Essential business vocabulary for workplace communication',
  'Business',
  'easy',
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Vocabulary 2: Daily Life
(
  'v2222222-2222-2222-2222-222222222222'::UUID,
  'Daily Life Vocabulary',
  'Common words used in everyday conversations',
  'Daily Life',
  'easy',
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Vocabulary 3: Travel
(
  'v3333333-3333-3333-3333-333333333333'::UUID,
  'Travel Vocabulary',
  'Words and phrases useful for traveling',
  'Travel',
  'medium',
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Vocabulary 4: Advanced Business
(
  'v4444444-4444-4444-4444-444444444444'::UUID,
  'Advanced Business Terminology',
  'Advanced vocabulary for business professionals',
  'Business',
  'hard',
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- Vocabulary 5: Academic English
(
  'v5555555-5555-5555-5555-555555555555'::UUID,
  'Academic English Vocabulary',
  'Vocabulary for academic and educational contexts',
  'Academic',
  'medium',
  TRUE,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT READING MATERIALS
-- ====================================================
INSERT INTO public.reading_materials (id, user_id, title, content, category, word_count, created_at, updated_at) VALUES
(
  'r1111111-1111-1111-1111-111111111111'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'Introduction to Cloud Computing',
  'Cloud computing is the on-demand delivery of computing resources, including servers, storage, databases, and software, over the internet. Instead of maintaining expensive computer hardware and data centers, companies can use cloud services to access computing resources as needed.',
  'Technology',
  125,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'r2222222-2222-2222-2222-222222222222'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'The Benefits of Meditation',
  'Meditation is a practice that involves focusing your mind and eliminating distractions. Regular meditation can reduce stress, improve concentration, enhance emotional health, and promote overall well-being. Studies show that people who meditate daily experience lower anxiety levels and better sleep quality.',
  'Health',
  98,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'r3333333-3333-3333-3333-333333333333'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'Sustainable Living Tips',
  'Sustainable living is about making conscious choices that reduce your environmental impact. You can start by reducing energy consumption, using renewable energy sources, minimizing waste through recycling and composting, and choosing eco-friendly products. Small changes in daily habits can make a significant difference.',
  'Environment',
  87,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT FOLDERS
-- ====================================================
INSERT INTO public.folders (id, user_id, name, description, color, created_at, updated_at) VALUES
(
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'TOEIC Preparation',
  'Cards for TOEIC exam preparation',
  '#3b82f6',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'IELTS Vocabulary',
  'Vocabulary cards for IELTS exam',
  '#8b5cf6',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'f-333333-3333-3333-3333-333333333333'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'Daily Practice',
  'Daily vocabulary practice',
  '#10b981',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT FLASHCARDS
-- ====================================================
INSERT INTO public.flashcards (id, user_id, folder_id, front_content, back_content, pronunciation, part_of_speech, example, confidence_level, created_at, updated_at) VALUES
-- Business Vocabulary Flashcards
(
  'c1111111-1111-1111-1111-111111111111'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'Absent',
  'Not present or not in attendance',
  '/ˈæbsənt/',
  'adjective',
  'Most students were absent from school.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c2222222-2222-2222-2222-222222222222'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'Accept',
  'To receive or agree to something offered',
  '/əkˈsept/',
  'verb',
  'We accept payment by credit card.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c3333333-3333-3333-3333-333333333333'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'Accommodation',
  'A place where someone can live or stay',
  '/əˌkɒməˈdeɪʃən/',
  'noun',
  'I need first-class accommodation for the conference.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c4444444-4444-4444-4444-444444444444'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'Account',
  'A record of financial transactions or personal profile',
  '/əˈkaʊnt/',
  'noun',
  'You need to create an account to use this service.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c5555555-5555-5555-5555-555555555555'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-111111-1111-1111-1111-111111111111'::UUID,
  'Achieve',
  'To successfully reach a goal or complete a task',
  '/əˈtʃiːv/',
  'verb',
  'She achieved her goal of becoming a doctor.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
-- IELTS Vocabulary Flashcards
(
  'c6666666-6666-6666-6666-666666666666'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'Acknowledge',
  'To recognize or admit the truth of something',
  '/əkˈnɒlɪdʒ/',
  'verb',
  'He acknowledged his mistake and apologized.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c7777777-7777-7777-7777-777777777777'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'Aggregate',
  'A collection or sum of things gathered together',
  '/ˈæɡrɪɡət/',
  'noun',
  'The aggregate of the survey results shows positive feedback.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c8888888-8888-8888-8888-888888888888'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'Allocate',
  'To assign or distribute something as a share or portion',
  '/ˈæləkeɪt/',
  'verb',
  'We need to allocate resources for this project.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'c9999999-9999-9999-9999-999999999999'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'Analyze',
  'To examine something carefully and in detail',
  '/ˈænəlaɪz/',
  'verb',
  'We need to analyze the data before making a decision.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'ca00000-0000-0000-0000-000000000000'::UUID,
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'f-222222-2222-2222-2222-222222222222'::UUID,
  'Appointment',
  'A scheduled meeting or arrangement',
  '/əˈpɔɪntmənt/',
  'noun',
  'I have an appointment with the manager at 3 PM.',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- INSERT QUIZ DATA
-- ====================================================
INSERT INTO public.quizzes (id, title, description, category, difficulty, is_public, questions, created_at, updated_at) VALUES
(
  'q1111111-1111-1111-1111-111111111111'::UUID,
  'Present Tense Quiz',
  'Test your knowledge of the present tense',
  'General English',
  'Beginner',
  TRUE,
  '[
    {
      "id": 1,
      "question": "Which sentence is correct?",
      "options": ["I goes to school", "I go to school", "I going to school", "I am go to school"],
      "correctAnswer": 1,
      "explanation": "''I go to school'' is the correct form of simple present tense."
    },
    {
      "id": 2,
      "question": "Does she _____ in an office?",
      "options": ["work", "works", "working", "is working"],
      "correctAnswer": 0,
      "explanation": "Use the base form ''work'' after the auxiliary verb ''does''."
    },
    {
      "id": 3,
      "question": "They _____ football every Saturday.",
      "options": ["playing", "plays", "play", "are play"],
      "correctAnswer": 2,
      "explanation": "With plural subject ''they'', use ''play'' without ''s''."
    }
  ]',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'q2222222-2222-2222-2222-222222222222'::UUID,
  'Past Tense Quiz',
  'Test your knowledge of the past tense',
  'General English',
  'Beginner',
  TRUE,
  '[
    {
      "id": 1,
      "question": "What is the past tense of ''go''?",
      "options": ["goes", "going", "went", "gone"],
      "correctAnswer": 2,
      "explanation": "''Went'' is the irregular past tense of ''go''."
    },
    {
      "id": 2,
      "question": "I _____ at home yesterday.",
      "options": ["am", "was", "were", "be"],
      "correctAnswer": 1,
      "explanation": "Use ''was'' with singular subjects in the past."
    },
    {
      "id": 3,
      "question": "She _____ to the market last week.",
      "options": ["go", "goes", "went", "going"],
      "correctAnswer": 2,
      "explanation": "''Went'' is the correct past tense form."
    }
  ]',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- SUMMARY
-- ====================================================
-- Inserted:
-- 1 test user
-- 5 grammar topics
-- 5 vocabulary libraries
-- 3 reading materials
-- 3 folders
-- 10 flashcards
-- 2 quizzes
