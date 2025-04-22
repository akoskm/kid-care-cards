import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function Home() {
  return (
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-card py-4 px-6 border-b border-border">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-semibold text-primary">
                Kid Care Cards
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a>
              <Link
                href="https://donate.stripe.com/7sI4hl9le2jf21WfYZ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Donate
                <Heart className="h-4 w-4 text-red-500 fill-red-500 transform rotate-20" />
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/sign-in" className="text-primary hover:text-primary/80 whitespace-nowrap text-sm sm:text-base">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-primary/90 text-sm sm:text-base whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto py-16 px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex justify-start mb-8">
                <Image
                  src="/logo.png"
                  alt="Kid Care Cards Logo"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Remember what worked
                <span className="block text-primary">when your child needs it most</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Track solutions that helped your child. When the same issue comes up again, you&apos;ll know exactly what to do.
              </p>
              <Link
                href="/sign-up"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/hero.jpeg"
                  alt="Parent using Kid Care Cards app while child sleeps"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-lg w-full h-auto md:h-[600px]"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div id="features" className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Be ready for anything
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Whether it&apos;s 3 AM or your child&apos;s first day at school, you&apos;ll have your proven solutions at hand.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 - Easy Symptom Tracking */}
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Symptom Tracking</h3>
                <p className="text-muted-foreground">
                  Record symptoms quickly and efficiently with our intuitive interface.
                </p>
              </div>

              {/* Feature Card 3 - Voice Control */}
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice Control</h3>
                <p className="text-muted-foreground">
                  We parents always have our hands full. Record symptoms and solutions using voice dictation.
                </p>
              </div>

              {/* Feature Card 4 - Secure Data */}
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
                <p className="text-muted-foreground">
                  Your child&apos;s health information is encrypted and stored securely.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Your Data</h3>
                <p className="text-muted-foreground">
                  Download your health records in multiple formats for easy sharing with healthcare providers.
                </p>
              </div>

              {/* Feature Card 5 - Open Source */}
              <div className="bg-card p-6 rounded-lg shadow-sm relative overflow-hidden">
                <div className="absolute -right-20 top-8 rotate-45 bg-accent text-accent-foreground py-1.5 w-64 text-center text-sm font-semibold">
                  Coming Soon
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Open Source</h3>
                <p className="text-muted-foreground">
                  Transparent and community-driven development. Review and contribute to our codebase.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Hosted vs Self-Hosted Comparison */}
        <div className="bg-card py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Hosted vs Self-Hosted
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Choose the deployment option that best fits your needs
            </p>

            <div className="max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-4 px-6 text-left font-medium text-muted-foreground">Feature</th>
                      <th className="py-4 px-6 text-center">
                        <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block">
                          kidcarecards.com
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <div className="bg-muted text-muted-foreground px-4 py-1 rounded-full text-sm font-medium inline-block">
                          Self-Hosted
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Setup Time</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <span className="font-medium">2 minutes</span>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <span className="font-medium">1-2 hours</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Monthly Cost</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <span className="font-medium">Pay per use</span>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <span className="font-medium">$10+ minimum</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Automatic Updates</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Infrastructure Management</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <span className="font-medium">Fully managed</span>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <span className="font-medium">Self managed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Professional Support</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-4 px-6">Backups & Security</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <span className="font-medium">DIY</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6">Server Maintenance</td>
                      <td className="py-4 px-6 text-center text-primary">
                        <svg className="w-6 h-6 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </td>
                      <td className="py-4 px-6 text-center text-muted-foreground">
                        <span className="font-medium">Required</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary-foreground mb-4">
              Core Features are Free Forever
            </h2>
            <p className="text-center text-primary-foreground text-lg mb-4">
              Track symptoms and solutions at no cost. No credit card required.
            </p>
            <p className="text-center text-primary-foreground text-lg mb-12">
              Additional credits are only needed for Voice Control.
            </p>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-card rounded-lg p-8 shadow-lg flex flex-col h-full">
                <div>
                  <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                    FREE PLAN
                  </div>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold">$0</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Track symptoms and solutions
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Limited Voice Dictation Support
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Secure data storage
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link
                    href="/sign-up"
                    className="block text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Start Free
                  </Link>
                </div>
              </div>

              {/* 100 Credits */}
              <div className="bg-card rounded-lg p-8 shadow-lg flex flex-col h-full">
                <div>
                  <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                    100 CREDITS
                  </div>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold">$5</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Includes everything from the free plan
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      No-charge setup!
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Buy only what you need
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link
                    href="/sign-up"
                    className="block text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Buy Credits
                  </Link>
                </div>
              </div>

              {/* 250 Credits */}
              <div className="bg-card rounded-lg p-8 shadow-lg border-4 border-accent relative flex flex-col h-full">
                <div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      BEST VALUE
                    </span>
                  </div>
                  <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                    250 CREDITS
                  </div>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold">$10</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Includes everything from the free plan
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save $2.50
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Best value
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link
                    href="/sign-up"
                    className="block text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Get started
                  </Link>
                </div>
              </div>

              {/* 700 Credits */}
              <div className="bg-card rounded-lg p-8 shadow-lg flex flex-col h-full">
                <div>
                  <div className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                    700 CREDITS
                  </div>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold">$25</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Includes everything from the free plan
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save $10
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Perfect for frequent use
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <Link
                    href="/sign-up"
                    className="block text-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="text-2xl font-semibold text-white mb-4 block">
                  Kid Care Cards
                </Link>
                <p className="text-gray-400 mb-4">
                  A personal solution knowledge base built by parents for parents. Track what worked before, so you&apos;re always prepared.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="#features" className="hover:text-white">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="mailto:support@akoskm.com" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Kid Care Cards. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}
