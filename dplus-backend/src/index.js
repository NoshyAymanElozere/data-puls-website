import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRouter from './routes/index.js';
import { localizationMiddleware } from './middleware/localization.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Disable ETags and force no-cache headers for dynamic API content
app.set('etag', false);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Connect to MongoDB Atlas Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(localizationMiddleware);
app.use('/uploads', express.static('uploads'));

// Main Root route
app.get('/', (req, res) => {
    res.send('hello');
});

// Mounted Routes
app.use('/api', apiRouter);

// Start Server listener
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
