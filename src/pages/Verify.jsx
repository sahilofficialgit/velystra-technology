// src/pages/Verify.jsx
import { useState } from 'react';
import { ShieldCheck, Search, Info, CheckCircle, Lock } from 'lucide-react';

const Verify = () => {
  const [certId, setCertId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    // Simulate API call delay for realism
    setIsVerifying(true);
    setShowResult(false);
    
    setTimeout(() => {
      setIsVerifying(false);
      setShowResult(true);
    }, 1200);

    // TODO FOR LATER (Backend Integration):
    // try {
    //   const response = await fetch(`/api/verify/${certId}`);
    //   const data = await response.json();
    //   setResult(data);
    // } catch (error) { ... }
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-72px)] py-12 md:py-20 flex flex-col items-center">
      
      <div className="w-full max-w-2xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ShieldCheck size={32} className="text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Certificate Verification
          </h1>
          <p className="text-slate-600 text-lg">
            Enter your unique Certificate ID to verify the authenticity of a Velystra Technology internship certificate.
          </p>
        </div>

        {/* VERIFICATION BOX */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-10 relative overflow-hidden">
          
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certId" className="block text-sm font-medium text-slate-700 mb-2">
                Certificate ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="certId"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-slate-900 font-mono text-sm uppercase"
                  placeholder="e.g. VELY-2026-XXXX"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Lock size={12} /> Secure 256-bit verification portal
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !certId.trim()}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${
                isVerifying || !certId.trim()
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </form>

          {/* RESULT PLACEHOLDER */}
          {showResult && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 animate-fade-in">
              <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">System Update in Progress</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  The certificate verification system is currently being prepared. Once the backend infrastructure is deployed, this portal will display the complete candidate profile and verified credentials for ID: <strong className="font-mono bg-blue-100 px-1 rounded">{certId}</strong>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* TRUST BADGES */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} /> Official Records
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} /> Direct Verification
          </div>
        </div>

      </div>
    </div>
  );
};

export default Verify;