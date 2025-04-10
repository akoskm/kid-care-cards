import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Kid Care Cards',
  description: 'Privacy Policy for Kid Care Cards application',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-4">
          Kid Care Cards (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
        <p className="mb-4">
          We only collect the information that you explicitly enter into the application. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Account information (email, name) when you sign up</li>
          <li>Child information (name, age) that you choose to add</li>
          <li>Health tracking data (symptoms, notes) that you record</li>
        </ul>
        <p className="mb-4">
          We do not collect any additional information beyond what you explicitly provide. We do not track your location, browsing history, or any other personal data outside of what you enter into the app.
        </p>
        <p className="mb-4">
          For website analytics, we use Plausible Analytics, a privacy-friendly analytics tool that is GDPR compliant. Plausible does not use cookies and does not collect any personal data. It only provides us with aggregated statistics about website usage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
        <p className="mb-4">
          We use the collected information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and maintain our service</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact me at hello@akoskm.com.
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-8">
        Last updated: 10th April 2025
      </p>
    </div>
  )
}