import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamic API Base URL configuration for Local & Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [viewType, setViewType] = useState('global'); // 'global' or 'college'
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem('velystra_token');

  useEffect(() => {
    fetchLeaderboard();
  }, [viewType]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/api/leaderboard?type=${viewType}`, { headers });
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (studentId) => {
    try {
      setModalLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/student/${studentId}/profile`);
      if (res.data.success) {
        setSelectedStudent(res.data.student);
      }
    } catch (err) {
      alert('Failed to load student profile.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Toggle */}
        <div className="text-center mb-8">
          <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
            Campus League & Global Rankings
          </span>
          <h1 className="text-3xl font-bold text-white mt-3">Public Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">Compete in college & public events, climb the global rankings, and put your institution on top!</p>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setViewType('global')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${viewType === 'global' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              🌍 Global Rankings
            </button>
            <button
              onClick={() => setViewType('college')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${viewType === 'college' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              🏛️ My College Top 10
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center text-slate-400">
            No rankings available for this category yet.
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="divide-y divide-slate-700">
              {leaderboard.map((student, index) => (
                <div 
                  key={student.id} 
                  onClick={() => handleStudentClick(student.id)}
                  className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30' :
                      index === 1 ? 'bg-slate-300 text-slate-950' :
                      index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-900 text-slate-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-blue-400">
                      {student.avatarUrl ? <img src={student.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : student.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-2">
                        {student.fullName}
                        <span className="text-xs bg-slate-900 text-blue-400 px-2 py-0.5 rounded-md border border-slate-700 font-normal">{student.domain}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="text-amber-400 font-medium">🏛️ {student.college?.name || 'Independent'}</span>
                      </p>
                      {/* Points Split Breakdown Display */}
                      <div className="flex gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="text-indigo-300">College Pts: <strong>{student.collegePoints || 0}</strong></span>
                        <span>•</span>
                        <span className="text-teal-300">Public Pts: <strong>{student.publicPoints || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400">{student.campusScore}</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Public Profile Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-6 relative shadow-2xl">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-medium"
              >
                ✕ Close
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-blue-500/40 overflow-hidden flex items-center justify-center text-3xl font-bold text-blue-400 mb-3 shadow-lg">
                  {selectedStudent.avatarUrl ? <img src={selectedStudent.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : selectedStudent.fullName.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white">{selectedStudent.fullName}</h3>
                <p className="text-xs text-blue-400 mt-1 bg-blue-950/50 px-3 py-1 rounded-full border border-blue-800/40">{selectedStudent.domain}</p>
                <p className="text-xs text-slate-400 mt-2 italic">"{selectedStudent.bio || 'No bio provided'}"</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-2 text-sm">
                <p className="flex justify-between"><strong className="text-slate-400">College:</strong> <span className="text-white font-medium">{selectedStudent.college?.name}</span></p>
                <p className="flex justify-between"><strong className="text-slate-400">Approved Submissions:</strong> <span className="text-emerald-400 font-bold">{selectedStudent.submissions?.length || 0}</span></p>
                <p className="flex justify-between"><strong className="text-slate-400">Total Campus Score:</strong> <span className="text-blue-400 font-extrabold">{selectedStudent.campusScore} pts</span></p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}