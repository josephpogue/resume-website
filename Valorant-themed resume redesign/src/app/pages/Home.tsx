import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ChevronRight,
  Shield,
  Code,
  Server,
  Award,
  Briefcase,
  Github,
  Linkedin,
  ExternalLink,
  Terminal,
  Zap,
  Lock,
  Database,
  Cloud,
  Network,
} from "lucide-react";
import { TacticalGrid } from "../components/TacticalGrid";
import { SectionHeader } from "../components/SectionHeader";

const stats = [
  { value: "5+", label: "YEARS OF EXPERIENCE", icon: Briefcase },
  { value: "15+", label: "PROJECTS SHIPPED", icon: Code },
  { value: "3", label: "CERTIFICATIONS", icon: Award },
  { value: "99.9%", label: "UPTIME ACHIEVED", icon: Server },
];

const skills = [
  { name: "Cloud Infrastructure", level: 92, icon: Cloud, category: "PRIMARY" },
  { name: "Network Security", level: 88, icon: Shield, category: "PRIMARY" },
  { name: "CI/CD Pipelines", level: 85, icon: Zap, category: "PRIMARY" },
  { name: "Container Orchestration", level: 90, icon: Database, category: "SECONDARY" },
  { name: "Threat Detection", level: 82, icon: Lock, category: "SECONDARY" },
  { name: "System Architecture", level: 87, icon: Network, category: "SECONDARY" },
];

const experiences = [
  {
    role: "Senior Infrastructure Engineer",
    company: "TechCorp Security",
    period: "2023 - Present",
    description: "Leading cloud infrastructure initiatives and implementing zero-trust security architecture across distributed systems.",
    tags: ["AWS", "Terraform", "Kubernetes", "Zero Trust"],
  },
  {
    role: "DevOps Engineer",
    company: "CloudScale Inc.",
    period: "2021 - 2023",
    description: "Built and maintained CI/CD pipelines, managed container orchestration, and improved deployment frequency by 300%.",
    tags: ["Docker", "Jenkins", "GCP", "Ansible"],
  },
  {
    role: "Security Analyst",
    company: "CyberDefense Labs",
    period: "2019 - 2021",
    description: "Conducted vulnerability assessments, implemented SIEM solutions, and developed incident response procedures.",
    tags: ["SIEM", "Splunk", "Python", "Penetration Testing"],
  },
];

const projects = [
  {
    codename: "OPERATION: SENTINEL",
    title: "Zero-Trust Network Architecture",
    description: "Designed and deployed a zero-trust security model across a multi-cloud environment serving 50K+ users.",
    status: "COMPLETED",
    difficulty: "HARD",
    tags: ["AWS", "Azure", "Cloudflare"],
  },
  {
    codename: "OPERATION: PHOENIX",
    title: "Disaster Recovery System",
    description: "Built an automated disaster recovery pipeline with < 5 min RTO and cross-region failover capabilities.",
    status: "COMPLETED",
    difficulty: "HARD",
    tags: ["Terraform", "Lambda", "S3"],
  },
  {
    codename: "OPERATION: GHOST",
    title: "Threat Detection Platform",
    description: "Developed a real-time threat detection system using ML-powered anomaly detection across network traffic.",
    status: "ACTIVE",
    difficulty: "EXTREME",
    tags: ["Python", "ELK Stack", "ML"],
  },
];

