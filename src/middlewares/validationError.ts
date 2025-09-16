/*
 * File: validationError.ts
 * Project: blog-api
 * Created Date: Tue Sep 16 2025
 * Author: Nayan (Raanna) Kasturi
 * -----
 * Last Modified: Tue Sep 16 2025
 * Modified By: Nayan (Raanna) Kasturi
 * -----
 * Copyright (c) 2025 Binary Biology. All rights reserved.
 * License: Apache-2.0
 * License URL: https://www.apache.org/licenses/LICENSE-2.0
 * Contact: raanna@binarybiology.top
 * --------------------------------------------------------------------------
 */

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validationError = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = Object.values(errors.mapped()).map((error: any) => error.msg);
        const combinedErrorMessage = errorMessages.join(". ");

        res.status(400).json({
            code: 'ValidationError',
            errors: combinedErrorMessage,
        });
        return;
    }

    next();
}

export default validationError;