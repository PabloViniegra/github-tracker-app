"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

/**
 * PrivacyModal Component
 *
 * Modal displaying Privacy Policy for the GitHub Activity Tracker app.
 *
 * Props:
 * @param {boolean} isOpen - Controls modal visibility
 * @param {() => void} onClose - Callback function to close the modal
 *
 * Features:
 * - Scrollable content for long text
 * - Accessible with proper ARIA labels
 * - Closes on backdrop click or close button
 * - Dark mode optimized
 *
 * Usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * <PrivacyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */
interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="3xl"
      classNames={{
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border-default-200 bg-background",
      }}
      aria-labelledby="privacy-modal-title"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 id="privacy-modal-title" className="text-2xl font-bold">
            Privacy Policy
          </h2>
          <p className="text-sm font-normal text-default-500">
            Last updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </ModalHeader>

        <ModalBody className="gap-4">
          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              1. Introduction
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              At GitHub Activity Tracker (&quot;we&quot;, &quot;our&quot; or &quot;the Application&quot;), we
              are committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, store, and protect your personal information
              when you use our application.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              2. Information We Collect
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We collect different types of information to provide and improve
              our service:
            </p>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              2.1. GitHub OAuth Information
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-sm text-default-600">
              <li>GitHub username</li>
              <li>Email address associated with your GitHub account</li>
              <li>Profile picture and public bio</li>
              <li>OAuth access token (stored securely)</li>
            </ul>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              2.2. Repository Data
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-sm text-default-600">
              <li>List of public and private repositories (based on granted permissions)</li>
              <li>Repository metadata (name, description, language, stars)</li>
              <li>Repository events and activities</li>
              <li>Webhook configurations set by you</li>
            </ul>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              2.3. Usage Data
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-sm text-default-600">
              <li>IP address and general location data</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent</li>
              <li>Actions performed within the application</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              3. How We Use Your Information
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We use the collected information for the following purposes:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Provide and maintain our application</li>
              <li>Authenticate your identity and manage your session</li>
              <li>Display information from your GitHub repositories</li>
              <li>Send notifications about repository events</li>
              <li>Configure and manage webhooks according to your instructions</li>
              <li>Improve functionality and user experience</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              4. Data Storage and Security
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We implement appropriate technical and organizational security measures
              to protect your information:
            </p>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              4.1. Security Measures
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-sm text-default-600">
              <li>Data encryption in transit via HTTPS/TLS</li>
              <li>Secure storage of access tokens</li>
              <li>JWT authentication with expiration time</li>
              <li>Limited data access through permission control</li>
              <li>Security monitoring and regular audits</li>
            </ul>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              4.2. Data Retention
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-default-600">
              We retain your personal information only for as long as necessary to
              fulfill the purposes set out in this policy, unless a longer retention
              period is required or permitted by law.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              5. Sharing Information with Third Parties
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We do not sell, trade, or transfer your personal information to
              third parties, except in the following cases:
            </p>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              5.1. Service Providers
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-sm text-default-600">
              <li>GitHub (for OAuth authentication and API access)</li>
              <li>Hosting and cloud storage providers</li>
              <li>Analytics and monitoring services</li>
            </ul>

            <h4 className="mb-1 mt-3 text-base font-semibold text-default-700">
              5.2. Legal Requirements
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-default-600">
              We may disclose your information if required by law, court order,
              or legal process, or to protect our rights, property, or safety.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              6. Your Privacy Rights
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              You have the following rights regarding your personal information:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to the processing of your data</li>
              <li><strong>Revocation:</strong> Revoke consent at any time</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              7. Cookies and Tracking Technologies
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We use cookies and similar technologies to:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Keep your session active</li>
              <li>Remember your user preferences</li>
              <li>Analyze application usage</li>
              <li>Improve user experience</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed text-default-600">
              You can configure your browser to reject cookies, but this may
              limit some functionalities of the application.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              8. International Data Transfers
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              Your information may be transferred to and stored on servers located
              outside your country of residence. We ensure that such transfers
              comply with applicable data protection laws and that your data
              is adequately protected.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              9. Children&apos;s Privacy
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              Our application is not directed to children under 13 years of age. We do not
              knowingly collect personal information from minors. If we discover that we have
              collected data from a minor without parental consent verification,
              we will take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              10. Third-Party Links
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              Our application may contain links to third-party websites. We are
              not responsible for the privacy practices of these sites. We
              recommend reviewing the privacy policies of any third-party sites
              you visit.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              11. Changes to this Privacy Policy
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We may update our Privacy Policy periodically. We will
              notify you of significant changes by posting the new policy
              on this page with a revised update date. We recommend
              reviewing this policy periodically to stay informed about how
              we protect your information.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              12. Revocation of Permissions
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              You can revoke the permissions granted to the application at any time
              from your GitHub account settings at:
            </p>
            <p className="mt-2 text-sm font-mono text-default-600">
              GitHub → Settings → Applications → Authorized OAuth Apps
            </p>
            <p className="mt-2 text-sm leading-relaxed text-default-600">
              By revoking permissions, the application will no longer have access to your GitHub
              data and will delete your information from our servers according to our
              retention policies.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              13. Contact and Inquiries
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              If you have questions, concerns, or requests about this Privacy
              Policy or how we handle your personal information, you can
              contact us through the support channels available in the
              application.
            </p>
          </section>

          <section className="rounded-lg bg-default-100 p-4">
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              14. Regulatory Compliance
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              This policy is designed to comply with:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>EU General Data Protection Regulation (GDPR)</li>
              <li>California Consumer Privacy Act (CCPA)</li>
              <li>Other applicable data protection laws</li>
            </ul>
          </section>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            aria-label="Close privacy policy"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
