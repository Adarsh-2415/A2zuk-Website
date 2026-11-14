# Git, DevOps & Deployment Engineering

## 1. Version Control & Git Discipline

Git provides a deterministic historical ledger of system evolution. Clear commit discipline and branching workflows ensure collaboration velocity while preventing regressions.

### Branching Strategy
- **`main` / `trunk` Branch:** The production-ready source of truth. Always deployable, passing all automated tests and static analysis checks.
- **Feature & Fix Branches:** Create short-lived branches branching off `main`:
  - `feat/<short-description>`: New functional capabilities.
  - `fix/<short-description>`: Bug remediations and patch fixes.
  - `refactor/<short-description>`: Internal code restructuring without behavioral alterations.
  - `chore/<short-description>`: Tooling, dependency updates, and maintenance.
- **Pull Request (PR) Discipline:**
  - Keep PRs small and focused (ideally under 400 lines of diff).
  - Every PR must pass automated CI checks (linting, type checking, test suites, build validation) before merge approval.

### Conventional Commits
Write imperative, atomic commit messages following the Conventional Commits specification:
```text
<type>(<optional-scope>): <imperative-summary>

[optional body explaining motivation and architectural context]

[optional footer referencing issue or breaking change]
```
- *Examples:*
  - `feat(auth): implement rate limiting on login endpoint`
  - `fix(checkout): resolve price calculation discrepancy on multi-currency orders`
  - `refactor(database): decouple user repository from direct ORM models`

---

## 2. Environment Lifecycle & Separation

Maintain strict physical and logical separation across environments:

| Environment | Purpose | Access & Data Rules |
| :--- | :--- | :--- |
| **Local (Dev)** | Active local feature development, unit testing, rapid iteration. | Ephemeral mock data; local environment variables (`.env.local`). |
| **Preview / Staging** | Mirror of production environment for integration testing, QA verification, and pre-release audits. | Sanitized seed data; staging third-party sandboxes (Stripe test mode, test SMTP). |
| **Production** | Live system serving real end-users and handling actual business transactions. | Strict least-privilege access; encrypted secrets; real customer data subject to privacy rules. |

---

## 3. Configuration & Secrets Management

- **The Twelve-Factor Config Rule:** Store application configuration in environment variables, completely decoupled from application code.
- **Hierarchical Config Validation:**
  - Parse and validate all required environment variables at application startup.
  - Crash immediately with an informative message if mandatory configuration variables (database credentials, API keys) are missing or malformed, preventing partially configured runtimes.
- **Strict Secret Isolation:** Never pass production secrets into preview or staging builds. Rotate API keys and service tokens on scheduled cycles and immediately upon potential compromise.

---

## 4. Continuous Integration & Deployment (CI/CD)

### The Continuous Delivery Pipeline
1. **Lint & Static Analysis:** Verify code formatting, enforce lint rules, run strict type checks.
2. **Automated Testing:** Execute unit tests, integration tests, and security dependency audits in parallel.
3. **Build Artifact Generation:** Compile optimized production bundles; ensure builds are reproducible and generate checksum-verified assets.
4. **Staging Verification:** Automatically deploy approved builds to staging for end-to-end smoke testing.
5. **Production Release Gates:** Deploy to production using zero-downtime release strategies (blue-green or rolling releases).

### Safe Database Migrations & Deployment Sequencing
Schema migrations and code deployments must be decoupled to prevent downtime:
- **Expand-and-Contract (Parallel Run) Pattern:**
  1. *Phase 1 (Expand):* Add new columns or tables in a backwards-compatible manner (nullable or with safe defaults). Old code continues to run safely.
  2. *Phase 2 (Deploy):* Deploy the new application version that writes to both old and new structures, or exclusively reads from the new structure.
  3. *Phase 3 (Contract):* Once verified in production, run a follow-up migration to remove old deprecated columns or legacy tables.
- **Never Run Breaking DDL on Active Tables:** Avoid blocking table locks (`ALTER TABLE ... ADD COLUMN` with complex locks) during peak traffic hours.

---

## 5. Rollback Planning & Operational Safety

- **Every Deployment Must Have a Rollback Plan:** Before releasing changes, define the exact procedure to revert the deployment if critical defects emerge.
- **Stateless Quick Rollbacks:** Maintain prior immutable release containers or build artifacts so that reverting is an instantaneous pointer shift rather than a full re-compilation.
- **Destructive Operations Guardrail:**
  - Never execute irreversible file deletion, production database drops, or bulk records purging without explicit confirmation, verified backups, and formal stakeholder approval.
  - Always verify command context before executing operational scripts against remote systems.

---

## 6. Observability, Logging & Incident Response

- **Centralized Structured Logging:** Output logs in structured JSON format including timestamps, log levels (`INFO`, `WARN`, `ERROR`), service identifiers, and request correlation IDs.
- **Error Tracking & Alerting:** Integrate centralized error monitoring to automatically aggregate uncaught exceptions with breadcrumbs, stack traces, and release tags.
- **Incident Severity Levels:**
  - **SEV-1 (Critical):** Core customer workflows unavailable (e.g., checkout offline, total site outage). Immediate incident response team activation.
  - **SEV-2 (Major):** Significant feature degraded with no simple workaround for affected users.
  - **SEV-3 (Minor):** Non-critical bug or visual glitch with an available workaround.
