import { useState } from 'react';
import { User, Mail, Phone, Code, Send, CheckCircle, AlertCircle, Briefcase, Calendar, Info } from 'lucide-react';

const Apply = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    domain: 'Frontend Development',
    duration: '1 Month' // NAYA: Default duration
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('https://velystra-backend.onrender.com/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccessData(data.data); 
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Server connection failed. Please check your backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-72px)] py-12 md:py-20 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Briefcase size={32} className="text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Apply for Internship
          </h1>
          <p className="text-slate-600 text-lg">
            Kickstart your career with Velystra Technology's premium programs.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>

          {!successData ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter Your Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. example@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              {/* DROP-DOWN GRID (Domain & Duration) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Domain</label>
                  <div className="relative">
                    <Code size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                    <select name="domain" value={formData.domain} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white">
                      <option value="Frontend Development">Frontend</option>
                      <option value="Backend Development">Backend</option>
                      <option value="Full Stack Development">Full Stack</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute inset-y-0 left-3 top-3.5 text-slate-400" />
                    <select name="duration" value={formData.duration} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white">
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* UPDATED FEE STRUCTURE BOX (Digital Certificate is FREE) */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-2 text-sm text-blue-900">
                <h4 className="font-bold flex items-center gap-2 mb-2">
                  <Info size={16} className="text-blue-700" /> Transparent Fee Structure
                </h4>
                <p className="mb-2 text-blue-800">The internship training and digital certificate are <strong>100% Free</strong>. Optional printed/courier certificate charges apply if requested:</p>
                <ul className="list-disc ml-5 space-y-1 text-blue-800 font-medium">
                  <li><strong>1 Month:</strong> <span className="text-green-700">FREE (Digital)</span> | ₹299 (Printed + Courier)</li>
                  <li><strong>3 Months:</strong> <span className="text-green-700">FREE (Digital)</span> | ₹450 (Printed + Courier)</li>
                  <li><strong>6 Months:</strong> <span className="text-green-700">FREE (Digital)</span> | ₹700 (Printed + Courier)</li>
                </ul>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2 shadow-md">
                {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
              </button>
            </form>
          ) : (
            
            <div className="py-6 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Successful!</h2>
              <p className="text-slate-600 mb-8">Welcome to Velystra Technology. Here are your internship details:</p>
              
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-left space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Registration ID</span>
                  <span className="font-bold text-slate-900 bg-blue-100 text-blue-800 px-3 py-1 rounded-md tracking-wider">
                    {successData.regId}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Duration</span>
                  <span className="font-bold text-slate-900">{successData.duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Start Date</span>
                  <span className="font-bold text-slate-900">{successData.startDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-medium">End Date</span>
                  <span className="font-bold text-slate-900">{successData.endDate}</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mt-6">
                Please save your Registration ID. You will need it to track your tasks and generate your certificate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;