import { Schema, model, Document } from 'mongoose';

interface IJob extends Document {
    startDate: Date;
    endDate: Date;
    status: string;
    user: Schema.Types.ObjectId;
    worker: Schema.Types.ObjectId;
    paymentAmount: number;
    paymentStatus: string;
    workTitle: string;
    workerNeeded: number;
}

const jobSchema = new Schema<IJob>({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Accept', 'Reject', 'Done', 'UnDoable']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    paymentAmount: {
        type: Number,
        required: true, default: 0
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "InComplete"
    },
    workTitle: {
        type: String,
        required: true,
    },
    workerNeeded: {
        type: Number,
        default: 1,
    },
});

export const Job = model<IJob>('Job', jobSchema);
