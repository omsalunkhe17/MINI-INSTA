const express = require('express');
const userController = require('../controllers/user.controller');
const identidyUser = require('../middleware/auth.middleware')   


const userRouter = express.Router();

/**
 * @ route POST /api/users/follow/:userID
 * @description follow a user with the given userID in the params
 * @access Private
 */
userRouter.post("/follow/:username", identidyUser, userController.followUserController)


/**
 * @ route POST /api/users/unfollow/:userID
 * @description unfollow a user with the given userID in the params
 * @access Private
 */
userRouter.post("/unfollow/:username", identidyUser, userController.unfollowUserController)




module.exports = userRouter;