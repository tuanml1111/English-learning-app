-- ====================================================
-- BRAINHUB - COMPLETE SETUP & SAMPLE DATA
-- ====================================================
-- Creates schemas, tables, and inserts sample data
-- 20 vocabulary items + 5 grammar topics

-- ====================================================
-- STEP 1: CREATE SCHEMAS
-- ====================================================
CREATE SCHEMA IF NOT EXISTS grammar;
CREATE SCHEMA IF NOT EXISTS vocabulary;
CREATE SCHEMA IF NOT EXISTS quiz;

-- ====================================================
-- STEP 2: CREATE TABLES
-- ====================================================

-- GRAMMAR SCHEMA TABLES
CREATE TABLE IF NOT EXISTS grammar.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  rules TEXT[] DEFAULT '{}',
  examples JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  difficulty VARCHAR(50) DEFAULT 'beginner',
  tags VARCHAR(100)[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grammar.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic_id UUID NOT NULL REFERENCES grammar.topics(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic_id)
);

-- VOCABULARY SCHEMA TABLES
CREATE TABLE IF NOT EXISTS vocabulary.libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  words JSONB DEFAULT '[]',
  word_count INTEGER DEFAULT 0,
  difficulty VARCHAR(50) DEFAULT 'medium',
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  tags VARCHAR(100)[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vocabulary.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  library_id UUID NOT NULL REFERENCES vocabulary.libraries(id) ON DELETE CASCADE,
  words_learned INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  learning_status VARCHAR(50) DEFAULT 'not_started',
  last_studied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, library_id)
);

-- QUIZ SCHEMA TABLES
CREATE TABLE IF NOT EXISTS quiz.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  quiz_type VARCHAR(50) NOT NULL,
  related_grammar_topic_id UUID REFERENCES grammar.topics(id) ON DELETE SET NULL,
  related_vocabulary_library_id UUID REFERENCES vocabulary.libraries(id) ON DELETE SET NULL,
  difficulty VARCHAR(50) DEFAULT 'medium',
  duration_minutes INTEGER,
  passing_score_percent INTEGER DEFAULT 70,
  questions JSONB NOT NULL,
  question_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  is_draft BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES quiz.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  score_percent INTEGER NOT NULL,
  answers JSONB NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_grammar_topics_category ON grammar.topics(category);
CREATE INDEX IF NOT EXISTS idx_grammar_topics_difficulty ON grammar.topics(difficulty);
CREATE INDEX IF NOT EXISTS idx_grammar_progress_user ON grammar.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_grammar_progress_topic ON grammar.user_progress(topic_id);

