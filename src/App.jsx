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

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        {/* main flex-grow taaki content screen cover kare aur Footer hamesha neeche rahe */}
        <main className="flex-grow bg-slate-50 font-sans text-slate-800 pt-[72px]">
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
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
                <p className="text-xl text-slate-600">Page Not Found</p>
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