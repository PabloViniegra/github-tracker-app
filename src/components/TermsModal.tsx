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
 * TermsModal Component
 *
 * Modal displaying Terms and Conditions for the GitHub Activity Tracker app.
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
 * <TermsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 */
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
      aria-labelledby="terms-modal-title"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 id="terms-modal-title" className="text-2xl font-bold">
            Terms and Conditions
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
              1. Acceptance of Terms
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              By accessing and using GitHub Activity Tracker (&quot;the Application&quot;), you agree
              to be bound by these Terms and Conditions. If you do not agree with any
              part of these terms, you should not use the Application.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              2. Service Description
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              GitHub Activity Tracker is an application that allows users to monitor
              their GitHub activity in real-time, including:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Tracking GitHub repositories</li>
              <li>Receiving notifications via webhooks</li>
              <li>Viewing GitHub events and activities</li>
              <li>Analyzing repository metrics</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              3. Authentication and User Account
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              To use the Application, you must authenticate using your GitHub account.
              You are responsible for:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Maintaining the confidentiality of your access credentials</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying any unauthorized use of your account</li>
              <li>Complying with GitHub&apos;s Terms of Service</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              4. Permissions and Data Access
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              By authenticating with GitHub, you grant the Application limited permissions to:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Read your public GitHub profile information</li>
              <li>Access your list of repositories</li>
              <li>Read events and activities from your repositories</li>
              <li>Configure webhooks on repositories specified by you</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              5. Usage Limitations
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              The Application is subject to the following limitations:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>API rate limits as established by GitHub</li>
              <li>Data storage and processing restrictions</li>
              <li>Service availability not guaranteed at 100%</li>
              <li>Possible interruptions due to scheduled maintenance</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              6. Prohibited Use
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              You agree NOT to use the Application to:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-default-600">
              <li>Violate applicable laws or regulations</li>
              <li>Perform reverse engineering or attempt to access the source code</li>
              <li>Overload or damage the Application&apos;s infrastructure</li>
              <li>Access data from other users without authorization</li>
              <li>Distribute malware or malicious content</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              7. Intellectual Property
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              All intellectual property rights related to the Application,
              including but not limited to design, code, logos, and trademarks,
              are the exclusive property of GitHub Activity Tracker and its licensors.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              8. Disclaimer of Warranties
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              THE APPLICATION IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
              OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE APPLICATION
              WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              9. Limitation of Liability
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              In no event shall we be liable for indirect, incidental,
              special, consequential, or punitive damages, including loss of profits,
              data, or use, arising from the use or inability to use the Application.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              10. Modifications to Terms
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We reserve the right to modify these Terms and Conditions at
              any time. Modifications will take effect immediately
              after being published in the Application. Your continued use of the
              Application constitutes your acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              11. Termination
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              We may suspend or terminate your access to the Application at any time,
              with or without cause, with or without prior notice. You may stop using the
              Application at any time by revoking GitHub OAuth permissions.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              12. Governing Law
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              These Terms shall be governed by and construed in accordance with applicable laws,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-default-700">
              13. Contact
            </h3>
            <p className="text-sm leading-relaxed text-default-600">
              If you have questions about these Terms and Conditions, you can contact us
              through the support channels available in the Application.
            </p>
          </section>
        </ModalBody>

        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            aria-label="Close terms and conditions"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
