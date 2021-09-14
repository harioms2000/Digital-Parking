const mongoose = require('mongoose');

const historySchema=new mongoose.Schema({
    //id will be index here all other fields should drop all non-id and non-_id index
    id:{
        type:Number,
        unique:true
    },
    time:{
        type:Date
    },
    number:{
        type:String,
        required: true,
    },
    colour:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    Model:{
        type:String,
        require:true
    },
    slot:{
        type:Number
    }
});

const History = mongoose.model('History',historySchema);
module.exports=History;