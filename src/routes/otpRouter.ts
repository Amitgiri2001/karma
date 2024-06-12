import { Router } from 'express';
import { sendMobileVerificationOTP } from '../controllers/otpController';

const router = Router();

router.post('/generateOTP', sendMobileVerificationOTP);


export default router;