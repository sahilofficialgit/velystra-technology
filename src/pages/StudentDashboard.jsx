import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Velystra1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Alpha3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Nexus4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vertex5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Matrix6',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Vector7',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum8',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Pulsar9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zenith10'
];

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboards, setLeaderboards] = useState({ globalLeaderboard: [], collegeLeaderboard: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submissionData, setSubmissionData] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Student metadata fields
  const [degreeType, setDegreeType] = useState('Degree');
  const [branch, setBranch] = useState('');
  const [academicYear, setAcademicYear] = useState('2nd Year');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get('/student/dashboard');
      setDashboardData(res.data);

      if (res.data.student) {
        setDegreeType(res.data.student.degreeType || 'Degree');
        setBranch(res.data.student.branch || '');
        setAcademicYear(res.data.student.academicYear || '2nd Year');
        setAvatarUrl(res.data.student.avatarUrl || PRESET_AVATARS[0]);
      }

      const collegeCode = res.data.student.collegeCode;
      const lbRes = await API.get(`/leaderboards?collegeCode=${collegeCode}`);
      setLeaderboards(lbRes.data);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load student dashboard.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'STUDENT') {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const finalAvatar = customAvatarInput.trim() ? customAvatarInput.trim() : avatarUrl;
      await API.patch('/student/profile', { avatarUrl: finalAvatar });
      setSuccess('Profile picture updated successfully!');
      setShowEditProfile(false);
      setCustomAvatarInput('');
      fetchData();
    } catch (err) {
      setError('Failed to update profile picture.');
    }
  };

  const handleJoinOrMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      let finalPayload = {
        degreeType,
        branch,
        academicYear,
        submissionData: selectedEvent.submissionType === 'ATTENDANCE' ? 'Marked Present (Attendance Verified)' : submissionData
      };

      await API.post(`/student/events/${selectedEvent.id}/join`, finalPayload);
      setSuccess('Successfully submitted for faculty review!');
      setSelectedEvent(null);
      setSubmissionData('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit details.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center font-mono text-xs uppercase tracking-widest">Loading Student Workspace...</div>;

  const student = dashboardData?.student;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black">
      
      {/* Header with Instagram-style Large PFP */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black border border-neutral-800 p-8 rounded-2xl mb-8 gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => setShowEditProfile(true)}>
            <img 
              src={student?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Default'} 
              alt={student?.name} 
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-neutral-700 object-cover bg-neutral-900 shadow-2xl transition group-hover:border-white"
            />
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[10px] font-mono uppercase tracking-widest text-white font-bold">
              Edit PFP
            </div>
          </div>
          <div>
            <span className="text-[10px] bg-white text-black font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">Student Portal</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">{student?.name}</h1>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              PRN: <strong className="text-white">{student?.prnNumber}</strong> | College: <strong className="text-white">{student?.college?.collegeName || student?.collegeName}</strong>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">
              {student?.degreeType || 'Degree'} | {student?.academicYear} | Branch: <strong className="text-white">{student?.branch || 'N/A'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right font-mono">
            <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Campus Score</p>
            <p className="text-3xl font-black text-white">{student?.campusScore} PTS</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowEditProfile(true)} className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition uppercase font-mono">
              Customize PFP
            </button>
            <button onClick={handleLogout} className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-bold transition uppercase font-mono">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {error && <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}
      {success && <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl font-mono">{success}</div>}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-black border border-neutral-800 p-8 rounded-2xl max-w-md w-full relative">
            <h3 className="text-base font-bold uppercase tracking-wider mb-2 font-mono">Customize Profile Picture</h3>
            <p className="text-xs text-neutral-400 mb-6 font-mono">Select a curated Instagram-style avatar or paste your custom gallery image URL.</p>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                <img 
                  src={customAvatarInput.trim() || avatarUrl} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full border border-neutral-700 object-cover bg-neutral-900"
                />
                <div>
                  <p className="text-xs font-mono font-bold text-white uppercase">Live Preview</p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Visible across all institutional leaderboards.</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-3 uppercase">Choose Curated Avatar</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setAvatarUrl(url); setCustomAvatarInput(''); }}
                      className={`p-1.5 rounded-xl border transition ${avatarUrl === url && !customAvatarInput ? 'border-white bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}
                    >
                      <img src={url} alt={`Avatar ${idx + 1}`} className="w-10 h-10 rounded-full mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase">Or Custom Image URL (Gallery)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
                  Save Changes ✓
                </button>
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 bg-neutral-900 border border-neutral-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Notice */}
      {!student?.isVerified && (
        <div className="mb-8 p-4 bg-neutral-900 border border-neutral-700 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">PRN Verification Pending</h3>
            <p className="text-xs text-neutral-400 mt-0.5 font-mono">Your college admin is reviewing your PRN. Once verified, you can mark attendance & earn fixed 100 PTS.</p>
          </div>
          <span className="text-xs font-mono uppercase bg-black text-neutral-300 px-3 py-1 rounded-lg border border-neutral-800">Pending</span>
        </div>
      )}

      {/* Available College Events Section */}
      <div className="bg-black border border-neutral-800 p-6 rounded-2xl mb-8">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-6 pb-4 border-b border-neutral-800">Institutional Events & Seminars (Fixed 100 PTS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.collegeEvents.length === 0 ? (
            <p className="text-xs text-neutral-500 py-10 text-center font-mono">No events available right now.</p>
          ) : (
            dashboardData?.collegeEvents.map(ev => {
              const alreadyJoined = ev.participants.length > 0;
              return (
                <div key={ev.id} className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase font-mono">{ev.category}</span>
                      <span className="text-[10px] bg-white text-black font-bold px-2.5 py-0.5 rounded font-mono uppercase">{ev.submissionType}</span>
                    </div>
                    <h3 className="font-bold text-base">{ev.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-3">{ev.description}</p>
                    <p className="text-[11px] text-neutral-500 mt-4 font-mono">📅 {ev.date} at {ev.time} | <strong className="text-white">+100 PTS</strong></p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800">
                    {alreadyJoined ? (
                      <span className="block text-center w-full bg-neutral-900 border border-neutral-700 text-white py-2 rounded-xl text-xs font-mono font-bold uppercase">
                        Submitted & Pending Review ✓
                      </span>
                    ) : (
                      <button
                        disabled={!student?.isVerified}
                        onClick={() => setSelectedEvent(ev)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition ${student?.isVerified ? 'bg-white hover:bg-neutral-200 text-black' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'}`}
                      >
                        {student?.isVerified ? (ev.submissionType === 'ATTENDANCE' ? 'Mark Attendance' : 'Submit Work') : 'Verify PRN to Participate'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dynamic Modal for Event Participation */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-black border border-neutral-800 p-8 rounded-2xl max-w-md w-full relative">
            <h3 className="text-base font-bold uppercase tracking-wider mb-1 font-mono">
              {selectedEvent.submissionType === 'ATTENDANCE' ? 'Confirm Attendance Verification' : 'Submit Event Work'}
            </h3>
            <p className="text-xs text-neutral-400 mb-6 font-mono">{selectedEvent.title}</p>

            <form onSubmit={handleJoinOrMarkAttendance} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-neutral-400 mb-1 uppercase">Degree / Diploma</label>
                  <select
                    value={degreeType}
                    onChange={(e) => setDegreeType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="Degree">Degree</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-neutral-400 mb-1 uppercase">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-semibold text-neutral-400 mb-1 uppercase">Branch / Department</label>
                <input
                  type="text"
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g. Computer Engineering"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                />
              </div>

              {selectedEvent.submissionType === 'ATTENDANCE' ? (
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
                  <p className="text-xs font-mono text-neutral-300">
                    ℹ️ By clicking confirm, you are formally registering your presence. Faculty will tally this against physical attendance records.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-neutral-400 mb-1 uppercase">Repository / Social Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/... or https://linkedin.com/..."
                    value={submissionData}
                    onChange={(e) => setSubmissionData(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
                  Confirm & Submit
                </button>
                <button type="button" onClick={() => setSelectedEvent(null)} className="flex-1 bg-neutral-900 border border-neutral-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}