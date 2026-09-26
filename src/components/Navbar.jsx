import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../assets/logo.png.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("velystra_token");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Internships", path: "/internships" },
    { name: "Challenges", path: "/challenges" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left: Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Velystra Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
              VELYSTRA <span className="text-blue-700">TECHNOLOGY</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-700 ${
                    isActive ? "text-blue-700" : "text-slate-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Only Sign Up (or Logout if logged in) */}
          <div className="flex items-center gap-3">
            {token ? (
              <button
                onClick={handleLogout}
                className="hidden md:inline-block bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-sm font-medium px-5 py-2.5 rounded-md transition-all border border-red-200"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/signup"
                className="hidden md:inline-block bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm"
              >
                Sign Up
              </NavLink>
            )}

            {/* Mobile Hamburger Icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-blue-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100">
          <div className="px-4 py-6 space-y-3 flex flex-col">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <div className="pt-4 border-t border-slate-100">
              {token ? (
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full text-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-medium px-4 py-2.5 rounded-md transition-colors"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-3 rounded-md transition-colors shadow-sm"
                >
                  Sign Up
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;