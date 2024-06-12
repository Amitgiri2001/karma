import { Router } from 'express';
import { getWorkers, createWorker, getWorkerById, updateWorker, deleteWorker } from '../controllers/workerController';

const router = Router();

router.get('/', getWorkers);
router.post('/', createWorker);
router.get('/:id', getWorkerById);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

export default router;
