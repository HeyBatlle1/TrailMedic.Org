import React, { useState } from 'react';
import { AlertTriangle, Mail, Lock, Eye, EyeOff, Shield, UserCheck } from 'lucide-react';
import ActionButton from './ActionButton';
import { useAuth } from '../context/AuthContext';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, continueAsGuest } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password);
        setSuccess('Account created successfully! Welcome to TrailMedic.');
      } else {
        await login(email, password);
        setSuccess('Signed in successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-xl shadow-lg">
            <Shield className="text-white" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Emergency Access
        </h2>
        <p className="text-gray-400">
          Sign in to save your assessments, or continue as guest for immediate emergency use
        </p>
      </div>

      {/* Emergency Guest Access */}
      <div className="mb-6">
        <ActionButton
          label="Continue as Guest"
          onClick={handleGuestMode}
          icon={<UserCheck size={20} />}
          variant="danger"
          fullWidth
          className="py-4 text-lg font-bold bg-red-700 hover:bg-red-600"
        />
        <p className="text-center text-xs text-gray-400 mt-2">
          For immediate emergency use - data stored locally only
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or sign in to save data</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-start">
          <AlertTriangle className="text-red-500 mr-2 flex-shrink-0" size={20} />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-900/30 border border-green-800 rounded-lg p-4">
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-gray-400" size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="text-gray-400 hover:text-gray-300 transition-colors\" size={18} />
              ) : (
                <Eye className="text-gray-400 hover:text-gray-300 transition-colors" size={18} />
              )}
            </button>
          </div>
          {isSignUp && (
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 6 characters long
            </p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>
        )}

        <ActionButton
          label={loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          onClick={() => {}}
          variant="secondary"
          fullWidth
          disabled={loading}
          className="py-3 text-lg font-bold"
        />

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-green-500 hover:text-green-400 text-sm transition-colors"
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="text-green-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-blue-300 text-xs font-medium mb-1">
                Emergency-First Design
              </p>
              <p className="text-blue-200 text-xs leading-relaxed">
                Guest mode provides immediate access to all emergency features. Sign in to sync your data across devices and access your assessment history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;