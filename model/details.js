const mongoose= require('mongoose');
//const { validate } = require('./history');

const detailSchema = new  mongoose.Schema({
    number:{
        type:String,
        required: true,
        unique:true
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


//carSchema.plugin(autoIncrement.plugin,'slot');
const Detail = new mongoose.model("Detail", detailSchema);
module.exports=Detail;