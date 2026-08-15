export const validate = (schema) => async (req, res, next) => {
    try {
        const validatedBody = await schema.validateAsync(req.body, { abortEarly: false });
        req.body = validatedBody; // Assign cleaned/validated values
        next();
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({
                success: false,
                errors: err.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                })),
            });
        }

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export default validate;
