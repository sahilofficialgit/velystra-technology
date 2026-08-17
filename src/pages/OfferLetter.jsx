// src/pages/OfferLetter.jsx
import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const OfferLetter = () => {
  const [regId, setRegId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const offerRef = useRef();

  useEffect(() => {
    const idFromUrl = searchParams.get('regId');
    if (idFromUrl) {
      setRegId(idFromUrl);
      autoSearch(idFromUrl);
    }
  }, [searchParams]);

  const autoSearch = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://velystra-backend.onrender.com/api/check-status/${id}`);
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      } else {
        alert("Invalid Registration ID");
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (regId) autoSearch(regId);
  };

  const downloadOffer = () => {
    if (!offerRef.current) return;
    
    // Temporarily show the template for PDF generation
    offerRef.current.style.display = 'block';
    
    const opt = {
      filename: `Velystra_Offer_Letter_${userData?.name || 'Intern'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'px', format: [1123, 794], orientation: 'landscape' }
    };

    html2pdf().from(offerRef.current).set(opt).save().then(() => {
      offerRef.current.style.display = 'none';
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Velystra Portal</h2>
        <p className="text-slate-400 text-sm mb-6">Enter your Registration ID to download your official offer letter.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input 
            value={regId} 
            onChange={(e) => setRegId(e.target.value)} 
            placeholder="e.g. VTFE26123456" 
            className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-semibold transition">
            {loading ? 'Loading...' : 'Verify'}
          </button>
        </form>

        {userData && (
          <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-left">
            <p className="text-sm text-slate-400">Name: <span className="text-white font-medium">{userData.name}</span></p>
            <p className="text-sm text-slate-400">Domain: <span className="text-white font-medium">{userData.domain}</span></p>
            <p className="text-sm text-slate-400">Duration: <span className="text-white font-medium">{userData.duration}</span></p>
            
            <button onClick={downloadOffer} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg">
              <Download size={18}/> Download Offer Letter PDF
            </button>
          </div>
        )}
      </div>

      {/* HIDDEN TEMPLATE FOR PDF GENERATION (Landscape A4 Dimensions) */}
      <div 
        ref={offerRef} 
        style={{ 
          display: 'none', 
          width: '1123px', 
          height: '794px', 
          position: 'relative', 
          backgroundImage: 'url("/offer-template.png")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif'
        }}
      >
        {/* Dynamic Fields Placement (Adjust top & left according to your template design) */}
        <div style={{ position: 'absolute', top: '310px', left: '140px', fontSize: '24px', fontWeight: 'bold', color: '#0A192F' }}>
          {userData?.name}
        </div>
        <div style={{ position: 'absolute', top: '360px', left: '140px', fontSize: '20px', color: '#334155' }}>
          {userData?.domain} Internship
        </div>
        <div style={{ position: 'absolute', top: '410px', left: '140px', fontSize: '18px', color: '#334155' }}>
          Duration: {userData?.duration} | Start Date: {userData?.startDate}
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;