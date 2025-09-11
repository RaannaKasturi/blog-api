/*
 * File: register.ts                                                           *
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



import { logger } from "@/lib/winston";
import config from "@/config";

import { Request, Response } from "express";


const register = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            message: "New user Created",
        })
        logger.info("New user registered successfully");
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error,
        });
        logger.error(`Error in register controller: ${error}`);
    }
}
export default register;