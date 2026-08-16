import { useState } from 'react';
import { Search, Link as LinkIcon, Send, CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';

const Submit = () => {
  // NAYA: Ek link ki jagah 3 links ka state bana diya
  const [formData, setFormData] = useState({ 
    regId: '', 
    task1: '', 
    task2: '', 
    task3: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check karna ki saare boxes bhare hain ya nahi
    if (!formData.regId.trim() || !formData.task1.trim() || !formData.task2.trim() || !formData.task3.trim()) {
      setError('Please fill all the task links.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    // ✨ THE MAGIC: Teeno links ko ek sath jod diya (with new line \n)
    const combinedLinks = `Task 1: ${formData.task1} \nTask 2: ${formData.task2} \nTask 3: ${formData.task3}`;

    try {
      const response = await fetch('https://velystra-backend.onrender.com/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend ko abhi bhi lag raha hai ki 1 hi link aa raha hai (taskLink)
        body: JSON.stringify({ 
          regId: formData.regId, 
          taskLink: combinedLinks 
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message);
        // Form clear kar do
        setFormData({ regId: '', task1: '', task2: '', task3: '' }); 
      } else {
        setError(data.message || 'Submission failed.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-72px)] py-12 md:py-20 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <UploadCloud size={32} className="text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Submit Your Tasks
          </h1>
          <p className="text-slate-600 text-lg">
            Upload your project links here to get them reviewed.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          {!successMsg ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* REGISTRATION ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Registration ID</label>
                <div className="relative">
                  <Search size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.regId}
                    onChange={(e) => setFormData({ ...formData, regId: e.target.value.replace(/-/g, '').toUpperCase() })}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase"
                    placeholder="e.g. VTFE26123456"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 pb-1 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Project Links</h3>
              </div>

              {/* TASK 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task 1 URL</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input
                    type="url"
                    value={formData.task1}
                    onChange={(e) => setFormData({ ...formData, task1: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://github.com/..."
                    required
                  />
                </div>
              </div>

              {/* TASK 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task 2 URL</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input
                    type="url"
                    value={formData.task2}
                    onChange={(e) => setFormData({ ...formData, task2: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://github.com/..."
                    required
                  />
                </div>
              </div>

              {/* TASK 3 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task 3 URL</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input
                    type="url"
                    value={formData.task3}
                    onChange={(e) => setFormData({ ...formData, task3: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://github.com/..."
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3 font-medium bg-slate-50 p-2 rounded">
                  ⚠️ Make sure all your links (Google Drive / GitHub) are set to "Public" so our team can review them.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md">
                {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit All Tasks</>}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center animate-fade-in">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Tasks Submitted Successfully!</h3>
              <p className="text-slate-600 mb-6">{successMsg}</p>
              <button onClick={() => setSuccessMsg('')} className="text-blue-600 font-medium hover:underline">
                Submit another response
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submit;