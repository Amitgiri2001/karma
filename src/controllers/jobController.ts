import { Request, Response } from 'express';
import { Job } from '../models/jobModel';
import { User } from '../models/userModel';
import { Worker } from '../models/workerModel';
import { NotFoundError, ValidationError } from '../errors';
import { isError } from '../utils/isError';

export const createJob = async (req: Request, res: Response) => {
    try {
        const { user, worker, ...jobData } = req.body;
        const newJob = new Job({ ...jobData, user, worker });

        // Save the job
        const savedJob = await newJob.save();

        // Update the user's jobsPosted array
        const userUpdateResult = await User.findByIdAndUpdate(
            user,
            { $push: { requestedJobs: savedJob._id } }
        );

        // Update the worker's jobsPending array
        const workerUpdateResult = await User.findByIdAndUpdate(
            worker,
            { $push: { appliedJobs: savedJob._id } }
        );

        if (!userUpdateResult) {
            throw new NotFoundError('User not found');
        }

        if (!workerUpdateResult) {
            throw new NotFoundError('Worker not found');
        }

        res.status(201).json(savedJob);
    } catch (error: any) {
        console.error('Error creating job:', error); // Log the error details

        if (isError(error)) {
            if (error instanceof NotFoundError || error instanceof ValidationError) {
                res.status(error.statusCode).json({ error: error.message });
            } else if (error.name === 'CastError') {
                res.status(400).json({ error: 'Invalid ObjectID' });
            } else {
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};




export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find().populate('user worker');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// New controller to get jobs by user ID
export const getJobsByUserId = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ user: req.params.userId });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// New controller to get jobs by worker ID
export const getJobsByWorkerId = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ worker: req.params.workerId });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// New controller to update a job
export const updateJob = async (req: Request, res: Response) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

// New controller to delete a job
export const deleteJob = async (req: Request, res: Response) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
