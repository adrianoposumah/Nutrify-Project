import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | Nutrify',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman tidak ditemukan</h2>
        </div>

        <div className="space-y-4">
          <Link href="/" className="inline-block bg-primary text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
