# Testing & Quality Assurance

## 1. Quality Assurance Philosophy & Testing Pyramid

Quality assurance is an ongoing verification discipline that guarantees software operates reliably, predictably, and securely according to design specifications. 

### Core Testing Directives
- **Never Report Without Evidence:** Never report that a feature functions, a bug is resolved, or a test has passed without verifiable, reproducible evidence. Distinguish clearly between tests planned, attempted, passed, failed, or blocked.
- **The Testing Pyramid:** Balance automated test suites across three primary tiers to optimize feedback speed and testing confidence:
  1. **Unit Tests (Broad Base):** Fast, isolated, deterministic tests validating individual pure functions, business algorithms, and localized state logic.
  2. **Integration Tests (Substantial Middle):** Validate module interactions, database repositories, API endpoints, serialization logic, and state store transitions.
  3. **End-to-End (E2E) Tests (Focused Peak):** High-value, critical-path browser automation simulating real user workflows (e.g., signup, checkout, primary navigation).

---

## 2. Test Disciplines & Methodologies

### 1. Static Analysis & Type Checking
- Enforce strict static type checking without allowing untyped escapes (`any`).
- Integrate automated linters to enforce uniform code styling, detect dead code, flag potential security antipatterns, and prevent unhandled promise rejections.
- Run static checks automatically via pre-commit hooks and CI build gates.

### 2. Unit & Integration Testing
- **Test Invariants, Not Implementations:** Focus tests on inputs and observed outputs rather than private internal implementation details. Refactoring internal logic should not break well-designed unit tests.
- **Deterministic Test Environments:** Tests must never depend on the order of execution, external internet connectivity, or specific system clocks. Use fixed test clocks and ephemeral database instances.
- **Arrange-Act-Assert (AAA):** Maintain clear structural separation within test bodies:
  - *Arrange:* Initialize necessary fixtures and preconditions.
  - *Act:* Execute the target behavior or method under test.
  - *Assert:* Verify state mutations, return values, and contract invariants.

### 3. API Contract & Permission Testing
- Validate that all API routes reject malformed JSON, invalid data types, and oversized payloads with clean `400 Bad Request` or `422 Unprocessable Content` responses.
- Explicitly test permission boundaries: verify that unauthenticated requests receive `401 Unauthorized`, and authenticated users attempting to access unauthorized tenant records receive `403 Forbidden` or `404 Not Found`.

### 4. Edge Cases & Defensive Scenarios
- Always test extreme boundary conditions:
  - Empty arrays, `null`, `undefined`, and zero values.
  - Unicode text, emojis, special characters, and very long strings.
  - Malformed email strings, telephone formats, and invalid dates.
  - Network timeouts, simulated 500 error responses, and offline client states.

---

## 3. Accessibility & Responsive QA

### Automated & Manual Accessibility (a11y) Checks
- Incorporate automated accessibility scanning into test pipelines to catch missing `alt` attributes, low contrast, and unlinked form labels.
- Supplement automated tools with **manual keyboard testing**:
  - Unplug the mouse: navigate every view using only `Tab`, `Shift+Tab`, `Space`, `Enter`, and Arrow keys.
  - Verify that visual focus indicators remain visible at all times.
  - Verify that modal dialogs trap keyboard focus and return focus to the trigger upon closing.
  - Test screen reader announcements using native screen readers (e.g., NVDA, VoiceOver) on key user flows.

### Responsive Viewport Verification
- Verify layouts and touch targets across standard device breakpoints:
  - Mobile: 320px, 375px, 414px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1440px, 1920px
- Ensure horizontal scrolling never occurs unexpectedly and touch targets maintain a minimum 44x44px bounding area.

---

## 4. Defect Tracking, Root-Cause Analysis & Fix Verification

When bugs are discovered, document and resolve them using structured engineering protocols:

### Defect Report Structure
1. **Summary:** Clear, unambiguous description of the defect.
2. **Environment:** Browser version, OS, viewport size, environment (dev, staging, prod), commit SHA.
3. **Preconditions:** Necessary account roles or database state.
4. **Steps to Reproduce:** Numbered, minimal, deterministic steps to replicate the issue.
5. **Observed Behavior:** What the application actually did (including console errors or logs).
6. **Expected Behavior:** What the application should have done according to specifications.
7. **Severity & Impact:** Triage rating (Critical, High, Medium, Low).

### Root-Cause Analysis (RCA) & Regression Prevention
- Before modifying code to fix a bug, identify the fundamental root cause (e.g., missing validation, race condition, stale cache, flawed business logic).
- **Write a Failing Test First:** Author an automated regression test reproducing the exact failure scenario. Confirm the test fails.
- **Implement the Minimal Fix:** Apply the code fix and confirm the test turns green.
- **Verify No Unintended Side-Effects:** Run the complete test suite to ensure adjacent functionality remains unaffected.
