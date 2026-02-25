# Resume Website — Project Guide

## Vision

This is a personal website with **two distinct profile modes** that a visitor can toggle between:

1. **Career/Recruiter Mode** — a professional resume-style presentation, clean and recruiter-friendly, focused on work history, skills, and projects.
2. **Player/Hobby Mode** — a gaming-themed (Valorant aesthetic) profile showcasing personal interests, hobbies, and personality.

The mode toggle is stored in `localStorage` and applied via a `data-recruiter="true"` attribute on `<html>`. Elements use `.career-only` / `.player-only` CSS classes to show/hide content per mode.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Database**: Prisma + SQLite (via libsql adapter)
- **Styling**: Tailwind CSS 3 + custom CSS variables in `globals.css`
- **Icons**: Lucide React
- **PDF Export**: `@react-pdf/renderer`
- **AI Parsing**: Claude API (used server-side for document parsing on import)
- **Animations**: CSS keyframes only — no framer-motion

---

## Architecture Overview

```
src/app/
  (public)/          # Visitor-facing pages
    layout.tsx       # 'use client' navbar wrapper with mode toggle
    page.tsx         # Home — dual hero (CareerHero / AgentCardHero)
    resume/          # Public resume view
    missions/        # Projects list + detail pages
    loadout/         # Skills / tech stack display
    hobbies/         # Hobby/interest profile (gaming-themed)
    contact/         # Contact form
  admin/             # Protected dashboard (JWT auth)
    login/
    (dashboard)/
      archive/       # Career data CRUD (experiences, skills, projects, etc.)
      loadouts/      # Resume "loadouts" — curated subsets of archive data
      import/        # Import from Google Drive (Claude parses the doc)
      export/        # Generate PDFs from loadouts
```

---

## Career/Resume System

### The Core Idea
Career data is stored in a **private Archive** and then selectively surfaced via **Loadouts**. This lets you maintain one master database of your history and create tailored resume views for different job types (e.g., "Data Analyst Loadout" vs "Infrastructure Engineer Loadout").

### Archive (the data layer)
The archive is the complete, private database of your career information:
- **Experiences** — jobs with role, company, dates, description, and bullet points
- **Skills** — individual skills with group, proficiency level, and tags
- **Projects** — with pitch, case study, tech stack, GitHub/demo URLs
- **Education** — school, degree, GPA, honors
- **Certifications** — issuer, date, expiry, credential URL
- **Leadership** — orgs, roles, and bullet points

Each entry can be edited via the admin Archive tab. Bullet points on experiences have their own sub-editor at `/admin/archive/experiences/[id]`.

### Loadouts (the resume layer)
A **Loadout** is a named, curated subset of archive data assembled for a specific job target. It has:
- A name and slug (e.g., `data-analyst`, `infra-engineer`)
- Export rules (max bullets per role, max projects, font scale range)
- A template ID (determines PDF layout)
- Items drawn from the Archive via the `LoadoutItem` join table

Loadouts are managed at `/admin/loadouts`. Each loadout can be exported as a one-page PDF.

### Import Flow (AI-powered)
The Import page (`/admin/import`) connects to Google Drive (OAuth). You pick a document (resume, bio, freeform text blob, etc.) and Claude parses it into structured data across all archive categories. You then review the parsed items, select what to keep, and commit them to the archive. This is the primary way to get data in quickly.

**To add text blob import** (future): the same `/api/drive/import` API can be extended to accept raw text directly, bypassing the Drive picker.

### Export
The Export page (`/admin/export`) lists all loadouts and lets you download a one-page PDF for any of them. PDFs are generated via `@react-pdf/renderer` server-side at `/api/pdf/[loadoutId]`. Multiple PDF templates are available (e.g., `ats-classic`), each with an ATS score rating.

---

## Hobby/Player Profile

### The Idea
The hobby side uses the same Valorant gaming aesthetic as the rest of the site's "Player Mode." It shows who you are outside of work — interests, games, activities, communities — presented as an operator profile or mission log.

### Current State
`/hobbies` exists with placeholder content (`// HOBBY NAME`). The data is currently hardcoded in the page file.

### Future Direction
- Hobbies/interests should be manageable from the admin (similar to the Archive) so they can be updated without touching code
- Each hobby could have: category label, title, description, tags, and optionally an image or icon
- The gaming theme should lean into Valorant UI language: `// CATEGORY` headers, clip-path cards, tactical grid backgrounds, `#hashtag` style tags

---

## Design System (Valorant Theme)

### CSS Variables
```
--bg:      #0f1923   (dark navy background)
--surface: #1a2332   (card/panel background)
--border:  rgba(255,70,85,0.2)
--accent:  #ff4655   (red — primary highlight)
--accent2: #00ffff   (cyan — secondary)
--text:    #ece8e1   (off-white body text)
--muted:   #7b8ea0   (gray secondary text)
--darker:  #0a1017
```

### Fonts (loaded via next/font/google)
- **Orbitron** — headings, h1/h2, stat numbers
- **Rajdhani** — body text, buttons
- **Share Tech Mono** — monospace labels, `// COMMENTS`, `#tags` (`--font-mono-val`)

### Reusable Components
- `TacticalGrid` — HUD-style background with grid, corner brackets, crosshair
- `SectionHeader` — `// LABEL` + red line + title + subtitle
- `AgentCardHero` — Player mode hero with rotating HUD rings and entrance animations
- `MissionCard` — Project card with OPERATION codename bar and hover accents
- `clip-corner` / `clip-corner-tr` — CSS clip-path utilities for angled card corners

### Animations
Defined as keyframes in `globals.css`: `fade-up`, `spin-slow`, `cornerBlink`
Applied via: `.anim-fade-up`, `.anim-delay-1` through `.anim-delay-N`

---

## Admin System

- Protected by JWT middleware — login at `/admin/login`
- All admin pages live under `/admin/(dashboard)/` with a shared layout
- The admin sees the raw archive data and can edit anything Claude extracted during import
- Context notes (AI-generated summaries per entity) are stored alongside records and can be reviewed/edited

---

## Key Conventions

- **No framer-motion** — all animations are pure CSS
- **Dual-mode rendering** uses `.career-only` / `.player-only` classes, not separate routes
- **`data-recruiter` attribute** on `<html>` is the source of truth for active mode
- **Import first, curate second** — the intended workflow is: dump text → Claude parses → admin reviews → build loadout → export PDF
- **Loadouts are job-specific** — one loadout per target role type, not one global resume
- **Hobbies are player-mode content** — always shown in gaming aesthetic regardless of mode toggle (hobbies page is player-only context)
