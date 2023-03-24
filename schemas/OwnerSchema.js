const { path } = require("express/lib/application");
const mongoose = require("mongoose");


const adminSchema = mongoose.Schema({
    _id : {
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        auto: true
    },
    email:{
        type : String,
        required : true,
        unique:true
    },
    phone:{
        type : String,
        required : true,
        unique:true
    },
    password :{
       type: String,
       required : true
    },
    name:{
       type:String,
       required : true
   },
    verified : {
        type : Boolean
    }


  
})

module.exports = mongoose.model('owners' , adminSchema);