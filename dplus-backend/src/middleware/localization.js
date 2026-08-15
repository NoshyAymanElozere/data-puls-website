import mongoose from 'mongoose';
import slugify from 'slugify';

/**
 * Express middleware to handle bilingual content transformation.
 * Attaches a `res.localize(data)` function to automatically format and filter 
 * database objects based on the client's Accept-Language request header.
 */
export const localizationMiddleware = (req, res, next) => {
    const acceptLang = req.headers['accept-language'] || req.headers['accept-lang'];

    // If acceptLang is present, determine the target language
    const isAr = acceptLang && acceptLang.toLowerCase().startsWith('ar');
    req.language = isAr ? 'ar' : (acceptLang ? 'en' : 'raw');

    res.localize = (data) => {
        // If no language header was sent, we keep the raw structure (for Dashboard compatibility)
        if (req.language === 'raw' || !data) {
            return data;
        }

        const formatItem = (item) => {
            if (!item) return item;

            // Convert Mongoose document to plain JS object if applicable
            const doc = item.toObject ? item.toObject() : item;

            const isArabicRequest = req.language === 'ar';

            // إذا كان الكائن يمثل قسماً (Department / Category) وليس مقالاً
            const isDept = (item.constructor && item.constructor.modelName === 'Department') ||
                (doc.name_ar !== undefined && doc.name_en !== undefined && doc.title === undefined && doc.titleEn === undefined && doc.title_ar === undefined);

            if (isDept) {
                return {
                    _id: doc._id,
                    slug: doc.slug,
                    name: isArabicRequest ? doc.name_ar : doc.name_en,
                    name_ar: doc.name_ar,
                    name_en: doc.name_en,
                    createdAt: doc.createdAt,
                    updatedAt: doc.updatedAt
                };
            }

            const langBlock = isArabicRequest ? (doc.ar || {}) : (doc.en || {});
            const categoryId = doc.categoryEn ? slugify(doc.categoryEn, { lower: true, strict: true }) : 'software';
            const subtitleText = isArabicRequest ? (doc.subtitle || '') : (doc.subtitleEn || '');

            return {
                _id: doc._id,
                id: doc.slug,
                slug: doc.slug,
                coverImage: doc.coverImage,
                authorAvatarUrl: doc.authorAvatarUrl,
                publishedAt: doc.publishedAt,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,

                // Flat fields for listing / details compatibility
                excerpt: subtitleText,
                categoryId: categoryId,

                // Flatten translations to root properties
                title: isArabicRequest ? (doc.title_ar || doc.title) : (doc.title_en || doc.titleEn),
                subtitle: subtitleText,
                category: isArabicRequest ? (doc.category || '') : (doc.categoryEn || ''),
                author: isArabicRequest ? (doc.name_ar || doc.author) : (doc.name_en || doc.authorEn),
                readTime: isArabicRequest ? (doc.readTime || '') : (doc.readTimeEn || ''),

                // Spread selected language block properties (sections, quote, etc.)
                ...langBlock
            };
        };

        if (Array.isArray(data)) {
            return data.map(item => formatItem(item));
        }

        return formatItem(data);
    };

    next();
};
