const { Quiz, QuizAttempt, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get all quizzes (with optional filters)
// @route   GET /api/quizzes
// @access  Public
exports.getQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const where = { isPublic: true };

    if (category) {
      where.category = category;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const quizzes = await Quiz.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    // Transform to include question count but not full questions
    const transformedQuizzes = quizzes.map(quiz => {
      const quizData = quiz.toJSON();
      
      // Parse questions if it's a string (from JSONB)
      let questions = quizData.questions;
      if (typeof questions === 'string') {
        try {
          questions = JSON.parse(questions);
        } catch (e) {
          questions = [];
        }
      }
      
      const questionCount = questions ? questions.length : 0;
      delete quizData.questions; // Remove full questions
      return {
        ...quizData,
        questionCount, // Add question count
      };
    });

    return successResponse(res, 200, 'Quizzes retrieved successfully', transformedQuizzes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    const quizData = quiz.toJSON();
    
    // Parse questions if it's a string (from JSONB)
    if (typeof quizData.questions === 'string') {
      try {
        quizData.questions = JSON.parse(quizData.questions);
      } catch (e) {
        quizData.questions = [];
      }
    }

    return successResponse(res, 200, 'Quiz retrieved successfully', quizData);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuizAttempt = async (req, res, next) => {
  try {
    const { answers, timeSpent } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return errorResponse(res, 404, 'Quiz not found');
    }

    // Parse questions if it's a string (from JSONB)
    let questions = quiz.questions;
    if (typeof questions === 'string') {
      try {
        questions = JSON.parse(questions);
      } catch (e) {
        questions = [];
      }
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    // answers is an object with format: { 0: 1, 1: 2, ... } where key is question index, value is selected option index
    Object.keys(answers).forEach((questionIndex) => {
      const question = questions[parseInt(questionIndex)];
      const selectedOptionIndex = answers[questionIndex];
      
      if (question && selectedOptionIndex !== undefined) {
        const selectedOption = question.options[selectedOptionIndex];
        // Check if this option is the correct answer
        if (selectedOption === question.options[question.correct_answer]) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= quiz.passingScore;

    // Create quiz attempt
    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      quizId,
      answers, // Store the answers object as-is
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: timeSpent || 0,
      isPassed,
      completedAt: new Date(),
    });

    // Update quiz total attempts
    await quiz.increment('totalAttempts');

    return successResponse(res, 201, 'Quiz attempt submitted successfully', {
      attempt,
      score,
      correctAnswers,
      totalQuestions,
      isPassed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's quiz attempts
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getUserQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: {
        userId: req.user.id,
        quizId: req.params.id,
      },
      order: [['completed_at', 'DESC']],
      limit: 10,
    });

    return successResponse(res, 200, 'Quiz attempts retrieved successfully', attempts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest attempt for a quiz
// @route   GET /api/quizzes/:id/latest-attempt
// @access  Private
exports.getLatestAttempt = async (req, res, next) => {
  try {
    const attempt = await QuizAttempt.findOne({
      where: {
        userId: req.user.id,
        quizId: req.params.id,
      },
      order: [['completedAt', 'DESC']],
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'description', 'category', 'difficulty', 'questions', 'timeLimit', 'passingScore'],
      }],
    });

    if (!attempt) {
      return errorResponse(res, 404, 'No attempts found for this quiz');
    }

    const attemptData = attempt.toJSON();
    
    // Parse quiz questions if it's a string (from JSONB)
    if (attemptData.quiz && typeof attemptData.quiz.questions === 'string') {
      try {
        attemptData.quiz.questions = JSON.parse(attemptData.quiz.questions);
      } catch (e) {
        attemptData.quiz.questions = [];
      }
    }

    return successResponse(res, 200, 'Latest attempt retrieved successfully', attemptData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's all quiz attempts
// @route   GET /api/quizzes/my-attempts
// @access  Private
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Quiz,
        as: 'quiz',
        attributes: ['id', 'title', 'category', 'difficulty'],
      }],
      order: [['completed_at', 'DESC']],
      limit: 20,
    });

    return successResponse(res, 200, 'User attempts retrieved successfully', attempts);
  } catch (error) {
    next(error);
  }
};
