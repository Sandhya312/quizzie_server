const mongoose = require('mongoose');


const quizSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    quizType:{
        type:Boolean,  // 0 - QnA , 1 - Poll  
        required:true,
    },
    impressions:{
        type:Number,
        default:0,
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required:true,
    }],
    timer:{
        type:Number,
        default:0,
    },
    // questions:[String],
    createdTime:{
        type:String,
        // default:Date.now(),
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

});

module.exports = mongoose.model('Quiz',quizSchema);