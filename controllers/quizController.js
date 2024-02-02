

const asyncHandler = require('express-async-handler');
const Question = require('../models/questionsModel');
const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const constants = require('../constants');


// @desc    Get all quiz
// @route   GET /api/quizs
const getAllQuizs = asyncHandler(async (req, res) => {
    const quizs = await Quiz.find({});

    //replace quiz questions id with question object
    for(const quiz of quizs){
        const quesitionIds = quiz.questions;

        console.log( " quesitionIds",quesitionIds+"quiz name"+quiz.name);
        const questionTemp=[];
        for(const questionId of quesitionIds){
            const question = await Question.findById(questionId);
            questionTemp.push(question);
        }
        console.log(" questionTemp",questionTemp);
        quiz.questions = questionTemp;
    }
    

    //sort quizs accoording to quiz impressions
    quizs.sort((a, b) => {
        return b.impressions - a.impressions;
    })


    res.status(constants.SUCCESS).send(quizs);
});


// @desc   Get single quiz
//@route    GET / api/quiz/:id
const singleQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        console.log("Quiz not found");
        res.status(constants.NOT_FOUND).send("Quiz not found");
    }
    let questions = [];

    const questionIds = quiz?.questions;
    for (const questionId of questionIds) {
        const question = await Question.findById(questionId);
        if (!question) {
            console.log("Question not found");
            res.status(constants.NOT_FOUND).send("Question not found");
        }
        questions.push(question);
        quiz.questions=questions;
    }

     // Set the Content-Type header to application/json
  res.setHeader('Content-Type', 'application/json');

    res.status(constants.SUCCESS).send(quiz);
});


// @desc  Get  quiz analytics
//@route  GET /api/quiz/:id/analytics
const quizAnalytics = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    const questionIds = quiz.questions;
    const analytics = [];

    for (const questionId of questionIds) {
        const question = await Question.findById(questionId);
        analytics.push(question.analysis);
    }


    res.status(constants.SUCCESS).send({
        "analytics": analytics,
        "quizType": quiz.quizType,
    });

})

// @desc    Get all questions count,all quiz count,impressions count
// @route   GET /api/quiz/stats
const getStats = asyncHandler(async (req, res) => {

    const allQuizs = await Quiz.find({});
    const quizCount = allQuizs.length;

    const Totalimpression = allQuizs.reduce((acc, quiz) => {
        return acc + quiz.impressions;
    }, 0);

    const questionCount = allQuizs.reduce((acc, quiz) => {
        return acc + quiz.questions.length;
    }, 0);


    res.status(constants.SUCCESS).send({
        quizCount,
        questionCount,
        Totalimpression,
    })

})


// @desc    Create quiz
// @route   POST /api/createquiz
const createQuiz = asyncHandler(async (req, res) => {
    const { name, quizType, questions, createdBy, impressions,timer } = req.body;
    
    console.log("questions",req.body,createdBy);
   
    const createdTime = formattedDate();

    const quesitionIdArray = [];
    for (const question of questions) {
        const { title, type, options, analysis } = question;
        const questionItem = await Question.create({
            title,
            type,
            options,
            analysis,
            
        });
        questionItem.save();
        if (questionItem) {
            quesitionIdArray.push(questionItem._id);
        }
    }

    

    const quiz = await Quiz.create({
        name,
        quizType,
        impressions,
        questions: quesitionIdArray,
        createdTime,
        timer,
        createdBy: new mongoose.Types.ObjectId(createdBy),
    })
    await quiz.save();
    
    const quizId=quiz._id;
    
    
    const user = await User.findById(new mongoose.Types.ObjectId(createdBy));
    console.log("user",user,new mongoose.Types.ObjectId(createdBy));

    if(!user){
        res.status(constants.NOT_FOUND).send("User not found");
    }
    user.CreatedQuiz.push(quizId);
    await user.save();

    console.log("user",user);

    res.status(constants.SUCCESS).json(quiz);

})


// @desc    adding question analysis
// @route   POST /api/quiz/question/:id/analysis
const addQuestionAnalysis = asyncHandler(async (req,res)=>{
    const {analysis} = req.body;
    const question = await Question.findById(req.params.id);
    if(!question){
        res.status(constants.NOT_FOUND).send("Question not found");
    }
    question.analysis = analysis;
    await question.save();
    res.status(constants.SUCCESS).send(question);
})


// @desc   Update quiz
//@route   PUT /api/quiz/:id
const updateQuiz = asyncHandler(async (req, res) => {
    const { name, quizType, questions, createdBy, impressions } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(constants.NOT_FOUND).send("Quiz not found");
    }

    for (const question of questions) {
        const { title, type, options, analysis } = question;
        const questionItem = await Question.findByIdAndUpdate(
            question._id,
            {
                title,
                type,
                options,
                analysis,
            });

    }

    const findQuiz = await Quiz.findById(req.params.id);

    if (!findQuiz) {
        res.status(constants.NOT_FOUND).send("Quiz not found");
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        {
            name,
            quizType,
            impressions,
        }
    )

    res.status(constants.SUCCESS).send(updatedQuiz);

})


// @desc   Delete quiz
//@route   Delete /api/quiz/:id
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        res.status(constants.NOT_FOUND).send("Quiz not found");
    }

    const userId =  quiz.createdBy;
    console.log("userId",quiz);

    const user = await User.findById(userId);
     
    if(!user){
        res.status(constants.NOT_FOUND).send("User not found");
    }
    const quizId = quiz._id;
    const index = user.CreatedQuiz.indexOf(quizId);
    
    user.CreatedQuiz.splice(index, 1);
    await user.save();

   
    const deleteOne = await Quiz.deleteOne({ _id: req.params.id });
    console.log(deleteOne);
    res.status(constants.SUCCESS).send("Quiz deleted");
})


//function to format date
const formattedDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[currentDate.getMonth()];
    const year = String(currentDate.getFullYear());
    const formattedDate = `${day} ${month}, ${year}`;
    return formattedDate;
}






module.exports = {
    getAllQuizs,
    singleQuiz,
    quizAnalytics,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    getStats,
    addQuestionAnalysis
}