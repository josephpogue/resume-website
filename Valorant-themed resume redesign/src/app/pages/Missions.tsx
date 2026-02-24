import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  ChevronRight,
  Target,
  Flame,
  Zap,
  Shield,
  Globe,
  Cpu,
  Eye,
} from "lucide-react";
import { TacticalGrid } from "../components/TacticalGrid";
import { SectionHeader } from "../components/SectionHeader";

const filters = ["ALL", "COMPLETED", "ACTIVE", "CLASSIFIED"];

const missions = [
  {
    codename: "OPERATION: SENTINEL",
    title: "Zero-Trust Network Architecture",
    description:
      "Designed and deployed a zero-trust security model across a multi-cloud environment serving 50K+ users. Implemented identity-aware proxies, micro-segmentation, and continuous verification protocols.",
    status: "COMPLETED",
    difficulty: "HARD",
    icon: Shield,
    tags: ["AWS", "Azure", "Cloudflare", "Terraform", "Zero Trust"],
    metrics: { users: "50K+", uptime: "99.99%", regions: "3" },
    github: "https://github.com",
    demo: null,
  },
  {
    codename: "OPERATION: PHOENIX",
    title: "Disaster Recovery Automation",
    description:
      "Built an automated disaster recovery pipeline with < 5 min RTO and cross-region failover. Includes automated data replication, health monitoring, and one-click failover procedures.",
    status: "COMPLETED",
    difficulty: "HARD",
    icon: Flame,
    tags: ["Terraform", "Lambda", "S3", "RDS", "CloudWatch"],
    metrics: { rto: "< 5min", rpo: "< 1min", coverage: "100%" },
    github: "https://github.com",
    demo: null,
  },
  {
    codename: "OPERATION: GHOST",
    title: "Threat Detection Platform",
    description:
      "Real-time threat detection system using ML-powered anomaly detection. Processes millions of events per day with sub-second alerting for critical security incidents.",
    status: "ACTIVE",
    difficulty: "EXTREME",
    icon: Eye,
    tags: ["Python", "ELK Stack", "TensorFlow", "Kafka"],
    metrics: { events: "10M/day", latency: "< 1s", accuracy: "98.5%" },
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  {
    codename: "OPERATION: VANGUARD",
    title: "Kubernetes Platform Engineering",
    description:
      "Designed a self-service Kubernetes platform for 200+ microservices with automated scaling, canary deployments, and comprehensive observability.",
    status: "COMPLETED",
    difficulty: "HARD",
    icon: Cpu,
    tags: ["Kubernetes", "Helm", "ArgoCD", "Prometheus", "Grafana"],
    metrics: { services: "200+", deploys: "50/day", devs: "60+" },
    github: "https://github.com",
    demo: null,
  },
  {
    codename: "OPERATION: ORACLE",
    title: "Infrastructure Cost Optimizer",
    description:
      "Built an AI-powered cloud cost optimization tool that analyzes resource usage patterns and recommends right-sizing and reservation strategies.",
    status: "ACTIVE",
    difficulty: "MEDIUM",
    icon: Zap,
    tags: ["Python", "AWS", "GCP", "React", "PostgreSQL"],
    metrics: { savings: "40%", analyzed: "500+", providers: "3" },
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  {
    codename: "OPERATION: NEXUS",
    title: "Global CDN & Edge Computing",
    description:
      "Deployed a global content delivery network with edge computing capabilities, reducing latency by 70% for users across 30+ countries.",
    status: "CLASSIFIED",
    difficulty: "EXTREME",
    icon: Globe,
    tags: ["Cloudflare Workers", "Rust", "WebAssembly", "Redis"],
    metrics: { latency: "-70%", countries: "30+", requests: "1B+/mo" },
    github: null,
    demo: null,
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "EXTREME":
      return "text-val-red";
    case "HARD":
      return "text-yellow-500";
    case "MEDIUM":
      return "text-green-400";
    default:
      return "text-val-gray";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-400/10 text-green-400 border-green-400/30";
    case "COMPLETED":
      return "bg-val-gray/10 text-val-gray border-val-gray/20";
    case "CLASSIFIED":
      return "bg-val-red/10 text-val-red border-val-red/30";
    default:
      return "bg-val-gray/10 text-val-gray border-val-gray/20";
  }
}

export function Missions() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  const filteredMissions =
    activeFilter === "ALL"
      ? missions
      : missions.filter((m) => m.status === activeFilter);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 border-b border-val-red/10">
        <TacticalGrid />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeader
            label="// FIELD OPERATIONS"
            title="Mission Briefings"
            subtitle="Projects deployed in the field — each one a completed objective"
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 border transition-all duration-300 tracking-[0.15em] ${
                  activeFilter === filter
                    ? "border-val-red bg-val-red/10 text-val-red"
                    : "border-val-red/10 text-val-gray hover:border-val-red/30 hover:text-val-cream"
                }`}
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
              >
                {filter}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Target className="w-3 h-3 text-val-gray/40" />
              <span
                className="text-val-gray/40"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
              >
                {filteredMissions.length} MISSIONS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filteredMissions.map((mission, i) => (
                <motion.div
                  key={mission.codename}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative border border-val-red/10 bg-val-navy/20 hover:border-val-red/30 transition-all duration-500 cursor-pointer"
                  onClick={() =>
                    setSelectedMission(
                      selectedMission === mission.codename ? null : mission.codename
                    )
                  }
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-val-red/5 border-b border-val-red/10">
                    <div className="flex items-center gap-3">
                      <mission.icon className="w-4 h-4 text-val-red" />
                      <span
                        className="text-val-red tracking-[0.2em]"
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
                      >
                        {mission.codename}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={getDifficultyColor(mission.difficulty)}
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                      >
                        {mission.difficulty}
                      </span>
                      <span
                        className={`px-2 py-0.5 border ${getStatusColor(mission.status)}`}
                        style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.55rem" }}
                      >
                        {mission.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-val-cream mb-2" style={{ fontSize: "1.1rem" }}>
                      {mission.title}
                    </h3>
                    <p className="text-val-gray/60 mb-4" style={{ fontSize: "0.85rem" }}>
                      {mission.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {Object.entries(mission.metrics).map(([key, value]) => (
                        <div key={key} className="text-center p-2 bg-val-dark/40 border border-val-red/5">
                          <div
                            className="text-val-red"
                            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.85rem" }}
                          >
                            {value}
                          </div>
                          <div
                            className="text-val-gray/40 uppercase"
                            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem" }}
                          >
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mission.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-val-gray/40"
                          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      {mission.github && (
                        <a
                          href={mission.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-val-gray hover:text-val-red transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}>
                            SOURCE
                          </span>
                        </a>
                      )}
                      {mission.demo && (
                        <a
                          href={mission.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-val-gray hover:text-val-red transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}>
                            LIVE DEMO
                          </span>
                        </a>
                      )}
                      {mission.status === "CLASSIFIED" && (
                        <span
                          className="text-val-red/40 flex items-center gap-2"
                          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          RESTRICTED ACCESS
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="h-[2px] bg-gradient-to-r from-val-red/0 via-val-red group-hover:via-val-red/80 to-val-red/0 transition-all duration-500" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
