
import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateJWT } from '../Auth/Authentication';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', authenticateJWT, getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
