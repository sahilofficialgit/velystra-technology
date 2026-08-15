// src/pages/Verify.jsx
import { useState, useRef } from 'react';
import { ShieldCheck, Search, Info, CheckCircle, Lock, AlertCircle, User, Award, CreditCard, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Verify = () => {
  const [certId, setCertId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState(''); 
  
  const certificateRef = useRef();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setIsVerifying(true); setResult(null); setError(null); setPaymentSuccess(false);
    
    try {
      const response = await fetch(`http://localhost:5000/api/check-status/${certId}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Verification failed. Please check the ID.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePayment = async () => {
    try {
      const orderRes = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 150, regId: certId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Payment initialize nahi ho payi.");
        return;
      }

      const options = {
        key: "rzp_test_TQ2XYIDcQnSoSL", // <-- APNI RAZORPAY KEY YAHAN DAALEIN
        amount: orderData.order.amount,
        currency: "INR",
        name: "Velystra Technology",
        description: "Official Certificate Unlock",
        order_id: orderData.order.id,
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:5000/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              regId: certId
            }),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            setCertificateId(verifyData.certId);
            setIssueDate(verifyData.issueDate);
            setPaymentSuccess(true);
            alert("Payment Successful! Aapka Certificate taiyaar hai.");
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: result?.user?.name || "Student",
          email: result?.user?.email || "student@gmail.com",
        },
        theme: { color: "#2563EB" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleDownloadPDF = () => {
    const element = certificateRef.current;
    element.style.display = 'block';
    
    const opt = {
      margin: 0,
      filename: `${result.user.name}_Velystra_Certificate.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { unit: 'px', format: [1123, 794], orientation: 'landscape' }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      element.style.display = 'none'; 
    });
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
            Certificate & Status Verification
          </h1>
          <p className="text-slate-600 text-lg">
            Enter your Registration ID to check status and unlock your certificate.
          </p>
        </div>

        {/* VERIFICATION BOX */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certId" className="block text-sm font-medium text-slate-700 mb-2">Registration ID</label>
              <div className="relative">
                <Search size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value.toUpperCase())} 
                  className="block w-full pl-10 pr-3 py-3.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase"
                  placeholder="e.g. VT-FE-26-000"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isVerifying || !certId.trim()} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
              {isVerifying ? 'Verifying Data...' : 'Check Status'}
            </button>
          </form>

          {/* RESULTS SECTION */}
          <div className="mt-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={20} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {result && !error && (
              <div className={`p-6 border rounded-xl ${result.isCompleted ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-4 mb-6 border-b pb-6 border-slate-200/50">
                  <div className={`p-3 rounded-full shrink-0 ${result.isCompleted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {result.isCompleted ? <CheckCircle size={24} /> : <Info size={24} />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${result.isCompleted ? 'text-green-900' : 'text-amber-900'}`}>{result.message}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm flex items-center gap-2 text-slate-700"><User size={14} className="text-slate-400"/> <strong>Name:</strong> {result.user.name}</p>
                      <p className="text-sm flex items-center gap-2 text-slate-700"><Award size={14} className="text-slate-400"/> <strong>Domain:</strong> {result.user.domain}</p>
                    </div>
                  </div>
                </div>

                {result.isCompleted && (
                  <div className="space-y-4">
                    {!paymentSuccess ? (
                      <button onClick={handlePayment} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                        <CreditCard size={18} /> Unlock Digital Certificate 🔓 (₹150)
                      </button>
                    ) : (
                      <button onClick={handleDownloadPDF} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md">
                        <Download size={18} /> Download Certificate (PDF)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🛑 VELYSTRA CUSTOM TEMPLATE DESIGN (HIDDEN) 🛑 */}
      {/* ======================================================== */}
      {result && (
        <div style={{ display: 'none' }}>
           <div 
             ref={certificateRef}
             style={{
               width: '1123px', // A4 Landscape width
               height: '794px', // A4 Landscape height
               position: 'relative',
               fontFamily: "'Montserrat', 'Arial', sans-serif", // Clean professional font
               backgroundImage: 'url("/template.png")', 
               backgroundSize: '100% 100%',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
               backgroundColor: '#fff'
             }}
           >
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
               
               {/* 1. CERTIFICATE ID (Top Right corner) */}
               <div style={{ position: 'absolute', top: '10%', right: '4%', width: '15%', textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0a192f' }}>
                 {certificateId}
               </div>

               {/* 2. NAME (Center Big Line) */}
               <div style={{ position: 'absolute', top: '43.5%', left: '0', width: '100%', textAlign: 'center', fontSize: '42px', fontWeight: 'bold', color: '#0a192f', textTransform: 'uppercase', letterSpacing: '2px' }}>
                 {result.user.name}
               </div>

               {/* 3. DURATION (Extracts only number, e.g. "1 Month" -> "1") */}
               <div style={{ position: 'absolute', top: '54%', left: '40.5%', width: '2.5%', textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0a192f' }}>
                 {String(result.user.duration).replace(/[^0-9]/g, '')}
               </div>

               {/* 4. DOMAIN (Web Development, etc.) */}
               <div style={{ position: 'absolute', top: '53.5%', left: '57.5%', width: '25%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>
                 {result.user.domain}
               </div>

               {/* 5. START DATE */}
               <div style={{ position: 'absolute', top: '57.5%', left: '36.5%', width: '22%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>
                 {result.user.startDate}
               </div>

               {/* 6. END DATE */}
               <div style={{ position: 'absolute', top: '57.5%', left: '61.5%', width: '23%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>
                 {result.user.endDate}
               </div>

               {/* 7. ISSUE DATE (Bottom Right) */}
               <div style={{ position: 'absolute', top: '80%', right: '17%', width: '18%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>
                 {issueDate}
               </div>

             </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Verify;