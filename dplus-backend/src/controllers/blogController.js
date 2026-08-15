import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import slugify from 'slugify';

/**
 * دالة تهيئة وتحويل كتلة البيانات للغة واحدة (عربية أو إنجليزية)
 * وتقوم بهيكلة المدخلات لتطابق متطلبات عرض صفحات واجهة المستخدم.
 */
const normalizeLangBlock = (title, subtitle, categoryId, readTime, authorName, sections, lang, authorAvatarUrl, dateStr) => {
    // تعيين وقت افتراضي للقراءة في حال عدم تحديده
    const defaultReadTime = readTime || (lang === 'ar' ? '5 دقائق للقراءة' : '5 min read');

    // توزيع أقسام المحتوى للمقاطع المختلفة بالصفحة
    let section1_title = lang === 'ar' ? 'نظرة عامة' : 'Overview';
    let section1_p1 = subtitle || '';
    let section1_p2 = '';
    let section1_strong = '';
    let section1_p2_cont = '';
    let callout_text = '';
    let section2_title = '';
    let section2_p1 = '';

    const elements = sections || [];
    let headings = [];
    let paragraphs = [];
    let quotes = [];

    // فرز العناصر المستلمة حسب نوعها
    elements.forEach(sec => {
        if (sec.type === 'header') {
            headings.push(sec.text);
        } else if (sec.type === 'paragraph') {
            paragraphs.push(sec.text);
        } else if (sec.type === 'quote_card') {
            quotes.push(sec.text);
        }
    });

    if (headings.length > 0) section1_title = headings[0];
    if (headings.length > 1) section2_title = headings[1];

    if (paragraphs.length > 0) section1_p1 = paragraphs[0];
    if (paragraphs.length > 1) {
        section1_p2 = paragraphs[1];
        const words = section1_p2.split(' ');
        if (words.length > 3) {
            section1_strong = words.slice(0, 2).join(' ');
            section1_p2_cont = ' ' + words.slice(2).join(' ');
        } else {
            section1_p2_cont = section1_p2;
        }
    }
    if (paragraphs.length > 2) section2_p1 = paragraphs[2];
    if (quotes.length > 0) callout_text = quotes[0];

    // تكوين الفهرس الجانبي للتمرير التلقائي
    const indexList = headings.map((heading, i) => ({
        id: `section-${i + 1}`,
        label: heading
    }));

    // تحديد تاريخ العرض وتنسيقه
    let displayDate = dateStr;
    try {
        if (dateStr) {
            displayDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
        }
    } catch (e) {
        // الاحتفاظ بالتاريخ الأصلي كبديل
    }

    // إرجاع كائن المحتوى الهيكلي المترجم
    return {
        seo: {
            title: title + (lang === 'ar' ? ' | داتا بولس' : ' | Data Pulse'),
            description: subtitle || '',
            keywords: categoryId
        },
        hero: {
            dispatch_prefix: lang === 'ar' ? 'إرسال: ' : 'DISPATCH: ',
            read_label: lang === 'ar' ? 'دقائق للقراءة' : 'MIN READ',
            label_left: lang === 'ar' ? 'تأسس ٢٠٢٤' : 'EST. 2024',
            label_right_prefix: lang === 'ar' ? 'تجزئة: ' : 'HASH: ',
            scroll_label: lang === 'ar' ? 'انزل لأسفل' : 'SCROLL DOWN'
        },
        meta_ticker: {
            integrity_label: lang === 'ar' ? 'سلامة' : 'INTEGRITY',
            integrity_value: lang === 'ar' ? 'مؤكد' : 'VERIFIED',
            source_label: lang === 'ar' ? 'مصدر' : 'SOURCE',
            node_prefix: lang === 'ar' ? 'عقدة // ' : 'NODE // ',
            node_suffix: lang === 'ar' ? ' // نظام' : ' // SYSTEM',
            download_button: lang === 'ar' ? 'حفظ المقال' : 'SAVE DISPATCH'
        },
        sidebar: {
            index_label: lang === 'ar' ? 'فهرس' : 'INDEX',
            node_prefix: lang === 'ar' ? 'عقدة_' : 'NODE_',
            quote: quotes[0] || (lang === 'ar' ? 'التعلم هو الكود المصدري الجديد، والسياق هو الذاكرة الجديدة.' : 'Learning is the new source code, and context is the new memory.')
        },
        index: indexList,
        content: {
            section1_title,
            section1_p1,
            section1_p2,
            section1_strong,
            section1_p2_cont,
            callout_label: lang === 'ar' ? 'نظرة بحثية' : 'RESEARCH INSIGHT',
            callout_text,
            section2_title,
            section2_p1
        },
        article: {
            id: '',
            uid: `${lang === 'ar' ? 'AR' : 'EN'}-${Date.now().toString().slice(-6)}`,
            category: categoryId,
            title,
            title_accent: '',
            subtitle,
            lead: subtitle,
            author: {
                name: authorName || '',
                role: lang === 'ar' ? 'مساهم' : 'Contributor',
                image: authorAvatarUrl || 'https://i.pravatar.cc/150',
                id: 'DP-CONT'
            },
            meta: {
                date: displayDate,
                readTime: defaultReadTime.replace(/[^0-9]/g, ''),
                hash: '0x' + Math.random().toString(16).slice(2, 10),
                security: lang === 'ar' ? 'منشور عام' : 'Public Dispatch'
            }
        },
        related: {
            title_line1: lang === 'ar' ? 'استمر' : 'KEEP',
            title_line2: lang === 'ar' ? 'في الاستكشاف' : 'EXPLORING',
            subtitle: lang === 'ar' ? 'تعمق أكثر في أرشيفاتنا التقنية.' : 'Dive deeper into our technical archives.',
            view_archive: lang === 'ar' ? 'عرض جميع المقالات' : 'VIEW ALL BLOGS',
            access_label: lang === 'ar' ? 'قرء المقال كاملاً' : 'READ FULL DISPATCH'
        }
    };
};

