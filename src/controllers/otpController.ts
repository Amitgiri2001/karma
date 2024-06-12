import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { OTP } from "../models/otpModel"
import awsOTP from '../AWS/awsSMS';
import { error } from 'console';


function generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
export const sendMobileVerificationOTP = async (req: Request, res: Response) => {
    // You can save this OTP to your database for later verification

    try {
        const mobile_number: string = req.body.mobile;

        const otp: string = generateOTP();

        // Create OTP entry
        const currentOTP = await OTP.create({ mobile_number, otp });

        // Save the OTP to the database
        const otpData = await currentOTP.save();

        res.json({ message: 'OTP sent successfully', otpData: otpData });
    } catch (error: any) {
        console.error("Error creating OTP:", error);
        res.status(500).json({ message: 'Failed to create OTP', error: error.message });
    }

    // Send OTP via SMS provider (replace with your integration)
    // const phone = `+91${mobile_number}`
    // console.log(phone)
    // const message = `Your OTP is ${otp}`
    // if (awsOTP(phone, message) == 1) {

    //     console.log(`Sending OTP ${otp} to ${mobile_number}`);

    //     res.json({ message: 'OTP sent successfully', otp: otp });
    // } else {
    //     res.json({ message: 'Error sending OTP' });
    // }


};