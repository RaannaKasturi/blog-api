/*
 * File: express_rate_limit.ts                                                 *
 * Project: blog-api                                                           *
 * Created Date: Wed Sep 10 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Wed Sep 10 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * ----------	---	---------------------------------------------------------  *
 */



import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 1000, // 5 seconds
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: 'draft-8', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
})

export default limiter;