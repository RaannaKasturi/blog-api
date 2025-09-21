/*
 * File: index.ts                                                              *
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

import { Types } from "mongoose";



declare global {
    namespace Express {
        interface Request {
            userId?: Types.ObjectId | null;
        }
    }
}