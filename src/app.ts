// Import necessary modules
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Create Express app
const app = express();

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv?.config();

const port: string | number = process?.env?.PORT || 8080;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(express.static(join(__dirname, '/'))); // Serve static files from the '/' directory

import { identify } from './services/fluxkartService.js';
import { error } from './types/fluxkartType.js';

app.get('/', (req: Request, res: Response) => {
    res.send('BiteSpeed Fluxkart Server');
});

app.get('/testEndpoint', async (req: Request, res: Response) => {
    res.send('BiteSpeed Fluxkart service testEndpoint');
});

app.post('/identify', async (req: Request, res: Response) => {
    try {
        const response = await identify(req.body);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Middleware to handle any errors
app.use((err: error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).send({ name: err.name, message: err.message, stack: err.stack });
});

// Middleware to handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        error: {
            code: 404,
            message: 'Not Found',
            description: 'The requested resource was not found on the server.',
            suggestedAction: 'Check the resource URL or verify that the resource exists.',
        },
    });
});

// Start the server
app.listen(port, () => {
    console.log(`BiteSpeed Fluxkart is running at ${port}`);
});
