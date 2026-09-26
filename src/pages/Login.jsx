import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Dynamic API Base URL configuration for Local & Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('velystra_token', response.data.token);
        localStorage.setItem('velystra_user', JSON.stringify(response.data.user));

        const userRole = response.data.user.role;

        if (userRole === 'SUPER_ADMIN' || userRole === 'COLLEGE_ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address first.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      if (response.data.success) {
        setMessage('Temporary password sent to your email! Check inbox/spam.');
        setForgotMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
            Velystra SaaS Ecosystem
          </span>
          <h2 className="text-3xl font-bold text-white mt-3">{forgotMode ? 'Reset Password' : 'Welcome Back'}</h2>
          <p className="text-slate-400 text-sm mt-1">{forgotMode ? 'Enter your email to receive temporary password' : 'Log in to access your role-based dashboard'}</p>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-300 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 p-3 rounded-xl mb-6 text-sm text-center">
            {message}
          </div>
        )}

        {/* Form */}
        {!forgotMode ? (
          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <button 
                  type="button" 
                  onClick={() => setForgotMode(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                autoComplete="current-password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-600/20 transition-all duration-200 text-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Registered Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 text-sm mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending Reset Email...' : 'Send Temporary Password'}
            </button>

            <button 
              type="button" 
              onClick={() => setForgotMode(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white mt-3 underline"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium underline">
            Sign up here
          </Link>
        </div>

      </div>
    </div>
  );
}