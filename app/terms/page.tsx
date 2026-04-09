export const metadata = {
  title: "Terms of Service | StudyForge",
  description: "StudyForge Terms of Service for use of the website, account responsibilities, and legal disclaimers.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section>
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary-pink">Terms of Service</p>
          <h1 className="text-4xl font-semibold text-text-primary">Use StudyForge responsibly</h1>
          <p className="mt-4 text-base leading-8 text-text-secondary">
            These Terms of Service govern your access to and use of StudyForge. By using our service, you agree to the terms described below.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Acceptance of Terms</h2>
          <p className="text-base leading-7 text-text-secondary">
            By creating an account or using StudyForge, you accept these Terms. If you do not agree, please do not use the service.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Account Responsibility</h2>
          <p className="text-base leading-7 text-text-secondary">
            You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately if you suspect unauthorized access.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Acceptable Use</h2>
          <ul className="space-y-3 text-base leading-7 text-text-secondary list-disc pl-5">
            <li>Do not use StudyForge for illegal activities or to generate harmful, abusive, or copyrighted content without permission.</li>
            <li>Do not attempt to bypass security measures or access other users' accounts.</li>
            <li>Do not upload content that violates third-party rights or applicable laws.</li>
          </ul>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Generated Content</h2>
          <p className="text-base leading-7 text-text-secondary">
            AI-generated study materials are provided for educational support. StudyForge does not guarantee accuracy, completeness, or suitability for any particular purpose. You are responsible for reviewing and verifying the output.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Disclaimer and Limitation of Liability</h2>
          <p className="text-base leading-7 text-text-secondary">
            StudyForge is provided "as is" and "as available". To the maximum extent permitted by law, we disclaim all warranties and are not liable for indirect, incidental, or consequential damages.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Changes to the Terms</h2>
          <p className="text-base leading-7 text-text-secondary">
            We may update these Terms over time. Continued use of the service after the changes indicates your acceptance of the updated Terms.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            If you have questions about these Terms, please contact us through the site.
          </p>
        </section>
      </div>
    </main>
  );
}
