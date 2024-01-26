
const express = require('express');

const router = express.Router();
const authenticateToken = require('../middleware/auth');


const {
    getAllQuizs,
    singleQuiz,
    quizAnalytics,
    createQuiz,
    getStats,
    deleteQuiz,
    updateQuiz,
    
} = require('../controllers/quizController');


// @desc    Get all quiz
// @route   GET /api/quizs
// @access  private
router.get('/',authenticateToken,getAllQuizs);

// @desc    Get all questions count,all quiz count,impressions count
// @route   GET /api/quiz/stats
// @access  Private
router.get('/stats',authenticateToken,getStats);

// @desc    Get single quiz
// @route   GET /api/quiz/:id
// @access  Public
router.get('/:id',singleQuiz);

// @desc  Get  quiz analytics
// @route  GET /api/quiz/:id/analytics
// @access Private
router.get('/:id/analytics',authenticateToken,quizAnalytics);

// @desc    Create quiz
// @route   POST /api/createquiz
// @access  Private
router.post('/createquiz',authenticateToken,createQuiz)

// @desc    Update quiz
// @route   PUT /api/quiz/:id
// @access  Private
router.put('/:id',authenticateToken,updateQuiz);

// @desc    Delete quiz
// @route   DELETE /api/quiz/:id
// @access  Private
router.delete('/:id',authenticateToken,deleteQuiz);


module.exports = router;