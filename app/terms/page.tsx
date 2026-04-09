export const metadata = {
  title: "Terms of Service | StudyForge",
  description: "StudyForge Terms of Service covering account use, acceptable use, generated content, billing expectations, and legal limitations.",
};

const effectiveDate = "April 9, 2026";

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section>
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary-pink">Terms of Service</p>
          <h1 className="text-4xl font-semibold text-text-primary">Terms for using StudyForge</h1>
          <p className="mt-4 text-base leading-8 text-text-secondary">
            These Terms of Service govern your access to and use of StudyForge, including the website, dashboard, uploads, generated outputs, and related services.
          </p>
          <p className="mt-3 text-sm text-text-muted">Effective date: {effectiveDate}</p>
        </section>

        <TermsSection title="Acceptance of Terms">
          <p className="text-base leading-7 text-text-secondary">
            By creating an account, accessing the site, or using StudyForge, you agree to be bound by these Terms and any policies referenced within them. If you do not agree, you should not use the service.
          </p>
        </TermsSection>

        <TermsSection title="Eligibility and Accounts">
          <p className="text-base leading-7 text-text-secondary">
            You are responsible for providing accurate account information and for maintaining the confidentiality of your login credentials. You are also responsible for activity that occurs under your account unless caused by our own failure to secure the service.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            We may suspend, restrict, or terminate access if we reasonably believe an account is being used in violation of these Terms, applicable law, or platform security requirements.
          </p>
        </TermsSection>

        <TermsSection title="Acceptable Use">
          <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-text-secondary">
            <li>Do not use StudyForge for unlawful, fraudulent, abusive, or harmful activity.</li>
            <li>Do not attempt to bypass authentication, rate limits, or other security protections.</li>
            <li>Do not access another user&apos;s account, data, or content without authorization.</li>
            <li>Do not upload or generate content that infringes intellectual property rights or violates applicable law.</li>
            <li>Do not use automated tools in a way that disrupts the platform or unfairly consumes shared resources.</li>
          </ul>
        </TermsSection>

        <TermsSection title="Your Content">
          <p className="text-base leading-7 text-text-secondary">
            You retain responsibility for the files, prompts, text, and other content you submit to StudyForge. You confirm that you have the rights or permissions needed to upload and use that content with the service.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            You grant StudyForge the limited rights necessary to host, process, analyze, and transform your content for the purpose of operating the platform and providing requested outputs to you.
          </p>
        </TermsSection>

        <TermsSection title="AI-Generated Outputs">
          <p className="text-base leading-7 text-text-secondary">
            StudyForge uses automated systems and AI tools to generate notes, MCQs, viva content, exam papers, and similar educational outputs. These outputs are provided to support study workflows and may contain inaccuracies, omissions, or formatting issues.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            You are responsible for reviewing generated outputs and deciding whether they are appropriate for your intended use. StudyForge does not guarantee that generated material will be correct, complete, or acceptable for academic submission.
          </p>
        </TermsSection>

        <TermsSection title="Plans, Trials, and Paid Features">
          <p className="text-base leading-7 text-text-secondary">
            Some parts of the service may be offered on a free plan, trial basis, or paid plan. Availability of features, usage limits, and access duration may vary depending on the plan tied to your account.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            If paid billing is introduced or expanded, additional pricing or subscription terms may apply and will be presented to you before purchase or renewal where required.
          </p>
        </TermsSection>

        <TermsSection title="Availability and Service Changes">
          <p className="text-base leading-7 text-text-secondary">
            We may modify, suspend, or discontinue parts of StudyForge at any time, including features, integrations, limits, or workflows. We may also release updates, patches, or changes required for security, compliance, or performance reasons.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            We do not guarantee uninterrupted availability and are not responsible for downtime caused by maintenance, third-party dependencies, infrastructure failures, or events outside our reasonable control.
          </p>
        </TermsSection>

        <TermsSection title="Termination">
          <p className="text-base leading-7 text-text-secondary">
            You may stop using the service at any time. We may suspend or terminate your access if you materially breach these Terms, create security risk, misuse the platform, or if continued access would expose us or other users to harm.
          </p>
        </TermsSection>

        <TermsSection title="Disclaimers">
          <p className="text-base leading-7 text-text-secondary">
            StudyForge is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied, to the fullest extent permitted by law. This includes implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy.
          </p>
        </TermsSection>

        <TermsSection title="Limitation of Liability">
          <p className="text-base leading-7 text-text-secondary">
            To the maximum extent permitted by law, StudyForge and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of data, profits, goodwill, or business interruption arising out of or related to your use of the service.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            Where liability cannot be excluded, it will be limited to the amount you paid, if any, for the relevant service during the period directly preceding the claim, subject to applicable law.
          </p>
        </TermsSection>

        <TermsSection title="Changes to These Terms">
          <p className="text-base leading-7 text-text-secondary">
            We may update these Terms from time to time. When material changes are made, we may revise the effective date and provide notice where appropriate. Continued use of StudyForge after updated Terms take effect means the updated Terms will apply to your use of the service.
          </p>
        </TermsSection>

        <TermsSection title="Contact">
          <p className="text-base leading-7 text-text-secondary">
            If you have questions about these Terms, please contact the StudyForge team through the support or contact channel made available on the platform.
          </p>
        </TermsSection>
      </div>
    </main>
  );
}
