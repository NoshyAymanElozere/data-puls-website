import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from './db.js';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();

        const email = 'admin@datapuls.com';
        const existing = await User.findOne({ email });

        if (existing) {
            existing.password = 'password123';
            existing.name = 'Data Puls Admin';
            existing.role = 'admin';
            await existing.save();
            console.log('Admin user credentials reset to password123 successfully:', email);
            process.exit(0);
        }

        const admin = new User({
            name: 'Data Puls Admin',
            email,
            password: 'password123',
            role: 'admin'
        });

        await admin.save();
        console.log('Default admin seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err.message);
        process.exit(1);
    }
};

seed();