CREATE INDEX IF NOT EXISTS idx_vocab_libraries_category ON vocabulary.libraries(category);
CREATE INDEX IF NOT EXISTS idx_vocab_libraries_usage ON vocabulary.libraries(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_vocab_progress_user ON vocabulary.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_vocab_progress_library ON vocabulary.user_progress(library_id);

CREATE INDEX IF NOT EXISTS idx_quiz_type ON quiz.quizzes(quiz_type);
CREATE INDEX IF NOT EXISTS idx_quiz_published ON quiz.quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_attempt_user ON quiz.attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempt_quiz ON quiz.attempts(quiz_id);

-- ====================================================
-- STEP 3: INSERT VOCABULARY DATA - 20 WORDS
-- ====================================================

INSERT INTO vocabulary.libraries (title, description, category, words, word_count, difficulty, is_public, usage_count) VALUES
(
  'Business Vocabulary - 20 Essential Words',
  'Tong hop 20 tu vung thong dung trong moi truong van phong, cong so',
  'Business',
  '[
    {
      "word": "absent",
      "pronunciation": "/aebsent/",
      "meaning": "vang mat (vi dau om,...)",
      "partOfSpeech": "adjective",
      "example": "Most students were absent from school."
    },
    {
      "word": "accept",
      "pronunciation": "/aksept/",
      "meaning": "nhan, chap nhan",
      "partOfSpeech": "verb",
      "example": "We accept payment by credit card or cash."
    },
    {
      "word": "accommodation",
      "pronunciation": "/akamadasen/",
      "meaning": "cho tro, cho an o",
      "partOfSpeech": "noun",
      "example": "I need first-class accommodation for the conference."
    },
    {
      "word": "account",
      "pronunciation": "/akaunt/",
      "meaning": "tai khoan",
      "partOfSpeech": "noun",
      "example": "You need to create an account to use this service."
    },
    {
      "word": "achieve",
      "pronunciation": "/atiev/",
      "meaning": "dat duoc, gianh duoc",
      "partOfSpeech": "verb",
      "example": "She achieved her goal of becoming a doctor."
    },
    {
      "word": "acknowledge",
      "pronunciation": "/aknoldj/",
      "meaning": "thua nhan, cong nhan",
      "partOfSpeech": "verb",
      "example": "He acknowledged his mistake and apologized."
    },
    {
      "word": "agenda",
      "pronunciation": "/ajenda/",
      "meaning": "chuong trinh, ke hoach",
      "partOfSpeech": "noun",
      "example": "What is on the agenda for today meeting?"
    },
    {
      "word": "allocate",
      "pronunciation": "/alocaet/",
      "meaning": "phan bo, gan cho",
      "partOfSpeech": "verb",
      "example": "We need to allocate resources for this project."
    },
    {
      "word": "analyze",
      "pronunciation": "/analaiz/",
      "meaning": "phan tich",
      "partOfSpeech": "verb",
      "example": "We need to analyze the data before making a decision."
    },
    {
      "word": "appointment",
      "pronunciation": "/apointment/",
      "meaning": "cuoc hen, buoi hen",
      "partOfSpeech": "noun",
      "example": "I have an appointment with the manager at 3 PM."
    },
    {
      "word": "appreciate",
      "pronunciation": "/aprishiaet/",
      "meaning": "danh gia cao, cam on",
      "partOfSpeech": "verb",
      "example": "We appreciate your hard work and dedication."
    },
    {
      "word": "approach",
      "pronunciation": "/aproutsh/",
      "meaning": "cach tiep can, den gan",
      "partOfSpeech": "verb",
      "example": "We need a different approach to solve this problem."
    },
    {
      "word": "asset",
      "pronunciation": "/aset/",
      "meaning": "tai san, quy",
      "partOfSpeech": "noun",
      "example": "Our main asset is our skilled workforce."
    },
    {
      "word": "assign",
      "pronunciation": "/asain/",
      "meaning": "giao cho, phan cong",
      "partOfSpeech": "verb",
      "example": "I will assign this task to you tomorrow."
    },
    {
      "word": "assistance",
      "pronunciation": "/asistans/",
      "meaning": "su giup do, ho tro",
      "partOfSpeech": "noun",
      "example": "Do you need any assistance with this project?"
    },
    {
      "word": "assume",
      "pronunciation": "/asum/",
      "meaning": "gia dinh, cho rang",
      "partOfSpeech": "verb",
      "example": "I assume you have received my email."
    },
    {
      "word": "assure",
      "pronunciation": "/ashur/",
      "meaning": "dam bao, cam doan",
      "partOfSpeech": "verb",
      "example": "I assure you that this is confidential."
    },
    {
      "word": "attend",
      "pronunciation": "/atend/",
      "meaning": "tham du, cham soc",
      "partOfSpeech": "verb",
      "example": "I will attend the meeting on Friday."
    },
    {
      "word": "attitude",
      "pronunciation": "/atitood/",
      "meaning": "thai do, lap truong",
      "partOfSpeech": "noun",
      "example": "A positive attitude is important for success."
    },
    {
      "word": "authority",
      "pronunciation": "/athority/",
      "meaning": "quyen han, chinh quyen",
      "partOfSpeech": "noun",
      "example": "He has the authority to make final decisions."
    }
  ]'::jsonb,
  20,
  'easy',
  true,
  0
);

-- ====================================================
-- STEP 4: INSERT GRAMMAR DATA - 5 TOPICS
-- ====================================================

