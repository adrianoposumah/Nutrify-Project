'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components';
import { CheckCircle, Mail, User as UserIcon, Calendar, Ruler, Weight } from 'lucide-react';
import { UserPresenter, UserView } from '@/presenters/UserPresenter';
import { User } from '@/types/index';
import toast from 'react-hot-toast';

interface UserCardProps {
  className?: string;
}

export function UserCard({ className }: UserCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const viewInterface: UserView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    setUser: (user: User | null) => setUser(user),
    setProfilePicture: (url: string) => setProfilePicture(url),
  };
  const [presenter] = useState(() => new UserPresenter(viewInterface));
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await presenter.getCurrentUser();
      if (currentUser?.hasProfilePicture) {
        await presenter.getCurrentUserProfilePicture(currentUser);
      }
    };

    fetchUserData();
  }, [presenter]);

  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 py-10 lg:py-20 ${className}`}>
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`container mx-auto px-4 py-10 lg:py-20 ${className}`}>
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Failed to load user information</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const profileImage = profilePicture || '';

  return (
    <div className={`container mx-auto px-4 py-10 lg:py-20 ${className}`}>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage || undefined} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.isVerified && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified</span>
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-2 text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground sm:justify-start">
                  <UserIcon className="h-4 w-4" />
                  <span>User ID: {user.id}</span>
                </div>
              </div>

              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{user.age} years old</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center space-x-1">
                  <Ruler className="h-4 w-4" />
                  <span>Height</span>
                </span>
                <span className="font-medium">{user.height} cm</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center space-x-1">
                  <Weight className="h-4 w-4" />
                  <span>Weight</span>
                </span>
                <span className="font-medium">{user.weight} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <Badge variant={user.isVerified ? 'default' : 'secondary'}>{user.isVerified ? 'Verified' : 'Unverified'}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{formatDate(user.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
