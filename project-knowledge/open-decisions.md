# Open Decisions & Unresolved Questions Register

This register documents all product, operational, legal, and contest design decisions that remain unresolved. Every item must be evaluated and formally decided prior to public launch. No unconfirmed assumptions are permitted to masquerade as finalized requirements.

---

## 1. Contest Lifecycle & Schedule Decisions

### OD-01: Entry and Voting Schedule & Durations
- **Status:** `UNDECIDED`
- **What is Already Known:** The lifecycle consists of sequential phases (Upcoming -> Accepting Entries -> Voting Open -> Voting Closed -> Results Pending -> Completed).
- **What Remains Unresolved:**
  - Official launch date and timezone reference (presumed IST).
  - Duration of the entry submission window (e.g., 2 weeks vs. 1 month).
  - Duration of the public voting window.
  - Whether submission and voting overlap (can submissions continue while voting is open, or do submissions close completely before voting begins?).
  - Duration of the audit/results-pending window before winners are announced.
- **Why It Matters:** Determines user interface countdown timers, submission form availability gates, and campaign marketing schedules.
- **Must Be Confirmed Before Launch:** Exact calendar dates, milestone times, and phase overlap rules.

---

## 2. Voting Governance & Anti-Fraud Rules

### OD-02: Winner-Selection Policy & Evaluation Model
- **Status:** `UNDECIDED`
- **What is Already Known:** Public vote counts are visible; highest raw vote count alone does not automatically guarantee victory without audit.
- **What Remains Unresolved:**
  - Is the winner purely the audited highest vote-getter, or is there an editorial/jury component?
  - What disqualification thresholds apply if fraudulent voting is detected on an entry?
- **Why It Matters:** Core to platform credibility, user trust, and legal compliance.
- **Must Be Confirmed Before Launch:** Clear, binding winner determination policy published in Official Contest Rules.

### OD-03: Official Tie-Breaking Protocol
- **Status:** `UNDECIDED`
- **What is Already Known:** Two or more top contestants may conclude the voting period with an identical number of verified votes.
- **What Remains Unresolved:**
  - How are ties broken? (Options: earliest submission timestamp, joint winners, secondary 24-hour runoff vote, or editorial committee decision).
- **Why It Matters:** Prevents disputes and allegations of favoritism in high-stakes competitive outcomes.
- **Must Be Confirmed Before Launch:** Exact tie-breaker criteria articulated in official rules.

### OD-04: Daily Voting Limits & Scope
- **Status:** `PROPOSED / UNDECIDED`
- **What is Already Known:** An early conceptual idea proposed a limit of "5 valid votes per day, resetting at midnight IST".
- **What Remains Unresolved:**
  - Is the 5-vote limit approved as policy?
  - What is the scope of the limit? (Is it 5 votes per contestant, 5 votes total across all contestants per device/IP, or something else?).
  - How is identity tracked without mandatory voter accounts? (Device fingerprint, cookie, IP, or SMS OTP?).
- **Why It Matters:** Affects the voting UI, error messaging, and anti-abuse effectiveness.
- **Must Be Confirmed Before Launch:** Clear daily voting quota definition and enforcement scope.

### OD-05: Suspicious Vote Verification & Anomaly Triggers
- **Status:** `UNDECIDED`
- **What is Already Known:** Hybrid voting model approved in concept: ordinary voting is single-click; suspicious activity triggers secondary verification.
- **What Remains Unresolved:**
  - What specific anomaly triggers activate verification? (Rate spikes, IP reputation, headless browser signals?).
  - What secondary verification method will be presented? (hCaptcha, Cloudflare Turnstile, SMS OTP?).
  - Are flagged votes discarded immediately or stored in a quarantine log for manual audit?
- **Why It Matters:** Balances voter conversion rates against vulnerability to automated voting scripts.
- **Must Be Confirmed Before Launch:** Anomaly detection thresholds and verification challenge mechanism.

---

## 3. Submission, Eligibility & Public Profiles

### OD-06: Participant Eligibility Criteria & Age Brackets
- **Status:** `UNDECIDED`
- **What is Already Known:** Premier contest is a baby photo contest for participants in India represented by parents/legal guardians.
- **What Remains Unresolved:**
  - What is the exact eligible age range? (e.g., 0 to 24 months, 0 to 36 months?).
  - Does the child need to be within that age range at the time of submission or at the time the contest ends?
  - Are there geographic residency constraints within India (national vs. specific states)?
- **Why It Matters:** Informs submission validation rules and prevents eligibility disputes.
- **Must Be Confirmed Before Launch:** Explicit age range and geographic boundaries.

### OD-07: Public Participant Profile Field Schema
- **Status:** `UNDECIDED`
- **What is Already Known:** Policy of minimal public information approved. Baby photo and child display name are confirmed public. Private contact credentials remain hidden.
- **What Remains Unresolved:**
  - Will the public profile include child age (in months)?
  - Will the public profile include city or state?
  - Can guardians write a short optional caption or bio, or is text entry strictly prohibited to minimize moderation risk?
- **Why It Matters:** Determines UI card layout, database fields, and exposure footprint of minors.
- **Must Be Confirmed Before Launch:** Final list of public fields approved for contestant profiles.

---

## 4. Legal, Privacy & Moderation Policies

### OD-08: Guardian Consent & Legal Declarations Wording
- **Status:** `REQUIRES VALIDATION / UNDECIDED`
- **What is Already Known:** Mandatory declarations are required to establish guardianship, photo copyright, and publishing license.
- **What Remains Unresolved:**
  - Exact legal text for consent checkboxes tailored to Indian digital media and child privacy regulations.
  - Legal liability disclaimers regarding user-generated content.
- **Why It Matters:** Protects the platform and participants from legal exposure and copyright claims.
- **Must Be Confirmed Before Launch:** Final legal review and approval of declaration statements.

### OD-09: Photo Retention, Storage & Archival Policy
- **Status:** `UNDECIDED`
- **What is Already Known:** Baby photographs will be published during the contest lifecycle.
- **What Remains Unresolved:**
  - How long are photos retained on public servers after a contest concludes?
  - Are non-winning entries archived permanently, de-indexed from search engines, or deleted after a set retention period (e.g., 90 days)?
  - What is the permanent deletion procedure when an account/guardian requests removal?
- **Why It Matters:** Dictates storage costs, data privacy compliance, and parent trust.
- **Must Be Confirmed Before Launch:** Data retention and post-contest archiving policy.

### OD-10: Reporting Escalation & Moderation SLA
- **Status:** `UNDECIDED`
- **What is Already Known:** Every profile will feature a "Report Entry" link.
- **What Remains Unresolved:**
  - What is the target turnaround time for reviewing reported entries?
  - Does an entry get temporarily hidden automatically if it receives a certain threshold of reports (e.g., 3 distinct flags)?
  - How are contested submissions resolved between disputing parties?
- **Why It Matters:** Prevents unauthorized photos from lingering on a public platform.
- **Must Be Confirmed Before Launch:** Operational moderation SOP and reporting thresholds.
