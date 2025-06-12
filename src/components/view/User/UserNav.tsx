/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { AuthPresenter, AuthView } from '@/presenters/AuthPresenter';
import { UserPresenter, UserView } from '@/presenters/UserPresenter';
import { User } from '@/types/index';

interface UserNavProps {
  className?: string;
}

export function UserNav({ className }: UserNavProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const router = useRouter();

  // Get initials from name for fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const authViewInterface: AuthView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => {}, // Remove success messages for getCurrentUser
    showError: (message: string) => {},
    navigateToDashboard: () => router.push('/'),
    setFieldErrors: () => {},
    setUser: (user: User | null) => setUser(user),
  };

  const userViewInterface: UserView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => {},
    showError: (message: string) => {},
    setUser: (user: User | null) => {
      setUser(user);
      setIsAuthenticated(!!user);
    },
    setProfilePicture: (url: string) => setProfilePicture(url),
  };

  const [authPresenter] = useState(() => new AuthPresenter(authViewInterface));
  const [userPresenter] = useState(() => new UserPresenter(userViewInterface));
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await authPresenter.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);

          // If user has a profile picture, fetch it
          if (currentUser.hasProfilePicture) {
            await userPresenter.getCurrentUserProfilePicture(currentUser);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, [authPresenter, userPresenter]);
  const handleSignOut = async () => {
    try {
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

      await authPresenter.logout();

      setUser(null);
      setIsAuthenticated(false);

      await new Promise((resolve) => setTimeout(resolve, 500));

      window.location.href = '/';
    } catch (error) {
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

      setUser(null);
      setIsAuthenticated(false);

      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    if (user?.name) {
      const formattedName = user.name.toLowerCase().replace(/\s+/g, '');
      router.push(`/users/${formattedName}`);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Button variant="outline" className="bg-transparent text-orange-500 border-orange-500 hover:text-white hover:bg-orange-500 transition-colors" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-3 hover:bg-transparent border border-transparent rounded-lg p-2 px-0">
            {' '}
            <div className="hidden sm:block text-right">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{user.name}</span>
                {user.isVerified && <div className="h-2 w-2 rounded-full bg-green-500" title="Verified" />}
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Avatar className="h-8 w-8 border-2 border-orange-200">
              <AvatarImage src={profilePicture || ''} alt={user.name} />
              <AvatarFallback className="text-sm bg-orange-100 text-orange-700 font-medium">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {' '}
              <Avatar className="h-10 w-10 border-2 border-orange-200">
                <AvatarImage src={profilePicture || ''} alt={user.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700 font-medium">{getInitials(user.name)}</AvatarFallback>
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
          <DropdownMenuItem className="cursor-pointer mt-2 focus:bg-orange-50 focus:text-orange-600" onClick={handleProfileClick}>
            <UserIcon className="mr-3 h-4 w-4" />
            <span className="text-sm">My Profile</span>
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
  );
}
