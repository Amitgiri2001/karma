import { Schema, model, Document } from 'mongoose';

interface IWorker extends Document {
    name: string;
    mobile: string;
    email?: string;
    jobsPending: Schema.Types.ObjectId[];
    profession: string;
    address: string;
}

const workerSchema = new Schema<IWorker>({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    jobsPending: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    profession: { type: String, required: true },
    address: { type: String, required: true },
});

export const Worker = model<IWorker>('Worker', workerSchema);
