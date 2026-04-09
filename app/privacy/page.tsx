export const metadata = {
  title: "Privacy Policy | StudyForge",
  description: "StudyForge Privacy Policy for data handling, AI processing, and user privacy rights.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section>
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary-pink">Privacy Policy</p>
          <h1 className="text-4xl font-semibold text-text-primary">Your privacy matters</h1>
          <p className="mt-4 text-base leading-8 text-text-secondary">
            This Privacy Policy explains how StudyForge collects, uses, discloses, and protects your personal information when you use our services.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Information We Collect</h2>
          <p className="text-base leading-7 text-text-secondary">
            We may collect information you provide directly, including account details, uploaded study material, and support requests. We also collect usage information when you interact with the website, such as browser data and activity logs.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">How We Use Your Data</h2>
          <ul className="space-y-3 text-base leading-7 text-text-secondary list-disc pl-5">
            <li>To provide, maintain, and improve StudyForge services.</li>
            <li>To generate study materials, practice content, and AI-assisted outputs based on your uploads.</li>
            <li>To communicate with you about your account, updates, and support requests.</li>
            <li>To monitor usage and protect against fraud or unauthorized activity.</li>
          </ul>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">AI Processing and Generated Content</h2>
          <p className="text-base leading-7 text-text-secondary">
            When you upload material or request generated content, StudyForge uses AI tools to process your data and produce outputs such as notes, questions, and exam preparation materials. Generated content is intended to support your study workflows and may not be perfect. Always verify results before relying on them.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Cookies and Tracking</h2>
          <p className="text-base leading-7 text-text-secondary">
            We use cookies and similar technologies to personalize your experience, remember preferences, and analyze site usage. You can manage cookie settings through your browser or any controls we provide on the website.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Your Rights</h2>
          <p className="text-base leading-7 text-text-secondary">
            You may access, update, or delete your account information by contacting us. If you are located in a region with data protection laws, you may also have rights to restrict or object to processing, and to request data portability.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Security</h2>
          <p className="text-base leading-7 text-text-secondary">
            We maintain reasonable technical and organizational measures to protect your information. However, no online service can guarantee absolute security.
          </p>
        </section>

        <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold text-text-primary">Changes to This Policy</h2>
          <p className="text-base leading-7 text-text-secondary">
            We may update this policy over time. When we do, we will revise the effective date and provide notice where required by law.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            If you have questions, please contact us through the channels listed on the site.
          </p>
        </section>
      </div>
    </main>
  );
}
