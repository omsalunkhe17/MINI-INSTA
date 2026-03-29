const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already exists"],
        required:[true,"username is required"]
    },
    email:{
        type:String,
        unique:[true,"email already exists"],
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/zl81bq0dsb/Cohort-2-insta-clone/Def%20img.png"
    }


})

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;