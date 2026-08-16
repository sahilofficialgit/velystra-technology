import { useState } from 'react';
import { ShieldCheck, Search, XCircle, Award, Calendar, CheckCircle } from 'lucide-react';

const Validate = () => {
  const [certId, setCertId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // DHYAN DEIN: Yahan bhi 'localhost' ki jagah apna IP address lagana agar phone pe test karna ho
  const handleValidate = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setIsLoading(true); setResult(null); setError(null);
    
    try {
      // FIX 1: API endpoint ko update kiya (/api/validate/)
      const response = await fetch(`http://localhost:5000/api/validate/${certId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // FIX 2: Backend se data 'user' ke andar aa raha hai, 'certificate' nahi
        setResult(data.user);
      } else {
        setError(data.message || 'Invalid Certificate ID.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-72px)] py-12 md:py-20 flex flex-col items-center">
      <div className="w-full max-w-xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Award size={32} className="text-blue-700" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Employer Verification</h1>
          <p className="text-slate-600">Verify the authenticity of a Velystra Certificate</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Certificate ID</label>
              <div className="relative">
                <Search size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value.toUpperCase())}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                  placeholder="e.g. VTCC26123456"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !certId.trim()}
              className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-lg transition-all"
            >
              {isLoading ? 'Searching...' : 'Validate Certificate'}
            </button>
          </form>

          <div className="mt-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fade-in">
                <XCircle className="text-red-600" size={24} />
                <div>
                  <h4 className="font-bold text-red-900">Verification Failed</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="p-6 border border-green-200 bg-green-50 rounded-xl animate-fade-in">
                <div className="flex items-center gap-3 mb-4 border-b border-green-200 pb-4">
                  <CheckCircle className="text-green-600" size={28} />
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Authentic Certificate</h3>
                    <p className="text-sm text-green-700">This record exists in our official database.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-slate-600 text-sm">Intern Name</span>
                    <span className="font-bold text-slate-900">{result.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-slate-600 text-sm">Domain</span>
                    <span className="font-bold text-slate-900">{result.domain}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-slate-600 text-sm">Duration</span>
                    <span className="font-bold text-slate-900">{result.duration}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-100 pb-2">
                    <span className="text-slate-600 text-sm">Timeline</span>
                    <span className="font-bold text-slate-900 text-sm">{result.startDate} - {result.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Issue Date</span>
                    <span className="font-bold text-slate-900">{result.issueDate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Validate;