import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema(
    {
        ar: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        en: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
