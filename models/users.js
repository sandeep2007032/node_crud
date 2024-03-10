const { default: mongoose } = require("mongoose");
const mangoose=require("mongoose");
const userSchema=  new mangoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },image:{
        type:String,
        required:true,
    },
    created:{
          type:Date,
          required:true,
          default:Date.now,
    },
});

module.exports= mongoose.model('User',userSchema);