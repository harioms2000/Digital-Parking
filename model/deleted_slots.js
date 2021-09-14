const mongoose = require('mongoose');

const deletedSchema = new mongoose.Schema({
    deleted_slot:{
        type:Number
    }
})

const Deleted = new mongoose.model('deletedSlot',deletedSchema);
module.exports=Deleted;