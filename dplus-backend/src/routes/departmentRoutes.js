import express from 'express';
import {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

// جلب جميع الأقسام وإضافتها
router.get('/', getAllDepartments);
router.post('/', createDepartment);

// إدارة قسم محدد بالمعرف أو الـ Slug
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
