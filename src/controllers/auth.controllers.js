const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerController(req,res){
    const { email , username , password, bio , profileImage} = req.body;

    // const isuserExistByEmail = await userModel.findOne({email});

    // if(isuserExistByEmail){
    //     return res.status(409).json({
    //         message:"email already exists"})
    // }

    // const isuserExistByUsername = await userModel.findOne({username});

    // if(isuserExistByUsername){
    //     return res.status(409).json({
    //         message:"username already exists"})
    // }

    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    });

    if(isUserAlreadyExist){
        return res.status(409).json({
            message:"user already exists" + (isUserAlreadyExist.email === email ? "email already exists" : "username already exists")
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash,
        bio,
        profileImage
    })

    /**
     * user ka data hona chhaiye
     * data unique hona chahiye
     */

    const token = jwt.sign({
        id: user._id,
        username:user.username,
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"user Registerd successfully",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profileImage:user.profileImage
        }
        
    })
}

async function loginController(req, res) {
    const { identifier, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    }).select("+password");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.set("Cache-Control", "no-store");

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    });

    return res.status(200).json({
        message: "Login successful",
        user: {
            username: user.username,
            email: user.email
        }
    });
}

async function getMeController(req,res){
    const userId = req.user.id
    const user = await userModel.findById(userId)

    res.status(200).json({
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
} 

module.exports = {
    registerController,
    loginController,
    getMeController
}
