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
 * --------------------------------------------------------------------------  *
 */



import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import config from '@/config';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import rateLimiter from '@/lib/express_rate_limit';
import v1Routes from '@/routes/v1';
import { logger } from './lib/winston';

const app = express();

// CORS Options
const corsOptions: CorsOptions = {
    origin(requestOrigin, callback) {
        if (config.NODE_ENV === 'development' || !requestOrigin || config.WHITELIST_ORIGINS.includes(requestOrigin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy: No access from origin ${requestOrigin}`), false);
            logger.warn(`CORS policy: No access from origin ${requestOrigin}`);
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
        // Connect to the database
        await connectToDatabase();

        // API Version 1 routes
        app.use('/api/v1', v1Routes);

        // Start the server
        app.listen(config.PORT, () => {
            logger.info(`Server is running on http://localhost:${config.PORT}`);
        });

    } catch (error) {
        logger.error('Error starting server:', error);

        if (config.NODE_ENV === 'production') {
            process.exit(1); // Exit the process with failure
        }
    }
})();

// Handle Server Shutdown Gracefully
const handleServerShutdown = async () => {
    try {
        // Disconnect from the database
        await disconnectFromDatabase();

        logger.info('Shutting down server gracefully...');
        process.exit(0);
    } catch (error) {
        logger.error('Error during server shutdown:', error);
    }
}

// Listen for termination signals
process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);