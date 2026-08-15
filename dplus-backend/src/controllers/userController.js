import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * @desc    Register a new user / admin
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email address is already in use.',
            });
        }

        // Create user document
        const newUser = new User({
            name,
            email,
            password,
            role: role || 'user',
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/**
 * @desc    Login user / admin and generate token session
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email address or password.',
            });
        }

        // Match password hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email address or password.',
            });
        }

        // Generate JWT
        const payload = {
            id: user._id,
            role: user.role,
        };
        const secret = process.env.JWT_SECRET || 'dplus_default_jwt_secret_fallback';
        const expiry = process.env.JWT_EXPIRY || '7d';

        const token = jwt.sign(payload, secret, { expiresIn: expiry });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export default {
    registerUser,
    loginUser,
    getProfile,
};
