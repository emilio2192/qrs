"use client";
import { useState } from 'react';
import { useFormStatus } from "react-dom";
import { loginUser, signupUser } from '@/lib/request';
import { useAuthToken } from '@/hooks/useAuthToken';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
      {pending ? "Submitting..." : label}
    </button>
  );
}

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function AuthPrompt() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [apiError, setApiError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthData } = useAuthToken();

  // Clear messages when switching tabs
  const handleTabChange = (newTab: 'login' | 'signup') => {
    setTab(newTab);
    setApiError('');
    setSuccessMessage('');
  };

  // Validation for login
  function validateLogin() {
    const errors: typeof loginErrors = {};
    if (!loginForm.email) errors.email = 'Email is required';
    else if (!validateEmail(loginForm.email)) errors.email = 'Invalid email format';
    if (!loginForm.password) errors.password = 'Password is required';
    else if (loginForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Validation for signup
  function validateSignup() {
    const errors: typeof signupErrors = {};
    if (!signupForm.name) errors.name = 'Name is required';
    if (!signupForm.email) errors.email = 'Email is required';
    else if (!validateEmail(signupForm.email)) errors.email = 'Invalid email format';
    if (!signupForm.password) errors.password = 'Password is required';
    else if (signupForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!signupForm.confirm) errors.confirm = 'Please confirm your password';
    else if (signupForm.password !== signupForm.confirm) errors.confirm = 'Passwords do not match';
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    if (validateLogin()) {
      try {
        const data = await loginUser(loginForm.email, loginForm.password);
        
        // Store both token and user data
        setAuthData(data.token, data.user);
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect to checkout or refresh page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
        
        // Provide more specific error messages
        if (errorMessage.includes('Invalid email or password')) {
          setApiError('Invalid email or password. Please check your credentials and try again.');
        } else if (errorMessage.includes('Account is deactivated')) {
          setApiError('Your account has been deactivated. Please contact support.');
        } else if (errorMessage.includes('Network error')) {
          setApiError('Connection error. Please check your internet connection and try again.');
        } else {
          setApiError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    if (validateSignup()) {
      try {
        const data = await signupUser(signupForm.name, signupForm.email, signupForm.password);
        
        // Store both token and user data
        setAuthData(data.token, data.user);
        
        setSuccessMessage('Account created successfully! Redirecting...');
        
        // Redirect to checkout or refresh page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
        
        // Provide more specific error messages
        if (errorMessage.includes('Email already registered')) {
          setApiError('An account with this email already exists. Please try logging in instead.');
        } else if (errorMessage.includes('Network error')) {
          setApiError('Connection error. Please check your internet connection and try again.');
        } else {
          setApiError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <div className="border rounded p-8 text-center bg-white shadow max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 font-semibold rounded-t transition-colors ${tab === 'login' ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => handleTabChange('login')}
        >
          Log In
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-t transition-colors ${tab === 'signup' ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => handleTabChange('signup')}
        >
          Sign Up
        </button>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {successMessage}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-start">
            <span className="mr-2 mt-0.5">❌</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}
      
      <div className="relative">
        {tab === 'login' ? (
          <form className="space-y-4 text-left" onSubmit={handleLoginSubmit} autoComplete="on">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                required
                disabled={isLoading}
              />
              {loginErrors.email && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {loginErrors.email}
              </div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                required
                disabled={isLoading}
              />
              {loginErrors.password && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {loginErrors.password}
              </div>}
            </div>
            <SubmitButton label="Log In" />
          </form>
        ) : (
          <form className="space-y-4 text-left" onSubmit={handleSignupSubmit} autoComplete="on">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={signupForm.name}
                onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                required
                disabled={isLoading}
              />
              {signupErrors.name && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {signupErrors.name}
              </div>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={signupForm.email}
                onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                required
                disabled={isLoading}
              />
              {signupErrors.email && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {signupErrors.email}
              </div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={signupForm.password}
                onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                required
                disabled={isLoading}
              />
              {signupErrors.password && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {signupErrors.password}
              </div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={signupForm.confirm}
                onChange={e => setSignupForm(f => ({ ...f, confirm: e.target.value }))}
                required
                disabled={isLoading}
              />
              {signupErrors.confirm && <div className="text-xs text-red-500 mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {signupErrors.confirm}
              </div>}
            </div>
            <SubmitButton label="Sign Up" />
          </form>
        )}
      </div>
    </div>
  );
} 