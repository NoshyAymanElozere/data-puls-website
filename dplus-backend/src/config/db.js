import mongoose from 'mongoose';
import dns from 'dns';

// Set DNS servers to Google's public DNS to resolve querySrv issues
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}

// Track DB connection state
let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('MONGO_URI is not defined in the environment variables.');
        return; // Don't call process.exit(1) on serverless platforms
    }

    try {
        await mongoose.connect(mongoURI);
        isConnected = true;
        console.log('Successfully connected to MongoDB Atlas!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

export default connectDB;
