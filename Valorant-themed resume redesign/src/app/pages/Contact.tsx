import { useState } from "react";
import { motion } from "motion/react";
import {
  Send,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  MapPin,
  Clock,
  Terminal,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { TacticalGrid } from "../components/TacticalGrid";
import { SectionHeader } from "../components/SectionHeader";

export function Contact() {
  const [formData, setFormData] = useState({
    callsign: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ callsign: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 border-b border-val-red/10">
        <TacticalGrid />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeader
            label="// COMMS CHANNEL"
            title="Mission Briefing"
            subtitle="Initiate secure communication — let's discuss your next operation"
          />
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="p-5 border border-val-red/10 bg-val-navy/20 group hover:border-val-red/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-4 h-4 text-val-red" />
                  <span
                    className="text-val-red tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    PRIMARY CHANNEL
                  </span>
                </div>
                <p className="text-val-cream" style={{ fontSize: "0.95rem" }}>
                  joseph@pogue.dev
                </p>
              </div>

              <div className="p-5 border border-val-red/10 bg-val-navy/20 group hover:border-val-red/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-4 h-4 text-val-red" />
                  <span
                    className="text-val-red tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    BASE OF OPERATIONS
                  </span>
                </div>
                <p className="text-val-cream" style={{ fontSize: "0.95rem" }}>
                  San Francisco, CA
                </p>
                <p className="text-val-gray/50" style={{ fontSize: "0.8rem" }}>
                  Open to remote missions worldwide
                </p>
              </div>

              <div className="p-5 border border-val-red/10 bg-val-navy/20 group hover:border-val-red/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-4 h-4 text-val-red" />
                  <span
                    className="text-val-red tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    RESPONSE TIME
                  </span>
                </div>
                <p className="text-val-cream" style={{ fontSize: "0.95rem" }}>
                  Within 24 hours
                </p>
                <p className="text-val-gray/50" style={{ fontSize: "0.8rem" }}>
                  Typically responds within a few hours
                </p>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="text-val-gray/40 tracking-[0.2em] mb-4"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
              >
                SECURE CHANNELS
              </div>
              <div className="space-y-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-val-red/10 bg-val-navy/10 hover:border-val-red/30 hover:bg-val-red/5 transition-all group"
                >
                  <Github className="w-4 h-4 text-val-gray group-hover:text-val-red transition-colors" />
                  <span className="text-val-cream" style={{ fontSize: "0.85rem" }}>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-val-gray/40 ml-auto group-hover:text-val-red transition-colors" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-val-red/10 bg-val-navy/10 hover:border-val-red/30 hover:bg-val-red/5 transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-val-gray group-hover:text-val-red transition-colors" />
                  <span className="text-val-cream" style={{ fontSize: "0.85rem" }}>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-val-gray/40 ml-auto group-hover:text-val-red transition-colors" />
                </a>
              </div>
            </motion.div>

            {/* Terminal-style status */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 border border-val-red/10 bg-val-darker"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3 h-3 text-val-red" />
                <span
                  className="text-val-gray/40 tracking-wider"
                  style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                >
                  SYSTEM STATUS
                </span>
              </div>
              <div className="space-y-1.5" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
                <div className="text-green-400">
                  <span className="text-val-gray/40">[SYS]</span> Agent online
                </div>
                <div className="text-val-gray/50">
                  <span className="text-val-gray/40">[NET]</span> All channels operational
                </div>
                <div className="text-val-gray/50">
                  <span className="text-val-gray/40">[SEC]</span> Comms encrypted
                </div>
                <div className="text-val-red">
                  <span className="text-val-gray/40">[MSG]</span> Ready to receive_
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="border border-val-red/10 bg-val-navy/20">
              {/* Form header */}
              <div className="px-6 py-4 bg-val-red/5 border-b border-val-red/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-val-red" />
                  <span
                    className="text-val-red tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    TRANSMISSION FORM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span
                    className="text-green-400"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                  >
                    SECURE
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-val-gray/60 tracking-[0.15em] mb-2"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                    >
                      CALLSIGN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.callsign}
                      onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-val-dark/60 border border-val-red/15 px-4 py-3 text-val-cream placeholder-val-gray/30 focus:border-val-red/50 focus:outline-none transition-colors"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-val-gray/60 tracking-[0.15em] mb-2"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                    >
                      COMMS FREQUENCY *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full bg-val-dark/60 border border-val-red/15 px-4 py-3 text-val-cream placeholder-val-gray/30 focus:border-val-red/50 focus:outline-none transition-colors"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-val-gray/60 tracking-[0.15em] mb-2"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    MISSION SUBJECT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="What's the mission?"
                    className="w-full bg-val-dark/60 border border-val-red/15 px-4 py-3 text-val-cream placeholder-val-gray/30 focus:border-val-red/50 focus:outline-none transition-colors"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-val-gray/60 tracking-[0.15em] mb-2"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    BRIEFING DETAILS *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide mission details..."
                    className="w-full bg-val-dark/60 border border-val-red/15 px-4 py-3 text-val-cream placeholder-val-gray/30 focus:border-val-red/50 focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-val-gray/30"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                  >
                    * REQUIRED FIELDS
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-val-red text-white tracking-[0.2em] hover:bg-val-red/90 transition-colors"
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: "0.85rem",
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    TRANSMIT
                  </button>
                </div>

                {/* Success message */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-400/10 border border-green-400/30"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div
                        className="text-green-400 tracking-wider"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
                      >
                        TRANSMISSION SUCCESSFUL
                      </div>
                      <div className="text-val-gray/50" style={{ fontSize: "0.8rem" }}>
                        Message received. Expect a response within 24 hours.
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
