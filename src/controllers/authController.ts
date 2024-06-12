import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OTP } from '../models/otpModel';
import { User } from '../models/userModel';

export const login = async (req: Request, res: Response) => {
    try {
        const { mobile, otp } = req.body;

        // Check if the OTP is correct
        const validOTP = await OTP.findOne({ mobile_number: mobile, otp: otp });

        if (!validOTP) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Find the user by mobile number
        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            'your_secret_key55',
            { expiresIn: '7d' } // Token valid for 7 days
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


export const logOut = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
