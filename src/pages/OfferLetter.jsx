// src/pages/OfferLetter.jsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
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

    // Load template image to ensure it draws cleanly on PDF canvas
    const img = new Image();
    img.src = '/offer-template.png';

    img.onload = () => {
      // Initialize jsPDF in A4 Portrait format (Units in millimeters: 210 x 297 mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;

      // Draw background image to fit exact A4 dimensions without cropping
      doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

      // Add dynamic text over the template using millimeter coordinates (X, Y)
      doc.setTextColor(10, 25, 47); // Dark navy color
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      
      // Name
      doc.text(userData.name || '', 35, 68);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Domain
      doc.text(userData.domain || '', 68, 79);

      // Duration & Start Date
      doc.text(`${userData.duration || '1'} Month(s)`, 42, 115);
      doc.text(userData.startDate || '', 105, 115);

      // Save the generated full-size PDF
      doc.save(`Velystra_Offer_Letter_${userData.name}.pdf`);
    };
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
            
            <button onClick={downloadOfferPDF} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg">
              <Download size={18}/> Download Offer Letter PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetter;