import { useState } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Users,
  ChevronRight,
  MapPin,
  Calendar,
  Download,
  Shield,
} from "lucide-react";
import { TacticalGrid } from "../components/TacticalGrid";
import { SectionHeader } from "../components/SectionHeader";

const tabs = [
  { id: "experience", label: "EXPERIENCES", icon: Briefcase, count: 3 },
  { id: "education", label: "EDUCATION", icon: GraduationCap, count: 2 },
  { id: "certifications", label: "CERTS", icon: Award, count: 3 },
  { id: "leadership", label: "LEADERSHIP", icon: Users, count: 2 },
];

const experiences = [
  {
    role: "Senior Infrastructure Engineer",
    company: "TechCorp Security",
    location: "San Francisco, CA",
    period: "2023 - Present",
    type: "Full-Time",
    description: "Leading cloud infrastructure initiatives and implementing zero-trust security architecture across distributed systems. Managing a team of 4 engineers.",
    achievements: [
      "Reduced infrastructure costs by 40% through optimization",
      "Implemented zero-trust architecture across 3 cloud providers",
      "Led migration of 200+ microservices to Kubernetes",
      "Achieved 99.99% uptime for critical production systems",
    ],
    tags: ["AWS", "Terraform", "Kubernetes", "Zero Trust", "Python"],
  },
  {
    role: "DevOps Engineer",
    company: "CloudScale Inc.",
    location: "Austin, TX",
    period: "2021 - 2023",
    type: "Full-Time",
    description: "Built and maintained CI/CD pipelines, managed container orchestration, and improved deployment frequency by 300%.",
    achievements: [
      "Designed CI/CD pipeline serving 50+ developers",
      "Reduced deployment time from 2 hours to 15 minutes",
      "Implemented infrastructure as code for all environments",
      "Mentored 3 junior engineers on DevOps best practices",
    ],
    tags: ["Docker", "Jenkins", "GCP", "Ansible", "Go"],
  },
  {
    role: "Security Analyst",
    company: "CyberDefense Labs",
    location: "Remote",
    period: "2019 - 2021",
    type: "Full-Time",
    description: "Conducted vulnerability assessments, implemented SIEM solutions, and developed incident response procedures.",
    achievements: [
      "Identified and mitigated 150+ security vulnerabilities",
      "Built automated security scanning pipeline",
      "Developed incident response playbook adopted company-wide",
      "Conducted 20+ penetration testing engagements",
    ],
    tags: ["SIEM", "Splunk", "Python", "Pen Testing", "OWASP"],
  },
];

const education = [
  {
    degree: "M.S. Cybersecurity",
    school: "Georgia Institute of Technology",
    period: "2017 - 2019",
    gpa: "3.9 / 4.0",
    highlights: ["Thesis: ML-Powered Network Intrusion Detection", "Graduate Research Assistant", "Dean's List - All Semesters"],
  },
  {
    degree: "B.S. Computer Science",
    school: "University of Texas at Austin",
    period: "2013 - 2017",
    gpa: "3.7 / 4.0",
    highlights: ["Minor in Mathematics", "Undergraduate Research in Distributed Systems", "ACM Chapter Vice President"],
  },
];

const certifications = [
  {
    name: "AWS Solutions Architect - Professional",
    issuer: "Amazon Web Services",
    date: "2024",
    id: "SAP-C02",
    status: "ACTIVE",
  },
  {
    name: "Certified Kubernetes Administrator",
    issuer: "Cloud Native Computing Foundation",
    date: "2023",
    id: "CKA-2023",
    status: "ACTIVE",
  },
  {
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "2022",
    id: "SY0-601",
    status: "ACTIVE",
  },
];

const leadership = [
  {
    role: "Tech Lead - Infrastructure Team",
    org: "TechCorp Security",
    period: "2024 - Present",
    description: "Leading a team of 4 infrastructure engineers, conducting architecture reviews, and establishing engineering standards.",
  },
  {
    role: "Open Source Maintainer",
    org: "CloudGuard CLI",
    period: "2022 - Present",
    description: "Maintaining an open-source cloud security scanning tool with 2K+ GitHub stars. Managing contributors and releases.",
  },
];

