import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';
import { UserUpdateForm } from '@/components/view/User/UserUpdateForm';

export default function SettingsPage() {
  return (
    <div className="dashboard-container w-full">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Informasi Akun</CardTitle>
              <CardDescription>Perbarui atau ubah informasi akun anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserUpdateForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Foto Profil</CardTitle>
              <CardDescription>Ubah foto profil anda</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <UserUpdateForm showProfilePictureOnly />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
