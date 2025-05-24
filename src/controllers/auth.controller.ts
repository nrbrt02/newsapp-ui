import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { generateVerificationCode, sendVerificationEmail } from '../utils/email.utils';
import { hashPassword } from '../utils/auth.utils';
import { redisClient } from '../config/redis';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.status(200).json({ message: 'If an account exists with this email, you will receive a password reset code' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store code in Redis with 15 minutes expiration
    await redisClient.set(`reset_password:${email}`, verificationCode, 'EX', 900);

    // Send verification email
    await sendVerificationEmail(email, verificationCode, 'password_reset');

    return res.status(200).json({ message: 'If an account exists with this email, you will receive a password reset code' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyResetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }

    // Get stored code from Redis
    const storedCode = await redisClient.get(`reset_password:${email}`);
    if (!storedCode) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Verify code
    if (storedCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    await user.update({ password: hashedPassword });

    // Delete verification code from Redis
    await redisClient.del(`reset_password:${email}`);

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in verifyResetPassword:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resendResetCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.status(200).json({ message: 'If an account exists with this email, you will receive a new password reset code' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    
    // Store new code in Redis with 15 minutes expiration
    await redisClient.set(`reset_password:${email}`, verificationCode, 'EX', 900);

    // Send new verification email
    await sendVerificationEmail(email, verificationCode, 'password_reset');

    return res.status(200).json({ message: 'If an account exists with this email, you will receive a new password reset code' });
  } catch (error) {
    console.error('Error in resendResetCode:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 