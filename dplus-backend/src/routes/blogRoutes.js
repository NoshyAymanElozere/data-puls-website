import express from 'express';
import { getBlogBySlug, createBlog, getAllBlogs, updateBlog, deleteBlog, uploadBlogImage } from '../controllers/blogController.js';
import validate from '../middleware/validation.js';
import { createBlogSchema } from '../validators/blogValidator.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Route to fetch all blogs
router.get('/', getAllBlogs);

// Route to upload an image file
router.post('/upload', upload.single('image'), uploadBlogImage);

// Route to fetch a blog by slug
router.get('/:slug', getBlogBySlug);

// Route to create a new blog (validated using Joi)
router.post('/', validate(createBlogSchema), createBlog);

// Route to update an existing blog by ID
router.put('/:id', validate(createBlogSchema), updateBlog);

// Route to delete an existing blog by ID
router.delete('/:id', deleteBlog);

export default router;
