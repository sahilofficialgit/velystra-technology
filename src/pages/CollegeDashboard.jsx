import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CollegeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState('HACKATHON');
  const [submissionType, setSubmissionType] = useState('ATTENDANCE'); // 'ATTENDANCE', 'GITHUB_DEMO', 'LINKEDIN_POST'
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/college/dashboard');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'COLLEGE_ADMIN') {
      navigate('/');
      return;
    }
    fetchDashboard();
  }, [navigate]);

  const handleVerifyStudent = async (studentId, isVerified) => {
    try {
      await API.patch(`/college/verify-student/${studentId}`, { isVerified });
      setSuccess('Student PRN status updated.');
      fetchDashboard();
    } catch (err) {
      setError('Failed to update student verification.');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/college/events', {
        title: eventTitle,
        description: eventDesc,
        category: eventCategory,
        submissionType,
        date: eventDate,
        time: eventTime,
      });
      setSuccess('Event hosted successfully with selected submission/attendance mode.');
      setEventTitle('');
      setEventDesc('');
      setEventDate('');
      setEventTime('');
      fetchDashboard();
    } catch (err) {
      setError('Failed to create event.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/college/events/${eventId}`);
      setSuccess('Event deleted.');
      fetchDashboard();
    } catch (err) {
      setError('Failed to delete event.');
    }
  };

  // Approve or Reject Submission / Attendance (Handles -ve points if rejected)
  const handleReviewSubmission = async (participantId, status) => {
    try {
      await API.patch(`/college/submissions/${participantId}`, { status });
      setSuccess(`Submission marked as ${status}. Points updated.`);
      fetchDashboard();
    } catch (err) {
      setError('Failed to review submission.');
    }
  };

  // Export Audit Report (CSV)
  const handleExportAuditReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,Student Name,PRN,Degree/Diploma,Branch,Year,Event Title,Submission Type,Status\n";
    
    data?.events.forEach(ev => {
      ev.participants.forEach(p => {
        const row = [
          `"${p.student.name}"`,
          `"${p.student.prnNumber}"`,
          `"${p.student.degreeType || 'Degree'}"`,
          `"${p.student.branch}"`,
          `"${p.student.academicYear}"`,
          `"${ev.title}"`,
          `"${ev.submissionType}"`,
          `"${p.status}"`
        ].join(",");
        csvContent += row + "\r\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data?.collegeCode}_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center font-mono text-xs tracking-widest uppercase">Initializing Secure Workspace...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black border border-neutral-800 p-8 rounded-2xl mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-white text-black font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">Enterprise Node</span>
            <span className="text-xs text-neutral-400 font-mono">Secure ID: {data?.collegeCode}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">{data?.collegeName}</h1>
          <p className="text-xs text-neutral-400 mt-1">Attendance, Verification & Talent Intelligence Dashboard</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExportAuditReport}
            className="flex-1 md:flex-none bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition uppercase"
          >
            Download Audit CSV 📊
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition uppercase"
          >
            Sign Out
          </button>
        </div>
      </header>

      {error && <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}
      {success && <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700 text-white text-xs rounded-xl font-mono">{success}</div>}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Enrolled Students</p>
          <h3 className="text-4xl font-black mt-2 font-mono text-white">{data?.totalStudents}</h3>
        </div>
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Pending Approvals</p>
          <h3 className="text-4xl font-black mt-2 font-mono text-white">{data?.pendingVerification}</h3>
        </div>
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Hosted Events</p>
          <h3 className="text-4xl font-black mt-2 font-mono text-white">{data?.totalEvents}</h3>
        </div>
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Total Submissions</p>
          <h3 className="text-4xl font-black mt-2 font-mono text-white">{data?.totalParticipantsCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Student PRN Verification Queue */}
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
            <h2 className="text-sm font-bold tracking-wider uppercase">Student PRN Verification Queue</h2>
            <span className="text-[11px] font-mono bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md text-neutral-400">
              {data?.students.filter(s => !s.isVerified).length} Pending
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {data?.students.filter(s => !s.isVerified).length === 0 ? (
              <p className="text-xs text-neutral-500 py-10 text-center font-mono">All student PRNs verified.</p>
            ) : (
              data?.students.filter(s => !s.isVerified).map(student => (
                <div key={student.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{student.name}</h4>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">PRN: {student.prnNumber} | {student.degreeType || 'Degree'} ({student.academicYear}, {student.branch})</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{student.email}</p>
                  </div>
                  <button
                    onClick={() => handleVerifyStudent(student.id, true)}
                    className="bg-white hover:bg-neutral-200 text-black px-3.5 py-2 rounded-lg text-xs font-bold transition uppercase tracking-wider"
                  >
                    Verify
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Host Event Form with Submission Type Selector */}
        <div className="bg-black border border-neutral-800 p-6 rounded-2xl">
          <h2 className="text-sm font-bold tracking-wider uppercase mb-6 pb-4 border-b border-neutral-800">Host Academic Event / Seminar</h2>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              />
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              >
                <option value="HACKATHON">Coding Hackathon</option>
                <option value="WORKSHOP">Technical Workshop</option>
                <option value="SEMINAR">Expert Seminar</option>
                <option value="SYMPOSIUM">Technical Symposium</option>
              </select>
            </div>

            {/* Submission Mode Selection */}
            <div>
              <label className="block text-[11px] font-mono font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Required Student Verification Mode</label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
              >
                <option value="ATTENDANCE">Attendance Marking (Physical Sheet Tally)</option>
                <option value="GITHUB_DEMO">GitHub Repository & Live Demo Link</option>
                <option value="LINKEDIN_POST">LinkedIn / Social Media Post Link</option>
              </select>
            </div>

            <textarea
              required
              placeholder="Detailed description and evaluation guidelines..."
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            ></textarea>
            
            <div className="grid grid-cols-3 gap-3">
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              <input
                type="text"
                required
                placeholder="Time (e.g. 10 AM)"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
              
            </div>
            <button type="submit" className="w-full bg-white hover:bg-neutral-200 text-black py-3 rounded-xl text-xs font-bold transition uppercase tracking-widest">
              Publish Event with Mode Selection
            </button>
          </form>
        </div>

      </div>

      {/* Events & Submissions Review */}
      <div className="bg-black border border-neutral-800 p-6 rounded-2xl mb-8">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-6 pb-4 border-b border-neutral-800">Event Submissions & Physical Sheet Tally</h2>
        <div className="space-y-6">
          {data?.events.length === 0 ? (
            <p className="text-xs text-neutral-500 text-center py-10 font-mono">No institutional events hosted yet.</p>
          ) : (
            data?.events.map(ev => (
              <div key={ev.id} className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded font-mono uppercase">{ev.category}</span>
                      <span className="text-[10px] bg-white text-black font-bold px-2.5 py-0.5 rounded font-mono uppercase">{ev.submissionType}</span>
                      <span className="text-xs text-neutral-400 font-mono">{ev.date}</span>
                    </div>
                    <h3 className="font-bold text-base mt-2">{ev.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{ev.description}</p>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase">
                    Delete
                  </button>
                </div>

                {/* Participant List with Branch & Year */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 font-mono">Participant List (Tally against Physical Sheet)</p>
                  {ev.participants.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic font-mono">No student submissions or attendance marked yet.</p>
                  ) : (
                    ev.participants.map(p => (
                      <div key={p.id} className="bg-black border border-neutral-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <p className="text-xs font-bold font-mono text-white">{p.student.name} <span className="text-neutral-400">({p.student.prnNumber})</span></p>
                          <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                            {p.student.degreeType || 'Degree'} | {p.student.academicYear} | {p.student.branch}
                          </p>
                          <p className="text-xs font-mono text-neutral-300 mt-1">
                            Submission/Data: <span className="text-white underline">{p.submissionData || 'Attendance Marked'}</span> | Status: <strong className="text-white">{p.status}</strong>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewSubmission(p.id, 'APPROVED')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition tracking-wider ${p.status === 'APPROVED' ? 'bg-white text-black' : 'bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800'}`}
                          >
                            Approve ✓
                          </button>
                          <button
                            onClick={() => handleReviewSubmission(p.id, 'REJECTED')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition tracking-wider ${p.status === 'REJECTED' ? 'bg-neutral-900 text-red-400 border border-red-800' : 'bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-red-400'}`}
                          >
                            Reject ✕
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}