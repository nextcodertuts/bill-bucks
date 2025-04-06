/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-10">
      <Head>
        <title>Privacy Policy - Bill Buckz</title>
        <meta name="description" content="Privacy Policy for Bill Buckz" />
      </Head>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Privacy Policy for Bill Buckz
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          <strong>Last Updated: April 6, 2025</strong>
        </p>

        <p className="mb-4">
          Welcome to Bill Buckz! We value your privacy and are committed to
          protecting your personal information. This Privacy Policy explains how
          we collect, use, store, and safeguard your data when you use our
          application ("Bill Buckz" or "the App"), to store and track your
          invoices. By using Bill Buckz, you agree to the practices described in
          this policy.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect the following information from you when you use Bill
            Buckz:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Personal Information</strong>: Your name and phone number
              only. We do not collect email addresses.
            </li>
            <li>
              <strong>Contact Information</strong>: With your explicit consent,
              we may access your device contacts (names and phone numbers only)
              to help you connect with friends who are already using our app and
              to provide personalized recommendations.
            </li>
            <li>
              <strong>Invoice Details</strong>: Information related to the
              invoices you upload or input, such as invoice numbers, dates,
              amounts, and any other details you provide to help you track your
              invoices.
            </li>
          </ul>
          <p className="mt-2">
            We only collect information that you voluntarily provide while using
            the App or that you explicitly consent to share.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc ml-6">
            <li>
              To provide and improve the functionality of Bill Buckz, enabling
              you to store, manage, and track your invoices effectively.
            </li>
            <li>
              To enhance your social experience by connecting you with friends
              who are already using the app.
            </li>
            <li>
              To provide personalized recommendations and features based on your
              contacts and usage patterns.
            </li>
            <li>
              To communicate with you, such as responding to your inquiries or
              sending updates about the App (e.g., new features or service
              changes).
            </li>
            <li>To ensure the security and integrity of the App.</li>
            <li>To comply with legal obligations, if applicable.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Contact Access and Usage
          </h2>
          <p>
            Our app may request access to your device contacts. Here's how we
            handle this data:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Explicit Consent</strong>: We will always ask for your
              explicit permission before accessing your contacts. You can
              decline this permission without affecting the core functionality
              of the app.
            </li>
            <li>
              <strong>Limited Data Collection</strong>: We only collect names
              and phone numbers from your contacts. We do not collect email
              addresses or other contact details.
            </li>
            <li>
              <strong>Purpose of Collection</strong>: We use this information
              to:
              <ul className="list-disc ml-6 mt-2">
                <li>
                  Show you which of your friends are already using the app
                </li>
                <li>Make it easier to share content with your friends</li>
                <li>Provide personalized recommendations</li>
              </ul>
            </li>
            <li>
              <strong>Control Over Your Data</strong>: You can revoke contact
              permissions at any time through your device settings.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            4. How We Store and Protect Your Information
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Storage</strong>: Your data is stored securely on our
              servers, which are hosted using industry-standard cloud providers.
              We implement reasonable measures to protect your information from
              unauthorized access, loss, or misuse.
            </li>
            <li>
              <strong>Security</strong>: We use encryption and other safeguards
              to protect your personal information and invoice details. However,
              no system is completely immune to risks, and we cannot guarantee
              absolute security.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            5. Sharing Your Information
          </h2>
          <p>
            We do not sell, trade, or otherwise share your personal information
            with third parties, except in the following cases:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Service Providers</strong>: We may share your data with
              trusted third-party vendors (e.g., cloud hosting services) who
              assist us in operating the App, provided they agree to keep your
              information confidential.
            </li>
            <li>
              <strong>Legal Requirements</strong>: We may disclose your
              information if required by law or to protect the rights, safety,
              or property of Bill Buckz, our users, or others.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            6. Your Choices and Rights
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Access and Update</strong>: You can review and update your
              personal information (e.g., name, phone number) within the App at
              any time.
            </li>
            <li>
              <strong>Contact Permissions</strong>: You can grant or revoke
              contact access permissions at any time through your device
              settings.
            </li>
            <li>
              <strong>Deletion</strong>: If you wish to delete your account and
              all associated data (including any stored contacts), please
              contact us at{" "}
              <a
                href="mailto:contact@nextcoder.co.in"
                className="text-blue-600 hover:underline"
              >
                contact@nextcoder.co.in
              </a>
              , and we will process your request promptly, subject to any legal
              obligations we may have to retain certain data.
            </li>
            <li>
              <strong>Opt-Out</strong>: You may opt out of non-essential
              communications (e.g., updates) by adjusting your preferences in
              the App or contacting us.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p>
            We retain your personal information, contact data, and invoice
            details for as long as your account is active or as needed to
            provide you with the App's services. If you delete your account, we
            will remove your data within a reasonable timeframe, except where we
            are required to retain it for legal or operational purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
          <p>
            Bill Buckz may contain links to third-party websites or services
            (e.g., payment processors). We are not responsible for the privacy
            practices of these external sites. We encourage you to review their
            privacy policies before interacting with them.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Children's Privacy</h2>
          <p>
            Bill Buckz is not intended for use by individuals under the age of
            13. We do not knowingly collect personal information from children
            under 13. If we learn that such data has been collected, we will
            take steps to delete it immediately.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of significant updates by posting the revised policy in the App or
            via email (if provided). The "Last Updated" date at the top of this
            page indicates when the policy was last revised.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            11. Marketing and Promotional Communication
          </h2>
          <p>
            By providing your phone number during registration, you agree to
            receive marketing and promotional updates from Bill Buckz. These
            updates may include special offers, promotions, and other relevant
            information.
          </p>
          <p>
            You can opt-out of receiving promotional messages at any time by
            following the instructions provided in the messages or by contacting
            us at
            <a
              href="mailto:contact@nextcoder.co.in"
              className="text-blue-600 hover:underline"
            >
              {" "}
              contact@nextcoder.co.in
            </a>
            .
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or your data, please reach out to us at:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Email</strong>:{" "}
              <a
                href="mailto:contact@nextcoder.co.in"
                className="text-blue-600 hover:underline"
              >
                contact@nextcoder.co.in
              </a>
            </li>
          </ul>
        </section>

        <p className="text-center text-gray-600">
          Thank you for trusting Bill Buckz with your invoice tracking needs.
          We're here to make your experience seamless and secure!
        </p>
      </div>
    </div>
  );
}
