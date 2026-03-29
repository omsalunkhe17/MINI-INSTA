const express = require('express')
const postRouter = express.Router();
const postController = require('../controllers/post.controller')
const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()}) // for parsing multipart/form-data
const identidyUser = require('../middleware/auth.middleware')

postRouter.use(identidyUser) // to make all the routes protected routes



/**
 * @route POST /api/posts [protected route]
 * - @description create a post with the given caption and image in the request body
 * - 
 */

/** /api/posts/ */

postRouter.post("/",upload.single("image"),postController.createPostController)

/**
 * @GET /api/posts/ [protected route]
 * - @description get all the posts of the user that is logged in
 * 
 */

postRouter.get('/',postController.getPostController)

/**
 * @GET /api/posts/details/:postId
 * - @description return details about specific post with the ID, also check whether the post belongs to the user that the result come from
 */

postRouter.get('/details/:postId',postController.getPostDetailsController)


/**
 * @route POST /api/posts/like/:postId [protected route]
 * - @description like a post with the given postId in the params
 */

postRouter.post("/like/:postId",identidyUser ,postController.likePostController)
postRouter.post("/unlike/:postId",identidyUser ,postController.unlikePostController)

/**
 * @route GET /api/posts/feed
 * @description get all the posts of the user that is logged in and also the posts of the users that the user is following
 * @access Private
 */
postRouter.get("/feed",identidyUser,postController.getFeedController)

module.exports = postRouter 