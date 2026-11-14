# Product Requirements & Public Experience

## 1. Information Architecture & Public Page Requirements

The public website structure is defined across eight primary functional pages. This page model represents the approved baseline `[CONFIRMED]`. No superfluous pages or disconnected standalone galleries are to be introduced.

---

### Page 1: Home — `/` `[CONFIRMED]`
- **Purpose:** Introduce A2ZUK, convey platform credibility, highlight active and upcoming contests, and direct users into participation journeys.
- **Key User-Facing Requirements:**
  - Clear brand introduction explaining the purpose and fairness of the A2ZUK platform.
  - Featured showcase of active and upcoming contests with current status badges.
  - High-level overview of the participation flow (Discover -> Submit -> Vote -> Win).
  - Prominent calls to action guiding users to browse contests or submit entries.
  - Quick links to platform policies, help documentation, and contest categories.
  - *Constraint:* The homepage is a gateway, not a replacement for comprehensive contest rules.

---

### Page 2: Contests Directory — `/contests` `[CONFIRMED]`
- **Purpose:** Provide an organized directory of all contests across various lifecycle states.
- **Key User-Facing Requirements:**
  - Clear visual distinction between **Active**, **Upcoming**, and **Completed** contests.
  - Status indicators displaying the current phase (e.g., "Accepting Entries", "Voting Open", "Results Declared").
  - Essential metadata per contest: category title, hero imagery, key dates, and current primary action.
  - Direct navigation paths to individual Contest Detail pages.
  - *Constraint:* All entry galleries live contextually within individual contest pages; there is no standalone global entry gallery page.

---

### Page 3: Contest Details — `/contests/[contest-slug]` `[CONFIRMED]`
- **Purpose:** Serve as the central hub for a specific contest, presenting its timeline, rules, published entries, and phase-specific primary actions.
- **Key User-Facing Requirements:**
  - Contest status display: Upcoming, Accepting Entries, Voting Open, Voting Closed, Results Pending, Completed.
  - Official contest schedule (entry open/close, voting open/close, result publication) `[Dates UNDECIDED]`.
  - Comprehensive explanation of eligibility rules, photo criteria, and voting rules.
  - Dynamic primary call-to-action button adapting to contest status (e.g., "Submit Your Baby's Photo", "Vote Now", "View Results").
  - Embedded gallery of published eligible entries with search, sorting, and pagination.
  - Participant preview cards displaying approved public photo, child display name, and public vote count.
  - Announcement section for contest closure and final results when published.

---

