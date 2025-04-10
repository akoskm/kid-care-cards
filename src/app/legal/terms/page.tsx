import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Kid Care Cards',
  description: 'Terms of Service for Kid Care Cards application',
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using Kid Care Cards, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
        <p className="mb-4">
          Kid Care Cards provides a platform for tracking and managing children&apos;s health information. The service is intended for informational purposes only and should not be used as a substitute for professional medical advice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
        <p className="mb-4">
          As a user of Kid Care Cards, you understand that:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>You are responsible for maintaining the security of your account</li>
          <li>The information you track is for your personal use and reference</li>
          <li>You should consult with healthcare professionals for medical advice</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Limitation of Liability</h2>
        <p className="mb-4">
          Kid Care Cards shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-8">
        Last updated: 10th April 2025
      </p>
    </div>
  )
}