-- GRAMMAR 1: Present Simple
INSERT INTO grammar.topics (title, category, description, content, rules, examples, exercises, difficulty, tags) VALUES
(
  'Present Simple (Hien tai don)',
  'Thi hien tai',
  'Thi hien tai don dung de dien ta thoi quen, hanh dong lap di lap lai, su that hien nhien',
  '<h2>Cong thuc</h2><h3>Khang dinh</h3><p><strong>S + V(s/es)</strong></p><p>Vi du: She <strong>goes</strong> to school every day.</p><h3>Phu dinh</h3><p><strong>S + do/does + not + V (nguyen the)</strong></p><p>Vi du: He <strong>does not like</strong> coffee.</p><h3>Nghi van</h3><p><strong>Do/Does + S + V (nguyen the)?</strong></p><p>Vi du: <strong>Do</strong> you <strong>speak</strong> English?</p>',
  ARRAY[
    'Dien ta thoi quen, hanh dong lap di lap lai',
    'Dien ta su that hien nhien, chan ly',
    'Lich trinh, thoi gian bieu co dinh',
    'Dong tu them s/es voi ngoi thu 3 so it'
  ],
  '[
    {"english": "I go to school every day.", "vietnamese": "Toi di hoc moi ngay.", "note": "Thoi quen hang ngay"},
    {"english": "The sun rises in the east.", "vietnamese": "Mat troi moc o phia dong.", "note": "Su that hien nhien"},
    {"english": "She does not like coffee.", "vietnamese": "Co ay khong thich ca phe.", "note": "Phu dinh"}
  ]'::jsonb,
  '[
    {"question": "I ____ to work by bus every day.", "options": ["go", "goes", "went", "going"], "correctAnswer": "go", "explanation": "Dung present simple, ngoi thu nhat so nhieu"},
    {"question": "Does she _____ English?", "options": ["speak", "speaks", "spoke", "speaking"], "correctAnswer": "speak", "explanation": "Sau Do/Does dung dong tu nguyen the"},
    {"question": "He _____ in London.", "options": ["lives", "live", "lived", "living"], "correctAnswer": "lives", "explanation": "Ngoi thu 3 so it them s"}
  ]'::jsonb,
  'beginner',
  ARRAY['present', 'simple', 'habit', 'thoi quen']
);

-- GRAMMAR 2: Present Continuous
INSERT INTO grammar.topics (title, category, description, content, rules, examples, exercises, difficulty, tags) VALUES
(
  'Present Continuous (Hien tai tiep dien)',
  'Thi hien tai',
  'Thi hien tai tiep dien dung de dien ta hanh dong dang xay ra tai thoi diem noi',
  '<h2>Cong thuc</h2><h3>Khang dinh</h3><p><strong>S + am/is/are + V-ing</strong></p><p>Vi du: She <strong>is studying</strong> right now.</p><h3>Phu dinh</h3><p><strong>S + am/is/are + not + V-ing</strong></p><p>Vi du: I <strong>am not working</strong> today.</p><h3>Nghi van</h3><p><strong>Am/Is/Are + S + V-ing?</strong></p><p>Vi du: <strong>Are</strong> you <strong>watching</strong> TV?</p>',
  ARRAY[
    'Dien ta hanh dong dang xay ra tai thoi diem noi',
    'Dien ta ke hoach trong tuong lai gan',
    'Dien ta qua trinh, su thay doi',
    'Thuong dung voi now, at the moment, right now'
  ],
  '[
    {"english": "I am studying English right now.", "vietnamese": "Toi dang hoc tieng Anh luc nay.", "note": "Hanh dong dang xay ra"},
    {"english": "They are playing football in the park.", "vietnamese": "Ho dang choi bong da trong cong vien.", "note": "Hanh dong dang dien ra"},
    {"english": "He is not working today.", "vietnamese": "Hom nay anh ay khong lam viec.", "note": "Phu dinh"}
  ]'::jsonb,
  '[
    {"question": "She ____ a book at the moment.", "options": ["is reading", "reads", "read", "reading"], "correctAnswer": "is reading", "explanation": "Present continuous voi at the moment"},
    {"question": "What are you _____ right now?", "options": ["do", "doing", "does", "did"], "correctAnswer": "doing", "explanation": "V-ing trong present continuous"},
    {"question": "They _____ in the office today.", "options": ["are working", "work", "worked", "working"], "correctAnswer": "are working", "explanation": "Hanh dong dang xay ra"}
  ]'::jsonb,
  'beginner',
  ARRAY['present', 'continuous', 'now', 'dang lam']
);

