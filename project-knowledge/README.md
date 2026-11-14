# Project Knowledge System — A2ZUK

## 1. Overview & Governance Architecture

The `project-knowledge` directory serves as the centralized, persistent knowledge base and technical governance foundation for the **A2ZUK** contest platform. It is organized into two mutually supportive pillars:

1. **Engineering Foundation & Standards:** Reusable, platform-agnostic engineering disciplines, architecture patterns, quality controls, security safeguards, and operational checklists established in Master Prompt 01.
2. **Product & Business Specifications:** Project-specific product vision, business rules, page structures, contest workflows, user personas, and decision logs established for A2ZUK in Master Prompt 02.

This directory is a **living documentation system**. It defines how engineering decisions are framed, evaluated, executed, and validated.

---

## 2. Master Document Index

### A. Product & Business Specifications (A2ZUK Platform)

| Document | Primary Domain & Purpose | When to Consult |
| :--- | :--- | :--- |
| **[`project-overview.md`](file:///d:/A2zuk%20Website/project-knowledge/project-overview.md)** | Product identity, business objectives, audience, and approved visual baseline. | Onboarding, brand alignment, vision validation. |
| **[`product-requirements.md`](file:///d:/A2zuk%20Website/project-knowledge/product-requirements.md)** | 8 core public pages, contest lifecycle phases, and non-functional requirements. | UI drafting, page component building, lifecycle modeling. |
| **[`contest-workflows.md`](file:///d:/A2zuk%20Website/project-knowledge/contest-workflows.md)** | Baby contest flow, guardian declarations, automated checks, and hybrid voting. | Workflow design, form logic, voting integration. |
| **[`users-and-user-journeys.md`](file:///d:/A2zuk%20Website/project-knowledge/users-and-user-journeys.md)** | User personas (Guardians, Voters, Visitors), journeys, and friction mitigations. | UX design, conversion flow optimization, error handling. |
| **[`business-model-and-future-scope.md`](file:///d:/A2zuk%20Website/project-knowledge/business-model-and-future-scope.md)** | Monetization channels (ads, sponsors), multi-category roadmap, and Phase 1 scope. | Scope gating, feature prioritization, roadmap planning. |
| **[`privacy-moderation-and-trust.md`](file:///d:/A2zuk%20Website/project-knowledge/privacy-moderation-and-trust.md)** | Child privacy, data segregation, reporting pathways, and voting fairness. | Privacy compliance, moderation workflows, anti-abuse. |
| **[`open-decisions.md`](file:///d:/A2zuk%20Website/project-knowledge/open-decisions.md)** | Active register of unresolved product, schedule, and legal questions (OD-01 to OD-10). | Prior to implementing any feature marked `UNDECIDED`. |
| **[`product-decisions-log.md`](file:///d:/A2zuk%20Website/project-knowledge/product-decisions-log.md)** | Historical ledger of confirmed product decisions (PD-01 to PD-08). | Verifying approved baseline features and changes. |

### B. Engineering Foundation & Standards

| Document | Primary Focus & Domain | When to Consult |
| :--- | :--- | :--- |
| **[`engineering-role.md`](file:///d:/A2zuk%20Website/project-knowledge/engineering-role.md)** | Multi-disciplinary engineering responsibilities, professional mindset, standards. | Defining team expectations, evaluating engineering rigor and scope. |
| **[`software-architecture.md`](file:///d:/A2zuk%20Website/project-knowledge/software-architecture.md)** | System design principles, modularity, boundary enforcement, scalability patterns. | Pre-implementation planning, high-level design, refactoring milestones. |
| **[`ui-ux-design.md`](file:///d:/A2zuk%20Website/project-knowledge/ui-ux-design.md)** | UI/UX principles, design systems, visual hierarchy, accessibility, user flows. | Wireframing, component design, styling, usability evaluations. |
| **[`frontend-engineering.md`](file:///d:/A2zuk%20Website/project-knowledge/frontend-engineering.md)** | Modern client architecture, state management, rendering lifecycle, forms. | Designing UI components, client-side routing, state and layout logic. |
| **[`backend-api-engineering.md`](file:///d:/A2zuk%20Website/project-knowledge/backend-api-engineering.md)** | API contracts, server-side validation, idempotency, rate limiting, error handling. | API design, service integration, business logic implementation. |
| **[`database-engineering.md`](file:///d:/A2zuk%20Website/project-knowledge/database-engineering.md)** | Relational modeling, schema integrity, indexing, transactions, migrations. | Designing entities, writing queries, planning schema changes. |
| **[`security-privacy.md`](file:///d:/A2zuk%20Website/project-knowledge/security-privacy.md)** | Threat modeling, OWASP defenses, auth/authz, input handling, data privacy. | All stages of feature design, auth flows, handling sensitive data. |
| **[`seo-search-visibility.md`](file:///d:/A2zuk%20Website/project-knowledge/seo-search-visibility.md)** | Technical SEO, semantic structure, structured data, crawler accessibility. | Page templating, metadata design, content rendering strategies. |
| **[`performance-reliability.md`](file:///d:/A2zuk%20Website/project-knowledge/performance-reliability.md)** | Core Web Vitals, asset budgets, profiling, caching, resilience patterns. | Optimization audits, scaling preparation, resource constraint analysis. |
| **[`testing-quality-assurance.md`](file:///d:/A2zuk%20Website/project-knowledge/testing-quality-assurance.md)** | Testing pyramid, static analysis, accessibility tests, defect triage. | Writing test suites, regression checks, pre-release sign-offs. |
| **[`clean-code-standards.md`](file:///d:/A2zuk%20Website/project-knowledge/clean-code-standards.md)** | Naming conventions, cognitive complexity, SOLID, refactoring guidelines. | Daily authoring, code reviews, technical debt reduction. |
| **[`git-devops-deployment.md`](file:///d:/A2zuk%20Website/project-knowledge/git-devops-deployment.md)** | Branching strategies, CI/CD, deployment sequencing, rollbacks, env vars. | Release management, operational setup, pipeline troubleshooting. |
| **[`documentation-standards.md`](file:///d:/A2zuk%20Website/project-knowledge/documentation-standards.md)** | Documentation maintenance rules, tracking open questions, ADR protocols. | Writing specifications, updating architecture logs, progress reporting. |
| **[`engineering-checklists.md`](file:///d:/A2zuk%20Website/project-knowledge/engineering-checklists.md)** | Actionable pre-flight, review, security, and verification checklists. | Before starting tasks, before committing/merging, before releases. |
| **[`architectural-decisions.md`](file:///d:/A2zuk%20Website/project-knowledge/architectural-decisions.md)** | Architecture Decision Record (ADR) template and historical log. | Whenever a non-trivial architectural, technology, or design choice is made. |

---

## 3. Relationship Between Standards and Product Requirements

The documents in this repository maintain a strict separation of concerns:
- **Product Specifications** (e.g., `product-requirements.md`, `contest-workflows.md`) define **WHAT** the platform is, who it serves, its business rules, and how the user experience behaves.
- **Engineering Standards** (e.g., `software-architecture.md`, `frontend-engineering.md`) define **HOW** any software built for this project must be structured, secured, tested, and maintained.
- **Living Maintenance Rule:** Technical choices must never override product rules without formal consultation. Product changes must be recorded in `product-decisions-log.md`, while unresolved questions are tracked in `open-decisions.md`.