### Page 4: Contestant Profile — `/contests/[contest-slug]/entries/[entry-slug]` `[CONFIRMED]`
- **Purpose:** Dedicated public profile page for an individual approved participant entry.
- **Key User-Facing Requirements:**
  - High-resolution display of the approved participant photograph.
  - Approved public details only (e.g., child's display name, age bracket or entry city if approved) `[CONFIRMED: Minimal Public Info]`.
  - Direct association with the parent contest and breadcrumb navigation back to contest details.
  - Live public vote count display `[CONFIRMED: Public Counts Visible]`.
  - Inline voting action when voting is actively open for that contest.
  - Prominent social and messaging share actions (WhatsApp, Facebook, Twitter/X, copy link) to allow guardians and supporters to rally votes.
  - Accessible "Report Entry" link opening the problem reporting modal/form.
  - *Strict Boundary:* Absolutely no private guardian contact info (email, phone, home address) may ever appear on this page `[CONFIRMED]`.

---

### Page 5: Submit Entry — `/contests/[contest-slug]/submit` `[CONFIRMED]`
- **Purpose:** Dedicated submission form where parents/legal guardians submit baby photos and necessary declarations.
- **Key User-Facing Requirements:**
  - Dynamic status check: if submissions are closed or not yet open, display an informative closure message instead of an active form.
  - Clear submission guidelines: eligible age ranges, accepted image formats, and criteria.
  - Minimal form inputs capturing only required child information and private guardian contact credentials.
  - Mandatory guardian declarations: confirming legal guardianship, photo ownership, permission to publish, and agreement to contest terms.
  - Drag-and-drop or file selector for baby photo upload with client-side preview.
  - Transparent inline validation messaging explaining any missing fields or unsupported image files.
  - Direct link to Privacy Policy and Contest Rules regarding data usage and child image protections.

---

### Page 6: Submission Success — `/submission-success` `[CONFIRMED]`
- **Purpose:** Affirm the outcome of the submission attempt and outline immediate next steps in clear, plain language.
- **Key User-Facing Requirements:**
  - Unambiguous confirmation message regarding the submission outcome.
  - Realistic status notification: explains that automated checks are processing/have processed, and provides the direct URL to the published profile once ready.
  - *Honesty Constraint:* Never claim an entry is published, stored, or accepted unless the system has genuinely confirmed that outcome.
  - Social sharing links encouraging the guardian to share their newly created entry profile.
  - Button to return to the parent contest page or explore other entries.

---

### Page 7: How It Works — `/how-it-works` `[CONFIRMED]`
- **Purpose:** Educate new visitors and participants on the end-to-end contest lifecycle without forcing them to read lengthy legal agreements.
- **Key User-Facing Requirements:**
  - Step-by-step visual walkthrough: Discovering contests -> Guardian submission -> Automated checks & publication -> Public voting -> Result verification.
  - Plain-language explanation of voting fairness, fraud scrutiny, and reporting procedures.
  - FAQ snippet addressing top guardian questions regarding child privacy, photo safety, and voting costs (free).
  - Clear navigational pointers back to active contests.

---

### Page 8: Help & Policies Directory `[CONFIRMED]`
- **Purpose:** Provide accessible, dedicated pages/sections with clear, permanent URLs for platform governance and user assistance.
- **Required Sections / URLs:**
  - **FAQ (`/help/faq`):** Common questions regarding participation, voting rules, schedules, and technical help.
  - **Support & Contact (`/help/contact`):** Official communication channels for inquiries and escalation.
  - **Terms & Conditions (`/policies/terms`):** Binding rules of platform usage, liability, and contest eligibility.
  - **Privacy Policy (`/policies/privacy`):** Comprehensive disclosure on personal data handling, child privacy, retention, and deletion rights.
  - **Official Contest Rules (`/policies/contest-rules`):** Universal contest governance, eligibility criteria, and fair-play standards.
  - **Reporting & Entry Removal (`/policies/reporting`):** Clear procedures on how intellectual property owners, guardians, or visitors can request entry reviews or removals.

---

## 2. Contest Lifecycle States & Behavioral Matrix

Every contest must cycle through strictly defined lifecycle phases `[CONFIRMED]`:

```
┌──────────────┐     ┌────────────────────┐     ┌─────────────┐
│ 1. UPCOMING  │ ──► │ 2. ACCEPTING       │ ──► │ 3. VOTING   │
│              │     │    ENTRIES         │     │    OPEN     │
└──────────────┘     └────────────────────┘     └─────────────┘
                                                       │
                                                       ▼
┌──────────────┐     ┌────────────────────┐     ┌─────────────┐
│ 6. COMPLETED │ ◄── │ 5. RESULTS PENDING │ ◄── │ 4. VOTING   │
│              │     │    (AUDITING)      │     │    CLOSED   │
└──────────────┘     └────────────────────┘     └─────────────┘
```

| Lifecycle State | Submission Allowed? | Voting Allowed? | Public Gallery Visible? | Primary User Action |
| :--- | :--- | :--- | :--- | :--- |
| **1. Upcoming** | No | No | No (Teaser only) | "Set Reminder" / View contest rules & opening dates. |
| **2. Accepting Entries** | **Yes** | Depends on schedule `[UNDECIDED]` | Yes (as published) | "Submit Photo" / Browse initial published contestants. |
| **3. Voting Open** | Depends on schedule `[UNDECIDED]` | **Yes** | Yes | "Vote Now" / Share entry profile. |
| **4. Voting Closed** | No | No | Yes | "Voting Closed" / Browse finalist entries. |
| **5. Results Pending** | No | No | Yes (Counts frozen) | "Results Under Verification" notice. |
| **6. Completed** | No | No | Yes (Final archive) | "View Official Winners & Final Results". |

---

## 3. Non-Functional Product Expectations

- **Clarity & Simplicity:** Interfaces must be effortlessly usable for parents and grandparents who possess minimal technical experience `[CONFIRMED]`.
- **Trust & Transparency:** Clear communication of rules, no hidden fees, transparent vote counters, and explicit notice when checks or reviews are pending `[CONFIRMED]`.
- **Accessibility:** Design and contrast must target universal readability across standard mobile screens in bright daylight conditions `[CONFIRMED]`.
- **Mobile-First Experience:** Over 85% of traffic in India is expected via mobile devices. Touch ergonomics, low data consumption, and fast visual feedback on slow mobile networks are paramount `[CONFIRMED]`.
- **Zero Ambiguity in Communication:** Never mislead users into believing a closed contest is accepting votes or that an unverified vote count represents a finalized victory `[CONFIRMED]`.

---

## 4. Explicit Exclusions for Phase 1 `[OUT OF SCOPE FOR THIS TASK]`

- No admin dashboard or content management system implementation in this phase.
- No backend database or server infrastructure setup in this phase.
- No commercial payment gateways or paid voting mechanics.
- No advertiser dashboards, sponsor self-serve portals, or automated billing engines.
- No mandatory voter account registration or social login requirements.
- No secondary contest categories (pets, talent, arts) launched in Phase 1.
