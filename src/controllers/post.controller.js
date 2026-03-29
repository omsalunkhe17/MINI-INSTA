const postModel = require('../models/post.model')
const  Imagekit = require("@imagekit/nodejs");
const { toFile } = require('@imagekit/nodejs');
const jwt = require('jsonwebtoken');
const likeModel = require('../models/like.model');

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
    
})


async function createPostController(req,res){
   

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName:"Test",
        folder:"Cohort-2-insta-clone"
    })

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:req.user.id
    })

    res.status(201).json({
        message:"post created successfully",
        post
    })

}

async function getPostController(req,res){

    

    const userId = req.user.id

    const posts = await postModel.find({
        user:userId
    }).populate("user")

    res.status(200).json({
        message:"posts fetched successfully",
        posts
    })


}

async function getPostDetailsController(req,res){
    

    const userId = req.user.id
    const postId = req.params.postId

    if(!postId){
        return res.status(404).json({
            message:"Post not found"
        })
    }

    const post = await postModel.findById(postId).populate("user") 
    
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }

    
    const isValidUser = post.user.toString() === userId
    
    if(!isValidUser){
        return res.status(403).json({
            message:"You are not authorized to access this post"
        })
    }

    return res.status(200).json({
        message:"post details fetched successfully",
        post
    })


}

async function likePostController(req,res){
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }

    const like = await likeModel.create({
        post:postId,
        username:username
    })

    res.status(200).json({
        message:"Post liked successfully",
        like
    })          
}

async function unlikePostController(req,res){
    const username = req.user.username
    const postId = req.params.postId

    const like = await likeModel.findOne({
        post:postId,
        username:username
    })

    if(!like){
        return res.status(404).json({
            message:"Like not found"
        })
    }

    await likeModel.findByIdAndDelete({_id : like._id} )

    return res.status(200).json({
        message:"Post unliked successfully",
        
    })          
}

async function getFeedController(req, res) {
    const user = req.user;

    const posts = await postModel
        .find()
        .sort ({ _id: -1 })
        .populate("user")
        .lean();

    const updatedPosts = await Promise.all(
        posts.map(async (post) => {
            const isLiked = await likeModel.findOne({
                username: user.username, // FIXED
                post: post._id
            });

            post.isLiked = !!isLiked;
            return post;
        })
    );

    res.status(200).json({
        message: "Feed fetched successfully",
        posts: updatedPosts
    });
}


module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unlikePostController
}