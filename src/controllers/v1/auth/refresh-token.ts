/*
 * File: refresh-token.ts                                                      *
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

import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import Token from "@/models/tokens";
import { Request, Response } from "express";
import { Types } from "mongoose";
import jwt from 'jsonwebtoken';



const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;
    try {
        const tokenExists = await Token.exists({ token: refreshToken })
        if (!tokenExists) {
            res.status(401).json({
                code: "InvalidToken",
                message: "Refresh Token is invalid or expired",
            });
            logger.warn("Refresh token is invalid or expired");
        }
        // Verify Refresh Token
        const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };
        const accessToken = generateAccessToken(jwtPayload.userId);
        res.status(200).json({
            accessToken,
        });
        logger.info("Access token generated using refresh token");
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                code: 'TokenExpired',
                message: "Refresh Token has expired. Please login again.",
            });
            logger.warn("Refresh token has expired. Please login again.");
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                code: 'InvalidToken',
                message: "Refresh Token is invalid. Please login again.",
            });
            logger.warn("Refresh token is invalid. Please login again.");
            return;
        }
        res.status(500).json({
            code: 'ServerError',
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
        logger.error(`Error in refresh-token controller: ${error}`);
    }
}

export default refreshToken;