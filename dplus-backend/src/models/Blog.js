import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        coverImage: {
            type: String,
        },
        authorAvatarUrl: {
            type: String,
        },
        publishedAt: {
            type: String,
        },

        // Flat Localized Content (for dashboard inputs & listing grids)
        title: {
            type: String, // Title (AR)
        },
        titleEn: {
            type: String, // Title (EN)
        },
        title_ar: {
            type: String, // Explicit title_ar
        },
        title_en: {
            type: String, // Explicit title_en
        },
        subtitle: {
            type: String, // Subtitle (AR)
        },
        subtitleEn: {
            type: String, // Subtitle (EN)
        },
        category: {
            type: String, // Category (AR)
        },
        categoryEn: {
            type: String, // Category (EN)
        },
        author: {
            type: String, // Author Name (AR)
        },
        authorEn: {
            type: String, // Author Name (EN)
        },
        name_ar: {
            type: String, // Explicit name_ar
        },
        name_en: {
            type: String, // Explicit name_en
        },
        readTime: {
            type: String, // Read Time (AR)
        },
        readTimeEn: {
            type: String, // Read Time (EN)
        },

        // Rich integration blocks (for website details pages)
        en: {
            type: mongoose.Schema.Types.Mixed,
        },
        ar: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
