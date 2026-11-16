import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalDocView, { LegalSection } from "@/components/LegalDocView";

export const metadata: Metadata = {
  title: "Privacy Policy — A2ZUK",
  description:
    "Understand how A2ZUK handles personal information, contest submissions, voting limits, and child privacy.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const intro =
    "Your privacy matters to us. This policy explains how A2ZUK handles information when you visit the platform, participate in contests or interact with public entries. Please read it to understand what information is collected, how it is used and what choices may be available to you.";

  const privacySections: LegalSection[] = [
    {
      id: "section-1",
      number: "1",
      title: "Who operates A2ZUK?",
      content: (
        <p>
          A2ZUK is an online contest platform designed to host community contests
          and celebratory campaigns for families across India. For any inquiries, feedback, or privacy matters, our team can be reached directly at support@a2zuk.in.
        </p>
      ),
    },
    {
      id: "section-2",
      number: "2",
      title: "Information we collect",
      content: (
        <>
          <p>
            Depending on how you interact with the A2ZUK platform, we collect
            the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <strong>Contest submission forms:</strong> Information provided by
              parents or legal guardians during entry submission (such as child
              display name, date of birth, guardian full name, relationship to the child, and
              guardian contact phone number, address, and email address).
            </li>
            <li>
              <strong>Submitted photos and entry details:</strong> Photographs
              uploaded for contest participation and associated timestamps.
            </li>
            <li>
              <strong>Voting and integrity information:</strong> Cryptographic hashes
              and network identifiers (such as hashed IP addresses, browser headers, and submission
              timestamps) necessary to enforce our 1-vote-per-contestant policy and
              protect against automated manipulation.
            </li>
            <li>
              <strong>Technical information:</strong> Basic log data collected
              automatically to ensure operational stability, including HTTP request
              methods, page views, and error telemetry.
            </li>
            <li>
              <strong>Support communications:</strong> Information contained in
              inquiries or reports submitted regarding contest entries or platform
              behavior.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "section-3",
      number: "3",
      title: "How information is used",
      content: (
        <>
          <p>
            Information collected through A2ZUK is used strictly for legitimate
            operational purposes, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Operating active contests and managing entry lifecycles.</li>
            <li>
              Publishing approved eligible entries to public contest galleries.
            </li>
            <li>
              Administering voting limits and preserving voting fairness.
            </li>
            <li>
              Communicating with guardians regarding submission status, entry
              verification, or contest outcomes.
            </li>
            <li>
              Investigating reported concerns, intellectual property questions,
              or technical security incidents.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "section-4",
      number: "4",
      title: "Public entries and photos",
      content: (
        <>
          <p>
            When an entry passes our safety and quality review and is published, only the
            following details become visible to visitors on the platform:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>The approved participant photograph.</li>
            <li>The child&apos;s display name or nickname.</li>
            <li>The child&apos;s age category (e.g., Under 12 Months) and general city/state.</li>
            <li>Public verified vote counts accrued by the entry.</li>
          </ul>
          <p className="mt-2">
            <strong>Guardian Privacy Protection:</strong> Private guardian contact
            credentials (including telephone numbers, email addresses, street addresses, and exact dates of birth) are kept strictly confidential and are never exposed on public
            contestant profiles or public API endpoints.
          </p>
        </>
      ),
    },
    {
      id: "section-5",
      number: "5",
      title: "Children and guardian consent",
      content: (
        <>
          <p>
            Protecting the privacy and dignity of minors is a paramount commitment
            on A2ZUK. For child-focused photo contests:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              Submissions may only be made by a verified biological parent or
              court-appointed legal guardian.
            </li>
            <li>
              The submitting guardian must provide explicit affirmative declarations
              authorizing the display of the child&apos;s photograph within the
              contest gallery.
            </li>
            <li>
              Parents or guardians retain the right to request the withdrawal or
              removal of their child&apos;s entry at any time by contacting support@a2zuk.in.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "section-6",
      number: "6",
      title: "Cookies and technical services",
      content: (
        <p>
          A2ZUK uses essential functional cookies and session storage strictly
          necessary to operate navigation, maintain security integrity, and ensure
          authentic voting participation via Google Sign-In. We do not sell user data or deploy third-party advertising tracking networks.
        </p>
      ),
    },
    {
      id: "section-7",
      number: "7",
      title: "Data sharing, security and retention",
      content: (
        <>
          <p>
            We do not sell, rent, or trade participant or guardian personal
            information to third parties. Information is disclosed only when required
            by law or when essential to infrastructure operations (such as secure cloud
            hosting on Supabase).
          </p>
          <p className="mt-2">
            <strong>Retention:</strong> Entry data and photographs are retained for
            the duration of the applicable contest lifecycle and verified audit
            window. When an authorized removal request is approved, the entry is
            de-indexed, unpublished, and permanently removed from public view.
          </p>
        </>
      ),
    },
    {
      id: "section-8",
      number: "8",
      title: "User choices and privacy requests",
      content: (
        <p>
          Participants and guardians may request access to, correction of, or
          permanent deletion of their submitted records at any time. If you believe an entry
          contains unauthorized imagery of your child or infringes upon your
          privacy rights, you may submit an entry removal request directly to support@a2zuk.in.
        </p>
      ),
    },
    {
      id: "section-9",
      number: "9",
      title: "Policy updates and contact",
      content: (
        <p>
          We may update this Privacy Policy from time to time to reflect evolving
          contest operations, technical improvements, or regulatory requirements.
          Material updates will be posted directly to this page with an updated
          revision date. For any questions, please contact support@a2zuk.in.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Header />

        <main className="flex-1 flex flex-col">
          <LegalDocView
            title="Privacy Policy"
            intro={intro}
            sections={privacySections}
            lastUpdatedLabel="Effective: November 2026"
          />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </div>
  );
}
