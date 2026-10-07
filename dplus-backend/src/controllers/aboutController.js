import AboutUs from '../models/AboutUs.js';

/**
 * @desc    Get About Us page content
 * @route   GET /api/about
 * @access  Public
 */
export const getAboutUs = async (req, res) => {
    try {
        const about = await AboutUs.findOne();
        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About Us content not found',
            });
        }

        if (req.query.raw === 'true' || req.language === 'raw') {
            return res.status(200).json({
                success: true,
                data: about,
            });
        }

        const acceptLang = req.headers['accept-language'] || req.headers['accept-lang'];
        const isEn = acceptLang && acceptLang.toLowerCase().startsWith('en');
        const lang = req.language === 'en' || isEn ? 'en' : 'ar';

        const content = lang === 'en' ? about.en : about.ar;

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    Update About Us page content
 * @route   PUT /api/about
 * @access  Admin/Private
 */
export const updateAboutUs = async (req, res) => {
    try {
        const { ar, en } = req.body;
        let about = await AboutUs.findOne();

        if (!about) {
            about = new AboutUs({ ar, en });
        } else {
            if (ar) about.ar = ar;
            if (en) about.en = en;
        }

        await about.save();

        res.status(200).json({
            success: true,
            message: 'About Us content updated successfully',
            data: about,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export default {
    getAboutUs,
    updateAboutUs,
};
