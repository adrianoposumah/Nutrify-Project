/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Button, Input, Label, Avatar, AvatarFallback, AvatarImage } from '@/components';
import { Camera, Save, User } from 'lucide-react';
import { UserPresenter, UserView } from '@/presenters/UserPresenter';
import { User as UserType } from '@/types/index';

interface UserUpdateFormProps {
  onSuccess?: () => void;
  showProfilePictureOnly?: boolean;
}

// Skeleton Components
const SkeletonInput = () => (
  <div className="space-y-2">
    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const SkeletonAvatar = () => (
  <div className="relative">
    <div className="h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="absolute bottom-0 right-0 h-10 w-10 bg-gray-300 rounded-full animate-pulse"></div>
  </div>
);

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({ onSuccess, showProfilePictureOnly = false }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
  });

  const fetchUserData = useCallback(async () => {
    // This will be defined later when we have the presenter
  }, []);

  const userView: UserView = useMemo(
    () => ({
      showLoading: (loading: boolean) => setIsSubmitting(loading),
      showSuccess: (msg: string) => {
        // Don't show toast here, let toast.promise handle it
        if (onSuccess) onSuccess();
      },
      showError: (msg: string) => {
        // Don't show toast here, let toast.promise handle it
      },
      setUser: (userData: UserType | null) => {
        if (userData) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            age: userData.age ? userData.age.toString() : '',
            height: userData.height ? userData.height.toString() : '',
            weight: userData.weight ? userData.weight.toString() : '',
          });
        }
      },
      setProfilePicture: (url: string) => setProfilePicture(url),
      refreshUserData: fetchUserData,
    }),
    [onSuccess, fetchUserData]
  );

  const presenter = useMemo(() => new UserPresenter(userView), [userView]);

  // Update fetchUserData with the actual implementation
  const actualFetchUserData = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const currentUser = await presenter.getCurrentUser();
      if (currentUser?.hasProfilePicture) {
        await presenter.getCurrentUserProfilePicture(currentUser);
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, [presenter]);

  useEffect(() => {
    actualFetchUserData();
  }, [actualFetchUserData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Mohon pilih file gambar yang valid');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Gambar berhasil dipilih');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate numeric fields (name and email are read-only)
    const age = formData.age ? parseInt(formData.age) : 0;
    const height = formData.height ? parseInt(formData.height) : 0;
    const weight = formData.weight ? parseInt(formData.weight) : 0;

    if (age <= 0) {
      toast.error('Umur harus diisi dengan nilai yang valid');
      return;
    }

    if (height <= 0) {
      toast.error('Tinggi badan harus diisi dengan nilai yang valid');
      return;
    }

    if (weight <= 0) {
      toast.error('Berat badan harus diisi dengan nilai yang valid');
      return;
    }

    // Additional range validation
    if (age > 150) {
      toast.error('Umur tidak boleh lebih dari 150 tahun');
      return;
    }

    if (height < 50 || height > 300) {
      toast.error('Tinggi badan harus antara 50-300 cm');
      return;
    }

    if (weight < 10 || weight > 1000) {
      toast.error('Berat badan harus antara 10-1000 kg');
      return;
    }

    setIsSubmitting(true);
    const updatePromise = async () => {
      try {
        if (selectedFile) {
          // Create FormData with user data including profile picture (excluding name and email)
          const uploadFormData = new FormData();
          uploadFormData.append('profilePicture', selectedFile);
          uploadFormData.append('age', age.toString());
          uploadFormData.append('height', height.toString());
          uploadFormData.append('weight', weight.toString());

          // Call presenter to update profile with FormData
          await presenter.updateUserProfileWithThrow(uploadFormData);
          setSelectedFile(null); // Reset selected file after successful upload
        } else {
          // Create update data for text-only updates (excluding name and email)
          const updateData: Partial<UserType> = {
            age,
            height,
            weight,
          };

          await presenter.updateUserProfileWithThrow(updateData);
        }
      } catch (error) {
        console.error('Update failed:', error);
        throw error; // Re-throw to ensure promise rejects
      } finally {
        setIsSubmitting(false);
      }
    };
    toast.promise(updatePromise(), {
      loading: showProfilePictureOnly ? 'Mengupload foto profil...' : 'Menyimpan perubahan...',
      success: () => {
        // Refresh the page after successful update
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Small delay to let the user see the success message

        return showProfilePictureOnly ? 'Foto profil berhasil diperbarui!' : 'Profil berhasil diperbarui!';
      },
      error: (err) => {
        console.error('Update failed:', err);
        return showProfilePictureOnly ? 'Gagal mengupload foto profil' : 'Gagal menyimpan perubahan';
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // If showing only profile picture
  if (showProfilePictureOnly) {
    if (isInitialLoading) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <SkeletonAvatar />
          <div className="text-center space-y-1">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-36 animate-pulse mx-auto"></div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profilePicture} alt={formData.name} />
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{formData.name ? getInitials(formData.name) : <User className="h-12 w-12" />}</AvatarFallback>
          </Avatar>
          <Button type="button" size="sm" onClick={triggerFileInput} className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <div className="text-center">
          <p className="text-sm text-gray-600">Klik ikon kamera untuk mengubah foto</p>
          <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG. Maksimal 5MB</p>
        </div>
        {selectedFile && (
          <div className="text-center space-y-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium">Foto baru siap diupload</p>
              <p className="text-xs text-blue-600">{selectedFile.name}</p>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm disabled:opacity-50">
              {isSubmitting ? 'Mengupload...' : 'Update Foto Profil'}
            </Button>
          </div>
        )}
      </>
    );
  }

  // Main form content with skeleton loading
  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        {/* Basic Info Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <SkeletonInput />
          <SkeletonInput />
        </div>

        {/* Physical Stats Skeleton */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonInput />
            </div>
          </div>
        </div>

        {/* Save Button Skeleton */}
        <div className="flex justify-end pt-6">
          <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Nama
          </Label>
          <Input id="name" value={formData.name} placeholder="Nama anda" className="border-slate-200 bg-gray-50 cursor-not-allowed" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Alamat Email
          </Label>
          <Input id="email" type="email" value={formData.email} placeholder="Email anda" className="border-slate-200 bg-gray-50 cursor-not-allowed" disabled />
        </div>
      </div>

      {/* Physical Stats */}
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Informasi Fisik</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Umur
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Masukkan umur"
                min="1"
                max="150"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">
                Tinggi (cm)
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Masukkan berat"
                min="10"
                max="1000"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={isSubmitting} className="px-6 py-2 flex items-center gap-2 disabled:opacity-50">
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
};
