import { Router } from 'express';
import { logOut, login } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/logout', logOut);

export default router;