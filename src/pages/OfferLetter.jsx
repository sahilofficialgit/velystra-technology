// src/pages/OfferLetter.jsx
import { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const OfferLetter = () => {
  const [regId, setRegId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

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

  const downloadOfferPDF = () => {
    if (!userData) return;

    const img = new Image();
    img.src = '/offer-template.png';

    img.onload = () => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      doc.addImage(img, 'PNG', 0, 0, 210, 297);

      const xPercent = (percent) => (percent * 210) / 100;
      const yPercent = (percent) => (percent * 297) / 100;

      // --- Current System Date (Applied Date ke liye) ---
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

      doc.setTextColor(0, 0, 0); 
      doc.setFont("helvetica", "bold");

      // 1. Student Name
      doc.setFontSize(13);
      doc.text(userData.name || '', xPercent(15), yPercent(36.1));

      // 2. Registration ID
      doc.setFontSize(11);
      doc.text(regId || '', xPercent(78.7), yPercent(30.6)); 

      // 3. Domain
      doc.setFontSize(13);
      doc.text(userData.domain || '', xPercent(8), yPercent(42.7));

      // 4. Duration
      doc.setFontSize(12);
      const durationNum = userData.duration ? userData.duration.toString().replace(/[^0-9]/g, '') : '1';
      doc.text(durationNum, xPercent(48.5), yPercent(50));

      // 5. Original Internship Start Date & End Date (As it is backend se)
      doc.text(userData.startDate || '', xPercent(15), yPercent(52.5));
      doc.text(userData.endDate || '', xPercent(42), yPercent(52.5));

      // 6. Nayi Applied Date (Jis din user apply/download kar raha hai)
      // Yahan X aur Y percentage apne template ke hisaab se adjust kar lena jahan Applied Date dikhani hai
      doc.text(formattedDate, xPercent(17), yPercent(30)); 

      doc.save(`Velystra_Offer_Letter_${userData.name.replace(/\s+/g, '_')}.pdf`);
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-slate-700">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">Velystra Portal</h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">Enter your Registration ID to download your official offer letter.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input 
            value={regId} 
            onChange={(e) => setRegId(e.target.value)} 
            placeholder="e.g. VTFE26123456" 
            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2">
            <Search size={16}/> {loading ? 'Loading...' : 'Verify'}
          </button>
        </form>

        {userData && (
          <div className="mt-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-left space-y-2">
            <p className="text-xs sm:text-sm text-slate-400">Name: <span className="text-white font-medium">{userData.name}</span></p>
            <p className="text-xs sm:text-sm text-slate-400">Domain: <span className="text-white font-medium">{userData.domain}</span></p>
            <p className="text-xs sm:text-sm text-slate-400">Duration: <span className="text-white font-medium">{userData.duration}</span></p>
            <p className="text-xs sm:text-sm text-slate-400">Start Date: <span className="text-white font-medium">{userData.startDate || 'Current Date'}</span></p>
            <p className="text-xs sm:text-sm text-slate-400">End Date: <span className="text-white font-medium">{userData.endDate || 'Current Date'}</span></p>
            
            <button onClick={downloadOfferPDF} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg text-sm">
              <Download size={18}/> Download Offer Letter PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetter;