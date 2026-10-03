import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">VELYSTRA ROOT NODE</h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-mono">Master Telemetry Authentication</p>
        </div>

        {error && <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}

        <form onSubmit={handleMasterLogin} className="space-y-4 font-mono">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Root Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velystra.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Master Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg mt-2"
          >
            Authenticate Root Node ⚡
          </button>
        </form>
      </div>
    </div>
  );
}