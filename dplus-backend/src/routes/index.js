import express from 'express';
import userRoutes from './userRoutes.js';
import blogRoutes from './blogRoutes.js';
import departmentRoutes from './departmentRoutes.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/departments', departmentRoutes);

export default router;
