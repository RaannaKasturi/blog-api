/*
 * File: tokens.ts                                                             *
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



import { Schema, model } from 'mongoose';

interface IToken {
    token: string,
    userId: string,
};

const tokenSchema = new Schema<IToken>({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    }
});

const Token = model<IToken>('Token', tokenSchema);
export default Token;