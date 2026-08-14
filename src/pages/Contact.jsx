// src/pages/Contact.jsx
import { useState } from 'react';
import { Mail, MessageSquare, Send, Globe, Info } from 'lucide-react';
import { SITE_CONFIG } from '../config/constants';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate frontend-only form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600">
            Have questions about our internships or coding challenges? Reach out to the Velystra team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Contact Information */}
          <div className="bg-slate-900 text-white p-10 md:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="flex items-center gap-4 hover:text-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email Us</p>
                    <p className="font-medium">{SITE_CONFIG.contactEmail}</p>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-4 hover:text-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">LinkedIn</p>
                    <p className="font-medium">Velystra Technology</p>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-4 hover:text-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Telegram Community</p>
                    <p className="font-medium">@velystratechnology</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400">
                Response Time: We typically respond to queries within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            
            {/* Frontend Disclaimer */}
            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start gap-3 mb-8">
              <Info className="shrink-0 mt-0.5" size={18} />
              <p>This contact form is currently in demonstration mode. Backend email services are being configured.</p>
            </div>

            {isSent ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                <p className="text-sm">Thank you for reaching out. (Demo mode: no actual email was sent).</p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;