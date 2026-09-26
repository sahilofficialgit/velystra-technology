import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamic API Base URL configuration for Local & Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StudentDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [submissionsHistory, setSubmissionsHistory] = useState([]);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [domain, setDomain] = useState('Full Stack Developer');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Submission Form State
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('velystra_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const chalRes = await axios.get(`${API_BASE_URL}/api/challenges`, { headers });
      if (chalRes.data.success) {
        setChallenges(chalRes.data.challenges);
        setIsApproved(chalRes.data.isApproved);
      }

      const statsRes = await axios.get(`${API_BASE_URL}/api/student/stats`, { headers });
      if (statsRes.data.success) {
        setStudentStats(statsRes.data);
        setSubmissionsHistory(statsRes.data.submissions || []);
        setFullName(statsRes.data.student.fullName);
        setAvatarUrl(statsRes.data.student.avatarUrl || '');
        setBio(statsRes.data.student.bio || '');
        setDomain(statsRes.data.student.domain || 'Full Stack Developer');
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/student/profile`,
        { fullName, avatarUrl, bio, domain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert('Profile updated successfully! ✨');
        fetchData();
      }
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSubmitChallenge = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) return;
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/submissions`,
        { challengeId: selectedChallengeId, githubUrl, deployedUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert(response.data.message);
        setGithubUrl(''); setDeployedUrl(''); setSelectedChallengeId('');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentDate = new Date();
  const runningChallenges = challenges.filter(ch => !ch.deadline || new Date(ch.deadline) >= currentDate);

  return (
    <div className="min-h-[85vh] bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header & Points Breakdown Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl md:col-span-1 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-3xl font-bold text-blue-400 mb-3 overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : fullName.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-white">{fullName}</h2>
            <span className="text-xs text-blue-400 mt-1 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-800/40">{domain}</span>
            <p className="text-xs text-slate-400 mt-2 italic">"{bio || 'No bio set yet'}"</p>
            <div className={`mt-4 px-3 py-1 rounded-xl text-xs font-semibold border ${isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
              {isApproved ? '✅ PRN Verified' : '⏳ PRN Pending'}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl md:col-span-2 grid grid-cols-2 gap-4 items-center">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">College Event Pts</span>
              <h3 className="text-3xl font-extrabold text-blue-400 mt-2">{studentStats?.collegePoints || 0}</h3>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Public Event Pts</span>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">{studentStats?.publicPoints || 0}</h3>
            </div>
          </div>
        </div>

        {/* Profile Editor */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">⚙️ Edit Profile & Bio Tags</h3>
          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <input 
              type="text" 
              placeholder="Full Name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" 
            />

            {/* Avatar Gallery Preset Selector */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Choose Avatar Preset</label>
              <div className="flex gap-3">
                {[
                  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix', 
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine'
                ].map((url, i) => (
                  <button 
                    type="button" 
                    key={i} 
                    onClick={() => setAvatarUrl(url)} 
                    className={`w-12 h-12 rounded-xl border overflow-hidden bg-slate-900 transition-all ${avatarUrl === url ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-700'}`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <input 
              type="text" 
              placeholder="Or paste Avatar Image URL" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)} 
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm md:col-span-2" 
            />

            <select value={domain} onChange={(e) => setDomain(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm">
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Specialist">Frontend Specialist</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Data Science & AI">Data Science & AI</option>
            </select>

            <input type="text" placeholder="Short Bio (e.g. React & Node enthusiast)" value={bio} onChange={(e) => setBio(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
            
            <div className="md:col-span-2">
              <button type="submit" disabled={updatingProfile} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Save Profile</button>
            </div>
          </form>
        </div>

        {/* Submit Challenge Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">🚀 Submit Challenge Work</h3>
          <form onSubmit={handleSubmitChallenge} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={selectedChallengeId} onChange={(e) => setSelectedChallengeId(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm">
              <option value="">-- Choose Challenge --</option>
              {runningChallenges.map(ch => <option key={ch.id} value={ch.id}>{ch.title} ({ch.points} pts)</option>)}
            </select>
            <input type="url" placeholder="GitHub Repository URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
            <input type="url" placeholder="Live Demo URL (Optional)" value={deployedUrl} onChange={(e) => setDeployedUrl(e.target.value)} className="md:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
            <button type="submit" disabled={submitting || !isApproved} className="md:col-span-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">Submit for Review</button>
          </form>
        </div>

        {/* --- MY SUBMISSIONS & POINTS HISTORY SECTION --- */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">📊 My Submissions & Points History</h3>
          {submissionsHistory.length === 0 ? (
            <p className="text-slate-400 text-sm">You haven't submitted any challenges yet.</p>
          ) : (
            <div className="space-y-4">
              {submissionsHistory.map(sub => (
                <div key={sub.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-white">{sub.challenge?.title || 'Challenge'}</h4>
                    <p className="text-xs text-slate-400 mt-1">Submitted on: {new Date(sub.createdAt).toLocaleDateString()}</p>
                    {sub.feedback && (
                      <p className="text-xs text-red-400 mt-2 bg-red-950/40 p-2 rounded border border-red-900/50">
                        <strong>Admin Feedback:</strong> {sub.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                      sub.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {sub.status === 'APPROVED' ? `✅ Approved (+${sub.scoreAwarded} pts)` :
                       sub.status === 'REJECTED' ? '❌ Rejected' : '⏳ Pending Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Running Events List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">🔥 Running Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {runningChallenges.map(ch => (
              <div key={ch.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{ch.title}</h3>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-semibold">+{ch.points} pts</span>
                </div>
                <p className="text-slate-300 text-sm">{ch.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}