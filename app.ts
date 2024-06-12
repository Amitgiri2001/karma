import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes';
import workerRoutes from './src/routes/workerRoutes';
import jobRoutes from './src/routes/jobRoutes';
import authRoutes from './src/routes/authRoutes';
import otpRouter from "./src/routes/otpRouter"
const app = express();

import cookieParser from 'cookie-parser';
// index.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/workers', workerRoutes);
app.use('/jobs', jobRoutes);
app.use('/otp', otpRouter);

app.use('/auth', authRoutes);

export default app;
