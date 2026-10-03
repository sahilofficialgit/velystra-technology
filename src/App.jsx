import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Internships from './pages/Internships';
import Challenges from './pages/Challenges';
import Verify from './pages/Verify';
import About from './pages/About';
import Contact from './pages/Contact';
import Validate from './pages/Validate';
import Apply from './pages/Apply';
import Submit from './pages/Submit';
import OfferLetter from './pages/OfferLetter';
import Leaderboard from './pages/Learderboard';
import StudentDashboard from './pages/StudentDashboard';
import CollegeDashboard from './pages/CollegeDashboard';
import AuthPortal from './pages/AuthPortal'; // Naya Auth Portal (College + Student)
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />
        
        {/* Main content area */}
        <main className="flex-grow font-sans pt-[72px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/validate" element={<Validate />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/submit" element={<Submit />} />
            
            {/* Updated Auth Routes */}
            <Route path="/login" element={<AuthPortal />} />
            <Route path="/signup" element={<AuthPortal />} />
            <Route path="/auth" element={<AuthPortal />} />

            <Route path="/offer-letter" element={<OfferLetter />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Dashboards */}
            <Route path="/velystra-root-secure-portal" element={<SuperAdminLogin />} />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/college-dashboard" element={<CollegeDashboard />} />
            <Route path="/admin-dashboard" element={<CollegeDashboard />} /> {/* Fallback mapping */}
            
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-xl text-zinc-400">Page Not Found</p>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;