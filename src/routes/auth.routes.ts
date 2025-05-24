import { Router } from 'express';
import { forgotPassword, verifyResetPassword, resendResetCode } from '../controllers/auth.controller';

const router = Router();

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/2fa/verify-reset-password', verifyResetPassword);
router.post('/2fa/resend-code', resendResetCode);

export default router; 