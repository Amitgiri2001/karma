import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    mobile: string;
    address: string;
    requestedJobs: Schema.Types.ObjectId[];
    appliedJobs: Schema.Types.ObjectId[];
    isWorker: boolean;
    professions: string;
    verified: boolean;

}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    requestedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    isWorker: { type: Boolean },
    professions: { type: String },
    verified: { type: Boolean, default: false },
});

export const User = model<IUser>('User', userSchema);
