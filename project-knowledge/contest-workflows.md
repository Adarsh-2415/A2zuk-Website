# Contest Workflows & Lifecycle Governance

## 1. Premier Baby Photo Contest: End-to-End Workflow

The premier contest workflow centers on a child photo contest submitted by a verified parent or legal guardian. The end-to-end journey encompasses six distinct operational stages:

```
┌─────────────────┐       ┌────────────────────┐       ┌────────────────────────┐
│ 1. SUBMISSION   │ ────► │ 2. AUTOMATED       │ ────► │ 3. AUTOMATIC           │
│    BY GUARDIAN  │       │    CHECK PIPELINE  │       │    PUBLICATION         │
└─────────────────┘       └────────────────────┘       └────────────────────────┘
                                                                    │
                                                                    ▼
┌─────────────────┐       ┌────────────────────┐       ┌────────────────────────┐
│ 6. FINAL WINNER │ ◄──── │ 5. AUDIT & VOTE    │ ◄──── │ 4. HYBRID PUBLIC       │
│    DECLARATION  │       │    VERIFICATION    │       │    VOTING PERIOD       │
└─────────────────┘       └────────────────────┘       └────────────────────────┘
```

---

## 2. Participant Submission Workflow

### Step 1: Discovery & Eligibility Review
1. Parent or legal guardian navigates to `/contests/baby-photo-contest-1` or clicks "Submit Entry" from the homepage.
2. The user reviews eligibility guidelines (e.g., child age limits `[UNDECIDED]`, geographic eligibility, accepted photo formats).
3. If submissions are closed or scheduled for the future, the submission form is suppressed, and an explicit status notification is rendered.

### Step 2: Information Capture & Photo Upload
The submission form collects strictly segregated public and private data:
- **Approved Public Information `[CONFIRMED: Minimal Public Info]`:**
  - Baby's display name or nickname `[CONFIRMED]`.
  - Age bracket or month-age (if approved in final fields) `[UNDECIDED]`.
  - City / State (if approved in final fields) `[UNDECIDED]`.
  - Eligible baby photograph.
- **Private Guardian Contact Credentials `[CONFIRMED: Kept Strictly Private]`:**
  - Guardian's legal full name.
  - Guardian's relationship to child (Parent / Legal Guardian).
  - Primary contact phone number (e.g., standard 10-digit Indian mobile number).
  - Primary contact email address.

### Step 3: Mandatory Legal & Guardian Declarations
Before a submission can be processed, the guardian must actively acknowledge mandatory consent checkboxes `[CONFIRMED]`:
- Affirmation of parentage or legal guardianship over the depicted child.
- Confirmation of exclusive copyright or ownership of the submitted photograph.
- Explicit authorization granting A2ZUK the license to publish the photograph publicly for contest display.
- Agreement to platform Terms of Service and Contest Rules.
*(Note: Exact legal phrasing of declarations is `[REQUIRES VALIDATION]` by legal counsel before public launch.)*

### Step 4: Automated Pre-Publication Checks
Submissions are evaluated through an automated safety and eligibility filter `[CONFIRMED]`:
- **Format & Integrity Check:** Verification that the file is an authentic, uncorrupted image (JPEG/PNG/WebP) within size bounds.
- **Automated Content Screening:** Basic algorithmic inspection to detect flagrant non-image uploads or blatantly inappropriate content.
- **Duplicate Detection:** Basic matching against recent submissions to prevent inadvertent immediate resubmissions.