/**
 * دالة لتوحيد الحقول المستقبلة من لوحة التحكم وصهرها في الكتل المخصصة
 */
const normalizeBlogPayload = (body) => {
    const slug = body.slug || '';
    const coverImage = body.coverImage || '';
    const authorAvatarUrl = body.authorAvatarUrl || '';
    const dateStr = body.publishedAt || new Date().toISOString().split('T')[0];

    const titleAr = body.title_ar || body.title || '';
    const titleEn = body.title_en || body.titleEn || '';
    const subtitleAr = body.subtitle || '';
    const subtitleEn = body.subtitleEn || '';
    const categoryAr = body.category || 'تطوير البرمجيات';
    const categoryEn = body.categoryEn || 'Software Development';
    const authorAr = body.name_ar || body.author || body.nameAr || '';
    const authorEn = body.name_en || body.authorEn || body.nameEn || '';
    const readTimeAr = body.readTime || '5 دقائق للقراءة';
    const readTimeEn = body.readTimeEn || '5 min read';

    const sectionsEn = body.sectionsEn || [];
    const sectionsAr = body.sections || body.sectionsAr || [];

    // توليد معرف القسم الموحد ديناميكياً من عنوان القسم بالإنجليزية لربطه بالفرونت-إند
    const categoryId = slugify(categoryEn, { lower: true, strict: true }) || 'software';

    // صياغة الكتل المترجمة
    const normalizedEn = normalizeLangBlock(titleEn, subtitleEn, categoryId, readTimeEn, authorEn, sectionsEn, 'en', authorAvatarUrl, dateStr);
    const normalizedAr = normalizeLangBlock(titleAr, subtitleAr, categoryId, readTimeAr, authorAr, sectionsAr, 'ar', authorAvatarUrl, dateStr);

    if (normalizedEn && normalizedEn.article) {
        normalizedEn.article.id = slug;
    }
    if (normalizedAr && normalizedAr.article) {
        normalizedAr.article.id = slug;
    }

    return {
        slug,
        coverImage,
        authorAvatarUrl,
        publishedAt: dateStr,

        // الحقول المسطحة لتجنب المشاكل في جداول العرض بلوحة التحكم
        title: titleAr,
        titleEn: titleEn,
        title_ar: titleAr,
        title_en: titleEn,
        subtitle: subtitleAr,
        subtitleEn: subtitleEn,
        category: categoryAr,
        categoryEn: categoryEn,
        author: authorAr,
        authorEn: authorEn,
        name_ar: authorAr,
        name_en: authorEn,
        readTime: readTimeAr,
        readTimeEn: readTimeEn,

        en: normalizedEn,
        ar: normalizedAr
    };
};

