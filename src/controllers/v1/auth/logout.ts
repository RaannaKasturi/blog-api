/*
 * File: logout.ts                                                             *
 * Project: blog-api                                                           *
 * Created Date: Sun Sep 21 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Sun Sep 21 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * --------------------------------------------------------------------------  *
 */

import config from "@/config";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from "@/models/tokens";
import tokens from "@/models/tokens";
import User, { IUser } from "@/models/user";
import { Request, Response } from "express";

type UserData = Pick<IUser, 'email' | 'password'>

const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken as String;
        if (refreshToken) {
            Token.deleteOne({
                token: refreshToken
            }).exec().then(() => {
                logger.info(`Refresh token deleted successfully during logout`);
            }).catch((error) => {
                logger.error(`Error deleting refresh token during logout: ${error}`);
            })
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(204).json({});
        logger.info(`User logged out successfully`);
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
        logger.error(`Error in logout controller: ${error}`);
    }
}

export default logout;