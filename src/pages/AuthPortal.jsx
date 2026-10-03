import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AuthPortal() {
  const [roleType, setRoleType] = useState('STUDENT'); // 'STUDENT' or 'COLLEGE'
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [prnNumber, setPrnNumber] = useState('');
  const [domain, setDomain] = useState('Web Development');
  const [branch, setBranch] = useState('Computer Engineering');
  const [academicYear, setAcademicYear] = useState('2nd Year');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (roleType === 'COLLEGE') {
        if (isLogin) {
          const res = await API.post('/auth/college/login', { adminEmail: email, password });
          localStorage.setItem('velystra_token', res.data.token);
          localStorage.setItem('role', 'COLLEGE_ADMIN');
          navigate('/college-dashboard');
        } else {
          // Register College
          const res = await API.post('/auth/college/register', { collegeName, adminEmail: email, password });
          const code = res.data.collegeCode;
          
          // Auto login right after registration
          const loginRes = await API.post('/auth/college/login', { adminEmail: email, password });
          localStorage.setItem('velystra_token', loginRes.data.token);
          localStorage.setItem('role', 'COLLEGE_ADMIN');
          
          alert(`College registered successfully! Your 6-Digit Code is: ${code}`);
          navigate('/college-dashboard');
        }
      } else {
        if (isLogin) {
          const res = await API.post('/auth/student/login', { email, password });
          localStorage.setItem('velystra_token', res.data.token);
          localStorage.setItem('role', 'STUDENT');
          navigate('/student-dashboard');
        } else {
          // Register Student with Branch & Academic Year
          await API.post('/auth/student/register', { 
            name, email, password, prnNumber, collegeCode, domain, branch, academicYear 
          });
          
          // Auto login right after registration
          const loginRes = await API.post('/auth/student/login', { email, password });
          localStorage.setItem('velystra_token', loginRes.data.token);
          localStorage.setItem('role', 'STUDENT');
          
          alert('Registration submitted! Awaiting college PRN verification.');
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-black border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Minimalist Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white"></div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">VELYSTRA</h1>
          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-mono">Institutional Campus Ecosystem</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-neutral-950 border border-neutral-800 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRoleType('STUDENT')}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition ${roleType === 'STUDENT' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
          >
            Student Portal
          </button>
          <button
            type="button"
            onClick={() => setRoleType('COLLEGE')}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition ${roleType === 'COLLEGE' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
          >
            College Admin
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl font-mono">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && roleType === 'COLLEGE' && (
            <div>
              <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">College Name</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. MIT World Peace University"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
            </div>
          )}

          {!isLogin && roleType === 'STUDENT' && (
            <>
              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Full Name (As per College)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Student PRN Number</label>
                <input
                  type="text"
                  required
                  value={prnNumber}
                  onChange={(e) => setPrnNumber(e.target.value)}
                  placeholder="PRN12345678"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">6-Digit College Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value)}
                  placeholder="e.g. 482910"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Branch / Dept</label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Engg"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Primary Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Non-Coding / Management">Non-Coding / Management</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-lg mt-2"
          >
            {isLogin ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400 font-mono">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-semibold underline hover:text-neutral-300 ml-1 uppercase"
          >
            {isLogin ? 'Register here' : 'Sign In'}
          </button>
        </div>

      </div>
    </div>
  );
}