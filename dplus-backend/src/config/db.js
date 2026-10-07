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

    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/data-pulse-web';

    try {
        await mongoose.connect(mongoURI);
        isConnected = true;
        console.log(`Successfully connected to MongoDB at ${mongoURI}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

export default connectDB;
