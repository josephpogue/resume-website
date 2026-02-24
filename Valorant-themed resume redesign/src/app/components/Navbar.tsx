import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "RESUME", path: "/resume" },
  { label: "MISSIONS", path: "/missions" },
  { label: "CONTACT", path: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Red top line */}
      <div className="h-[2px] bg-val-red" />
      <div className="bg-val-darker/90 backdrop-blur-md border-b border-val-red/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Crosshair className="w-5 h-5 text-val-red group-hover:rotate-90 transition-transform duration-500" />
            <span
              className="tracking-[0.3em] text-val-cream"
              style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
            >
              JOSEPH
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 tracking-[0.15em] transition-colors duration-300 ${
                    isActive ? "text-val-red" : "text-val-gray hover:text-val-cream"
                  }`}
                  style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem" }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-val-red"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-green-400 tracking-widest"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
              >
                ONLINE
              </span>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-val-cream"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-val-darker/95 backdrop-blur-md border-b border-val-red/20"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 tracking-[0.15em] border-l-2 transition-all ${
                      isActive
                        ? "text-val-red border-val-red bg-val-red/5"
                        : "text-val-gray border-transparent hover:text-val-cream hover:border-val-gray"
                    }`}
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
