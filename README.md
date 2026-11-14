# A2ZUK — Online Contest Platform

A public-facing online contest platform, initially focused on India, designed to host recurring contest campaigns starting with a premier baby photo contest.

> **Current Status:** Approved Figma Home Landing Page implemented and verified at `http://localhost:3000/`.  
> Official product subpages (Contest Details, Participant Profiles, Submission Forms, and Backend Services) remain scheduled for subsequent phases.

---

## 1. Repository Structure

```
├── .env.example              # Template environment variables (safe placeholders only)
├── .gitignore                # Git exclusion rules (ignores secrets, build outputs, node_modules)
├── AGENTS.md                 # Agent and tooling operational conventions
├── README.md                 # Application documentation & developer setup guide
├── eslint.config.mjs         # ESLint 9 flat configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Package manifest and lifecycle scripts
├── package-lock.json         # Deterministic dependency lockfile
├── project-knowledge/        # Persistent engineering standards & product requirements (24 docs)
│   ├── README.md             # Master index and documentation governance
│   ├── product-requirements.md
│   ├── contest-workflows.md
│   ├── ...
├── src/
│   └── app/
│       ├── globals.css       # Tailwind CSS v4 directives
│       ├── layout.tsx        # Root HTML layout and baseline metadata
│       └── page.tsx          # Neutral Phase 0 setup verification page
└── tsconfig.json             # TypeScript strict mode configuration
```

---

## 2. Prerequisites

- **Node.js:** v20.x or higher (Tested and verified on `v24.13.0`)
- **Package Manager:** `npm` v10.x or higher (Tested on `npm 11.6.2`)
- **Git:** Installed and available in PATH

---

## 3. Getting Started

### 1. Clone & Install Dependencies
```bash
# Install exact dependencies from lockfile
npm install
```

### 2. Configure Environment Variables (Optional for Phase 0)
The local Phase 0 verification environment runs completely **without** requiring any external credentials.

To inspect available environment variables for future phases:
```bash
# Copy template if needed for local customization
cp .env.example .env.local
```
*(Never insert real API keys or credentials in tracked files.)*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The neutral Phase 0 setup verification page will display.

---

## 4. Quality & Build Commands

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | Start Dev Server | Launches Next.js dev server with hot-reload at `localhost:3000`. |
| `npm run build` | Production Build | Executes TypeScript checks and compiles an optimized static/SSR bundle. |
| `npm run start` | Production Server | Serves the compiled production build locally. |
| `npm run lint` | ESLint Audit | Runs ESLint 9 checks across all TypeScript and React files. |

---

## 5. Technology Foundation (Verified in Phase 0)

- **Application Framework:** Next.js `16.4.2` (App Router, Turbopack)
- **UI Library:** React `19.3.0`
- **Language:** TypeScript `5.x` (Configured with `"strict": true`)
- **Styling:** Tailwind CSS `4.x`
- **Code Quality:** ESLint `9.x` with `eslint-config-next`

---

## 6. What Has NOT Yet Been Implemented (Phase Scope Boundaries)

To maintain disciplined engineering velocity and adhere to Phase 0 constraints:
- ❌ **Product UI & Pages:** Homepage, contest directory, contest details, entry profiles, submission forms, and how-it-works pages are **not yet built**.
- ❌ **Figma Design Implementation:** The approved Figma design has **not yet been implemented**.
- ❌ **Contest Business Logic:** Submission processing, automated image checks, and hybrid voting mechanics are **not yet active**.
- ❌ **Backend & Database:** Supabase, relational schemas, database migrations, and server APIs are **not yet connected**.
- ❌ **Authentication & Admin:** No admin portal, user accounts, or auth guards have been implemented.

---

## 7. Project Documentation

All system architecture, product requirements, user journeys, workflows, checklists, and decision records are maintained in [`project-knowledge/`](file:///d:/A2zuk%20Website/project-knowledge). Consult [`project-knowledge/README.md`](file:///d:/A2zuk%20Website/project-knowledge/README.md) for the master index.
