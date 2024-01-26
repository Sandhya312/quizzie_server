const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    CreatedQuiz:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
    }]
},
{
    timestamps:true,
}
);

module.exports = mongoose.model('User',userSchema);