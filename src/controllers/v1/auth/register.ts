/*
 * File: register.ts                                                           *
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
 * ----------	---	---------------------------------------------------------  *
 */



import { logger } from "@/lib/winston";
import config from "@/config";

import { Request, Response } from "express";

import User, { IUser } from "@/models/user";
import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import tokens from "@/models/tokens";

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;
    try {
        if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
            res.status(403).json({
                code: "Authorization Error",
                message: "You cannot register as Admin"
            });
            logger.warn(
                `User with email ${email} tried to register as admin. But, is not in admin whitelist`
            );
            return;
        }
        const username = genUsername();
        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'user',
        })

        // Generate Access & Refresh Tokens
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Store Refresh Token in DB
        await tokens.create({
            token: refreshToken,
            userId: newUser._id,
        });
        logger.info(`Refresh Token generated for ${newUser._id}`, {
            token: refreshToken,
            userId: newUser._id,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        res.status(200).json({
            message: "New user Created",
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken
        })
        logger.info("New user registered successfully", {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
        logger.error(`Error in register controller: ${error}`);
    }
}
export default register;