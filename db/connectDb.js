import React from 'react'
import mongoose from 'mongoose';
const connectDb = async() => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chai";
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            // return conn
            
        } catch (error) {
            console.error("MongoDB Connection Error:", error.message);
        }
    }

export default connectDb;
