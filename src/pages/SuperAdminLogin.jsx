import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleMasterLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/super-admin/login', { email, password });
      localStorage.setItem('velystra_token', res.data.token);
      localStorage.setItem('role', 'SUPER_ADMIN');
      navigate('/super-admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid master telemetry credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-black border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Red Security Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        <div className="text-center mb-6">
          <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2.5 py-0.5 rounded font-mono uppercase">Restricted Access</span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">VELYSTRA SUPER A LOGIN</h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-mono">Telemetry Authentication</p>
        </div>

        {error && <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}

        <form onSubmit={handleMasterLogin} className="space-y-4 font-mono">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your e-mail"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Password</label>
            
            {/* Is div ko relative banaya */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                // pr-10 add kiya taaki text icon ke pichhe na chupe
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-white"
              />

              {/* Ye raha tera toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition shadow-lg mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}