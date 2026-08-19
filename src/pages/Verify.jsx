// src/pages/Verify.jsx
import { useState, useRef } from 'react';
import { ShieldCheck, Search, Info, CheckCircle, AlertCircle, User, Award, CreditCard, Download, Truck, FileText, MapPin } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Verify = () => {
  const [certId, setCertId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [issueDate, setIssueDate] = useState(''); 
  
  // NAYA: Delivery Option & Address State
  const [deliveryOption, setDeliveryOption] = useState('digital');
  const [address, setAddress] = useState('');

  const certificateRef = useRef();

  // DYNAMIC PRICING LOGIC (Display ke liye)
  const getPrices = (durationStr = "1 Month") => {
    if (durationStr.includes("3")) return { digital: 300, printed: 450 };
    if (durationStr.includes("6")) return { digital: 500, printed: 700 };
    return { digital: 150, printed: 299 }; // Default 1 Month
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    setIsVerifying(true); 
    setResult(null); 
    setError(null); 
    setPaymentSuccess(false); 
    setCertificateId('');
    setIssueDate('');
    setAddress('');
    
    try {
      const response = await fetch(`https://velystra-backend.onrender.com/api/check-status/${certId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data);
        
        const fetchedCertId = data.user.certId ? data.user.certId.trim() : '';
        
        if (fetchedCertId !== '' && fetchedCertId.startsWith('VTCC')) {
          setCertificateId(fetchedCertId);
          setIssueDate(data.user.issueDate);
          setPaymentSuccess(true); 
        } else {
          setPaymentSuccess(false); 
        }
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
      // Agar printed option select kiya hai toh address bharna zaroori hai
      if (deliveryOption === 'printed' && !address.trim()) {
        alert("Please enter your delivery address for the printed certificate.");
        return;
      }

      const orderRes = await fetch("https://velystra-backend.onrender.com/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regId: certId, deliveryOption: deliveryOption }), 
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Payment initialize nahi ho payi.");
        return;
      }

      const options = {
        key: "rzp_live_TRLEpSR63D9D3O", // <-- AAPKI RAZORPAY KEY
        amount: orderData.order.amount,
        currency: "INR",
        name: "Velystra Technology",
        description: `${deliveryOption === 'printed' ? 'Printed + Digital' : 'Digital'} Certificate`,
        order_id: orderData.order.id,
        handler: async function (response) {
          const verifyRes = await fetch("https://velystra-backend.onrender.com/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              regId: certId,
              deliveryOption: deliveryOption,
              address: address // 📦 Address backend ko bhej diya
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
          name: "",     // Blank chhod do taaki student khud bhare
          email: "",    // Blank chhod do
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
                  onChange={(e) => setCertId(e.target.value.replace(/-/g, '').toUpperCase())} 
                  className="block w-full pl-10 pr-3 py-3.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm uppercase"
                  placeholder="e.g. VTFE26123456"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isVerifying || !certId.trim()} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
              {isVerifying ? 'Verifying Data...' : 'Check Status'}
            </button>
          </form>

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
                      <p className="text-sm flex items-center gap-2 text-slate-700"><FileText size={14} className="text-slate-400"/> <strong>Duration:</strong> {result.user.duration}</p>
                    </div>
                  </div>
                </div>

                {result.isCompleted && (
                  <div className="space-y-6">
                    {!paymentSuccess ? (
                      <>
                        {/* OPTIONS SELECTION UI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${deliveryOption === 'digital' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                            <input type="radio" name="certType" value="digital" className="hidden" checked={deliveryOption === 'digital'} onChange={() => setDeliveryOption('digital')} />
                            <Download size={24} className={deliveryOption === 'digital' ? 'text-blue-600' : 'text-slate-400'} />
                            <div className="text-center">
                              <p className="font-bold text-slate-800">Digital Only</p>
                              <p className="text-lg font-black text-blue-700">₹{getPrices(result.user.duration).digital}</p>
                            </div>
                          </label>

                          <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${deliveryOption === 'printed' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                            <input type="radio" name="certType" value="printed" className="hidden" checked={deliveryOption === 'printed'} onChange={() => setDeliveryOption('printed')} />
                            <Truck size={24} className={deliveryOption === 'printed' ? 'text-blue-600' : 'text-slate-400'} />
                            <div className="text-center">
                              <p className="font-bold text-slate-800">Digital + Printed + Courier</p>
                              <p className="text-lg font-black text-blue-700">₹{getPrices(result.user.duration).printed}</p>
                            </div>
                          </label>
                        </div>

                        {/* 📦 NAYA: Address Input Box (Sirf Printed select hone par dikhega) */}
                        {deliveryOption === 'printed' && (
                          <div className="space-y-2 animate-fade-in">
                            <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
                              <MapPin size={16} className="text-blue-600" /> Delivery Address for Printed Certificate
                            </label>
                            <textarea
                              rows="3"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Enter your full postal address with landmark and Pincode..."
                              className="block w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              required
                            />
                          </div>
                        )}

                        <button onClick={handlePayment} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md text-lg">
                          <CreditCard size={20} /> Pay ₹{deliveryOption === 'digital' ? getPrices(result.user.duration).digital : getPrices(result.user.duration).printed} to Unlock
                        </button>
                      </>
                    ) : (
                      <button onClick={handleDownloadPDF} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md text-lg">
                        <Download size={20} /> Download Digital Certificate
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
           <div ref={certificateRef} style={{ width: '1123px', height: '794px', position: 'relative', fontFamily: "'Montserrat', 'Arial', sans-serif", backgroundImage: 'url("/template.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#fff' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
               <div style={{ position: 'absolute', top: '10%', right: '4%', width: '15%', textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0a192f' }}>{certificateId}</div>
               <div style={{ position: 'absolute', top: '43.5%', left: '0', width: '100%', textAlign: 'center', fontSize: '42px', fontWeight: 'bold', color: '#0a192f', textTransform: 'uppercase', letterSpacing: '2px' }}>{result.user.name}</div>
               <div style={{ position: 'absolute', top: '54%', left: '40.5%', width: '2.5%', textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#0a192f' }}>{String(result.user.duration).replace(/[^0-9]/g, '')}</div>
               <div style={{ position: 'absolute', top: '53.5%', left: '57.5%', width: '25%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>{result.user.domain}</div>
               <div style={{ position: 'absolute', top: '57.5%', left: '36.5%', width: '22%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>{result.user.startDate}</div>
               <div style={{ position: 'absolute', top: '57.5%', left: '61.5%', width: '23%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>{result.user.endDate}</div>
               <div style={{ position: 'absolute', top: '80%', right: '17%', width: '18%', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#0a192f' }}>{issueDate}</div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Verify;