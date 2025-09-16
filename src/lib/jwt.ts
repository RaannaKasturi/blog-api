/*
 * File: jwt.ts                                                                *
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



import jwt from 'jsonwebtoken';

import config from '@/config';

import { Types } from 'mongoose';


export const generateAccessToken = (UserId: Types.ObjectId): string => {
    return jwt.sign({ id: UserId }, config.JWT_ACCESS_SECRET, {
        expiresIn: config.JWT_ACCESS_EXPIRY,
        subject: 'AccessToken',
    });
};

export const generateRefreshToken = (UserId: Types.ObjectId): string => {
    return jwt.sign({ id: UserId }, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRY,
        subject: 'RefreshToken',
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
};