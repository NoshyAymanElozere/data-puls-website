import Department from '../models/Department.js';
import slugify from 'slugify';

/**
 * @desc    جلب جميع الأقسام
 * @route   GET /api/departments
 * @access  Public
 */
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: departments.length,
            data: res.localize(departments)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    جلب قسم واحد بالمعرف (Slug) أو الـ ObjectId
 * @route   GET /api/departments/:id
 * @access  Public
 */
export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: id };
        } else {
            query = { slug: id.toLowerCase() };
        }

        const dept = await Department.findOne(query);
        if (!dept) {
            return res.status(404).json({
                success: false,
                message: 'القسم غير موجود'
            });
        }

        res.status(200).json({
            success: true,
            data: res.localize(dept)
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    إنشاء قسم جديد
 * @route   POST /api/departments
 * @access  Admin/Private
 */
export const createDepartment = async (req, res) => {
    try {
        const { name_ar, name_en } = req.body;

        if (!name_ar || !name_en) {
            return res.status(400).json({
                success: false,
                message: 'يرجى إدخال اسم القسم بالعربية والإنجليزية'
            });
        }

        const slug = slugify(name_en, { lower: true, strict: true });

        // التحقق من تكرار الـ Slug
        const existingDept = await Department.findOne({ slug });
        if (existingDept) {
            return res.status(400).json({
                success: false,
                message: 'القسم موجود بالفعل، يرجى كتابة اسم مختلف بالإنجليزية'
            });
        }

        const newDept = new Department({
            name_ar,
            name_en,
            slug
        });

        await newDept.save();

        res.status(201).json({
            success: true,
            message: 'تم إضافة القسم بنجاح',
            data: newDept
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    تعديل قسم حالي
 * @route   PUT /api/departments/:id
 * @access  Admin/Private
 */
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_ar, name_en } = req.body;

        let query = {};
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: id };
        } else {
            query = { slug: id.toLowerCase() };
        }

        const targetDept = await Department.findOne(query);
        if (!targetDept) {
            return res.status(404).json({
                success: false,
                message: 'القسم غير موجود لتحديثه'
            });
        }

        if (name_en) {
            const newSlug = slugify(name_en, { lower: true, strict: true });

            // التحقق من تعارض الـ Slug مع قسم آخر
            const existingDept = await Department.findOne({ _id: { $ne: targetDept._id }, slug: newSlug });
            if (existingDept) {
                return res.status(400).json({
                    success: false,
                    message: 'هناك قسم آخر مسجل بنفس الاسم بالإنجليزية'
                });
            }
            targetDept.slug = newSlug;
            targetDept.name_en = name_en;
        }

        if (name_ar) {
            targetDept.name_ar = name_ar;
        }

        await targetDept.save();

        res.status(200).json({
            success: true,
            message: 'تم تحديث القسم بنجاح',
            data: targetDept
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    حذف قسم
 * @route   DELETE /api/departments/:id
 * @access  Admin/Private
 */
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: id };
        } else {
            query = { slug: id.toLowerCase() };
        }

        const deletedDept = await Department.findOneAndDelete(query);
        if (!deletedDept) {
            return res.status(404).json({
                success: false,
                message: 'القسم غير موجود لحذفه'
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم حذف القسم بنجاح'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
