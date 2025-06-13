'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, WifiOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, ThemeToggle, UserNav } from '@/components';

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/category',
    label: 'Kategori',
  },
  {
    href: '/tools',
    label: 'Tools',
  },
  {
    href: '/aboutus',
    label: 'About',
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial online status
    updateOnlineStatus();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [scrolled]);

  return (
    <header className={cn('fixed top-0 z-50 w-full transition-all duration-300', scrolled ? 'border-b bg-background/60 backdrop-blur-md' : 'bg-transparent')}>
      <div className="container flex h-20 mx-auto items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
          <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className={cn('text-base font-medium transition-colors hover:text-orange-500', pathname === route.href ? 'text-orange-500' : 'text-muted-foreground')}>
              {route.label}
            </Link>
          ))}{' '}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {!isOnline && (
            <div className="flex items-center text-yellow-600 text-sm">
              <WifiOff className="h-4 w-4 mr-1" />
              <span>Offline</span>
            </div>
          )}
          <ThemeToggle />
          <UserNav />
        </div>
        <div className="md:hidden flex items-center space-x-2">
          {!isOnline && <WifiOff className="h-4 w-4 text-yellow-600" />}
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>{' '}
              <div className="py-4">
                <nav className="flex flex-col space-y-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn('text-sm font-medium transition-colors hover:text-orange-500 px-3 py-2 rounded-md', pathname === route.href ? 'text-orange-500 bg-orange-50' : 'text-muted-foreground')}
                    >
                      {route.label}
                    </Link>
                  ))}{' '}
                </nav>
                <div className="mt-6 pt-6 border-t">
                  <UserNav className="w-full" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
