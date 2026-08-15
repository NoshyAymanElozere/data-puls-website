import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Department from '../models/Department.js';
import Blog from '../models/Blog.js';

dotenv.config();

const staticBase = 'f:/data-pluts-project/dpplus/dpuls-frontend/DataPulse/static-content';

const seed = async () => {
    try {
        console.log('Connecting to database...');
        await connectDB();

        console.log('Clearing existing collections...');
        await Department.deleteMany({});
        await Blog.deleteMany({});

        console.log('Seeding departments...');
        const deptData = [
            { slug: 'software', name_ar: 'تطوير البرمجيات', name_en: 'Software Development' },
            { slug: 'ai', name_ar: 'الذكاء الاصطناعي والتعلم الآلي', name_en: 'AI & Machine Learning' },
            { slug: 'cloud', name_ar: 'الحوسبة السحابية والعمليات', name_en: 'Cloud & DevOps' },
            { slug: 'marketing', name_ar: 'التسويق الرقمي', name_en: 'Digital Marketing' },
            { slug: 'product', name_ar: 'إدارة المنتجات', name_en: 'Product Management' }
        ];
        const departments = await Department.insertMany(deptData);
        console.log(`Seeded ${departments.length} departments.`);

        // Read all blogs list
        console.log('Loading static blog metadata...');
        const enAll = JSON.parse(fs.readFileSync(path.join(staticBase, 'Blogs/All/en.json'), 'utf8'));
        const arAll = JSON.parse(fs.readFileSync(path.join(staticBase, 'Blogs/All/ar.json'), 'utf8'));

        const categoryMap = {
            software: { ar: 'تطوير البرمجيات', en: 'Software Development' },
            ai: { ar: 'الذكاء الاصطناعي والتعلم الآلي', en: 'AI & Machine Learning' },
            cloud: { ar: 'الحوسبة السحابية والعمليات', en: 'Cloud & DevOps' },
            marketing: { ar: 'التسويق الرقمي', en: 'Digital Marketing' },
            product: { ar: 'إدارة المنتجات', en: 'Product Management' }
        };

        console.log('Seeding blogs...');
        for (const blogItem of enAll.blogs) {
            const { slug, coverImage, publishedAt } = blogItem;
            const arBlogItem = arAll.blogs.find(b => b.slug === slug) || {};

            // Load details content
            const detailEnPath = path.join(staticBase, `Blogs/Details/${slug}/en.json`);
            const detailArPath = path.join(staticBase, `Blogs/Details/${slug}/ar.json`);

            let enDetails = {};
            let arDetails = {};

            if (fs.existsSync(detailEnPath)) {
                enDetails = JSON.parse(fs.readFileSync(detailEnPath, 'utf8'));
            }
            if (fs.existsSync(detailArPath)) {
                arDetails = JSON.parse(fs.readFileSync(detailArPath, 'utf8'));
            }

            const categoryId = blogItem.categoryId || 'software';
            const catInfo = categoryMap[categoryId] || categoryMap.software;

            // Set up high-fidelity article.id to match the DB slug format
            if (enDetails.article) {
                enDetails.article.id = slug;
                enDetails.article.category = categoryId;
            }
            if (arDetails.article) {
                arDetails.article.id = slug;
                arDetails.article.category = categoryId;
            }

            const blogDoc = new Blog({
                slug,
                coverImage,
                publishedAt,
                authorAvatarUrl: enDetails.article?.author?.image || 'https://i.pravatar.cc/150',

                title: arBlogItem.title || blogItem.title,
                titleEn: blogItem.title,
                title_ar: arBlogItem.title || blogItem.title,
                title_en: blogItem.title,

                subtitle: arBlogItem.excerpt || blogItem.excerpt,
                subtitleEn: blogItem.excerpt,

                category: catInfo.ar,
                categoryEn: catInfo.en,

                author: arBlogItem.author || blogItem.author,
                authorEn: blogItem.author,
                name_ar: arBlogItem.author || blogItem.author,
                name_en: blogItem.author,

                readTime: arDetails.article?.meta?.readTime ? `${arDetails.article.meta.readTime} دقائق للقراءة` : '٥ دقائق للقراءة',
                readTimeEn: enDetails.article?.meta?.readTime ? `${enDetails.article.meta.readTime} min read` : '5 min read',

                en: enDetails,
                ar: arDetails
            });

            await blogDoc.save();
            console.log(`- Seeded blog: ${slug}`);
        }

        console.log('Seeding finished successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding data:', err);
        mongoose.connection.close();
    }
};

seed();
