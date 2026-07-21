import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import databaseConnect from './config/databaseConnect.js';
import sanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });
import app from './app.js';
await databaseConnect();

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})