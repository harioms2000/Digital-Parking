const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Parking",{
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false
}).then(()=>{
    console.log(`connection successful`);
}).catch((err)=>{
    console.log("no connection");
})