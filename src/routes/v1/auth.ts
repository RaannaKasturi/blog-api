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
import { Router } from 'express';

// controllers

const authRouter = Router();

// Register route
authRouter.post('/register', register);

export default authRouter;