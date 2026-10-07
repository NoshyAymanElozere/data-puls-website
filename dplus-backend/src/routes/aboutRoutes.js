import express from 'express';
import { getAboutUs, updateAboutUs } from '../controllers/aboutController.js';

const router = express.Router();

router.route('/')
    .get(getAboutUs)
    .put(updateAboutUs);

export default router;
