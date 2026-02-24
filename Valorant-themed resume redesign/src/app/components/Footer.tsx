import { Github, Linkedin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-val-red/20">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-val-red/40 to-transparent" />
      <div className="bg-val-darker py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-val-gray tracking-widest"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
            >
              JOSEPH POGUE &middot; 2026
            </span>
          </div>

          <div
            className="text-val-gray/40 tracking-[0.3em]"
            style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem" }}
          >
            // BUILDING RELIABLE SYSTEMS
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-val-gray hover:text-val-red transition-colors group"
            >
              <Github className="w-4 h-4" />
              <span
                className="tracking-widest"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
              >
                GITHUB
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-val-gray hover:text-val-red transition-colors group"
            >
              <Linkedin className="w-4 h-4" />
              <span
                className="tracking-widest"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem" }}
              >
                LINKEDIN
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