export function Resume() {
  const [activeTab, setActiveTab] = useState("experience");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 border-b border-val-red/10">
        <TacticalGrid />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <SectionHeader
                label="// CLASSIFIED DOSSIER"
                title="Agent Resume"
                subtitle="Full mission history and qualifications"
              />
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start md:self-auto flex items-center gap-2 px-6 py-3 border border-val-red/30 text-val-red hover:bg-val-red/10 transition-colors tracking-[0.15em] mb-12"
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.8rem",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              <Download className="w-4 h-4" />
              EXPORT PDF
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? "text-val-red border-val-red bg-val-red/5"
                    : "text-val-gray border-transparent hover:text-val-cream hover:border-val-gray/30"
                }`}
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="tracking-[0.15em]">{tab.label}</span>
                <span className="text-val-gray/40">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Experience Tab */}
          {activeTab === "experience" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.role}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border border-val-red/10 bg-val-navy/20 hover:border-val-red/25 transition-all duration-500"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-3 bg-val-red/5 border-b border-val-red/10">
                    <div className="flex items-center gap-4">
                      <span
                        className="text-val-red tracking-[0.2em]"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                      >
                        MISSION #{String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-val-gray/40 tracking-wider"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-val-gray">
                      <Calendar className="w-3 h-3" />
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}>
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-val-cream" style={{ fontSize: "1.15rem" }}>{exp.role}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-val-red flex items-center gap-1" style={{ fontSize: "0.9rem" }}>
                            <Briefcase className="w-3 h-3" /> {exp.company}
                          </span>
                          <span className="text-val-gray/50 flex items-center gap-1" style={{ fontSize: "0.8rem" }}>
                            <MapPin className="w-3 h-3" /> {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-val-gray/70 mb-5" style={{ fontSize: "0.9rem" }}>{exp.description}</p>

                    {/* Achievements */}
                    <div className="space-y-2 mb-5">
                      {exp.achievements.map((achievement) => (
                        <div key={achievement} className="flex items-start gap-3">
                          <ChevronRight className="w-3 h-3 text-val-red mt-1.5 shrink-0" />
                          <span className="text-val-gray/60" style={{ fontSize: "0.85rem" }}>{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-val-red/5 border border-val-red/15 text-val-red"
                          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-val-red/0 group-hover:bg-val-red transition-colors duration-500" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {education.map((edu, i) => (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 border border-val-red/10 bg-val-navy/20 hover:border-val-red/25 transition-all duration-500"
                  style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)" }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-val-cream" style={{ fontSize: "1.15rem" }}>{edu.degree}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <GraduationCap className="w-3 h-3 text-val-red" />
                        <span className="text-val-red" style={{ fontSize: "0.9rem" }}>{edu.school}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className="text-val-gray"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
                      >
                        {edu.period}
                      </div>
                      <div
                        className="text-val-red/60 mt-1"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                      >
                        GPA: {edu.gpa}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {edu.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-3">
                        <ChevronRight className="w-3 h-3 text-val-red mt-1.5 shrink-0" />
                        <span className="text-val-gray/60" style={{ fontSize: "0.85rem" }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-val-red/0 group-hover:bg-val-red transition-colors duration-500" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Certifications Tab */}
          {activeTab === "certifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border border-val-red/10 bg-val-navy/20 hover:border-val-red/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="px-5 py-3 bg-val-red/5 border-b border-val-red/10 flex items-center justify-between">
                    <Shield className="w-4 h-4 text-val-red" />
                    <span
                      className="px-2 py-0.5 bg-green-400/10 text-green-400 border border-green-400/30"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-val-cream mb-2" style={{ fontSize: "0.95rem" }}>{cert.name}</h3>
                    <p className="text-val-gray/60 mb-3" style={{ fontSize: "0.8rem" }}>{cert.issuer}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-val-gray/40"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                      >
                        ID: {cert.id}
                      </span>
                      <span
                        className="text-val-gray/40"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                      >
                        {cert.date}
                      </span>
                    </div>
                  </div>
                  <div className="h-[2px] bg-gradient-to-r from-val-red/0 via-val-red group-hover:via-val-red/80 to-val-red/0 transition-all duration-500" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Leadership Tab */}
          {activeTab === "leadership" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {leadership.map((lead, i) => (
                <motion.div
                  key={lead.role}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-6 border border-val-red/10 bg-val-navy/20 hover:border-val-red/25 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-val-cream" style={{ fontSize: "1.1rem" }}>{lead.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-3 h-3 text-val-red" />
                        <span className="text-val-red" style={{ fontSize: "0.9rem" }}>{lead.org}</span>
                      </div>
                    </div>
                    <span
                      className="text-val-gray shrink-0"
                      style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
                    >
                      {lead.period}
                    </span>
                  </div>
                  <p className="text-val-gray/70" style={{ fontSize: "0.9rem" }}>{lead.description}</p>
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-val-red/0 group-hover:bg-val-red transition-colors duration-500" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
