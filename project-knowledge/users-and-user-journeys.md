# Users & User Journeys

## 1. Intended User Personas & Core Needs

A2ZUK serves several distinct user constituencies. Each group brings unique motivations, expectations, and technical familiarity to the platform.

---

### A. General Visitors & Casual Browsers `[CONFIRMED]`
- **Profile:** Individuals who discover A2ZUK via social media links, organic search, or word of mouth.
- **Core Goals:** Explore interesting contests, browse photos, understand what A2ZUK is, and evaluate platform credibility.
- **Key Questions Needed Answered:**
  - *"What is this website, and who is running it?"*
  - *"Is this a legitimate and safe platform?"*
  - *"Are these real contests? Can anyone enter?"*
- **Potential Failure / Friction Points:**
  - Overwhelming legal jargon or confusing navigation.
  - Ambiguity regarding whether participation requires fees or forced app downloads.

---

### B. Parents & Legal Guardians (Submitters) `[CONFIRMED]`
- **Profile:** Mothers, fathers, or authorized legal guardians wanting to submit their child's photograph into the baby photo contest. Frequently non-technical mobile users.
- **Core Goals:** Submit an eligible baby photo easily, verify that the entry is published, share the entry with friends and family, and ensure child privacy is respected.
- **Key Questions Needed Answered:**
  - *"Is my baby eligible (age, location)?"*
  - *"Will my private phone number or email be made public?"*
  - *"How do I know my submission was successful?"*
  - *"How can I get my family to vote?"*
  - *"What if I change my mind and want my baby's photo removed?"*
- **Potential Failure / Friction Points:**
  - Complex upload forms with rigid file size restrictions that fail without explanatory feedback.
  - Anxiety that submitting an entry exposes personal private contact information to the internet.
  - Confusion over whether the entry is immediately published or awaiting review.

---

### C. Voters & Family Supporters `[CONFIRMED]`
- **Profile:** Friends, relatives, community members, and public visitors rallying to support a specific participant or simply voting for their favorite entries.
- **Core Goals:** Cast a vote for a selected contestant with minimal friction, see that their vote registered, and know when voting ends.
- **Key Questions Needed Answered:**
  - *"Do I have to create an account or provide my email to vote?"* (Answer: No mandatory account `[CONFIRMED]`).
  - *"How many times can I vote?"*
  - *"Did my vote actually count?"*
  - *"When does voting close?"*
- **Potential Failure / Friction Points:**
  - Unexpected login or signup walls forcing account creation.
  - Vague error states when a daily limit or anti-bot check is triggered.
  - Laggy or unconfirmed vote button interactions.

---

### D. Contest Participants (Represented Minors) `[CONFIRMED]`
- **Profile:** In the premier contest, the participant is an infant or toddler represented legally by their guardian.
- **Core Needs:**
  - Representation strictly limited to approved, safe public information (e.g., first name/display name and photograph).
  - High aesthetic dignity in profile presentation.
  - Protection against unauthorized publication or harassment.

---

### E. Returning Visitors & Repeat Contestants `[CONFIRMED]`
- **Profile:** Users who participated in or followed prior contests and return to monitor updates or join new campaigns.
- **Core Goals:** Revisit favorite contests, view verified winners and completed rankings, and discover newly announced contests.
- **Key Questions Needed Answered:**
  - *"Who won the last contest?"*
  - *"When is the next contest starting?"*
  - *"Can I enter my other child in an upcoming category?"*
- **Potential Failure / Friction Points:**
  - Inability to find past contest archives.
  - Outdated contest badges showing "Active" when a contest has concluded.

---

### F. Business Partners, Sponsors & Advertisers `[FUTURE / OUT OF SCOPE FOR PHASE 1]`
- **Profile:** Consumer brands, family-oriented businesses, and regional sponsors seeking audience alignment.
- **Core Goals:** Assess platform traffic, audience trust, and brand sponsorship opportunities.
- **Key Considerations:**
  - Dedicated partner portals and self-serve advertising dashboards are strictly `[OUT OF SCOPE FOR THIS TASK]`.
  - The public site need only provide standard contact/inquiry pathways for sponsorship discussions.

---

## 2. Detailed End-to-End User Journeys

### Journey 1: The Guardian's Submission Flow
```
[Social / Referral Link]
       │
       ▼
[Contest Details Page] ──► Reads Rules & Eligibility ──► Clicks "Submit Entry"
       │
       ▼
[Submit Entry Page] ────► Uploads Photo + Enters Child Name
       │               ► Enters Private Guardian Contact Info
       │               ► Agrees to Mandatory Consent & Guardianship Checkboxes
       ▼
[Submission Processing] ─► Automated Safety & Format Checks Run
       │
       ├─► [FAILS Checks] ─► Inline Guidance & Clear Correction Steps
       │
       └─► [PASSES Checks]
               │
               ▼
[Submission Success Page] ─► Displays Shareable URL & Immediate Next Steps
               │
               ▼
[Contestant Profile Page] ─► Entry Visible in Gallery; Sharing Links Activated
```

---

### Journey 2: The Voter's Engagement Flow
```
[WhatsApp / Social Shared Link]
       │
       ▼
[Contestant Profile Page] ─► Inspects Child Photo & Current Vote Count
       │
       ▼
[Clicks "Vote Now"]
       │
       ├─► [Standard Flow] ──► Vote Instantly Counted ──► Count Increments (+1)
       │                                              ──► Clear Success Feedback
       │
       └─► [Suspicious Signal] ► Lightweight Verification (e.g., Captcha)
                                 │
                                 ├─► [Verified] ──► Vote Counted
                                 └─► [Flagged]  ──► Held for Audit Log
```

---

### Journey 3: The Skeptical Visitor's Verification Flow
```
[Home / Search Landing]
       │
       ▼
[Browses Active Contests] ──► Clicks "How It Works" & "Official Rules"
       │
       ▼
[Reviews Trust Safeguards] ──► Inspects Anti-Fraud Policies & Guardian Consent
       │
       ▼
[Evaluates Live Entries] ──► Inspects Profiles & Transparent Vote Counts
       │
       ▼
[Converts to Active Voter or Future Participant]
```

---

## 3. Potential Failure Points & UX Mitigations

| Identified Failure Point | User Experience Impact | Proactive UX Mitigation |
| :--- | :--- | :--- |
| **Ambiguity around photo rights** | Guardian hesitates to submit out of fear of unauthorized reuse. | Explicit, plain-language explanation of photo licensing terms adjacent to the upload button. |
| **Abrupt voting rejection** | Voter reaches an unannounced daily limit and assumes site is broken. | Clear, friendly modal explaining daily limit rules and when voting resets (IST). |
| **Unresponsive vote click** | Voter clicks repeatedly on slow mobile connection, triggering anti-spam flags. | Immediate optimistic button state change ("Submitting vote...") and disabling double-clicks. |
| **Confusing contest status** | User attempts to submit to a closed contest. | Distinct visual banner: "Submissions for this contest closed on [Date]". |
| **Accidental or non-consensual entry** | Child's photo submitted without parent's authorization. | Prominent, frictionless "Report Entry" link on every profile leading to an immediate review pipeline. |
