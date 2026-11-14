# Practical Engineering Checklists

Use these practical, reusable checklists at key milestones throughout the engineering lifecycle to maintain technical rigor, avoid regressions, and ensure production readiness.

---

## 1. Before Starting a Significant Task
- [ ] Understand the core business objective and user problem being solved.
- [ ] Review existing codebase architecture, related components, and dependencies.
- [ ] Check if relevant standards exist in `project-knowledge/`.
- [ ] Identify external dependencies, APIs, or schema changes required.
- [ ] Formulate a written implementation plan: affected files, milestones, risk factors, and validation strategy.
- [ ] Clarify any ambiguous requirements or open technical questions before writing code.

---

## 2. Before Modifying Existing Code
- [ ] Read and understand the existing code, its callers, and its test coverage.
- [ ] Verify that existing tests pass in the current working copy before making changes.
- [ ] Identify potential side-effects across consuming modules.
- [ ] Ensure the proposed modification aligns with established project conventions.
- [ ] Determine whether refactoring is needed first to prepare for the change cleanly (make the change easy, then make the easy change).

---

## 3. Before Completing a Feature
- [ ] All functional requirements from the specification are implemented and verified.
- [ ] Edge cases (empty data, max lengths, special characters, network errors) are handled gracefully.
- [ ] Unit and integration tests are written, passing, and cover happy and failure paths.
- [ ] Component handles all UI states: Loading, Error, Empty, and Populated.
- [ ] Accessibility requirements (semantic HTML, keyboard navigation, contrast) are satisfied.
- [ ] Responsive design verified across mobile, tablet, and desktop viewports.
- [ ] Documentation updated to reflect any new interfaces, options, or environment variables.

---

## 4. Before Reviewing UI/UX Quality
- [ ] Visual hierarchy is clear; primary action is immediately identifiable.
- [ ] Typographic scale and spacing conform strictly to design system tokens.
- [ ] Focus rings (`:focus-visible`) are visible and high-contrast when navigating via keyboard.
- [ ] Color contrast ratios meet WCAG 2.1 AA standards (minimum 4.5:1 for body text, 3:1 for large text/icons).
- [ ] Touch targets are at least 44x44px with adequate spacing.
- [ ] Micro-interactions and animations respect `prefers-reduced-motion: reduce`.
- [ ] Content does not overflow or trigger unexpected horizontal scrolling on narrow screens (320px+).

---

## 5. Before Merging or Committing Changes
- [ ] `git status` inspected; only intended, relevant files are staged.
- [ ] No temporary debug code, `console.log` statements, or commented-out blocks remain.
- [ ] No secrets, `.env` files, credentials, or private tokens are staged.
- [ ] Static type checks pass with zero errors and no untyped bypasses.
- [ ] Automated linter and code formatting checks pass.
- [ ] All automated unit and integration tests pass cleanly.
- [ ] Commit message conforms to Conventional Commits standard (`type(scope): summary`).

---

## 6. Before Deployment
- [ ] Automated CI/CD pipeline builds successfully in a clean environment.
- [ ] All required environment variables and secrets are configured in the target environment.
- [ ] Database migrations are backwards-compatible and tested against realistic data volume.
- [ ] Rollback plan is explicitly defined and verified.
- [ ] Production build bundles audited for size regressions and unexpected dependencies.
- [ ] Health check and monitoring alerts are active.

---

## 7. Before Handling Sensitive Data or Security-Related Functionality
- [ ] Object-level authorization checks enforced server-side; record ownership verified.
- [ ] All user inputs strictly validated against a typed schema before processing.
- [ ] Output properly context-encoded to prevent XSS.
- [ ] Database queries parameterized; zero raw SQL string concatenation.
- [ ] Sensitive fields (passwords, tokens, PII) excluded from log outputs and error responses.
- [ ] Authentication endpoints protected by adaptive rate limiting.
- [ ] HTTPS enforced; cookies configured with `HttpOnly`, `Secure`, and `SameSite` flags.

---

## 8. When Investigating Bugs
- [ ] Obtain a deterministic, minimal set of reproduction steps.
- [ ] Capture environment context: OS, browser version, viewport, user permissions, relevant logs.
- [ ] Inspect server and client error logs; correlate with request correlation IDs.
- [ ] Isolate the failing component and identify the root cause before writing code.
- [ ] Write a failing automated regression test that reproduces the bug.
- [ ] Verify why previous tests failed to detect this bug and improve test coverage accordingly.

---

## 9. When Diagnosing Performance Issues
- [ ] Profile first: measure CPU, memory, network, and render timelines before making assumptions.
- [ ] Identify whether bottleneck is network latency, backend database query, or client-side rendering.
- [ ] Inspect Core Web Vitals (LCP, INP, CLS) using browser performance tooling.
- [ ] Check for N+1 database queries, unindexed filters, or missing database pagination.
- [ ] Review bundle analysis for uncompressed assets, duplicate packages, or missing code splitting.
- [ ] Measure post-optimization metrics under identical conditions to verify empirical improvement.

---

## 10. When Verifying a Fix
- [ ] Execute the original reproduction steps and confirm the defect no longer occurs.
- [ ] Verify that the automated regression test now passes.
- [ ] Run the complete automated test suite to ensure no collateral regressions were introduced.
- [ ] Test adjacent workflows that interact with the modified code paths.
- [ ] Confirm that fix operates correctly across supported browsers and viewport sizes.
- [ ] Document the root cause, fix mechanism, and verification steps in the issue record.
