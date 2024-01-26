const asyncHandler = require('express-async-handler');
const Question = require('../models/questionsModel');
const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const constants = require('../constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const blacklist = require('../blacklist');


// @desc    Get all quiz


const getMyQuizs = asyncHandler(async(req,res)=>{
    const quizs = [];
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(constants.NOT_FOUND).send("User not found");
    }
    const quizIds = user.CreatedQuiz;
    for(const quizId of quizIds){
        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            res.status(constants.NOT_FOUND).send("Quiz not found");
        }
        quizs.push(quiz);
    }

    //replace quiz questions id with question object
    for(const quiz of quizs){
        const quesitionIds = quiz.questions;

        console.log( " quesitionIds",quesitionIds+"quiz name"+quiz.name);
        const quizTemp=[];
        for(const questionId of quesitionIds){
            const question = await Question.findById(questionId);
            quizTemp.push(question);
        }
        console.log(" quizTemp",quizTemp);
        quiz.questions = quizTemp;
    }
    

    //sort quizs accoording to quiz impressions
    quizs.sort((a, b) => {
        return b.impressions - a.impressions;
    })


    res.status(constants.SUCCESS).send(quizs);
})


// @desc   SignUp User
//@route  POST /auth/signup
const signup = asyncHandler(async (req, res) => {
    const users = await User.find({});
    const { name, email, password } = req.body;

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
        res.status(constants.BAD_REQUEST).send("User Already Exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 20);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    })
    console.log(user);

    res.status(constants.SUCCESS).send("User Created Successfully");

})


// @desc   Login User
//@route  POST /auth/login
const login = asyncHandler(async (req, res) => {
    const users = await User.find({});
    const { email, password } = req.body;
    console.log("email", users);
    const userExists = await User.findOne({ email: email });
    console.log("45");


    // Check if password not matches
    if (!userExists) {

        res.status(constants.BAD_REQUEST).send("Invalid Credentials");
    }

    //check if password matches
    const token = jwt.sign({ user: userExists._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
    res.status(constants.SUCCESS).send({
        "user": userExists._id,
        "token": token,
    });


})

// @desc   Logout User
//@route  GET /auth/logout
const logout = asyncHandler(async (req, res) => {
     //expire the token
     const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    blacklist.add(token);
    setTimeout(() => {
        blacklist.delete(token)
    }, 1000 * 60 * 60 * 24);
    
    console.log("BLACKLIST",blacklist);
    
    
    res.status(constants.SUCCESS).send("Logout");
   
})


module.exports = {
    signup,
    login,
    logout,
    getMyQuizs
}


