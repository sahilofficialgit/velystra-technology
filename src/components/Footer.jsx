// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { SITE_CONFIG } from "../config/constants";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-white tracking-tight mb-4">
              VELYSTRA <span className="text-blue-500">TECHNOLOGY</span>
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Learn • Compete • Succeed
            </p>
            <p className="text-sm text-slate-500">
              Building practical skills through hands-on projects and developer
              communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/internships"
                  className="hover:text-blue-400 transition-colors"
                >
                  Internships
                </Link>
              </li>
              <li>
                <Link
                  to="/challenges"
                  className="hover:text-blue-400 transition-colors"
                >
                  Coding Challenges
                </Link>
              </li>
              <li>
                <Link
                  to="/verify"
                  className="hover:text-blue-400 transition-colors"
                >
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com/company/velystra-technology/"
                  className="hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="t.me/velystra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Discord (Coming Soon)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Velystra Technology. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
