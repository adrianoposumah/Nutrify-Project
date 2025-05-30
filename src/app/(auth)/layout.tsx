import Image from 'next/image';
import Link from 'next/link';
import BackgroundProvider from '@/components/features/BackgroundProvider';

import ThemeToggle from '@/components/ui/ThemeToggle';

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/about-us',
    label: 'About',
  },
];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="antialiased relative w-full  lg:h-screen mt-0">
        <BackgroundProvider />
        <header className="fixed top-0 z-50 w-full">
          <div className="container flex h-20 mx-auto items-center justify-between px-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
              <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
            </Link>
            <div className="flex">
              <ThemeToggle />

              <nav className="hidden ml-3 md:flex items-center space-x-6">
                {routes.map((route) => (
                  <Link key={route.href} href={route.href} className="font-medium transition-colors hover:text-orange-500">
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
