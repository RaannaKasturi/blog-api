/*
 * File: index.ts                                                              *
 * Project: blog-api                                                           *
 * Created Date: Mon Sep 15 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Mon Sep 15 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * --------------------------------------------------------------------------  *
 */



import express from "express";

import authRouter from "./auth";

// Add your route handlers here
const v1Routes = express.Router();

// Base route
v1Routes.get('/', (req, res) => {
    res.json({
        message: 'API is Live',
        status: 'ok',
        version: '1.0.0',
        timeStamp: new Date().toISOString(),
    });
});

// Ping route
v1Routes.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

v1Routes.use('/auth', authRouter);

export default v1Routes;