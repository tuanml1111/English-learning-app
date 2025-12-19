-- ====================================================
-- INSERT GRAMMAR QUIZ - 10 QUESTIONS
-- ====================================================

INSERT INTO public.quizzes (
  id, 
  title, 
  description, 
  category, 
  difficulty, 
  is_public, 
  questions, 
  time_limit,
  passing_score,
  created_at, 
  updated_at
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID,
  'English Grammar Basics - 10 Questions',
  'Test your knowledge on basic English grammar including tenses, parts of speech, and sentence structure',
  'General English',
  'Beginner',
  TRUE,
  '[
    {
      "id": 1,
      "question": "Which sentence uses the Simple Present Tense correctly?",
      "options": [
        "She go to school every day",
        "She goes to school every day",
        "She is go to school every day",
        "She going to school every day"
      ],
      "correctAnswer": 1,
      "explanation": "With third person singular (she), we use the -s form of the verb. The correct form is ''goes''."
    },
    {
      "id": 2,
      "question": "Complete the sentence: ''If I ____ you, I would say yes.''",
      "options": [
        "was",
        "were",
        "am",
        "is"
      ],
      "correctAnswer": 1,
      "explanation": "In second conditional sentences, we use ''were'' for all subjects, including ''I''. This is the subjunctive form."
    },
    {
      "id": 3,
      "question": "What is the past tense of ''go''?",
      "options": [
        "goes",
        "going",
        "went",
        "gone"
      ],
      "correctAnswer": 2,
      "explanation": "''Go'' is an irregular verb. Its past tense is ''went''."
    },
    {
      "id": 4,
      "question": "Which sentence is grammatically correct?",
      "options": [
        "She have lived here for five years",
        "She has lived here for five years",
        "She have been living here for five years",
        "She is lived here for five years"
      ],
      "correctAnswer": 1,
      "explanation": "With ''she'' (third person singular) and present perfect, we use ''has'' + past participle. The correct form is ''has lived''."
    },
    {
      "id": 5,
      "question": "What is the correct form of the plural noun for ''child''?",
      "options": [
        "childs",
        "childes",
        "children",
        "childrens"
      ],
      "correctAnswer": 2,
      "explanation": "''Child'' is an irregular noun. Its plural form is ''children''."
    },
    {
      "id": 6,
      "question": "Choose the sentence with correct Subject-Verb agreement:",
      "options": [
        "The team are winning the match",
        "The team is winning the match",
        "The team are wins the match",
        "The teams is winning the match"
      ],
      "correctAnswer": 1,
      "explanation": "''Team'' is a collective noun treated as singular. Therefore, we use ''is'' instead of ''are''."
    },
    {
      "id": 7,
      "question": "Which sentence uses the Present Continuous Tense correctly?",
      "options": [
        "I am work on the project",
        "I am working on the project",
        "I am works on the project",
        "I working on the project"
      ],
      "correctAnswer": 1,
      "explanation": "Present Continuous is formed with ''am/is/are'' + verb-ing. The correct form is ''am working''."
    },
    {
      "id": 8,
      "question": "What is the correct order for adjectives in this sentence: ''She has a ____ book.'' (Choose: beautiful, red, leather)",
      "options": [
        "leather beautiful red book",
        "red leather beautiful book",
        "beautiful red leather book",
        "leather red beautiful book"
      ],
      "correctAnswer": 2,
      "explanation": "The standard order of adjectives in English is: opinion (beautiful), color (red), material (leather)."
    },
    {
      "id": 9,
      "question": "Choose the correct form: ''By next year, I ____ here for 10 years.''",
      "options": [
        "will work",
        "will be working",
        "will have worked",
        "have worked"
      ],
      "correctAnswer": 2,
      "explanation": "This describes an action that will be completed by a specific time in the future. We use Future Perfect: ''will have worked''."
    },
    {
      "id": 10,
      "question": "Which sentence uses the correct form of the relative clause?",
      "options": [
        "The girl which I met yesterday is intelligent",
        "The girl whom I met yesterday is intelligent",
        "The girl where I met yesterday is intelligent",
        "The girl what I met yesterday is intelligent"
      ],
      "correctAnswer": 1,
      "explanation": "For people, we use ''whom'' as the object pronoun. ''Which'' is for things, ''where'' for places, and ''what'' is not used in relative clauses."
    }
  ]'::JSONB,
  30,
  70,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Verify the quiz was inserted
SELECT id, title, category, difficulty FROM public.quizzes WHERE title = 'English Grammar Basics - 10 Questions';
