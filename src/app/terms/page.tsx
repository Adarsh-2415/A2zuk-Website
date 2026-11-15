import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalDocView, { LegalSection } from "@/components/LegalDocView";

export const metadata: Metadata = {
  title: "Terms & Conditions — A2ZUK",
  description:
    "Terms and conditions for using A2ZUK and participating in platform contests.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const intro =
    "These terms explain the conditions for using A2ZUK and participating in contests hosted on the platform. Individual contests may also have additional rules, deadlines and eligibility requirements. Please review both these terms and the rules of the contest you wish to enter.";

  const termsSections: LegalSection[] = [
    {
      id: "section-1",
      number: "1",
      title: "Acceptance of terms",
      content: (
        <>
          <p>
            By accessing or using the A2ZUK platform, you acknowledge that you have
            read, understood, and agree to be bound by these Terms &amp; Conditions.
            Where participation in specific features (such as entry submission)
            requires affirmative consent, users must review and agree to the
            applicable declarations before completing their action.
          </p>
          <p className="mt-2">
            A2ZUK reserves the right to modify or update these terms over time.
            Continued usage of the website after updates indicates acceptance of the
            revised terms.
          </p>
        </>
      ),
    },
    {
      id: "section-2",
      number: "2",
      title: "Eligibility and participation",
      content: (
        <>
          <p>
            Contests hosted on A2ZUK are open to eligible participants as specified
            in the rules for each contest. For contests involving infants, toddlers,
            or minors:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              Only a biological parent or legally appointed court guardian may
              submit an entry on behalf of a minor child.
            </li>
            <li>
              Submitters must provide required affirmations of parentage or legal
              guardianship authority during the submission journey.
            </li>
          </ul>
        </>
      ),
      pendingNote:
        "Universal age thresholds, state-specific geographic restrictions within India, and exact guardian verification proof standards require confirmation prior to launch.",
    },
    {
      id: "section-3",
      number: "3",
      title: "Contest-specific rules",
      content: (
        <p>
          Each contest hosted on A2ZUK may feature its own specific calendar dates,
          eligibility criteria, submission deadlines, categories, and winner-selection
          methodology. In the event of an irreconcilable conflict between these
          general terms and contest-specific rules, the specific contest rules
          published on that contest&apos;s details page shall take precedence for that
          campaign.
        </p>
      ),
    },
    {
      id: "section-4",
      number: "4",
      title: "Submissions and content rights",
      content: (
        <>
          <p>
            Participants and submitting guardians must hold all necessary copyrights,
            permissions, and moral rights to submit any photograph or content.
            Submitting content that infringes upon third-party intellectual property
            or privacy is strictly prohibited.
          </p>
          <p className="mt-2">
            <strong>License to Display:</strong> By submitting an entry, the guardian
            grants A2ZUK a non-exclusive, limited license to display the photograph
            publicly within the context of the contest on the website. This does not
            constitute a transfer of copyright ownership.
          </p>
          <p className="mt-2">
            <strong>Removal Requests:</strong> Guardians may request the withdrawal
            and unpublishing of their entry at any point during or after the contest.
          </p>
        </>
      ),
      pendingNote:
        "The precise contractual license scope, promotional usage allowances, and withdrawal execution timelines must be finalized with legal counsel.",
    },
    {
      id: "section-5",
      number: "5",
      title: "Automated checks and publication",
      content: (
        <p>
          Submissions undergo automated pre-publication screening to evaluate image
          formatting, file integrity, and basic eligibility. Submissions that pass
          required checks are published directly to the public gallery. Submissions
          that fail automated checks are not published.
        </p>
      ),
      pendingNote:
        "Detailed error rejection messaging, resubmission allowances, and manual appeal channels remain subject to operational design decisions.",
    },
    {
      id: "section-6",
      number: "6",
      title: "Voting rules and fair participation",
      content: (
        <>
          <p>
            To foster community enthusiasm and genuine participation, public voting
            is authenticated via verified Google Sign-In to uphold strict one person, one vote integrity.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              Each verified voter receives exactly 1 official vote in the contest. Once cast, the ballot is sealed and permanent.
            </li>
            <li>
              Voting must reflect genuine individual human choices. Any attempt to
              manipulate vote counts using automated scripts, click farms, botnets,
              or fraudulent techniques is strictly prohibited.
            </li>
            <li>
              Suspicious activity may trigger secondary verification challenges or
              disqualification of fraudulent tallies during post-contest auditing.
            </li>
          </ul>
        </>
      ),
      pendingNote:
        "Specific anomaly detection and anti-abuse thresholds remain subject to continuous monitoring.",
    },
    {
      id: "section-7",
      number: "7",
      title: "Prohibited use",
      content: (
        <>
          <p>Users agree not to engage in any activity that:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              Submits unlawful, abusive, deceptive, defamatory, or inappropriate
              imagery.
            </li>
            <li>
              Misrepresents legal guardianship or submits photographs of minors
              without proper authorization.
            </li>
            <li>
              Interferes with, disrupts, or compromises the infrastructure or
              security of the platform.
            </li>
            <li>
              Circumvents voting rules, casts duplicate ballots, or tampers with the voting ledger.
            </li>
          </ul>
          <p className="mt-2">
            A2ZUK reserves the right to unpublish entries and disqualify participants
            found in violation of these rules.
          </p>
        </>
      ),
    },
    {
      id: "section-8",
      number: "8",
      title: "Winners, prizes and sponsors",
      content: (
        <p>
          Winner selection methodology, prize conditions (if any), and post-contest
          audit verification procedures are governed by the specific rules approved
          for each contest. Public vote counts displayed during active voting are
          provisional and subject to audit before final declarations are made.
        </p>
      ),
      pendingNote:
        "Prize fulfillment workflows, sponsor partnerships, tax compliance obligations, and tie-breaking protocols must be confirmed before launch.",
    },
    {
      id: "section-9",
      number: "9",
      title: "Availability and changes",
      content: (
        <p>
          While we strive for high system reliability, A2ZUK is provided on an &ldquo;as
          available&rdquo; basis. We reserve the right to perform scheduled maintenance,
          resolve technical interruptions, or adjust contest schedules when
          necessary to preserve integrity and fairness.
        </p>
      ),
    },
    {
      id: "section-10",
      number: "10",
      title: "Liability, disputes and contact",
      content: (
        <p>
          These terms represent the preliminary operational framework for the
          platform. Formal statutory provisions governing limitation of liability,
          dispute resolution mechanisms, applicable governing law, and jurisdiction
          will be finalized and published following legal review.
        </p>
      ),
      pendingNote:
        "Governing jurisdiction, dispute escalation procedures, and official corporate service contact addresses must be reviewed by legal counsel.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Header />

        <main className="flex-1 flex flex-col">
          <LegalDocView
            title="Terms & Conditions"
            intro={intro}
            sections={termsSections}
          />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </div>
  );
}
