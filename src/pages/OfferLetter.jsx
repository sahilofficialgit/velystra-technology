// src/pages/OfferLetter.jsx
import { useState, useRef, useEffect } from 'react';
import { FileText, Search, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useSearchParams } from 'react-router-dom'; // URL se ID lene ke liye

const OfferLetter = () => {
  const [regId, setRegId] = useState('');
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams(); // Hook
  const offerRef = useRef();

  // 1. Agar URL mein ?regId=... hai, toh auto-search karega
  useEffect(() => {
    const idFromUrl = searchParams.get('regId');
    if (idFromUrl) {
      setRegId(idFromUrl);
      // Auto-trigger search
      autoSearch(idFromUrl);
    }
  }, [searchParams]);

  const autoSearch = async (id) => {
    const response = await fetch(`https://velystra-backend.onrender.com/api/check-status/${id}`);
    const data = await response.json();
    if(data.success) setUserData(data.user);
    else alert("Invalid ID");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    autoSearch(regId);
  };

  const downloadOffer = () => {
    offerRef.current.style.display = 'block';
    const opt = {
      filename: 'Offer_Letter.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [1123, 794], orientation: 'portrait' }
    };
    html2pdf().from(offerRef.current).set(opt).save().then(() => {
        offerRef.current.style.display = 'none';
    });
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSearch} className="mb-10">
        <input 
          value={regId} 
          onChange={(e) => setRegId(e.target.value)} 
          placeholder="Enter Reg ID" 
          className="border p-2"
        />
        <button type="submit" className="bg-slate-800 text-white p-2 ml-2">Search</button>
      </form>

      {userData && (
        <button onClick={downloadOffer} className="bg-blue-600 text-white p-2 flex items-center gap-2">
          <Download size={18}/> Download PDF
        </button>
      )}

      {/* HIDDEN TEMPLATE - Yahan apni position set kar lena */}
      <div ref={offerRef} style={{ display: 'none', width: '1123px', height: '794px', position: 'relative', backgroundImage: 'url("/offer-template.png")', backgroundSize: 'contain' }}>
        <div style={{ position: 'absolute', top: '150px', left: '100px', fontSize: '20px' }}>{userData?.name}</div>
        <div style={{ position: 'absolute', top: '200px', left: '100px', fontSize: '20px' }}>{userData?.domain}</div>
      </div>
    </div>
  );
};
export default OfferLetter;