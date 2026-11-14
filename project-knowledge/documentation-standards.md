# Documentation Standards & Technical Communication

## 1. Documentation Philosophy & Purpose

Documentation is an essential engineering tool that preserves architectural clarity, accelerates team onboarding, documents technical trade-offs, and prevents the loss of critical domain knowledge over time.

### Core Directives
- **Documentation Must Match Reality:** Documentation is only valuable if it accurately reflects the actual, working state of the software. Stale, misleading documentation is more harmful than no documentation at all.
- **Maintain as Part of the Definition of Done:** No feature, architectural change, or system interface is considered complete until its corresponding documentation has been authored or updated.
- **Explain Intent, Context, and Trade-offs:** Focus documentation on the reasons behind architectural choices, non-obvious constraints, boundary conditions, and deliberate trade-offs rather than merely regurgitating raw code.

---

## 2. Documentation Architecture in `project-knowledge`

The `project-knowledge` folder serves as the persistent technical foundation for this codebase.

### Document Maintenance Rules
1. **Domain-Specific Placement:** Store knowledge in the designated topic file (e.g., database schema patterns belong in `database-engineering.md`; authentication policies belong in `security-privacy.md`).
2. **Synchronized Updates:** When an engineering decision modifies system design, security protocols, or API conventions, update the corresponding markdown document in the same commit or pull request.
3. **No Speculative or Fabricated Information:** Do not invent fictitious database schemas, simulated performance benchmarks, or imaginary integrations. Document only verified patterns or explicit templates.
4. **Technology Neutrality:** Keep foundational guidelines platform-agnostic until specific technologies, frameworks, and tools are officially selected through Architectural Decision Records (ADRs).

---

## 3. Managing Architectural Decisions (ADRs)

Architectural Decision Records capture important architectural choices along with their context, trade-offs, and consequences.

### When to Author an ADR
Create an ADR in [`architectural-decisions.md`](file:///d:/A2zuk%20Website/project-knowledge/architectural-decisions.md) whenever a choice meets any of the following criteria:
- Selecting or replacing a major framework, database, or infrastructure provider.
- Establishing or fundamentally altering an architectural pattern (e.g., monolith vs. microservices, event-driven vs. REST).
- Introducing a significant external dependency that impacts build, security, or licensing postures.
- Establishing security boundaries, authentication models, or data isolation paradigms.
- Decisions that are difficult or costly to reverse later.

### ADR Lifecycle States
- **Proposed:** The ADR is undergoing review, team discussion, and feasibility validation.
- **Accepted:** The decision is formally approved and authorized for active implementation.
- **Superseded:** A newer ADR has replaced this decision (must explicitly link to the superseding ADR ID).
- **Rejected:** The proposed decision was formally evaluated and rejected with recorded rationale.

---

## 4. Technical Communication & Progress Reporting

All technical reporting—including pull request descriptions, handover summaries, and status updates—must maintain the highest standard of professional transparency.

### Standard Status Report Structure
When reporting implementation progress or task completion, format communication using the following clear sections:
1. **Summary of Work Completed:** Concise, itemized list of changes made, files modified, and capabilities delivered.
2. **Verification & Evidence:** Concrete results from static checks, automated tests, manual testing, or performance profiling (with exact commands executed and observed outputs).
3. **Assumptions & Open Questions:** Explicitly list any working assumptions or unresolved questions that require stakeholder clarification.
4. **Known Limitations & Technical Debt:** Transparently document edge cases not yet covered, partial implementations, or temporary compromises.
5. **Recommended Next Steps:** Clear, prioritized sequence of next engineering actions.

---

## 5. Tracking Ambiguity & Unresolved Questions

When engineering requirements are incomplete or ambiguous:
- **Do Not Guess:** Never make assumptions about core business logic, regulatory compliance, data privacy, or destructive operations.
- **Formulate Clear Options:** When presenting an unresolved question to stakeholders, outline:
  - The specific ambiguity or technical conflict.
  - The viable options with respective pros, cons, and trade-offs.
  - The engineering team's recommended path forward with technical justification.
