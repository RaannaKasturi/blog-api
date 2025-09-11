/*
 * File: mongoose.ts                                                           *
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
 * ----------	---	---------------------------------------------------------  *
 */



import mongoose from 'mongoose';

import type { ConnectOptions } from 'mongoose';

import config from '@/config';
import { logger } from './winston';

const clientOptions: ConnectOptions = {
    dbName: 'blog-api',
    appName: 'blog-api',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
};

// Connect to the database
export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('Connected to Database');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error Connecting to Database: ${error.message}`);
        }
        logger.warn('Error Connecting the Database', error);
    }
};

// Disconnect from the database
export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('Disconnected from Database');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error Disconnecting from Database: ${error.message}`);
        }
        logger.warn('Error Connecting the Database', error);
    }
};