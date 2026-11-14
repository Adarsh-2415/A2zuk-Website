# Product Decisions Log (PDL)

This log preserves the immutable historical record of confirmed product decisions, scope definitions, and structural agreements for the A2ZUK platform.

---

## Decision Log Index

| Decision ID | Date | Title | Status | Approval Context |
| :--- | :--- | :--- | :--- | :--- |
| **PD-01** | 2026-10-22 | Premier Contest Category: Baby-First | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-02** | 2026-10-22 | Public Page Architecture (8 Core Pages) | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-03** | 2026-10-22 | No Mandatory Voter Accounts | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-04** | 2026-10-22 | Public Vote Counts Visible | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-05** | 2026-10-22 | Minimal Public Contestant Info & Guardian Privacy | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-06** | 2026-10-22 | Automatic Entry Publication After Automated Checks | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-07** | 2026-10-22 | High-Level Hybrid Voting Model | `CONFIRMED` | Master Prompt 02 Baseline |
| **PD-08** | 2026-10-22 | Approved Baseline Visual Reference (Figma) | `CONFIRMED` | Master Prompt 02 Baseline |

---

## Detailed Decision Records

### PD-01: Premier Contest Category: Baby-First
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** The initial release of A2ZUK will focus exclusively on a baby photo contest category. Future contest categories (pets, art, talent) are recognized as long-term roadmap possibilities but are strictly excluded from Phase 1 launch scope.
- **Context:** Allows the platform to build focused momentum, clear messaging, and a targeted audience in India before expanding into generic contest verticals.
- **Related Documentation:** [`project-overview.md`](file:///d:/A2zuk%20Website/project-knowledge/project-overview.md), [`business-model-and-future-scope.md`](file:///d:/A2zuk%20Website/project-knowledge/business-model-and-future-scope.md).
- **Consequences:** All initial UI copy, submission forms, legal disclaimers, and gallery aesthetics must be tailored for parents/guardians and infant photos.

---

### PD-02: Public Page Architecture (8 Core Pages)
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** The public frontend is structured across eight dedicated pages/routes:
  1. Home (`/`)
  2. Contests Directory (`/contests`)
  3. Contest Details (`/contests/[contest-slug]`)
  4. Contestant Profile (`/contests/[contest-slug]/entries/[entry-slug]`)
  5. Submit Entry (`/contests/[contest-slug]/submit`)
  6. Submission Success (`/submission-success`)
  7. How It Works (`/how-it-works`)
  8. Help and Policies (`/help/...`, `/policies/...`)
- **Context:** Avoids superfluous pages and fragmented standalone galleries. Galleries reside contextually inside individual contest details.
- **Related Documentation:** [`product-requirements.md`](file:///d:/A2zuk%20Website/project-knowledge/product-requirements.md).
- **Consequences:** Navigation bars, sitemaps, and breadcrumbs must map strictly to this information architecture.

---

### PD-03: No Mandatory Voter Accounts
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** Ordinary visitors will not be forced to register, create accounts, or log in to vote.
- **Context:** Minimizes voter drop-off and friction. Voting should be effortless for friends and family members who receive shared links.
- **Related Documentation:** [`contest-workflows.md`](file:///d:/A2zuk%20Website/project-knowledge/contest-workflows.md), [`users-and-user-journeys.md`](file:///d:/A2zuk%20Website/project-knowledge/users-and-user-journeys.md).
- **Consequences:** Anti-abuse protections cannot rely on user authentication and must leverage device/network signals, rate limits, and post-contest audits.

---

### PD-04: Public Vote Counts Visible
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** Real-time (or near real-time) public vote counts will be displayed on participant cards and profile pages.
- **Context:** Generates excitement, social proof, and viral motivation for contestants to share their profiles.
- **Related Documentation:** [`product-requirements.md`](file:///d:/A2zuk%20Website/project-knowledge/product-requirements.md), [`privacy-moderation-and-trust.md`](file:///d:/A2zuk%20Website/project-knowledge/privacy-moderation-and-trust.md).
- **Consequences:** The UI must communicate that live vote tallies are provisional until verified by final contest audit.

---

### PD-05: Minimal Public Contestant Information & Guardian Privacy
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** Public contestant profiles must display only the minimum required information (photo, child display name, and approved demographic tags if decided). All guardian contact information (phone, email, full legal name) must remain strictly private.
- **Context:** Essential for the safety of children and compliance with privacy best practices.
- **Related Documentation:** [`privacy-moderation-and-trust.md`](file:///d:/A2zuk%20Website/project-knowledge/privacy-moderation-and-trust.md).
- **Consequences:** Strict database and API data isolation between public entities and private submission records.

---

### PD-06: Automatic Entry Publication After Automated Checks
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** Eligible submissions that successfully pass automated safety, format, and duplicate checks are automatically published to the contest gallery without waiting for manual human approval.
- **Context:** Provides immediate positive reinforcement to submitting parents and allows instant viral social sharing.
- **Related Documentation:** [`contest-workflows.md`](file:///d:/A2zuk%20Website/project-knowledge/contest-workflows.md).
- **Consequences:** Robust reporting and emergency removal mechanisms are mandatory to handle cases where inappropriate content slips through automated screening.

---

### PD-07: High-Level Hybrid Voting Model
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** The platform adopts a hybrid voting paradigm: ordinary voting is low-friction and direct, while suspicious or high-velocity activity triggers secondary verification or audit logging.
- **Context:** Balances broad user conversion with fraud prevention.
- **Related Documentation:** [`contest-workflows.md`](file:///d:/A2zuk%20Website/project-knowledge/contest-workflows.md), [`open-decisions.md`](file:///d:/A2zuk%20Website/project-knowledge/open-decisions.md).
- **Consequences:** Detailed anomaly thresholds and challenge types must be finalized under OD-05 before launch.

---

### PD-08: Approved Baseline Visual Reference (Figma)
- **Date:** 2026-10-22
- **Status:** `CONFIRMED`
- **Decision:** The Figma design located at `https://www.figma.com/design/YbwxzoyhZKLYnW9OSmCH0x` is approved as the baseline visual and UI design reference for the A2ZUK platform.
- **Context:** Reviewed and selected by the project owner to govern visual aesthetics, typography, palette, and component styling.
- **Related Documentation:** [`project-overview.md`](file:///d:/A2zuk%20Website/project-knowledge/project-overview.md), [`ui-ux-design.md`](file:///d:/A2zuk%20Website/project-knowledge/ui-ux-design.md).
- **Consequences:** Frontend implementation must mirror this visual standard while adhering to the approved functional requirements.
