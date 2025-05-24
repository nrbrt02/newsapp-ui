import nodemailer from 'nodemailer';
import { config } from '../config';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const generateVerificationCode = (): string => {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (
  email: string,
  code: string,
  type: 'password_reset' | 'email_verification' | '2fa'
): Promise<void> => {
  let subject: string;
  let html: string;

  switch (type) {
    case 'password_reset':
      subject = 'Password Reset Verification Code';
      html = `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Please use the following verification code:</p>
        <h2 style="color: #4F46E5; font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `;
      break;
    case 'email_verification':
      subject = 'Email Verification Code';
      html = `
        <h1>Email Verification</h1>
        <p>Please use the following verification code to verify your email address:</p>
        <h2 style="color: #4F46E5; font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
      `;
      break;
    case '2fa':
      subject = 'Two-Factor Authentication Code';
      html = `
        <h1>Two-Factor Authentication</h1>
        <p>Please use the following verification code to complete your login:</p>
        <h2 style="color: #4F46E5; font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
      `;
      break;
    default:
      throw new Error('Invalid email type');
  }

  // Send mail with defined transport object
  await transporter.sendMail({
    from: `"NewsApp" <${config.email.user}>`,
    to: email,
    subject,
    html,
  });
}; 