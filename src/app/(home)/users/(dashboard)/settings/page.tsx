'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Avatar, AvatarFallback, AvatarImage } from '@/components';

import { Camera, Save, User } from 'lucide-react';

const profileData = {
  status: 'success',
  data: {
    userId: 'user123',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    profilePictureData: null,
    profilePictureMimeType: 'image/jpeg',
    age: 25,
    height: 175,
    weight: 70,
    role: 'user',
    isVerified: true,
    createdAt: '2024-01-15T08:00:00Z',
  },
};

export default function SettingsPage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
  });

  // Initialize form data with profile data
  useEffect(() => {
    const { data } = profileData;
    setFormData({
      name: data.name,
      email: data.email,
      password: '',
      age: data.age.toString(),
      height: data.height.toString(),
      weight: data.weight.toString(),
    });

    // Set profile image if available
    if (data.profilePictureData) {
      setProfileImage(`data:${data.profilePictureMimeType};base64,${data.profilePictureData}`);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="dashboard-container w-full ">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Informasi Akun</CardTitle>
              <CardDescription>Perbarui atau ubah informasi akun anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium ">
                    Nama
                  </Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Perbarui nama anda" className="border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium ">
                    Alamat Email
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Perbarui Email anda" className="border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>

              {/* Physical Stats */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold  mb-4">Informasi Fisik</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium ">
                        Umur
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Masukkan umur"
                        min="1"
                        max="120"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm font-medium ">
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="Masukkan tinggi"
                        min="50"
                        max="300"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-medium ">
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="Masukkan berat"
                        min="1"
                        max="500"
                        step="0.1"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col flex-end sm:flex-row gap-3 pt-6 border-t">
                <Button className="flex-1 font-medium py-2.5">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Bagian Foto Profil */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Foto Profil</CardTitle>
              <CardDescription>Unggah atau ubah foto profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profileImage || undefined} alt="Foto profil" />
                  <AvatarFallback className="text-lg font-semibold">{formData.name ? getInitials(formData.name) : <User className="w-12 h-12" />}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <p className="text-sm text-slate-500 text-center">
                Klik pada avatar untuk mengunggah foto baru
                <br />
                Rekomendasi: Gambar persegi, minimal 200x200px
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