/**
 * @desc    جلب تفاصيل مقال واحد حسب المعرف (Slug) أو الـ ObjectId
 * @route   GET /api/blogs/:slug
 * @access  Public
 */
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        let query = {};
        if (mongoose.Types.ObjectId.isValid(slug)) {
            query = { $or: [{ _id: slug }, { slug: slug.toLowerCase() }] };
        } else {
            query = { slug: slug.toLowerCase() };
        }
        const blog = await Blog.findOne(query);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'المقال غير موجود',
            });
        }

        res.status(200).json({
            success: true,
            data: res.localize(blog),
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    إنشاء مقال جديد
 * @route   POST /api/blogs
 * @access  Admin/Private
 */
export const createBlog = async (req, res) => {
    try {
        let finalSlug = req.body.slug || '';
        const titleText = req.body.title || req.body.titleEn || '';
        if (!finalSlug && titleText) {
            finalSlug = slugify(titleText, { lower: true, strict: true });
        } else if (finalSlug) {
            finalSlug = slugify(finalSlug, { lower: true, strict: true });
        }
        if (!finalSlug) {
            finalSlug = `blog-${Date.now()}`;
        }

        // التأكد من عدم تكرار الـ Slug
        const existingBlog = await Blog.findOne({ slug: finalSlug });
        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: 'تنبيه: مسار المقال (Slug) مستخدم بالفعل. يرجى إدخال اسم مميز.',
            });
        }

        req.body.slug = finalSlug;
        const normalizedData = normalizeBlogPayload(req.body);

        const newBlog = new Blog(normalizedData);
        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'تم حفظ المقال بنجاح',
            data: newBlog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    جلب كافة المقالات في لوحة التحكم أو الموقع
 * @route   GET /api/blogs
 * @access  Public
 */
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: res.localize(blogs),
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    تعديل مقال حالي (بواسطة المعرف أو الـ Slug)
 * @route   PUT /api/blogs/:id
 * @access  Admin/Private
 */
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { slug: id.toLowerCase() };
        }

        const targetBlog = await Blog.findOne(query);
        if (!targetBlog) {
            return res.status(404).json({
                success: false,
                message: 'المقال غير موجود لتعديله',
            });
        }

        const targetId = targetBlog._id;

        let finalSlug = req.body.slug || '';
        if (finalSlug) {
            finalSlug = slugify(finalSlug, { lower: true, strict: true });

            // التحقق من عدم التعارض مع مقال آخر
            const existingBlog = await Blog.findOne({ _id: { $ne: targetId }, slug: finalSlug });
            if (existingBlog) {
                return res.status(400).json({
                    success: false,
                    message: 'تنبيه: مسار المقال (Slug) مستخدم بالفعل في مقال آخر.',
                });
            }
        }

        req.body.slug = finalSlug;
        const normalizedData = normalizeBlogPayload(req.body);

        const updatedBlog = await Blog.findByIdAndUpdate(
            targetId,
            normalizedData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'تم تحديث المقال بنجاح',
            data: updatedBlog,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    حذف مقال حالي بقاعدة البيانات (بواسطة المعرف أو الـ Slug)
 * @route   DELETE /api/blogs/:id
 * @access  Admin/Private
 */
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { slug: id.toLowerCase() };
        }

        const deletedBlog = await Blog.findOneAndDelete(query);

        if (!deletedBlog) {
            return res.status(404).json({
                success: false,
                message: 'المقال غير موجود لحذفه',
                deletedId: id
            });
        }

        res.status(200).json({
            success: true,
            message: 'تم حذف المقال بنجاح',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    تحميل ورفع صورة المقال
 * @route   POST /api/blogs/upload
 * @access  Admin/Private
 */
export const uploadBlogImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'يرجى تحميل ملف صور صالح للاستخدام.',
            });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'تم رفع الصورة بنجاح',
            url: imageUrl,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export default {
    getBlogBySlug,
    createBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    uploadBlogImage,
};
