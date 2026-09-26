import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Dynamic API Base URL configuration for Local & Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [prnNumber, setPrnNumber] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
        prnNumber: role === 'STUDENT' ? prnNumber : undefined,
        collegeCode: role === 'STUDENT' ? collegeCode : undefined,
        collegeName: role === 'COLLEGE_ADMIN' ? collegeName : undefined
      });

      if (response.data.success) {
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email,
          password
        });

        if (loginResponse.data.success) {
          localStorage.setItem('velystra_token', loginResponse.data.token);
          localStorage.setItem('velystra_user', JSON.stringify(loginResponse.data.user));

          if (role === 'COLLEGE_ADMIN') {
            alert(`College Registered Successfully! 🎉 Your Unique College ID is generated. Check your dashboard.`);
          } else {
            alert('Registration Successful! 🎉 PRN verification request sent to your college admin.');
          }

          const userRole = loginResponse.data.user.role;
          if (userRole === 'SUPER_ADMIN' || userRole === 'COLLEGE_ADMIN') {
            navigate('/admin-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2 className="text-3xl font-bold text-white mt-3">Create an Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join the centralized student & college ecosystem</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-300 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form with anti-autofill */}
        <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              autoComplete="off"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              placeholder="Enter secure password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="new-password"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select User Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="STUDENT">Student</option>
              <option value="COLLEGE_ADMIN">College Admin / Faculty</option>
            </select>
          </div>

          {/* Conditional Fields for STUDENT */}
          {role === 'STUDENT' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">PRN Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 102456" 
                  value={prnNumber} 
                  onChange={(e) => setPrnNumber(e.target.value)} 
                  required 
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">College 6-Digit ID (Provided by Faculty)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 489210" 
                  value={collegeCode} 
                  onChange={(e) => setCollegeCode(e.target.value)} 
                  required 
                  autoComplete="off"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* Conditional Fields for COLLEGE_ADMIN */}
          {role === 'COLLEGE_ADMIN' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">College Name</label>
              <input 
                type="text" 
                placeholder="e.g. PCCOE Pune" 
                value={collegeName} 
                onChange={(e) => setCollegeName(e.target.value)} 
                required 
                autoComplete="off"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-600/20 transition-all duration-200 text-sm mt-3 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}