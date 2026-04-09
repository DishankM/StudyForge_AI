export const metadata = {
  title: "Privacy Policy | StudyForge",
  description: "StudyForge Privacy Policy covering account data, uploaded study material, AI processing, cookies, and user rights.",
};

const effectiveDate = "April 9, 2026";

function PolicySection({
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

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section>
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-primary-pink">Privacy Policy</p>
          <h1 className="text-4xl font-semibold text-text-primary">How StudyForge handles your data</h1>
          <p className="mt-4 text-base leading-8 text-text-secondary">
            This Privacy Policy explains what information StudyForge collects, how we use it, when it may be shared, and the choices you have when using the platform.
          </p>
          <p className="mt-3 text-sm text-text-muted">Effective date: {effectiveDate}</p>
        </section>

        <PolicySection title="Information We Collect">
          <p className="text-base leading-7 text-text-secondary">
            We collect information you provide directly when you create an account, sign in, upload study material, generate outputs, contact support, or manage your subscription. This may include your name, email address, profile image, authentication provider details, and the content you upload or generate inside the platform.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            We also collect technical and usage information such as IP address, browser and device details, session data, search activity, request logs, and security events used to protect the service, prevent abuse, and improve reliability.
          </p>
        </PolicySection>

        <PolicySection title="How We Use Information">
          <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-text-secondary">
            <li>To create and manage your account and authenticate access to the platform.</li>
            <li>To process uploads and generate notes, MCQs, viva questions, exam papers, and related study outputs.</li>
            <li>To provide customer support, account notices, onboarding messages, and service-related updates.</li>
            <li>To detect suspicious activity, enforce limits, investigate misuse, and keep the platform secure.</li>
            <li>To improve product quality, usability, and performance based on aggregate or operational insights.</li>
          </ul>
        </PolicySection>

        <PolicySection title="Uploads and AI Processing">
          <p className="text-base leading-7 text-text-secondary">
            When you upload study material or request generated content, StudyForge processes that material through internal services and third-party infrastructure used to extract text, generate outputs, and deliver results in your dashboard.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            You should only upload material that you are permitted to use. AI-generated outputs may contain mistakes, omissions, or formatting issues, so you remain responsible for reviewing generated content before relying on it for academic or professional purposes.
          </p>
        </PolicySection>

        <PolicySection title="Cookies, Sessions, and Similar Technologies">
          <p className="text-base leading-7 text-text-secondary">
            We use cookies and similar technologies to keep you signed in, remember preferences, support authentication flows, maintain security protections, and understand how the site is being used. Some cookies are necessary for core functionality and cannot be disabled without affecting the service.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            You can usually control cookies through your browser settings, but disabling certain cookies may prevent parts of StudyForge from working correctly.
          </p>
        </PolicySection>

        <PolicySection title="When We Share Information">
          <p className="text-base leading-7 text-text-secondary">
            We do not sell your personal information. We may share information with service providers and infrastructure partners that help us operate StudyForge, such as hosting, authentication, storage, analytics, email delivery, AI processing, or payment-related systems where applicable.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            We may also disclose information when reasonably necessary to comply with legal obligations, protect users or the platform, investigate fraud or abuse, or enforce our policies and Terms of Service.
          </p>
        </PolicySection>

        <PolicySection title="Data Retention">
          <p className="text-base leading-7 text-text-secondary">
            We keep personal information and platform content for as long as it is reasonably necessary to provide the service, maintain legitimate business records, resolve disputes, meet legal obligations, and preserve security or audit logs.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            Retention periods may vary depending on the kind of data involved, account status, operational needs, and the legal requirements that apply to us.
          </p>
        </PolicySection>

        <PolicySection title="Your Choices and Rights">
          <p className="text-base leading-7 text-text-secondary">
            Depending on your location, you may have rights to access, correct, delete, or restrict certain personal information, and in some cases request a copy of your data. You may also be able to close your account or request deletion of account-associated information, subject to legal and operational retention needs.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            If you would like to exercise a privacy request, contact us through the support or contact channel provided on the site and include enough information for us to verify the request.
          </p>
        </PolicySection>

        <PolicySection title="Security">
          <p className="text-base leading-7 text-text-secondary">
            StudyForge uses reasonable technical and organizational measures to protect account data, uploaded materials, and service operations. These measures may include authentication controls, access restrictions, logging, monitoring, and abuse protection.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            No internet service can guarantee absolute security, so you should also help protect your account by using strong credentials and reporting suspected unauthorized activity promptly.
          </p>
        </PolicySection>

        <PolicySection title="Children and Educational Use">
          <p className="text-base leading-7 text-text-secondary">
            StudyForge is intended for users who are legally permitted to use online services in their jurisdiction. If the service is used in an educational setting, the institution or account holder remains responsible for ensuring that use of the platform complies with applicable policies and consent requirements.
          </p>
        </PolicySection>

        <PolicySection title="Changes to This Policy">
          <p className="text-base leading-7 text-text-secondary">
            We may update this Privacy Policy from time to time to reflect changes in the service, our practices, or applicable law. When we make material updates, we may revise the effective date and provide additional notice where appropriate.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            Continued use of StudyForge after an updated policy becomes effective means the updated policy will apply to your use of the service.
          </p>
        </PolicySection>

        <PolicySection title="Contact">
          <p className="text-base leading-7 text-text-secondary">
            If you have privacy questions, data requests, or concerns about this policy, please contact the StudyForge team through the support or contact details made available on the platform.
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
