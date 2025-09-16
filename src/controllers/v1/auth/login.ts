/*
 * File: login.ts                                                              *
 * Project: blog-api                                                           *
 * Created Date: Tue Sep 16 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Tue Sep 16 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * --------------------------------------------------------------------------  *
 */

import { logger } from "@/lib/winston";
import user, { IUser } from "@/models/user";
import { Request, Response } from "express";
import User from '@/models/user';
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import config from "@/config";
import tokens from "@/models/tokens";


type UserData = Pick<IUser, 'email' | 'password'>

const login = async (req: Request, res: Response) => {
    try {
        const { email } = req.body as UserData;

        const user = await User.findOne({ email })
            .select('username email password role')
            .lean().exec();

        if (user == null) {
            res.status(404).json({
                message: "User doesn't exists",
                code: 'Invalid Data',
            })
            return;
        }

        // Validate Password


        // Generate Access & Refresh Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Update Refresh Token in DB
        await tokens.updateOne(
            { userId: user._id },
            { token: refreshToken },
            { upsert: true }
        );
        logger.info(`Refresh Token generated for ${user._id}`, {
            token: refreshToken,
            userId: user._id,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        res.status(200).json({
            message: "New user Created",
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken
        })
        logger.info("New user loggedin successfully", {
            username: user.username,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
        logger.error(`Error in login controller: ${error}`);
    }
}

export default login;