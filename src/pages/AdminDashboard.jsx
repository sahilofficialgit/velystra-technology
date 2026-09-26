import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Dynamic API Base URL configuration for Local & Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [allCollegeStudents, setAllCollegeStudents] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [collegeCode, setCollegeCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'students', 'submissions', 'events', 'create_challenge'

  // Challenge Form State
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengePoints, setChallengePoints] = useState(100);
  const [challengeDeadline, setChallengeDeadline] = useState('');
  const [challengeLoading, setChallengeLoading] = useState(false);

  // Rejection Feedback Modal State
  const [rejectingSubId, setRejectingSubId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Editing Challenge State
  const [editingChallenge, setEditingChallenge] = useState(null);

  const token = localStorage.getItem('velystra_token');
  const user = JSON.parse(localStorage.getItem('velystra_user') || '{}');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Pending Students & Code
      const studentsRes = await axios.get(`${API_BASE_URL}/api/admin/pending-students`, { headers });
      if (studentsRes.data.success) {
        setPendingStudents(studentsRes.data.students);
        setCollegeCode(studentsRes.data.collegeCode);
      }

      // 2. All College Students & Stats
      const statsRes = await axios.get(`${API_BASE_URL}/api/admin/stats`, { headers });
      if (statsRes.data.success) {
        setAllCollegeStudents(statsRes.data.students);
      }

      // 3. Pending Submissions
      const subRes = await axios.get(`${API_BASE_URL}/api/admin/submissions`, { headers });
      if (subRes.data.success) {
        setSubmissions(subRes.data.submissions);
      }

      // 4. Challenges / Events
      const chalRes = await axios.get(`${API_BASE_URL}/api/challenges`, { headers });
      if (chalRes.data.success) {
        setChallenges(chalRes.data.challenges);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/students/${studentId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        alert('Student PRN approved successfully! ✅');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve student.');
    }
  };

  const handleApproveSubmission = async (submissionId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/submissions/${submissionId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        alert('Submission approved and points awarded! 🎉');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve submission.');
    }
  };

  const handleRejectSubmission = async (submissionId) => {
    if (!feedbackText.trim()) {
      alert('Please provide a rejection reason/feedback.');
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/submissions/${submissionId}/reject`,
        { feedback: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert('Submission rejected with feedback.');
        setRejectingSubId(null);
        setFeedbackText('');
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to reject submission.');
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setChallengeLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/challenges`,
        { title: challengeTitle, description: challengeDesc, points: parseInt(challengePoints), deadline: challengeDeadline ? new Date(challengeDeadline) : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert('Challenge hosted successfully! 🚀');
        setChallengeTitle(''); setChallengeDesc(''); setChallengePoints(100); setChallengeDeadline('');
        fetchAdminData();
        setActiveTab('events');
      }
    } catch (err) {
      alert('Failed to create challenge.');
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleUpdateChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/challenges/${editingChallenge.id}`,
        editingChallenge,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert('Challenge updated successfully! ✅');
        setEditingChallenge(null);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update challenge.');
    }
  };

  const totalCollegeStudents = allCollegeStudents.length;

  return (
    <div className="min-h-[85vh] bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
              Admin Portal
            </span>
            <h1 className="text-3xl font-bold text-white mt-2">College Administration Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor student registrations, event analytics, and submissions.</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-lg text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-bold text-blue-400">{user.name || 'Admin'}</p>
            <span className="inline-block mt-1 bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20">
              {user.role}
            </span>
          </div>
        </div>

        {/* College Code Banner */}
        {user.role === 'COLLEGE_ADMIN' && collegeCode && (
          <div className="bg-gradient-to-r from-blue-900/60 to-slate-800 border border-blue-500/40 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="bg-blue-600/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
                Institution Code
              </span>
              <h3 className="text-xl font-bold text-white mt-2">Share this 6-Digit ID with students</h3>
              <p className="text-slate-400 text-sm mt-1">Students enter this code during signup for PRN verification.</p>
            </div>
            <div className="bg-slate-900 border border-blue-500/60 px-6 py-3 rounded-xl text-2xl font-mono font-bold text-blue-400 tracking-widest shadow-inner">
              {collegeCode}
            </div>
          </div>
        )}

        {error && <div className="bg-red-950/50 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm">{error}</div>}

        {/* Tabs Switcher */}
        <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            📊 College Analytics & Students
          </button>
          <button onClick={() => setActiveTab('students')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            👥 Pending PRNs ({pendingStudents.length})
          </button>
          <button onClick={() => setActiveTab('submissions')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            💻 Submissions ({submissions.length})
          </button>
          <button onClick={() => setActiveTab('events')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            📅 Events & Analytics
          </button>
          <button onClick={() => setActiveTab('create_challenge')} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'create_challenge' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            🚀 Host New Event
          </button>
        </div>

        {/* TAB CONTENTS */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading admin analytics...</div>
        ) : activeTab === 'analytics' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Total Verified Students</span>
                <h3 className="text-4xl font-extrabold text-blue-400 mt-2">{totalCollegeStudents}</h3>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Pending PRN Requests</span>
                <h3 className="text-4xl font-extrabold text-amber-400 mt-2">{pendingStudents.length}</h3>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Active Hosted Events</span>
                <h3 className="text-4xl font-extrabold text-emerald-400 mt-2">{challenges.length}</h3>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">🎓 College Student Directory & Points</h3>
              {allCollegeStudents.length === 0 ? (
                <p className="text-slate-400 text-sm">No verified students found for your college yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">PRN Number</th>
                        <th className="p-3">Domain</th>
                        <th className="p-3 text-right">Campus Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {allCollegeStudents.map(st => (
                        <tr key={st.id} className="hover:bg-slate-750">
                          <td className="p-3 font-bold text-white">{st.fullName}</td>
                          <td className="p-3 font-mono text-blue-400">{st.prnNumber}</td>
                          <td className="p-3 text-slate-400">{st.domain}</td>
                          <td className="p-3 text-right font-extrabold text-emerald-400">{st.campusScore} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'students' ? (
          pendingStudents.length === 0 ? (
            <div className="bg-slate-800/50 rounded-2xl p-12 text-center text-slate-400">No pending student PRN requests.</div>
          ) : (
            <div className="grid gap-4">
              {pendingStudents.map(student => (
                <div key={student.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">{student.fullName}</h3>
                    <p className="text-sm text-slate-300">PRN: <span className="font-mono text-blue-400">{student.prnNumber}</span> | Email: {student.user?.email}</p>
                  </div>
                  <button onClick={() => handleApproveStudent(student.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl text-sm">
                    ✅ Approve PRN
                  </button>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'submissions' ? (
          submissions.length === 0 ? (
            <div className="bg-slate-800/50 rounded-2xl p-12 text-center text-slate-400">No pending submissions to review.</div>
          ) : (
            <div className="grid gap-4">
              {submissions.map(sub => (
                <div key={sub.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{sub.challenge?.title}</h3>
                      <p className="text-sm text-slate-300">Student: <strong>{sub.student?.fullName}</strong> ({sub.student?.prnNumber})</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-800/50 text-xs font-medium">GitHub</a>
                      {sub.deployedUrl && <a href={sub.deployedUrl} target="_blank" rel="noreferrer" className="text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50 text-xs font-medium">Live Demo</a>}
                    </div>
                  </div>

                  {rejectingSubId === sub.id ? (
                    <div className="bg-slate-900 p-4 rounded-xl space-y-3 border border-red-500/30">
                      <input type="text" placeholder="Reason for rejection (e.g. Website not opening)" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" />
                      <div className="flex gap-2">
                        <button onClick={() => handleRejectSubmission(sub.id)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold">Confirm Rejection</button>
                        <button onClick={() => setRejectingSubId(null)} className="bg-slate-700 text-slate-300 px-4 py-1.5 rounded-lg text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
                      <button onClick={() => handleApproveSubmission(sub.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold">✅ Approve & Award Points</button>
                      <button onClick={() => setRejectingSubId(sub.id)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-semibold">❌ Reject with Feedback</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'events' ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Hosted Events & Participation Analytics</h3>
            {challenges.length === 0 ? (
              <div className="bg-slate-800/50 rounded-2xl p-12 text-center text-slate-400">No events hosted yet.</div>
            ) : (
              challenges.map(ch => {
                const totalSubmissions = ch.submissions ? ch.submissions.length : 0;
                const participationPercentage = totalCollegeStudents > 0 
                  ? Math.round((totalSubmissions / totalCollegeStudents) * 100) 
                  : 0;

                return (
                  <div key={ch.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-500/30">
                          +{ch.points} Points
                        </span>
                        <span className="text-xs text-slate-400">
                          Deadline: {ch.deadline ? new Date(ch.deadline).toLocaleDateString() : 'No Deadline'}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white">{ch.title}</h4>
                      <p className="text-sm text-slate-300">{ch.description}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                          <span className="text-slate-400">Enrolled / Submissions:</span>
                          <span className="font-bold text-emerald-400">{totalSubmissions} / {totalCollegeStudents} students</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                          <span className="text-slate-400">Participation Rate:</span>
                          <span className="font-extrabold text-blue-400">{participationPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex justify-end">
                      <button onClick={() => setEditingChallenge(ch)} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition-all">
                        ✏️ Edit Event
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Host New Event / Challenge</h3>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <input type="text" placeholder="Challenge Title" value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
              <textarea placeholder="Description & Instructions" rows="3" value={challengeDesc} onChange={(e) => setChallengeDesc(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Points" value={challengePoints} onChange={(e) => setChallengePoints(e.target.value)} required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                <input type="date" value={challengeDeadline} onChange={(e) => setChallengeDeadline(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
              </div>
              <button type="submit" disabled={challengeLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm">Publish Event</button>
            </form>
          </div>
        )}

        {/* Edit Challenge Modal */}
        {editingChallenge && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h3 className="text-xl font-bold text-white">Edit Challenge</h3>
              <form onSubmit={handleUpdateChallenge} className="space-y-4">
                <input type="text" value={editingChallenge.title} onChange={(e) => setEditingChallenge({...editingChallenge, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                <textarea rows="3" value={editingChallenge.description} onChange={(e) => setEditingChallenge({...editingChallenge, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={editingChallenge.points} onChange={(e) => setEditingChallenge({...editingChallenge, points: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                  <input type="date" value={editingChallenge.deadline ? editingChallenge.deadline.split('T')[0] : ''} onChange={(e) => setEditingChallenge({...editingChallenge, deadline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm font-semibold">Save Changes</button>
                  <button type="button" onClick={() => setEditingChallenge(null)} className="flex-1 bg-slate-700 text-slate-300 py-2 rounded-xl text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}