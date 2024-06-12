import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import workerRoutes from './routes/workerRoutes';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';
import otpRouter from "./routes/otpRouter"
const app = express();
import cookieParser from 'cookie-parser';

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/workers', workerRoutes);
app.use('/jobs', jobRoutes);
app.use('/otp', otpRouter);

app.use('/auth', authRoutes);

export default app;
