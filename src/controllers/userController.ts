import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { OTP } from '../models/otpModel';
import jwt from 'jsonwebtoken';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { mobile, otp, ...userData } = req.body;

        // check if mobile number is already present
        const userFound = await User.find({ mobile: mobile });
        console.log(userFound.length > 0);
        if (userFound.length > 0) {
            return res.status(400).json({ error: 'Mobile number already exists' });
        }

        // Check if the OTP is correct
        // console.log(mobile + " " + otp);
        const validOTP = await OTP.findOne({ mobile_number: mobile, otp: otp });

        if (!validOTP) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // If OTP is correct, create the user
        const newUser = new User({ ...userData, mobile });
        const savedUser = await newUser.save();

        // Optionally, delete the OTP after verification
        await OTP.deleteOne({ _id: validOTP._id });

        // Generate JWT
        const token = jwt.sign(
            { userId: savedUser._id },
            'your_secret_key55',
            { expiresIn: '7d' } // Token valid for 7 days
        );

        // Cookie
        res.cookie('token', token, {
            httpOnly: true, // Cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        res.status(201).json({ message: 'User created successfully', token, savedUser });


    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find the user and populate requestedJobs and appliedJobs
        const user = await User.findById(id)
            .populate('requestedJobs')
            .populate('appliedJobs');

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

export const getVerifiedWorkers = async (req: Request, res: Response) => {
    try {
        // Find users with specified conditions and project only name and _id fields

        let professions = req.params.professions || "";
        console.log(professions)
        const users = await User.find({ isWorker: true, verified: true, professions: professions }, 'name _id');

        // Check if users array is empty (no users found)
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No verified workers found' });
        }

        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