-- GRAMMAR 3: Past Simple
INSERT INTO grammar.topics (title, category, description, content, rules, examples, exercises, difficulty, tags) VALUES
(
  'Past Simple (Qua khu don)',
  'Thi qua khu',
  'Thi qua khu don dung de dien ta cac hanh dong da hoan thanh trong qua khu',
  '<h2>Cong thuc</h2><h3>Khang dinh</h3><p><strong>S + V-ed / V bat quy tac</strong></p><p>Vi du: I <strong>went</strong> to school yesterday.</p><h3>Phu dinh</h3><p><strong>S + did + not + V (nguyen the)</strong></p><p>Vi du: He <strong>did not go</strong> to work yesterday.</p><h3>Nghi van</h3><p><strong>Did + S + V (nguyen the)?</strong></p><p>Vi du: <strong>Did</strong> you <strong>watch</strong> the movie?</p>',
  ARRAY[
    'Dien ta hanh dong hoan thanh trong qua khu',
    'Dien ta mot chuoi hanh dong qua khu',
    'Thuong dung voi yesterday, last week, ago, in 2020',
    'Dong tu bat quy tac phai nho'
  ],
  '[
    {"english": "I went to London last year.", "vietnamese": "Toi da di den London nam ngoai.", "note": "Hanh dong qua khu"},
    {"english": "She did not finish her homework yesterday.", "vietnamese": "Hom qua co ay khong hoan thanh bai tap.", "note": "Phu dinh"},
    {"english": "Did you enjoy the party?", "vietnamese": "Ban co thich bua tiec khong?", "note": "Nghi van"}
  ]'::jsonb,
  '[
    {"question": "I ____ to Paris last summer.", "options": ["went", "go", "goes", "going"], "correctAnswer": "went", "explanation": "Dong tu bat quy tac qua khu cua go"},
    {"question": "She did not ____ the exam.", "options": ["pass", "passed", "passes", "passing"], "correctAnswer": "pass", "explanation": "Sau did not dung dong tu nguyen the"},
    {"question": "What did you ____ yesterday?", "options": ["do", "did", "does", "doing"], "correctAnswer": "do", "explanation": "Sau Did dung dong tu nguyen the"}
  ]'::jsonb,
  'beginner',
  ARRAY['past', 'simple', 'yesterday', 'qua khu']
);

-- GRAMMAR 4: Future Simple
INSERT INTO grammar.topics (title, category, description, content, rules, examples, exercises, difficulty, tags) VALUES
(
  'Future Simple (Tuong lai don)',
  'Thi tuong lai',
  'Thi tuong lai don dung de dien ta cac hanh dong se xay ra trong tuong lai',
  '<h2>Cong thuc</h2><h3>Khang dinh</h3><p><strong>S + will + V (nguyen the)</strong></p><p>Vi du: I <strong>will go</strong> to school tomorrow.</p><h3>Phu dinh</h3><p><strong>S + will + not + V (nguyen the)</strong></p><p>Vi du: He <strong>will not work</strong> tomorrow.</p><h3>Nghi van</h3><p><strong>Will + S + V (nguyen the)?</strong></p><p>Vi du: <strong>Will</strong> you <strong>help</strong> me?</p>',
  ARRAY[
    'Dien ta quyet dinh tuc thoi',
    'Dien ta du doan tuong lai',
    'Dien ta hanh dong se xay ra',
    'Thuong dung voi tomorrow, next week, in 2024'
  ],
  '[
    {"english": "I will call you tomorrow.", "vietnamese": "Toi se goi cho ban ngay mai.", "note": "Hanh dong tuong lai"},
    {"english": "She will not come to the party.", "vietnamese": "Co ay se khong den bua tiec.", "note": "Phu dinh"},
    {"english": "Will you help me?", "vietnamese": "Ban se giup toi khong?", "note": "Nghi van"}
  ]'::jsonb,
  '[
    {"question": "I ____ you next week.", "options": ["will call", "calls", "called", "calling"], "correctAnswer": "will call", "explanation": "Future simple voi next week"},
    {"question": "He will not ____ to the meeting.", "options": ["go", "goes", "went", "going"], "correctAnswer": "go", "explanation": "Sau will not dung dong tu nguyen the"},
    {"question": "Will she ____ with us?", "options": ["come", "comes", "came", "coming"], "correctAnswer": "come", "explanation": "Sau Will dung dong tu nguyen the"}
  ]'::jsonb,
  'beginner',
  ARRAY['future', 'simple', 'tomorrow', 'tuong lai']
);

