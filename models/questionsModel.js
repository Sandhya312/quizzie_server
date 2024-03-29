const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:Number,  // 0 - text , 1 - image, 2 - text with image
        required:true,
    },
    analysis:{
        type:Object,
        default:{},
        required:true,
    },
    options:{
        type:Array,
        default:[{value:[],correctOpt:false}],

    },
  
})


module.exports = mongoose.model('Question',questionSchema);