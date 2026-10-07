import express from 'express';
import userRoutes from './userRoutes.js';
import blogRoutes from './blogRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import contactRoutes from './contactRoutes.js';
import aboutRoutes from './aboutRoutes.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/departments', departmentRoutes);
router.use('/contact', contactRoutes);
router.use('/about', aboutRoutes);

export default router;
