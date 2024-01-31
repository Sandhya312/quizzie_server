const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

const {
    getMyQuizs,
    signup,
    login,
    logout,
} = require('../controllers/authController');


// @desc   Get my quizs
//@route  GET /auth/:id/myQuizs
// @access Private
router.get('/user/:id/myQuizs', authenticateToken, getMyQuizs);


// @desc   SignUp User
//@route  POST /auth/signup
// @access Public
router.post('/signup', signup);


// @desc   Login User
//@route  POST /auth/login
// @access Public
router.post('/login', login);


// @desc   Logout User
//@route  post /auth/logout
// @access Private
router.post('/logout', authenticateToken, logout);


module.exports = router;


