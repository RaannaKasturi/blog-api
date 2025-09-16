/*
 * File: auth.ts                                                               *
 * Project: blog-api                                                           *
 * Created Date: Thu Sep 11 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Thu Sep 11 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * --------------------------------------------------------------------------  *
 */



import register from '@/controllers/v1/auth/register';
import validationError from '@/middlewares/validationError';
import user from '@/models/user';
import { Router } from 'express';
import { body, cookie } from 'express-validator';
import User from '@/models/user';
import login from '@/controllers/v1/auth/login';
import bcrypt from 'bcrypt';
import refreshToken from '@/controllers/v1/auth/refresh-token';

// controllers

const authRouter = Router();

// Register route
authRouter.post(
    '/register',
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isLength({ max: 50 }).withMessage("Email must be less than 50")
        .isEmail().withMessage("Invalid email address")
        .not().contains("+").withMessage("Email address must not contain '+'")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error("Email address already in use");
            }
        }),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8, max: 32 }).withMessage("Password must be between 8-32 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]).{8,32}$/).withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    body('role')
        .optional().isString().withMessage("Role must be a string")
        .isIn(['admin', 'user']).withMessage("Role must be Admin or User"),
    validationError,
    register,
);

// Login Route
authRouter.post(
    "/login",
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isLength({ max: 50 }).withMessage("Email must be less than 50")
        .isEmail().withMessage("Invalid email address")
        .not().contains("+").withMessage("Email address must not contain '+'")
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (!userExists) {
                throw new Error("Email address is not registered");
            }
        }),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8, max: 32 }).withMessage("Password must be between 8-32 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={\[}\]|\\:;"'<,>.?/]).{8,32}$/).withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const userExists = await User.findOne({ email }).select('password').lean().exec();
            if (!userExists) {
                throw new Error("User Email or Password is not valid");
            }
            const passwordMatch = await bcrypt.compare(value, userExists.password);
            if (!passwordMatch) {
                throw new Error("User Email or Password is not valid");
            }
        }),
    validationError,
    login,
);


// Refresh Token Route
authRouter.post(
    '/refresh-token',
    cookie('refreshToken')
        .notEmpty().withMessage("Refresh Token is required")
        .isJWT().withMessage("Refresh Token must be a valid JWT"),
    validationError,
    refreshToken
);

export default authRouter;