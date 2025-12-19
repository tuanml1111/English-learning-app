-- ====================================================
-- BRAINHUB - SAMPLE DATA FOR VOCABULARY & GRAMMAR
-- ====================================================
-- This file seeds 20 vocabulary items and 5 grammar topics
-- Run this AFTER creating the database schema

-- ====================================================
-- VOCABULARY DATA - 20 WORDS (Business Category)
-- ====================================================

INSERT INTO vocabulary.libraries (id, title, description, category, difficulty, is_public, usage_count, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Từ vựng tiếng Anh cơ bản - Business',
  'Tổng hợp 20 từ vựng thông dụng trong môi trường văn phòng',
  'Business',
  'easy',
  true,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) RETURNING id INTO @vocab_id;

-- Insert vocabulary with words
INSERT INTO vocabulary.libraries (id, title, description, category, words, word_count, difficulty, is_public, usage_count, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'Business Vocabulary - 20 Essential Words',
  'Tổng hợp 20 từ vựng thông dụng trong môi trường văn phòng, công sở',
  'Business',
  '[
    {
      "word": "absent",
      "pronunciation": "/ˈæbsənt/",
      "meaning": "vắng mặt (vì dau ốm,...)",
      "partOfSpeech": "adjective",
      "example": "Most students were absent from school."
    },
    {
      "word": "accept",
      "pronunciation": "/əkˈsept/",
      "meaning": "nhận, chấp nhận",
      "partOfSpeech": "verb",
      "example": "We accept payment by credit card or cash."
    },
    {
      "word": "accommodation",
      "pronunciation": "/əˌkɒməˈdeɪʃən/",
      "meaning": "chỗ trọ, chỗ ăn ở",
      "partOfSpeech": "noun",
      "example": "I need first-class accommodation for the conference."
    },
    {
      "word": "account",
      "pronunciation": "/əˈkaʊnt/",
      "meaning": "tài khoản",
      "partOfSpeech": "noun",
      "example": "You need to create an account to use this service."
    },
    {
      "word": "achieve",
      "pronunciation": "/əˈtʃiːv/",
      "meaning": "đạt được, giành được",
      "partOfSpeech": "verb",
      "example": "She achieved her goal of becoming a doctor."
    },
    {
      "word": "acknowledge",
      "pronunciation": "/əkˈnɒlɪdʒ/",
      "meaning": "thừa nhận, công nhận",
      "partOfSpeech": "verb",
      "example": "He acknowledged his mistake and apologized."
    },
    {
      "word": "agenda",
      "pronunciation": "/əˈdʒendə/",
      "meaning": "chương trình, kế hoạch",
      "partOfSpeech": "noun",
      "example": "What is on the agenda for today meeting?"
    },
    {
      "word": "allocate",
      "pronunciation": "/ˈæləkeɪt/",
      "meaning": "phân bổ, gán cho",
      "partOfSpeech": "verb",
      "example": "We need to allocate resources for this project."
    },
    {
      "word": "analyze",
      "pronunciation": "/ˈænəlaɪz/",
      "meaning": "phân tích",
      "partOfSpeech": "verb",
      "example": "We need to analyze the data before making a decision."
    },
    {
      "word": "appointment",
      "pronunciation": "/əˈpɔɪntmənt/",
      "meaning": "cuộc hẹn, buổi hẹn",
      "partOfSpeech": "noun",
      "example": "I have an appointment with the manager at 3 PM."
    },
    {
      "word": "appreciate",
      "pronunciation": "/əˈpriːʃieɪt/",
      "meaning": "đánh giá cao, cảm ơn",
      "partOfSpeech": "verb",
      "example": "We appreciate your hard work and dedication."
    },
    {
      "word": "approach",
      "pronunciation": "/əˈprəʊtʃ/",
      "meaning": "cách tiếp cận, đến gần",
      "partOfSpeech": "verb",
      "example": "We need a different approach to solve this problem."
    },
    {
      "word": "asset",
      "pronunciation": "/ˈæset/",
      "meaning": "tài sản, quỹ",
      "partOfSpeech": "noun",
      "example": "Our main asset is our skilled workforce."
    },
    {
      "word": "assign",
      "pronunciation": "/əˈsaɪn/",
      "meaning": "giao cho, phân công",
      "partOfSpeech": "verb",
      "example": "I will assign this task to you tomorrow."
    },
    {
      "word": "assistance",
      "pronunciation": "/əˈsɪstəns/",
      "meaning": "sự giúp đỡ, hỗ trợ",
      "partOfSpeech": "noun",
      "example": "Do you need any assistance with this project?"
    },
    {
      "word": "assume",
      "pronunciation": "/əˈsuːm/",
      "meaning": "giả định, cho rằng",
      "partOfSpeech": "verb",
      "example": "I assume you have received my email."
    },
    {
      "word": "assure",
      "pronunciation": "/əˈʃɔː/",
      "meaning": "đảm bảo, cam đoan",
      "partOfSpeech": "verb",
      "example": "I assure you that this is confidential."
    },
    {
      "word": "attend",
      "pronunciation": "/əˈtend/",
      "meaning": "tham dự, chăm sóc",
      "partOfSpeech": "verb",
      "example": "I will attend the meeting on Friday."
    },
    {
      "word": "attitude",
      "pronunciation": "/ˈætɪtjuːd/",
      "meaning": "thái độ, lập trường",
      "partOfSpeech": "noun",
      "example": "A positive attitude is important for success."
    },
    {
      "word": "authority",
      "pronunciation": "/ɔːˈθɒrɪti/",
      "meaning": "quyền hạn, chính quyền",
      "partOfSpeech": "noun",
      "example": "He has the authority to make final decisions."
    }
  ]'::jsonb,
  20,
  'easy',
  true,
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- GRAMMAR DATA - 5 TOPICS
-- ====================================================