export function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <TacticalGrid />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-val-dark via-val-dark to-val-navy/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-val-dark to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-val-red/30 bg-val-red/5"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span
                className="text-val-red tracking-[0.25em]"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
              >
                AVAILABLE FOR OPPORTUNITIES
              </span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }}>
                <span className="text-val-cream">Joseph</span>
                <br />
                <span className="text-val-red">Pogue</span>
              </h1>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-4 mb-4"
            >
              <ChevronRight className="w-4 h-4 text-val-red" />
              <span
                className="text-val-gray tracking-[0.15em]"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(0.85rem, 2vw, 1.1rem)" }}
              >
                Infrastructure & Security Engineer
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-val-gray/70 max-w-lg mb-8"
              style={{ fontSize: "1rem" }}
            >
              Building reliable systems and securing the stack. Turning complex infrastructure challenges into elegant, battle-tested solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/resume"
                className="group relative px-8 py-3 bg-val-red text-white tracking-[0.2em] hover:bg-val-red/90 transition-colors"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.85rem",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                VIEW RESUME
              </Link>
              <Link
                to="/missions"
                className="group relative px-8 py-3 border border-val-red/40 text-val-red tracking-[0.2em] hover:bg-val-red/10 transition-colors"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.85rem",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                SEE MISSIONS
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-6 mt-10"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-val-gray hover:text-val-cream transition-colors">
                <Github className="w-4 h-4" />
                <span className="tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
                  GITHUB
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-val-gray hover:text-val-cream transition-colors">
                <Linkedin className="w-4 h-4" />
                <span className="tracking-widest" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
                  LINKEDIN
                </span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          </div>

          {/* Decorative HUD element on right */}
          <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="relative w-72 h-72"
            >
              {/* Rotating outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-val-red/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-val-red/10 rounded-full"
                style={{ borderStyle: "dashed" }}
              />
              {/* Inner content */}
              <div className="absolute inset-12 flex items-center justify-center">
                <div className="text-center">
                  <Terminal className="w-10 h-10 text-val-red mx-auto mb-2 opacity-60" />
                  <div
                    className="text-val-red/60 tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                  >
                    AGENT PROFILE
                  </div>
                  <div
                    className="text-val-gray/40 tracking-widest mt-1"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem" }}
                  >
                    LVL 25 // SENTINEL
                  </div>
                </div>
              </div>
              {/* Corner markers */}
              {[0, 90, 180, 270].map((deg) => (
                <motion.div
                  key={deg}
                  className="absolute w-3 h-3 border-t-2 border-l-2 border-val-red/40"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translate(130px, -6px)`,
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-val-red/10">
        <div className="absolute inset-0 bg-val-navy/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-6 border border-val-red/10 bg-val-dark/60 hover:border-val-red/30 transition-all duration-500"
                style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
              >
                <stat.icon className="w-5 h-5 text-val-red/40 mb-3 group-hover:text-val-red transition-colors" />
                <div
                  className="text-val-red mb-1"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.8rem" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-val-gray tracking-[0.15em]"
                  style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                >
                  {stat.label}
                </div>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-val-red/0 group-hover:border-val-red/40 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="// LOADOUT"
            title="Skills Arsenal"
            subtitle="Weapons in my engineering toolkit"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-5 border border-val-red/10 bg-val-navy/30 hover:border-val-red/30 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <skill.icon className="w-4 h-4 text-val-red" />
                    <span className="text-val-cream" style={{ fontSize: "0.95rem" }}>
                      {skill.name}
                    </span>
                  </div>
                  <span
                    className="text-val-red"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem" }}
                  >
                    {skill.level}%
                  </span>
                </div>
                {/* Skill bar */}
                <div className="h-1 bg-val-dark/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    className="h-full bg-gradient-to-r from-val-red to-val-red/60"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className="text-val-gray/40 tracking-widest"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                  >
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="relative py-24 px-6 border-t border-val-red/10">
        <div className="absolute inset-0 bg-val-navy/10" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader
            label="// DOSSIER"
            title="Combat Record"
            subtitle="Mission history and field experience"
          />
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative p-6 border border-val-red/10 bg-val-dark/40 hover:border-val-red/30 transition-all duration-500"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-val-cream" style={{ fontSize: "1.1rem" }}>{exp.role}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="w-3 h-3 text-val-red" />
                      <span className="text-val-red" style={{ fontSize: "0.85rem" }}>{exp.company}</span>
                    </div>
                  </div>
                  <span
                    className="text-val-gray shrink-0"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
                  >
                    {exp.period}
                  </span>
                </div>
                <p className="text-val-gray/70 mb-4" style={{ fontSize: "0.9rem" }}>{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-val-red/5 border border-val-red/20 text-val-red"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Left accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-val-red/0 group-hover:bg-val-red transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 text-val-red hover:text-val-cream transition-colors tracking-[0.15em]"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem" }}
            >
              VIEW FULL DOSSIER
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="// OPERATIONS"
            title="Active Missions"
            subtitle="Selected field operations and projects"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj, i) => (
              <motion.div
                key={proj.codename}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative border border-val-red/10 bg-val-navy/20 hover:border-val-red/30 transition-all duration-500 overflow-hidden"
              >
                {/* Header bar */}
                <div className="px-5 py-3 bg-val-red/5 border-b border-val-red/10 flex items-center justify-between">
                  <span
                    className="text-val-red tracking-[0.2em]"
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                  >
                    {proj.codename}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[0.55rem] tracking-wider ${
                      proj.status === "ACTIVE"
                        ? "bg-green-400/10 text-green-400 border border-green-400/30"
                        : "bg-val-gray/10 text-val-gray border border-val-gray/20"
                    }`}
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {proj.status}
                  </span>
                </div>
                {/* Body */}
                <div className="p-5">
                  <h3 className="text-val-cream mb-2" style={{ fontSize: "1.05rem" }}>{proj.title}</h3>
                  <p className="text-val-gray/60 mb-4" style={{ fontSize: "0.85rem" }}>{proj.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-val-gray/50"
                          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`tracking-wider ${
                        proj.difficulty === "EXTREME" ? "text-val-red" : "text-yellow-500"
                      }`}
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                    >
                      {proj.difficulty}
                    </span>
                  </div>
                </div>
                {/* Bottom accent */}
                <div className="h-[2px] bg-gradient-to-r from-val-red/0 via-val-red group-hover:via-val-red/80 to-val-red/0 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              to="/missions"
              className="inline-flex items-center gap-2 text-val-red hover:text-val-cream transition-colors tracking-[0.15em]"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem" }}
            >
              VIEW ALL MISSIONS
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 border-t border-val-red/10">
        <TacticalGrid />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-val-red" />
              <span
                className="text-val-red tracking-[0.3em]"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
              >
                // INITIATE CONTACT
              </span>
              <div className="w-8 h-[2px] bg-val-red" />
            </div>
            <h2 className="text-val-cream mb-4" style={{ fontSize: "1.75rem" }}>
              Ready to Deploy?
            </h2>
            <p className="text-val-gray mb-8" style={{ fontSize: "0.95rem" }}>
              Looking for an engineer who treats every system like a mission-critical operation? Let's connect.
            </p>
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-val-red text-white tracking-[0.2em] hover:bg-val-red/90 transition-colors"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.85rem",
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              }}
            >
              START MISSION BRIEFING
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}