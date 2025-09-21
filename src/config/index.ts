/*
 * File: index.ts                                                              *
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
 * --------------------------------------------------------------------------  *
 */



import dotenv from 'dotenv';

import type ms from 'ms';

dotenv.config({
    override: true,
});

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: [
        'http://localhost:3000',
    ],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    WHITELIST_ADMIN_MAIL: [
        "raannakasturi@gmail.com"
    ],
    // JWT Config
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY as ms.StringValue,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY as ms.StringValue,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
    LOGTAIL_INGESTION_HOST: process.env.LOGTAIL_INGESTION_HOST!,
}

export default config;