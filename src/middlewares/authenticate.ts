/*
 * File: authenticate.ts                                                       *
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

import { verifyAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            code: 'Unauthorized',
            message: 'No token provided',
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
            code: 'Unauthorized',
            message: 'No token provided',
        });
        return;
    }

    try {
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };
        req.userId = jwtPayload.userId;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'Unauthorized',
                message: 'Invalid or expired token',
            });
        } else {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : error,
            });
        }
        logger.error(`Error in authenticate middleware: ${error}`);
        return;
    }
};

export default authenticate;