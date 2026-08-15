import Joi from 'joi';

// Joi Schema Definition for User Registration
export const registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .required()
        .messages({
            'string.empty': 'Name cannot be empty',
            'any.required': 'Name is required',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
    role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .optional(),
});

// Joi Schema Definition for User Login
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required',
        }),
});
