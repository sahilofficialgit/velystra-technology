import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function Leaderboard() {
  const [leaderboards, setLeaderboards] = useState({ globalLeaderboard: [], collegeLeaderboard: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('velystra_token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        let url = '/leaderboards';
        
        if (token) {
          try {
            if (role === 'STUDENT') {
              const dashRes = await API.get('/student/dashboard');
              const code = dashRes.data.student.collegeCode;
              if (code) url = `/leaderboards?collegeCode=${code}`;
            } else if (role === 'COLLEGE_ADMIN') {
              const dashRes = await API.get('/college/dashboard');
              const code = dashRes.data.collegeCode;
              if (code) url = `/leaderboards?collegeCode=${code}`;
            }
          } catch (e) {
            console.warn('Fallback to global leaderboard.');
          }
        }

        const res = await API.get(url);
        setLeaderboards(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load rankings.');
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, [token, role]);

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center font-mono text-xs uppercase tracking-widest">Loading Ecosystem Rankings...</div>;

  const hasCollegeAccess = token && leaderboards.collegeLeaderboard.length > 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <span className="text-[10px] bg-white text-black font-bold px-3 py-1 rounded uppercase tracking-widest font-mono">Global Intelligence</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-3">INSTITUTIONAL LEADERBOARD</h1>
        <p className="text-xs text-neutral-400 mt-2 font-mono max-w-xl mx-auto">
          Real-time academic performance rankings, event participation metrics, and campus excellence indexing across verified institutions.
        </p>
      </div>

      {error && <div className="max-w-7xl mx-auto mb-6 p-4 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* College Leaderboard */}
        {hasCollegeAccess ? (
          <div className="bg-black border border-neutral-800 p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Campus Exclusive Node</span>
                <h2 className="text-lg font-bold tracking-wider uppercase mt-1">Institutional Campus Leaderboard</h2>
              </div>
              <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg text-neutral-300">
                Verified Peers Only
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                    <th className="pb-3 w-16">Rank</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">PRN</th>
                    <th className="pb-3">Branch & Year</th>
                    <th className="pb-3 text-right">Campus Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {leaderboards.collegeLeaderboard.map((s, idx) => {
                    const rank = idx + 1;
                    let rankBadge = <span className="font-bold text-white text-base font-mono">#{rank}</span>;
                    if (rank === 1) rankBadge = <span className="text-2xl" title="Rank 1: Gold Medal">🥇</span>;
                    else if (rank === 2) rankBadge = <span className="text-2xl" title="Rank 2: Silver Medal">🥈</span>;
                    else if (rank === 3) rankBadge = <span className="text-2xl" title="Rank 3: Bronze Medal">🥉</span>;

                    return (
                      <tr key={s.id} className="hover:bg-neutral-950 transition">
                        <td className="py-4">{rankBadge}</td>
                        <td className="py-4 flex items-center gap-4">
                          <img 
                            src={s.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(s.name)} 
                            alt={s.name} 
                            className="w-11 h-11 rounded-full border border-neutral-700 object-cover bg-neutral-900 shadow-md" 
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{s.name}</p>
                            <p className="text-[11px] text-neutral-400 font-mono">{s.prnNumber}</p>
                          </div>
                        </td>
                        <td className="py-4 text-neutral-400">{s.prnNumber}</td>
                        <td className="py-4 text-neutral-300">{s.branch} ({s.academicYear})</td>
                        <td className="py-4 text-right font-black text-white text-sm">{s.campusScore} PTS</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-700"></div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white mb-2">Institutional Campus Rankings Locked</h3>
            <p className="text-xs text-neutral-400 font-mono max-w-md mx-auto mb-6">
              Sign in with your student PRN or college admin account and complete verification to unlock your institution's exclusive leaderboard.
            </p>
            <a
              href="/signup"
              className="inline-block bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition"
            >
              Join Your Campus Node ↗
            </a>
          </div>
        )}

        {/* Global Leaderboard */}
        <div className="bg-black border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">Ecosystem-Wide Index</span>
              <h2 className="text-lg font-bold tracking-wider uppercase mt-1">Global Institutional Leaderboard</h2>
            </div>
            <span className="text-xs font-mono bg-white text-black font-bold px-3 py-1 rounded-lg">
              All Verified Campuses
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="pb-3 w-16">Rank</th>
                  <th className="pb-3">Student Name & Institution</th>
                  <th className="pb-3">Branch & Stream</th>
                  <th className="pb-3 text-right">Global Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {leaderboards.globalLeaderboard.map((s, idx) => {
                  const rank = idx + 1;
                  let rankBadge = <span className="font-bold text-white text-base font-mono">#{rank}</span>;
                  if (rank === 1) rankBadge = <span className="text-2xl" title="Rank 1: Gold Medal">🥇</span>;
                  else if (rank === 2) rankBadge = <span className="text-2xl" title="Rank 2: Silver Medal">🥈</span>;
                  else if (rank === 3) rankBadge = <span className="text-2xl" title="Rank 3: Bronze Medal">🥉</span>;

                  return (
                    <tr key={s.id} className="hover:bg-neutral-950 transition">
                      <td className="py-4">{rankBadge}</td>
                      <td className="py-4 flex items-center gap-4">
                        <img 
                          src={s.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(s.name)} 
                          alt={s.name} 
                          className="w-11 h-11 rounded-full border border-neutral-700 object-cover bg-neutral-900 shadow-md" 
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{s.name}</p>
                          <p className="text-[11px] text-neutral-400">{s.collegeName}</p>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-300">{s.branch} ({s.academicYear})</td>
                      <td className="py-4 text-right font-black text-white text-sm">{s.campusScore} PTS</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}