-- GRAMMAR 5: Present Perfect
INSERT INTO grammar.topics (title, category, description, content, rules, examples, exercises, difficulty, tags) VALUES
(
  'Present Perfect (Hien tai hoan thanh)',
  'Thi hien tai',
  'Thi hien tai hoan thanh dung de dien ta hanh dong bat dau tu qua khu va tiep tuc den hien tai',
  '<h2>Cong thuc</h2><h3>Khang dinh</h3><p><strong>S + have/has + V-ed / V bat quy tac</strong></p><p>Vi du: I <strong>have finished</strong> my homework.</p><h3>Phu dinh</h3><p><strong>S + have/has + not + V-ed</strong></p><p>Vi du: She <strong>has not eaten</strong> yet.</p><h3>Nghi van</h3><p><strong>Have/Has + S + V-ed?</strong></p><p>Vi du: <strong>Have</strong> you <strong>finished</strong>?</p>',
  ARRAY[
    'Dien ta hanh dong bat dau tu qua khu, keo dai den hien tai',
    'Dien ta kinh nghiem song',
    'Dien ta ket qua cua mot hanh dong',
    'Thuong dung voi just, already, yet, never, ever'
  ],
  '[
    {"english": "I have lived here for 5 years.", "vietnamese": "Toi da song o day 5 nam.", "note": "Bat dau tu qua khu den nay"},
    {"english": "She has already finished her work.", "vietnamese": "Co ay da hoan thanh cong viec roi.", "note": "Hanh dong da xong"},
    {"english": "Have you ever been to Paris?", "vietnamese": "Ban da bao gio den Paris chua?", "note": "Kinh nghiem song"}
  ]'::jsonb,
  '[
    {"question": "I ____ this book three times.", "options": ["have read", "reads", "read", "reading"], "correctAnswer": "have read", "explanation": "Present perfect voi kinh nghiem"},
    {"question": "She has not ____ her lunch yet.", "options": ["eaten", "eat", "eats", "eating"], "correctAnswer": "eaten", "explanation": "Past participle trong present perfect"},
    {"question": "Have you ____ to Japan?", "options": ["been", "be", "are", "go"], "correctAnswer": "been", "explanation": "Present perfect cua be la have/has been"}
  ]'::jsonb,
  'intermediate',
  ARRAY['present', 'perfect', 'experience', 'kinh nghiem']
);

-- ====================================================
-- STEP 5: VERIFICATION QUERIES
-- ====================================================

SELECT E'\n=== DATA INSERTED SUCCESSFULLY ===\n' as message;

SELECT 
  'Vocabulary Libraries' as "Data Type", 
  COUNT(*) as "Count",
  MAX(word_count) as "Total Words"
FROM vocabulary.libraries;

SELECT 
  'Grammar Topics' as "Data Type", 
  COUNT(*) as "Count",
  COUNT(DISTINCT category) as "Categories"
FROM grammar.topics;

SELECT E'\n=== SAMPLE DATA READY ===\n' as message;
SELECT E'Vocabulary: 1 library with 20 words\n' as info;
SELECT E'Grammar: 5 topics (Present Simple, Present Continuous, Past Simple, Future Simple, Present Perfect)\n' as info;
