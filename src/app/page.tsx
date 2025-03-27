import Link from 'next/link';
import MainLayout from './main-layout';

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
            <div className="hidden md:block">
              {/* You'll need to add an appropriate illustration here */}
              <div className="bg-emerald-50 rounded-lg p-8 h-96"></div>
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
      </div>
    </MainLayout>
  );
}
