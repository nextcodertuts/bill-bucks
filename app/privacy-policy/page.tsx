/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Head>
        <title>Privacy Policy - Bill Bucks</title>
        <meta name="description" content="Privacy Policy for Bill Bucks" />
      </Head>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Privacy Policy for Bill Bucks
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          <strong>Last Updated: February 27, 2025</strong>
        </p>

        <p className="mb-4">
          Welcome to Bill Bucks! We value your privacy and are committed to
          protecting your personal information. This Privacy Policy explains how
          we collect, use, store, and safeguard your data when you use our
          application ("Bill Bucks" or "the App"), built on Next.js, to store
          and track your invoices. By using Bill Bucks, you agree to the
          practices described in this policy.
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect the following information from you when you use Bill
            Bucks:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Personal Information</strong>: Your name, Your phone
              number
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
            the App.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc ml-6">
            <li>
              To provide and improve the functionality of Bill Bucks, enabling
              you to store, manage, and track your invoices effectively.
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
            3. How We Store and Protect Your Information
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
            4. Sharing Your Information
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
              or property of Bill Bucks, our users, or others.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            5. Your Choices and Rights
          </h2>
          <ul className="list-disc ml-6">
            <li>
              <strong>Access and Update</strong>: You can review and update your
              personal information (e.g., name, phone number) within the App at
              any time.
            </li>
            <li>
              <strong>Deletion</strong>: If you wish to delete your account and
              all associated data, please contact us at{" "}
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
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p>
            We retain your personal information and invoice details for as long
            as your account is active or as needed to provide you with the App’s
            services. If you delete your account, we will remove your data
            within a reasonable timeframe, except where we are required to
            retain it for legal or operational purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Third-Party Links</h2>
          <p>
            Bill Bucks may contain links to third-party websites or services
            (e.g., payment processors). We are not responsible for the privacy
            practices of these external sites. We encourage you to review their
            privacy policies before interacting with them.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Children’s Privacy</h2>
          <p>
            Bill Bucks is not intended for use by individuals under the age of
            13. We do not knowingly collect personal information from children
            under 13. If we learn that such data has been collected, we will
            take steps to delete it immediately.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of significant updates by posting the revised policy in the App or
            via email (if provided). The “Last Updated” date at the top of this
            page indicates when the policy was last revised.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
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
          Thank you for trusting Bill Bucks with your invoice tracking needs.
          We’re here to make your experience seamless and secure!
        </p>
      </div>
    </div>
  );
}
