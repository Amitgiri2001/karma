import { Router } from 'express';
import { getJobs, createJob, getJobsByUserId, getJobsByWorkerId, updateJob, deleteJob } from '../controllers/jobController';

const router = Router();

router.get('/', getJobs);
router.post('/', createJob);
router.get('/user/:userId', getJobsByUserId); // New route to get jobs by user ID
router.get('/worker/:workerId', getJobsByWorkerId); // New route to get jobs by worker ID
router.put('/:id', updateJob); // New route to update a job
router.delete('/:id', deleteJob); // New route to delete a job

export default router;
