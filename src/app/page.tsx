import Link from 'next/link';
import MainLayout from './main-layout';

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Kid Care Cards</h1>
          <p className="text-xl text-gray-600 mb-8">
            Track and manage your child&apos;s symptoms with ease. Keep detailed records of their health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-block px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
