const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");



async function followUserController(req,res){

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followerUsername === followeeUsername){
        return res.status(400).json({
            message:"You cannot follow yourself"
        })
    }

    const isFolloweeExist = await userModel.findOne({
        username:followeeUsername
    })

    if(!isFolloweeExist){
        return res.status(404).json({
            message:"User you are trying to follow does not exist"
        })
    }

    const isalreadyFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(isalreadyFollowing){
        return res.status(200).json({
            message:`You are already following ${followeeUsername}`,
                follow:isalreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })

    res.status(200).json({
        message :`You are now following ${followeeUsername}`,
         follow:followRecord
        
    })
}

async function unfollowUserController(req,res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(!isUserFollowing){
        return res.status(400).json({
            message:`You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)    

    res.status(200).json({
        message:`You are no longer following ${followeeUsername}`
    })
}

module.exports = {
    followUserController,
    unfollowUserController
}
