/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthPresenter, AuthView } from '@/presenters/index';
// import { User } from '@/types/index';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const router = useRouter();
  const viewInterface: AuthView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    navigateToUserProfile: (formattedName: string) => router.push(`/users/${formattedName}`),
    setFieldErrors: (errors: string[]) => setFieldErrors(errors),
    setUser: (user) => {},
  };

  const [presenter] = useState(() => new AuthPresenter(viewInterface));

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (fieldErrors.length > 0) {
        setFieldErrors([]);
      }
    },
    [fieldErrors.length]
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await presenter.login(formData);
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
              placeholder="Masukkan email anda disini"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="mt-1"
              placeholder="Masukkan password anda disini"
              disabled={isLoading}
            />
          </div>
        </div>

        {fieldErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <ul className="text-sm text-red-600 space-y-1">
              {fieldErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Masuk...' : 'Masuk'}
        </Button>
      </form>
    </>
  );
}
