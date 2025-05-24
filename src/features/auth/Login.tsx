import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiAlertCircle, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { login, verifyLoginCode, resendVerificationCode, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!username.trim() || !password) {
      setFormError('Username and password are required');
      return;
    }
    
    setFormError('');
    setInfoMessage('');
    
    try {
      // Attempt login
      const response = await login({ username, password });
      
      if (response && typeof response === 'object' && 'requiresTwoFactor' in response) {
        if (response.requiresTwoFactor) {
          setShowVerification(true);
          // Store the email from the login response
          setUserEmail(response.email);
          if (response.message) {
            setInfoMessage(response.message);
          }
        } else {
          // Navigate to return URL or home
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setFormError('Verification code is required');
      return;
    }
    
    setFormError('');
    
    try {
      // Use the stored email from login response
      const success = await verifyLoginCode({ email: userEmail, code: verificationCode });
      
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setFormError('');
    try {
      const success = await resendVerificationCode({ username });
      if (success) {
        setInfoMessage('A new verification code has been sent to your email');
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {showVerification ? 'Enter Verification Code' : 'Log in to NewsApp'}
        </h1>
        
        {/* Display error message */}
        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-start">
            <FiAlertCircle className="mt-1 mr-2 flex-shrink-0" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Display info message */}
        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded flex items-start">
            <FiInfo className="mt-1 mr-2 flex-shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}
        
        {!showVerification ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit}>
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                className="input"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isLoading}
                placeholder="Enter verification code"
              />
            </div>
            
            <button
              type="submit"
              className={`btn btn-primary w-full mb-4 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            
            <button
              type="button"
              onClick={handleResendCode}
              className={`text-primary-600 hover:underline w-full text-center ${isResending ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading || isResending}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;