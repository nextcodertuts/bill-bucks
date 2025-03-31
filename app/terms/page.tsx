/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen py-10">
      <Head>
        <title>Terms and Conditions - Bill Buckz</title>
        <meta
          name="description"
          content="Terms and Conditions for using Bill Buckz"
        />
      </Head>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms and Conditions
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          <strong>Last Updated: February 27, 2025</strong>
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By accessing and using Bill Buckz ("the App"), you acknowledge
              that you have read, understood, and agree to be bound by these
              Terms and Conditions. If you do not agree with any part of these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. RCS Messaging Consent
            </h2>
            <p className="text-gray-700">
              By using Bill Buckz, you explicitly consent to receive Rich
              Communication Services (RCS) messages from us. This includes:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Transaction confirmations and receipts</li>
              <li>Cashback notifications and rewards updates</li>
              <li>Important account notifications and security alerts</li>
              <li>Service updates and promotional offers</li>
              <li>Customer support communications</li>
            </ul>
            <p className="mt-2 text-gray-700">
              You acknowledge that message and data rates may apply to RCS
              messages. You can opt out of promotional messages at any time by
              updating your preferences in the app settings or contacting our
              support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Registration</h2>
            <p className="text-gray-700">To use Bill Buckz, you must:</p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Communication Preferences
            </h2>
            <p className="text-gray-700">
              By creating an account, you agree to receive:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>
                Transactional messages regarding your account and activity
              </li>
              <li>Service updates and important announcements</li>
              <li>Marketing communications (with option to opt-out)</li>
              <li>RCS messages for enhanced communication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Cashback Program</h2>
            <p className="text-gray-700">
              Our cashback program is subject to the following terms:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Cashback rates and terms may change without prior notice</li>
              <li>Minimum withdrawal amounts and processing times apply</li>
              <li>
                We reserve the right to verify all cashback claims and
                transactions
              </li>
              <li>
                Fraudulent activities will result in account termination and
                forfeiture of rewards
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. User Responsibilities
            </h2>
            <p className="text-gray-700">You agree to:</p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Submit only genuine and valid invoices</li>
              <li>Not manipulate or falsify any transaction information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>
                Report any unauthorized use or security breaches immediately
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Privacy Policy</h2>
            <p className="text-gray-700">
              Your use of Bill Buckz is also governed by our Privacy Policy,
              which outlines how we collect, use, and protect your personal
              information. By using our services, you consent to our data
              practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Modifications to Service
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify or discontinue any part of our
              service at any time. We will make reasonable efforts to notify
              users of significant changes through RCS messages or other
              communication channels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              9. Termination of Service
            </h2>
            <p className="text-gray-700">
              We may terminate or suspend your account and access to our
              services:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>For violations of these terms</li>
              <li>For fraudulent activities</li>
              <li>At our discretion with reasonable notice</li>
              <li>As required by law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Bill Buckz is provided "as is" without any warranties. We shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <p className="mt-2">
              <a
                href="mailto:contact@nextcoder.co.in"
                className="text-primary hover:underline"
              >
                contact@nextcoder.co.in
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          By using Bill Buckz, you acknowledge that you have read and understood
          these terms and conditions and agree to be bound by them.
        </div>
      </div>
    </div>
  );
}
