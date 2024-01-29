const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type:Boolean,  // 0 - QnA , 1 - Poll  
        // required:true,
    },
    analysis:{
        type:Array,
        default:[{option:"slfdd"}],
        required:true,
    },
    options:{
        type:Array,
        default:[{type:0,value:[],correctOpt:false}],

    },
  
})


module.exports = mongoose.model('Question',questionSchema);