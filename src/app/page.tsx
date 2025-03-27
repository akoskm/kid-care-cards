import Link from 'next/link';
import MainLayout from './main-layout';
import Image from 'next/image';

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white py-4 px-6 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-semibold text-emerald-600">
                Kid Care Cards
              </Link>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#benefits" className="text-gray-600 hover:text-gray-900">Benefits</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-700">
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto py-16 px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Focus more on your children
                <span className="block text-emerald-600">and less on tracking symptoms</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Kid Care Cards is a symptom tracking system built by parents for parents.
                We help you monitor your child&apos;s health journey with ease, so you can focus on what matters most.
              </p>
              <Link
                href="/sign-up"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/hero.jpg"
                  alt="Parent using Kid Care Cards app while child sleeps"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-lg"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Our mission is to help you track health better
            </h2>
            <p className="text-center text-gray-600 mb-12">
              We back up our mission with intuitive tools and reliable support.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Symptom Tracking</h3>
                <p className="text-gray-600">
                  Record symptoms quickly and efficiently with our intuitive interface.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Health History</h3>
                <p className="text-gray-600">
                  Keep a detailed record of your child&apos;s health journey all in one place.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice Control</h3>
                <p className="text-gray-600">
                  We parents always have our hands full. Record symptoms and solutions using voice dictation.
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
                <p className="text-gray-600">
                  Your child&apos;s health information is protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-emerald-500 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-white mb-4">
              Try Kid Care Cards free for 14 days
            </h2>
            <p className="text-center text-white text-lg mb-12">
              If you are not satisfied with your experience, cancel at any time. There are no contracts.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                  MONTHLY PLAN
                </div>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold">$5</span>
                  <span className="text-gray-600 ml-2">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    No-charge setup!
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    All features included
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Cancel anytime
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="block text-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full"
                >
                  Get started
                </Link>
              </div>

              {/* Yearly Plan */}
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium inline-block mb-6">
                  YEARLY PLAN
                </div>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold">$50</span>
                  <span className="text-gray-600 ml-2">/year</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save $10 annually
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    All features included
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Cancel anytime
                  </li>
                </ul>
                <Link
                  href="/sign-up"
                  className="block text-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full"
                >
                  Get started
                </Link>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/sign-up"
                className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Request demo
              </Link>
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
                  A symptom tracking system built by parents for parents. We exist to help you focus on your children, not paperwork.
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
                  <li><Link href="#help" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="#contact" className="hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Kid Care Cards. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
