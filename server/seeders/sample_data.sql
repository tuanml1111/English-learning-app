-- ============================================
-- BrainHub Sample Data: Grammar & Vocabulary
-- ============================================
-- This script inserts sample data for Grammar Topics and Vocabulary Libraries
-- into the PostgreSQL database schemas

-- Set working environment
SET search_path TO public, grammar, vocabulary, quiz;

-- ============================================
-- 1. GRAMMAR TOPICS DATA
-- ============================================

INSERT INTO grammar.topics (
  id, title, category, description, content, rules, 
  examples, exercises, difficulty, tags, view_count, 
  created_at, updated_at
) VALUES

-- Grammar Topic 1: Simple Present Tense
(
  gen_random_uuid(),
  'Simple Present Tense',
  'Present Tense',
  'Learn how to use Simple Present for daily habits and facts',
  'The Simple Present Tense is used to describe:
1. Actions that happen regularly or habitually
2. Facts that are always true
3. General truths about the world
4. Scheduled events in the future

Formation:
- Positive: Subject + V1 (base form) + Object
- Negative: Subject + do/does + not + V1 + Object
- Question: Do/Does + Subject + V1 + Object?

Note: Third person singular adds -s or -es to the verb',
  ARRAY[
    'Add -s to third person singular verbs',
    'Use ''do'' or ''does'' for negatives and questions',
    'For verbs ending in -o, -ss, -x, -z, -sh, -ch: add -es',
    'For verbs ending in consonant + y: change y to i and add -es'
  ],
  '[]'::jsonb,
  '[]'::jsonb,
  'beginner',
  ARRAY['present', 'tense', 'basic', 'daily-habits'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Grammar Topic 2: Present Continuous Tense
(
  gen_random_uuid(),
  'Present Continuous Tense',
  'Present Tense',
  'Learn how to describe actions happening right now',
  'The Present Continuous Tense (also called Present Progressive) is used to describe:
1. Actions happening right now at this moment
2. Temporary situations
3. Future plans or arrangements
4. Annoying habits (with ''always'')

Formation:
- Positive: Subject + am/is/are + V-ing + Object
- Negative: Subject + am/is/are + not + V-ing + Object
- Question: Am/Is/Are + Subject + V-ing + Object?

Spelling Rules for -ing:
- Most verbs: add -ing (play → playing)
- Verb ending in -e: drop -e and add -ing (make → making)
- One syllable with CVC: double the last consonant (run → running)
- Verb ending in -ie: change to -y and add -ing (lie → lying)',
  ARRAY[
    'Use be + verb-ing form',
    'Remember: am/is/are changes according to subject',
    'Common mistake: Using simple present for present actions',
    'Double final consonant rule for one-syllable words'
  ],
  '[]'::jsonb,
  '[]'::jsonb,
  'beginner',
  ARRAY['present', 'continuous', 'progressive', 'now'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Grammar Topic 3: Past Simple Tense
(
  gen_random_uuid(),
  'Past Simple Tense',
  'Past Tense',
  'Master the most common past tense in English',
  'The Past Simple Tense is used to describe:
1. Actions completed in the past
2. Series of past events
3. Past facts and habits (no longer true)
4. Duration in the past with specific time

Formation:
- Regular Verbs: Subject + V-ed + Object
- Irregular Verbs: Subject + V2 (second form) + Object
- Negative: Subject + did + not + V1 + Object
- Question: Did + Subject + V1 + Object?

Time Expressions: yesterday, last week/month/year, ago, in 2020, when I was young',
  ARRAY[
    'Regular verbs add -ed',
    'Irregular verbs have special forms (go-went-gone)',
    'Use ''did'' for all subjects in negatives and questions',
    'Time expressions are important to identify past simple'
  ],
  '[]'::jsonb,
  '[]'::jsonb,
  'beginner',
  ARRAY['past', 'simple', 'regular', 'irregular'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Grammar Topic 4: Present Perfect Tense
(
  gen_random_uuid(),
  'Present Perfect Tense',
  'Present Tense',
  'Understand the connection between past and present',
  'The Present Perfect Tense is used to describe:
1. Actions that started in the past and continue to now
2. Past actions with present results
3. Life experiences (without specific time)
4. Recent events
5. To emphasize how many times something has happened

Formation:
- Positive: Subject + have/has + V3 (past participle) + Object
- Negative: Subject + have/has + not + V3 + Object
- Question: Have/Has + Subject + V3 + Object?

Time Expressions: for, since, yet, already, ever, never, recently, just',
  ARRAY[
    'Use have/has + past participle (V3)',
    'Do NOT use specific time (not "yesterday" or "last week")',
    'Use ''for'' with duration, ''since'' with starting point',
    'Common mistake: confusing with past simple'
  ],
  '[]'::jsonb,
  '[]'::jsonb,
  'intermediate',
  ARRAY['present', 'perfect', 'experience', 'unfinished'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Grammar Topic 5: Conditional Sentences (If Clauses)
(
  gen_random_uuid(),
  'Conditional Sentences (If Clauses)',
  'Khác',
  'Learn how to talk about possibilities and imaginary situations',
  'Conditional sentences are used to describe:
1. Real situations and their probable results (Type 0)
2. Possible situations and their results (Type 1)
3. Imaginary situations contrary to present reality (Type 2)
4. Imaginary situations contrary to past reality (Type 3)

Type 0 (General Truth): If + present simple, present simple
- If you heat water to 100°C, it boils.

Type 1 (Likely Future): If + present simple, will + infinitive
- If it rains tomorrow, we will cancel the picnic.

Type 2 (Imaginary Present): If + past simple, would + infinitive
- If I were you, I would study harder.

Type 3 (Imaginary Past): If + past perfect, would have + past participle
- If you had studied, you would have passed the exam.',
  ARRAY[
    'Type 1: Real future possibility',
    'Type 2: Imaginary present (contrary to fact)',
    'Type 3: Imaginary past (contrary to fact)',
    'Use comma after if-clause when it comes first',
    'Remember: would/could/might in main clause'
  ],
  '[]'::jsonb,
  '[]'::jsonb,
  'intermediate',
  'ARRAY[''conditional'', ''if-clause'', ''unreal'', ''hypothetical'']',
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================
-- 2. VOCABULARY LIBRARIES DATA
-- ============================================

INSERT INTO vocabulary.libraries (
  id, title, description, category, words, word_count, 
  difficulty, is_public, usage_count, tags, created_at, updated_at
) VALUES

-- Vocabulary Library 1: Basic Daily Vocabulary
(
  gen_random_uuid(),
  'Basic Daily Vocabulary',
  'Essential English words for everyday communication and daily activities',
  'Daily',
  '[
    {"word": "breakfast", "pronunciation": "/ˈbrekfəst/", "meaning": "First meal of the day, eaten in the morning", "partOfSpeech": "noun", "example": "I usually eat breakfast at 7 AM."},
    {"word": "coffee", "pronunciation": "/ˈkɔːfi/", "meaning": "A hot beverage made from roasted coffee beans", "partOfSpeech": "noun", "example": "Would you like a cup of coffee?"},
    {"word": "beautiful", "pronunciation": "/ˈbjuːtɪfl/", "meaning": "Pleasing to the eye; attractive; having great beauty", "partOfSpeech": "adjective", "example": "The sunset today is absolutely beautiful."},
    {"word": "help", "pronunciation": "/help/", "meaning": "To give assistance or support to someone", "partOfSpeech": "verb", "example": "Can you help me with my homework?"},
    {"word": "friend", "pronunciation": "/frend/", "meaning": "A person with whom one has a bond of affection", "partOfSpeech": "noun", "example": "My best friend lives next door."},
    {"word": "happy", "pronunciation": "/ˈhæpi/", "meaning": "Feeling or showing pleasure or contentment", "partOfSpeech": "adjective", "example": "She looks very happy today."},
    {"word": "market", "pronunciation": "/ˈmɑːrkɪt/", "meaning": "A place where goods are bought and sold", "partOfSpeech": "noun", "example": "I go to the market every Saturday morning."},
    {"word": "weather", "pronunciation": "/ˈweðər/", "meaning": "The state of the atmosphere at a particular place and time", "partOfSpeech": "noun", "example": "The weather is nice today."}
  ]'::jsonb,
  8,
  'easy',
  true,
  0,
  ARRAY['beginner', 'daily', 'essential', 'conversation'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Vocabulary Library 2: Business English
(
  gen_random_uuid(),
  'Business English',
  'Professional vocabulary for office work, meetings, and corporate communication',
  'Business',
  '[
    {"word": "conference", "pronunciation": "/ˈkɑːnfərəns/", "meaning": "A formal meeting of many people to discuss a particular topic", "partOfSpeech": "noun", "example": "The annual conference is scheduled for next month."},
    {"word": "deadline", "pronunciation": "/ˈdedlaɪn/", "meaning": "The last time or date by which something should be completed", "partOfSpeech": "noun", "example": "The project deadline is Friday at 5 PM."},
    {"word": "negotiation", "pronunciation": "/nɪˌɡoʊʃiˈeɪʃn/", "meaning": "Discussion aimed at reaching an agreement", "partOfSpeech": "noun", "example": "The negotiation between the two companies took weeks."},
    {"word": "proposal", "pronunciation": "/prəˈpoʊzl/", "meaning": "A plan or suggestion put forward for consideration", "partOfSpeech": "noun", "example": "I will submit my proposal tomorrow morning."},
    {"word": "portfolio", "pronunciation": "/pɔːrˈfoʊlioʊ/", "meaning": "A set of investments held by a person or organization", "partOfSpeech": "noun", "example": "His investment portfolio is very diverse."},
    {"word": "budget", "pronunciation": "/ˈbʌdʒɪt/", "meaning": "An estimate of income and expenditure for a set period", "partOfSpeech": "noun", "example": "We need to approve the budget for next year."},
    {"word": "revenue", "pronunciation": "/ˈrevənjuː/", "meaning": "Income, especially that of a company or organization", "partOfSpeech": "noun", "example": "The company''s revenue increased by 15% this quarter."},
    {"word": "strategy", "pronunciation": "/ˈstrætədʒi/", "meaning": "A plan of action designed to achieve a long-term goal", "partOfSpeech": "noun", "example": "Our marketing strategy focuses on social media."}
  ]'::jsonb,
  8,
  'medium',
  true,
  0,
  ARRAY['business', 'professional', 'corporate', 'work'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Vocabulary Library 3: Academic English
(
  gen_random_uuid(),
  'Academic English',
  'Vocabulary for students and academic writing including research and essays',
  'Academic',
  '[
    {"word": "research", "pronunciation": "/rɪˈsɜːrtʃ/", "meaning": "The systematic investigation into and study of materials and sources to establish facts", "partOfSpeech": "noun", "example": "She is conducting research on climate change."},
    {"word": "analysis", "pronunciation": "/əˈnæləsɪs/", "meaning": "Detailed examination of the elements or structure of something", "partOfSpeech": "noun", "example": "The data analysis revealed important trends."},
    {"word": "hypothesis", "pronunciation": "/haɪˈpɑːθəsɪs/", "meaning": "A proposed explanation made on the basis of limited evidence as a starting point", "partOfSpeech": "noun", "example": "The hypothesis was tested through experiments."},
    {"word": "methodology", "pronunciation": "/ˌmeθəˈdɑːlədʒi/", "meaning": "A system of methods and principles used in a particular discipline", "partOfSpeech": "noun", "example": "The research methodology was clearly explained."},
    {"word": "conclusion", "pronunciation": "/kənˈkluːʒn/", "meaning": "A judgment or decision reached by reasoning", "partOfSpeech": "noun", "example": "The conclusion of the study supported our initial hypothesis."},
    {"word": "evidence", "pronunciation": "/ˈevɪdəns/", "meaning": "The available body of facts or information indicating whether something is true", "partOfSpeech": "noun", "example": "There is strong evidence supporting this theory."},
    {"word": "evaluate", "pronunciation": "/ɪˈvæljueɪt/", "meaning": "To assess or estimate the nature, ability, or quality of something", "partOfSpeech": "verb", "example": "We need to evaluate the effectiveness of the program."},
    {"word": "cite", "pronunciation": "/saɪt/", "meaning": "To quote or refer to as evidence for or support of an argument", "partOfSpeech": "verb", "example": "Please cite your sources in the essay."}
  ]'::jsonb,
  8,
  'medium',
  true,
  0,
  ARRAY['academic', 'study', 'research', 'education'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Vocabulary Library 4: Technology & Innovation
(
  gen_random_uuid(),
  'Technology & Innovation',
  'Modern technology terms and vocabulary related to IT, software, and digital innovation',
  'Technology',
  '[
    {"word": "algorithm", "pronunciation": "/ˈælɡərɪðm/", "meaning": "A step-by-step procedure for solving a problem or completing a task", "partOfSpeech": "noun", "example": "The search algorithm helps find relevant results quickly."},
    {"word": "database", "pronunciation": "/ˈdeɪtəbeɪs/", "meaning": "An organized collection of data stored and accessed by computer systems", "partOfSpeech": "noun", "example": "The database contains millions of customer records."},
    {"word": "interface", "pronunciation": "/ˈɪntərfeɪs/", "meaning": "A device or program enabling communication between systems", "partOfSpeech": "noun", "example": "The user interface is intuitive and easy to navigate."},
    {"word": "artificial intelligence", "pronunciation": "/ɑːrˈtɪfɪʃl ɪnˈtelɪdʒəns/", "meaning": "The simulation of human intelligence by machines", "partOfSpeech": "noun", "example": "Artificial intelligence is transforming many industries."},
    {"word": "cloud computing", "pronunciation": "/klaʊd kəmˈpjuːtɪŋ/", "meaning": "Delivery of computing services over the internet", "partOfSpeech": "noun", "example": "Many companies are migrating to cloud computing."},
    {"word": "cybersecurity", "pronunciation": "/ˌsaɪbərˈsɪkjərɪti/", "meaning": "Protection of computer systems from malicious attacks", "partOfSpeech": "noun", "example": "Cybersecurity is crucial for protecting data."},
    {"word": "innovation", "pronunciation": "/ˌɪnəˈveɪʃn/", "meaning": "The introduction of new ideas, methods, or technology", "partOfSpeech": "noun", "example": "The company is known for its innovation in mobile technology."},
    {"word": "optimize", "pronunciation": "/ˈɑːptɪmaɪz/", "meaning": "To make as good or effective as possible", "partOfSpeech": "verb", "example": "We need to optimize the website for mobile devices."}
  ]'::jsonb,
  8,
  'hard',
  true,
  0,
  ARRAY['technology', 'digital', 'innovation', 'IT'],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================
-- 3. VERIFICATION QUERIES
-- ============================================

-- Verify Grammar Topics Inserted
SELECT 'GRAMMAR TOPICS INSERTED' AS status, COUNT(*) as total 
FROM grammar.topics;

-- Verify Vocabulary Libraries Inserted  
SELECT 'VOCABULARY LIBRARIES INSERTED' AS status, COUNT(*) as total 
FROM vocabulary.libraries;

-- Show all Grammar Topics
SELECT title, category, difficulty, array_length(tags, 1) as tag_count 
FROM grammar.topics 
ORDER BY created_at;

-- Show all Vocabulary Libraries with word count
SELECT title, category, difficulty, word_count, array_length(tags, 1) as tag_count 
FROM vocabulary.libraries 
ORDER BY created_at;

-- ============================================
-- END OF SAMPLE DATA SCRIPT
-- ============================================
