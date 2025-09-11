import express from "express";

import authRouter from "./auth";

// Add your route handlers here
const v1Routes = express.Router();

// Base route
v1Routes.get('/', (req, res) => {
    res.json({
        message: 'API is Live',
        status: 'ok',
        version: '1.0.0',
        timeStamp: new Date().toISOString(),
    });
});

// Ping route
v1Routes.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

v1Routes.use('/auth', authRouter);

export default v1Routes;