INSERT INTO grammar.topics (id, title, category, description, content, rules, examples, exercises, difficulty, tags, view_count, created_at, updated_at) VALUES

-- GRAMMAR 1: Present Simple
(
  gen_random_uuid(),
  'Present Simple (Hiện tại đơn)',
  'Thì hiện tại',
  'Thì hiện tại đơn dùng để diễn tả thói quen, hành động lặp đi lặp lại, sự thật hiển nhiên',
  '<h2>Công thức</h2><h3>Khẳng định</h3><p><strong>S + V(s/es)</strong></p><p>Ví dụ: She <strong>goes</strong> to school every day.</p><h3>Phủ định</h3><p><strong>S + do/does + not + V (nguyên thể)</strong></p><p>Ví dụ: He <strong>doesn''t like</strong> coffee.</p><h3>Nghi vấn</h3><p><strong>Do/Does + S + V (nguyên thể)?</strong></p><p>Ví dụ: <strong>Do</strong> you <strong>speak</strong> English?</p>',
  ARRAY[
    'Diễn tả thói quen, hành động lặp đi lặp lại',
    'Diễn tả sự thật hiển nhiên, chân lý',
    'Lịch trình, thời gian biểu cố định',
    'Động từ thêm s/es với ngôi thứ 3 số ít'
  ],
  '[
    {"english": "I go to school every day.", "vietnamese": "Tôi đi học mỗi ngày.", "note": "Thói quen hàng ngày"},
    {"english": "The sun rises in the east.", "vietnamese": "Mặt trời mọc ở phía đông.", "note": "Sự thật hiển nhiên"},
    {"english": "She doesn''t like coffee.", "vietnamese": "Cô ấy không thích cà phê.", "note": "Phủ định"}
  ]'::jsonb,
  '[
    {"question": "I ____ to work by bus every day.", "options": ["go", "goes", "went", "going"], "correctAnswer": "go", "explanation": "Dùng present simple, ngôi thứ nhất số nhiều"},
    {"question": "Does she _____ English?", "options": ["speak", "speaks", "spoke", "speaking"], "correctAnswer": "speak", "explanation": "Sau Do/Does dùng động từ nguyên thể"},
    {"question": "He _____ in London.", "options": ["lives", "live", "lived", "living"], "correctAnswer": "lives", "explanation": "Ngôi thứ 3 số ít thêm s"}
  ]'::jsonb,
  'beginner',
  ARRAY['present', 'simple', 'habit', 'thói quen'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- GRAMMAR 2: Present Continuous
(
  gen_random_uuid(),
  'Present Continuous (Hiện tại tiếp diễn)',
  'Thì hiện tại',
  'Thì hiện tại tiếp diễn dùng để diễn tả hành động đang xảy ra tại thời điểm nói',
  '<h2>Công thức</h2><h3>Khẳng định</h3><p><strong>S + am/is/are + V-ing</strong></p><p>Ví dụ: She <strong>is studying</strong> right now.</p><h3>Phủ định</h3><p><strong>S + am/is/are + not + V-ing</strong></p><p>Ví dụ: I <strong>am not working</strong> today.</p><h3>Nghi vấn</h3><p><strong>Am/Is/Are + S + V-ing?</strong></p><p>Ví dụ: <strong>Are</strong> you <strong>watching</strong> TV?</p>',
  ARRAY[
    'Diễn tả hành động đang xảy ra tại thời điểm nói',
    'Diễn tả kế hoạch trong tương lai gần',
    'Diễn tả quá trình, sự thay đổi',
    'Thường dùng với now, at the moment, right now'
  ],
  '[
    {"english": "I am studying English right now.", "vietnamese": "Tôi đang học tiếng Anh lúc này.", "note": "Hành động đang xảy ra"},
    {"english": "They are playing football in the park.", "vietnamese": "Họ đang chơi bóng đá trong công viên.", "note": "Hành động đang diễn ra"},
    {"english": "He is not working today.", "vietnamese": "Hôm nay anh ấy không làm việc.", "note": "Phủ định"}
  ]'::jsonb,
  '[
    {"question": "She ____ a book at the moment.", "options": ["is reading", "reads", "read", "reading"], "correctAnswer": "is reading", "explanation": "Present continuous với at the moment"},
    {"question": "What are you _____ right now?", "options": ["do", "doing", "does", "did"], "correctAnswer": "doing", "explanation": "V-ing trong present continuous"},
    {"question": "They _____ in the office today.", "options": ["are working", "work", "worked", "working"], "correctAnswer": "are working", "explanation": "Hành động đang xảy ra"}
  ]'::jsonb,
  'beginner',
  ARRAY['present', 'continuous', 'now', 'đang làm'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- GRAMMAR 3: Past Simple
(
  gen_random_uuid(),
  'Past Simple (Quá khứ đơn)',
  'Thì quá khứ',
  'Thì quá khứ đơn dùng để diễn tả các hành động đã hoàn thành trong quá khứ',
  '<h2>Công thức</h2><h3>Khẳng định</h3><p><strong>S + V-ed / V bất quy tắc</strong></p><p>Ví dụ: I <strong>went</strong> to school yesterday.</p><h3>Phủ định</h3><p><strong>S + did + not + V (nguyên thể)</strong></p><p>Ví dụ: He <strong>didn''t go</strong> to work yesterday.</p><h3>Nghi vấn</h3><p><strong>Did + S + V (nguyên thể)?</strong></p><p>Ví dụ: <strong>Did</strong> you <strong>watch</strong> the movie?</p>',
  ARRAY[
    'Diễn tả hành động hoàn thành trong quá khứ',
    'Diễn tả một chuỗi hành động quá khứ',
    'Thường dùng với yesterday, last week, ago, in 2020',
    'Động từ bất quy tắc phải nhớ'
  ],
  '[
    {"english": "I went to London last year.", "vietnamese": "Tôi đã đi đến London năm ngoái.", "note": "Hành động quá khứ"},
    {"english": "She didn''t finish her homework yesterday.", "vietnamese": "Hôm qua cô ấy không hoàn thành bài tập.", "note": "Phủ định"},
    {"english": "Did you enjoy the party?", "vietnamese": "Bạn có thích bữa tiệc không?", "note": "Nghi vấn"}
  ]'::jsonb,
  '[
    {"question": "I ____ to Paris last summer.", "options": ["went", "go", "goes", "going"], "correctAnswer": "went", "explanation": "Động từ bất quy tắc quá khứ của go"},
    {"question": "She did not ____ the exam.", "options": ["pass", "passed", "passes", "passing"], "correctAnswer": "pass", "explanation": "Sau did not dùng động từ nguyên thể"},
    {"question": "What did you ____ yesterday?", "options": ["do", "did", "does", "doing"], "correctAnswer": "do", "explanation": "Sau Did dùng động từ nguyên thể"}
  ]'::jsonb,
  'beginner',
  ARRAY['past', 'simple', 'yesterday', 'quá khứ'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- GRAMMAR 4: Future Simple
(
  gen_random_uuid(),
  'Future Simple (Tương lai đơn)',
  'Thì tương lai',
  'Thì tương lai đơn dùng để diễn tả các hành động sẽ xảy ra trong tương lai',
  '<h2>Công thức</h2><h3>Khẳng định</h3><p><strong>S + will + V (nguyên thể)</strong></p><p>Ví dụ: I <strong>will go</strong> to school tomorrow.</p><h3>Phủ định</h3><p><strong>S + will + not + V (nguyên thể)</strong></p><p>Ví dụ: He <strong>won''t work</strong> tomorrow.</p><h3>Nghi vấn</h3><p><strong>Will + S + V (nguyên thể)?</strong></p><p>Ví dụ: <strong>Will</strong> you <strong>help</strong> me?</p>',
  ARRAY[
    'Diễn tả quyết định tức thời',
    'Diễn tả dự đoán tương lai',
    'Diễn tả hành động sẽ xảy ra',
    'Thường dùng với tomorrow, next week, in 2024'
  ],
  '[
    {"english": "I will call you tomorrow.", "vietnamese": "Tôi sẽ gọi cho bạn ngày mai.", "note": "Hành động tương lai"},
    {"english": "She won''t come to the party.", "vietnamese": "Cô ấy sẽ không đến bữa tiệc.", "note": "Phủ định"},
    {"english": "Will you help me?", "vietnamese": "Bạn sẽ giúp tôi không?", "note": "Nghi vấn"}
  ]'::jsonb,
  '[
    {"question": "I ____ you next week.", "options": ["will call", "calls", "called", "calling"], "correctAnswer": "will call", "explanation": "Future simple với next week"},
    {"question": "He will not ____ to the meeting.", "options": ["go", "goes", "went", "going"], "correctAnswer": "go", "explanation": "Sau will not dùng động từ nguyên thể"},
    {"question": "Will she ____ with us?", "options": ["come", "comes", "came", "coming"], "correctAnswer": "come", "explanation": "Sau Will dùng động từ nguyên thể"}
  ]'::jsonb,
  'beginner',
  ARRAY['future', 'simple', 'tomorrow', 'tương lai'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- GRAMMAR 5: Present Perfect
(
  gen_random_uuid(),
  'Present Perfect (Hiện tại hoàn thành)',
  'Thì hiện tại',
  'Thì hiện tại hoàn thành dùng để diễn tả hành động bắt đầu từ quá khứ và tiếp tục đến hiện tại',
  '<h2>Công thức</h2><h3>Khẳng định</h3><p><strong>S + have/has + V-ed / V bất quy tắc</strong></p><p>Ví dụ: I <strong>have finished</strong> my homework.</p><h3>Phủ định</h3><p><strong>S + have/has + not + V-ed</strong></p><p>Ví dụ: She <strong>hasn''t eaten</strong> yet.</p><h3>Nghi vấn</h3><p><strong>Have/Has + S + V-ed?</strong></p><p>Ví dụ: <strong>Have</strong> you <strong>finished</strong>?</p>',
  ARRAY[
    'Diễn tả hành động bắt đầu từ quá khứ, kéo dài đến hiện tại',
    'Diễn tả kinh nghiệm sống',
    'Diễn tả kết quả của một hành động',
    'Thường dùng với just, already, yet, never, ever'
  ],
  '[
    {"english": "I have lived here for 5 years.", "vietnamese": "Tôi đã sống ở đây 5 năm.", "note": "Bắt đầu từ quá khứ đến nay"},
    {"english": "She has already finished her work.", "vietnamese": "Cô ấy đã hoàn thành công việc rồi.", "note": "Hành động đã xong"},
    {"english": "Have you ever been to Paris?", "vietnamese": "Bạn đã bao giờ đến Paris chưa?", "note": "Kinh nghiệm sống"}
  ]'::jsonb,
  '[
    {"question": "I ____ this book three times.", "options": ["have read", "reads", "read", "reading"], "correctAnswer": "have read", "explanation": "Present perfect với kinh nghiệm"},
    {"question": "She has not ____ her lunch yet.", "options": ["eaten", "eat", "eats", "eating"], "correctAnswer": "eaten", "explanation": "Past participle trong present perfect"},
    {"question": "Have you ____ to Japan?", "options": ["been", "be", "are", "go"], "correctAnswer": "been", "explanation": "Present perfect của be là have/has been"}
  ]'::jsonb,
  'intermediate',
  ARRAY['present', 'perfect', 'experience', 'kinh nghiệm'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ====================================================
-- VERIFICATION QUERIES
-- ====================================================

-- Check vocabulary inserted
SELECT 'Vocabulary Libraries' as "Data Type", COUNT(*) as "Count" FROM vocabulary.libraries;

-- Check grammar topics inserted
SELECT 'Grammar Topics' as "Data Type", COUNT(*) as "Count" FROM grammar.topics;

-- ====================================================
-- END OF SAMPLE DATA
-- ====================================================
