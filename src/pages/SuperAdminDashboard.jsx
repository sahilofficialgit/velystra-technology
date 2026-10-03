import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchEcosystem = async () => {
    try {
      const res = await API.get('/super-admin/ecosystem');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Access denied or failed to load ecosystem telemetry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'SUPER_ADMIN') {
      navigate('/login');
      return;
    }
    fetchEcosystem();
  }, [navigate]);

  const handleOpenStudentAudit = async (studentId) => {
    setAuditLoading(true);
    try {
      const res = await API.get(`/super-admin/student/${studentId}`);
      setAuditData(res.data);
      setSelectedStudent(studentId);
      setAuditLoading(false);
    } catch (err) {
      setError('Failed to fetch student audit dossier.');
      setAuditLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center font-mono text-xs uppercase tracking-widest">Initializing Master Terminal...</div>;

  const metrics = data?.metrics;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black border border-neutral-800 p-8 rounded-2xl mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-red-600 text-white font-bold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">Master Controller Node</span>
            <span className="text-xs text-neutral-400 font-mono">Auth: Root Admin</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">VELYSTRA ECOSYSTEM COMMAND</h1>
          <p className="text-xs text-neutral-400 mt-1 font-mono">Cross-Institutional Monitoring, Student Dossiers & Talent Auditing</p>
        </div>
        
        <button onClick={handleLogout} className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition uppercase font-mono">
          Terminate Session
        </button>
      </header>

      {error && <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs rounded-xl font-mono">{error}</div>}

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 font-mono">
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Total Colleges</p>
          <h3 className="text-4xl font-black mt-2 text-white">{metrics?.totalColleges}</h3>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Total Students</p>
          <h3 className="text-4xl font-black mt-2 text-white">{metrics?.totalStudents}</h3>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Verified Students</p>
          <h3 className="text-4xl font-black mt-2 text-white">{metrics?.verifiedStudents}</h3>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Hosted Events</p>
          <h3 className="text-4xl font-black mt-2 text-white">{metrics?.totalEvents}</h3>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-2xl">
          <p className="text-[11px] text-neutral-400 uppercase tracking-widest">Total Submissions</p>
          <h3 className="text-4xl font-black mt-2 text-white">{metrics?.totalSubmissions}</h3>
        </div>
      </div>

      {/* Registered Colleges Overview */}
      <div className="bg-black border border-neutral-800 p-8 rounded-2xl mb-8">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-6 pb-4 border-b border-neutral-800 font-mono">Registered Institutional Nodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.colleges.map(college => (
            <div key={college.id} className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl font-mono">
              <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded">Code: {college.collegeCode}</span>
              <h3 className="font-bold text-base text-white mt-2">{college.collegeName}</h3>
              <p className="text-xs text-neutral-400 mt-1">Admin: {college.adminEmail}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-900 text-xs text-neutral-300">
                <span>Students: <strong>{college._count.students}</strong></span>
                <span>Events: <strong>{college._count.events}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Student Directory & Audit Trigger */}
      <div className="bg-black border border-neutral-800 p-8 rounded-2xl">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-6 pb-4 border-b border-neutral-800 font-mono">Ecosystem Student Directory (Click to Audit)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 uppercase">
                <th className="pb-3">Student & Avatar</th>
                <th className="pb-3">Institution</th>
                <th className="pb-3">PRN & Branch</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3 text-right">Campus Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {data?.students.map(s => (
                <tr key={s.id} onClick={() => handleOpenStudentAudit(s.id)} className="hover:bg-neutral-950 cursor-pointer transition">
                  <td className="py-3 flex items-center gap-3">
                    <img src={s.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(s.name)} alt="" className="w-8 h-8 rounded-full border border-neutral-700 object-cover bg-neutral-900" />
                    <div>
                      <p className="font-bold text-white">{s.name}</p>
                      <p className="text-[10px] text-neutral-400">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-3 text-neutral-300">{s.college?.collegeName || 'N/A'}</td>
                  <td className="py-3 text-neutral-400">{s.prnNumber} | {s.branch}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${s.isVerified ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'}`}>
                      {s.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-white">{s.campusScore} PTS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Deep-Dive Audit Dossier Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-black border border-neutral-800 p-8 rounded-2xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto font-mono">
            {auditLoading ? (
              <p className="text-center py-12 text-xs uppercase tracking-widest text-neutral-400">Loading Student Audit Dossier...</p>
            ) : auditData ? (
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-4">
                    <img src={auditData.student.avatarUrl} alt="" className="w-14 h-14 rounded-full border border-neutral-700 object-cover bg-neutral-900" />
                    <div>
                      <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded uppercase">Audit Dossier</span>
                      <h3 className="text-xl font-black text-white mt-1">{auditData.student.name}</h3>
                      <p className="text-xs text-neutral-400">PRN: {auditData.student.prnNumber} | Email: {auditData.student.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="text-neutral-400 hover:text-white text-sm font-bold px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg">✕ Close</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-neutral-400 uppercase">Global Rank</p>
                    <p className="text-xl font-black text-white mt-1">#{auditData.ranks.globalRank}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-neutral-400 uppercase">College Rank</p>
                    <p className="text-xl font-black text-white mt-1">#{auditData.ranks.collegeRank}</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-neutral-400 uppercase">Campus Score</p>
                    <p className="text-xl font-black text-white mt-1">{auditData.student.campusScore} PTS</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-neutral-400 uppercase">Verification</p>
                    <p className="text-xs font-bold text-white mt-2 uppercase">{auditData.student.isVerified ? 'Verified Active' : 'Pending'}</p>
                  </div>
                </div>

                <div className="mb-6 bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-xs space-y-1 text-neutral-300">
                  <p><strong>Institution:</strong> {auditData.student.college?.collegeName || auditData.student.collegeName} ({auditData.student.collegeCode})</p>
                  <p><strong>Academic Stream:</strong> {auditData.student.degreeType || 'Degree'} | {auditData.student.academicYear} | {auditData.student.branch}</p>
                  <p><strong>Primary Domain:</strong> {auditData.student.domain}</p>
                </div>

                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-neutral-300">Event Participations & Submission History ({auditData.student.participations.length})</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {auditData.student.participations.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No events participated yet.</p>
                  ) : (
                    auditData.student.participations.map(p => (
                      <div key={p.id} className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{p.event.title}</p>
                          <p className="text-[10px] text-neutral-400">Data: {p.submissionData || 'Attendance Marked'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${p.status === 'APPROVED' ? 'bg-white text-black' : p.status === 'REJECTED' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-neutral-900 text-neutral-400'}`}>
                            {p.status}
                          </span>
                          <p className="text-[10px] text-neutral-500 mt-1">{new Date(p.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}