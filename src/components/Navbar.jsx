import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../assets/logo.png.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("velystra_token"));
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // Keep tracking token changes across components/tabs if needed
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("velystra_token"));
    };
    window.addEventListener("storage", handleStorageChange);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
    { name: "Challenges", path: "/challenges" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleDashboardRedirect = () => {
    if (role === 'COLLEGE_ADMIN') {
      navigate('/college-dashboard');
    } else if (role === 'STUDENT') {
      navigate('/student-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-neutral-800 py-3"
          : "bg-black border-b border-neutral-900 py-4"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left: Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src={logo}
              alt="Velystra Logo"
              className="h-8 w-auto object-contain filter invert"
            />
            <span className="text-xl font-extrabold tracking-tight hidden sm:block font-mono">
              VELYSTRA <span className="text-neutral-400 font-light">TECHNOLOGY</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-widest transition-colors hover:text-white ${
                    isActive ? "text-white font-bold" : "text-neutral-400"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Dynamic Action (Dashboard if logged in, Sign In/Get Started if logged out) */}
          <div className="flex items-center gap-3">
            {token ? (
              <button
                onClick={handleDashboardRedirect}
                className="hidden md:inline-block bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg font-mono"
              >
                Dashboard ↗
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/signup"
                  className="hidden md:inline-block text-neutral-400 hover:text-white text-xs font-mono uppercase tracking-wider px-4 py-2"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="hidden md:inline-block bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg font-mono"
                >
                  Get Started
                </NavLink>
              </div>
            )}

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black border-b border-neutral-800 shadow-2xl">
          <div className="px-4 py-6 space-y-3 flex flex-col font-mono">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-xs uppercase tracking-wider ${
                    isActive
                      ? "text-white bg-neutral-900 border border-neutral-800"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-950"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="pt-4 border-t border-neutral-800 space-y-2">
              {token ? (
                <button
                  onClick={() => { setIsOpen(false); handleDashboardRedirect(); }}
                  className="w-full text-center bg-white text-black font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition"
                >
                  Go to Dashboard ↗
                </button>
              ) : (
                <>
                  <NavLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-neutral-300 bg-neutral-900 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-neutral-800"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center bg-white text-black font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl"
                  >
                    Get Started
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;