'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, ThemeToggle } from '@/components';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, ChevronDown, Settings, User, LogOut } from 'lucide-react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    avatar: '',
    initials: 'JD',
    isVerified: true,
  };

  return (
    <header className={cn('fixed top-0 z-50 w-full transition-all duration-300', scrolled ? 'border-b bg-background/60 backdrop-blur-md' : 'bg-transparent')}>
      <div className="container flex h-20 mx-auto  items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/NutrifyLogo.svg" alt="Nutrify Logo" width={35} height={35} priority />
          <h1 className="text-2xl font-bold text-orange-500">Nutrify</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className={cn('text-base font-medium transition-colors hover:text-orange-500', pathname === route.href ? 'text-orange-500' : 'text-muted-foreground')}>
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-orange-50 hover:text-orange-600">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-transparent border border-transparent rounded-lg p-2">
                    <div className="hidden sm:block text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{user.name}</span>
                        {user.isVerified && <div className="h-2 w-2 rounded-full bg-green-500" title="Verified" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Avatar className="h-8 w-8 border-2 border-orange-200">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-sm bg-orange-100 text-orange-700 font-medium">{user.initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-orange-200">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{user.name}</p>
                          {user.isVerified && <div className="h-2 w-2 rounded-full bg-green-500" title="Verified" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem className="cursor-pointer mt-2 focus:bg-orange-50 focus:text-orange-600" asChild>
                    <Link href="/users/profile" className="flex items-center space-x-3">
                      <User className="mr-3 h-4 w-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer focus:bg-orange-50 focus:text-orange-600" asChild>
                    <Link href="/users/settings" className="flex items-center space-x-3">
                      <Settings className="mr-3 h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700" onClick={handleSignOut}>
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="bg-transparent text-orange-500 border-orange-500 hover:text-white hover:bg-orange-500 transition-colors" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="md:hidden flex items-center space-x-2">
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
              </SheetHeader>
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
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-3 px-3 py-3 bg-orange-50 rounded-lg">
                        <Avatar className="h-10 w-10 border-2 border-orange-200">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{user.name}</p>
                            {user.isVerified && <div className="h-2 w-2 rounded-full bg-green-500" title="Verified" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="relative">
                          <Bell className="h-4 w-4" />
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                            3
                          </Badge>
                        </Button>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-2">
                        <Button className="w-full justify-start text-sm hover:bg-orange-50 hover:text-orange-600">
                          <User className="mr-3 h-4 w-4" />
                          My Profile
                        </Button>
                        <Button className="w-full justify-start text-sm hover:bg-orange-50 hover:text-orange-600">
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleSignOut}>
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full bg-transparent text-orange-500 border-orange-500 hover:text-white hover:bg-orange-500" asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" asChild>
                        <Link href="/signin">Sign In</Link>
                      </Button>
                    </div>
                  )}
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
