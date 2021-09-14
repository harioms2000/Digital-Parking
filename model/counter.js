const mongoose= require('mongoose');

const countSchema = new mongoose.Schema({
    last_count:{
        type:Number,
        default:0
    },
    history_count:{
        type:Number,
    }
})
//we will create a new collection

const Count=new mongoose.model("counter",countSchema);

module.exports=Count;