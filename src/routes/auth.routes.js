const express = require('express');
const authController = require('../controllers/auth.controllers');
const identidyUser = require('../middleware/auth.middleware');

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerController)

/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */

authRouter.post('/login', authController.loginController)

/**
 * @route GET /api/auth/get-me
 * @desc Get the current logged-in user
 * @access Private
 */
authRouter.get('/get-me', identidyUser, authController.getMeController)


module.exports = authRouter;