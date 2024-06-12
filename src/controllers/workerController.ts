import { Request, Response } from 'express';
import { Worker } from '../models/workerModel';
import { OTP } from '../models/otpModel';
import jwt from 'jsonwebtoken';

export const getWorkers = async (req: Request, res: Response) => {
    try {
        const workers = await Worker.find();
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createWorker = async (req: Request, res: Response) => {
    try {
        const { mobile, otp, ...userData } = req.body;
        const validOTP = await OTP.findOne({ mobile_number: mobile, otp: otp });

        if (!validOTP) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const newWorker = new Worker(req.body);
        const savedWorker = await newWorker.save();
        // Optionally, delete the OTP after verification
        await OTP.deleteOne({ _id: validOTP._id });

        // Generate JWT
        const token = jwt.sign(
            { userId: savedWorker._id },
            'your_secret_key55',
            { expiresIn: '7d' } // Token valid for 7 days
        );

        // Cookie
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        res.status(201).json({ message: 'User created successfully', token, savedWorker });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getWorkerById = async (req: Request, res: Response) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.status(200).json(worker);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// New controller to update a worker
export const updateWorker = async (req: Request, res: Response) => {
    try {
        const updatedWorker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWorker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.status(200).json(updatedWorker);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// New controller to delete a worker
export const deleteWorker = async (req: Request, res: Response) => {
    try {
        const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
        if (!deletedWorker) {
            return res.status(404).json({ error: 'Worker not found' });
        }
        res.status(200).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
