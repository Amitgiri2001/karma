import { Schema, model, Document } from 'mongoose';

// Define an interface for the OTP document
interface IOTP extends Document {
    mobile_number: string;
    createdAt: Date;
    otp: string;
}

// Define schema for the OTP entity
const otpSchema = new Schema<IOTP>({
    mobile_number: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    otp: {
        type: String,
        required: true,
    }
});

// Create a model for the OTP schema
export const OTP = model<IOTP>('OTP', otpSchema);


