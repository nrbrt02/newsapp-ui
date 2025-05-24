import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setInfoMessage('');

    try {
      await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setInfoMessage('If an account exists with this email, you will receive a password reset code');
      setStep('verify');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/2fa/verify-reset-password', {
        email,
        code: verificationCode,
        newPassword
      });
      setInfoMessage('Password has been reset successfully');
      setStep('reset');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setInfoMessage('');

    try {
      await api.post(`/auth/2fa/resend-code?email=${encodeURIComponent(email)}`);
      setInfoMessage('A new verification code has been sent to your email');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {step === 'email' && 'Reset Password'}
          {step === 'verify' && 'Enter Verification Code'}
          {step === 'reset' && 'Password Reset Complete'}
        </h1>

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-start">
            <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Display info message */}
        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded flex items-start">
            <FiInfo className="mt-1 mr-2 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleRequestReset}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                className="input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
                placeholder="Enter verification code"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full mb-4 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              className={`text-primary-600 hover:underline w-full text-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </form>
        )}

        {step === 'reset' && (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary w-full">
              Go to Login
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 