### Step 5: Publication Outcome
- **If Automated Checks PASS:** The entry is **automatically published** to the public contest gallery and assigned a unique public URL (`/contests/[slug]/entries/[entry-slug]`) `[CONFIRMED: Automatic Publication]`.
- **If Automated Checks FAIL:** The entry is held or rejected; the guardian receives clear error feedback on what failed. The entry is **never published** in an unverified state `[CONFIRMED]`.
- *Operational Reality:* Automated checks cannot detect every nuanced issue (e.g., unauthorized photos of someone else's child). Therefore, automated publication is accompanied by public reporting and removal pathways.

---

## 3. Public Voting Workflow

### Hybrid Voting Model `[CONFIRMED at High Level; Details UNDECIDED]`
A2ZUK utilizes a **hybrid voting model** engineered to balance effortless participation with anti-fraud protection:

1. **Ordinary / Low-Friction Flow:**
   - Any eligible visitor can explore participant entries and cast a vote directly with a single click.
   - **No Mandatory Voter Account `[CONFIRMED]`:** Voters do not need to register, create passwords, or log in to vote normally.
   - The vote is immediately acknowledged with positive UI feedback, and the public vote count updates accordingly.
2. **Suspicious / Anomaly Flow:**
   - When incoming votes display anomalous signals (e.g., abnormal burst velocity, high-volume automated scripts, proxy networks, identical device fingerprints voting repeatedly), the platform triggers secondary verification or logs the votes for post-contest audit.
   - Secondary verification may require lightweight challenges (e.g., CAPTCHA, device verification) before accepting the vote.
   - Exact anomaly detection thresholds and challenge methods are `[UNDECIDED]`.

### Voting Limits & Rules
- **Daily Voting Limit Proposal `[PROPOSED / UNDECIDED]`:** A guideline of "5 votes per day, resetting at midnight India Standard Time (IST)" was proposed in early planning.
  - *Current Status:* Unconfirmed proposal. It has not been decided whether this limit applies per IP, per device, per specific contestant, or globally across all contests.
- **Vote Presentation:** Public vote counts are visible to all visitors `[CONFIRMED]`. However, public numbers represent active tallies and are subject to final audit prior to winner declaration.

---

## 4. Contest Closure, Audit & Winner Selection

```
┌───────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ VOTING CLOSES     │ ────► │ AUDIT & AUDITING     │ ────► │ OFFICIAL RESULTS    │
│ At scheduled date │       │ Disqualify fraudulent│       │ Published on        │
│ & time (IST)      │       │ or automated votes   │       │ Contest Details     │
└───────────────────┘       └──────────────────────┘       └─────────────────────┘
```

1. **Scheduled Closure:** At the designated closing deadline, voting controls are automatically disabled across all entry profiles and contest pages.
2. **Audit & Results Pending Phase:** The contest status transitions to **"Results Pending"**. A prominent notice alerts visitors that votes are undergoing final verification and auditing.
3. **Winner-Selection Policy `[UNDECIDED]`:**
   - The winner is **not automatically decided by raw unverified vote counts**.
   - The review process must filter out fraudulent, script-generated, or duplicate votes identified during the audit.
   - Tie-breaking rules and review criteria must be formally approved prior to contest launch `[UNDECIDED]`.
4. **Official Winner Announcement:** Once verified, the contest transitions to **"Completed"**, highlighting the winning participant(s) and publishing finalized, immutable rankings.

---

## 5. Moderation, Reporting & Emergency Removal Workflow

Because the contest publishes photographs of minors, an immediate and responsive reporting channel is a mandatory product requirement `[CONFIRMED]`:

```
┌──────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│ 1. VISITOR FLAGS │ ────► │ 2. IMMEDIATE        │ ────► │ 3. REVIEW & FINAL   │
│    CONCERN       │       │    TEMPORARY ACTION │       │    RESOLUTION       │
│ via "Report Entry│       │ Entry concealed if  │       │ Reinstated or       │
│ link on profile  │       │ threshold triggered │       │ permanently deleted │
└──────────────────┘       └─────────────────────┘       └─────────────────────┘
```

- **Reporting Entry Point:** Every public entry profile features an accessible "Report Entry" link opening a structured reporting modal.
- **Report Reasons:** Intellectual property infringement, lack of guardian consent, incorrect information, or inappropriate content.
- **Guardian Removal Requests:** If a verified parent or legal guardian requests the withdrawal or deletion of their child's entry, the platform must provide a prioritized path to de-index and unpublish the profile promptly.
