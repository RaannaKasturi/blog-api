/*
 * File: server.ts                                                             *
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



import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from '@/config';
import rateLimiter from '@/lib/express_rate_limit';

const app = express();

// CORS Options
const corsOptions: CorsOptions = {
    origin(requestOrigin, callback) {
        if (config.NODE_ENV === 'development' || !requestOrigin || config.WHITELIST_ORIGINS.includes(requestOrigin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: No access from origin ${requestOrigin}`), false);
            console.log(`CORS policy: No access from origin ${requestOrigin}`);
        }
    },
}

// CORS Middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Compression middleware
app.use(compression({
    threshold: 1024, // Compress all responses
}));

// Helmet middleware for security headers
app.use(helmet());

// Apply rate limiting middleware
app.use(rateLimiter);
(async () => {
    try {
        // Base route
        app.get('/', (req, res) => {
            res.json({ message: 'Hello, World!' });
        });

        // Ping route
        app.get('/ping', (req, res) => {
            res.json({ message: 'pong' });
        });

        // Start the server
        app.listen(3000, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1); // Exit the process with failure
        }
    }
})();

