import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name_ar: {
            type: String,
            required: true,
            trim: true
        },
        name_en: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Department = mongoose.model('Department', departmentSchema);

export default Department;
