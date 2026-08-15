import Joi from 'joi';

export const createBlogSchema = Joi.object({
    slug: Joi.string()
        .optional()
        .allow('', null)
        .trim()
        .lowercase()
        .pattern(/^[a-z0-9-_]+$/),
    title: Joi.string().optional(),
    titleEn: Joi.string().optional().allow('', null),
    title_ar: Joi.string().optional().allow('', null),
    title_en: Joi.string().optional().allow('', null),
    subtitle: Joi.string().optional().allow('', null),
    subtitleEn: Joi.string().optional().allow('', null),
    category: Joi.string().optional().allow('', null),
    categoryEn: Joi.string().optional().allow('', null),
    author: Joi.string().optional().allow('', null), // nameAr
    authorEn: Joi.string().optional().allow('', null), // nameEn
    name_ar: Joi.string().optional().allow('', null),
    name_en: Joi.string().optional().allow('', null),
    readTime: Joi.string().optional().allow('', null),
    readTimeEn: Joi.string().optional().allow('', null),
    coverImage: Joi.string().optional().allow('', null),
    authorAvatarUrl: Joi.string().optional().allow('', null),
    publishedAt: Joi.any().optional(),

    // Arrays for content builders
    sections: Joi.array().optional(),
    sectionsEn: Joi.array().optional(),
}).unknown(true);
