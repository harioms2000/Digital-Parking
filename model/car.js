const mongoose= require('mongoose');
const { validate } = require('./history');
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(mongoose.Collection);
const carSchema = new  mongoose.Schema({
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
const Car = new mongoose.model("Car", carSchema);
module.exports=Car;