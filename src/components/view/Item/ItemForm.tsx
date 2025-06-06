'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Combobox } from '@/components';
import { ItemPresenter, ItemView, ItemFormData, FormIngredient } from '@/presenters/ItemPresenter';
import { Item, IngredientSearchResult } from '@/types';

const NATIONS = ['Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Philippines', 'China', 'Japan', 'Korea', 'India', 'Italy', 'France', 'Mexico', 'USA'];

const CATEGORIES = ['food', 'beverage', 'dessert', 'appetizer', 'main course', 'side dish'];

interface ItemFormProps {
  onSuccess?: (createdItem?: Item) => void;
  onCancel?: () => void;
}

export default function ItemForm({ onSuccess, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    nation: '',
    image: '',
    category: '',
    description: '',
    origin: '',
    ingredients: [{ ingredientName: '', ingredientDose: '' }],
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState<IngredientSearchResult[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isSearchingIngredients, setIsSearchingIngredients] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a view object for the presenter
  const itemView: ItemView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    setItems: () => {}, // Not used in form
    setItem: () => {}, // Not used in form
    refreshData: onSuccess, // Call onSuccess when data needs to be refreshed
  };
  const [itemPresenter] = useState(() => new ItemPresenter(itemView));

  // Load ingredients on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoadingIngredients(true);
        const ingredients = await itemPresenter.getAllIngredients();
        setAvailableIngredients(ingredients);
      } catch (error) {
        console.error('Failed to load ingredients:', error);
        toast.error('Gagal memuat daftar bahan');
      } finally {
        setIsLoadingIngredients(false);
      }
    };
    loadIngredients();
  }, [itemPresenter]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  // Debounced search function
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(async () => {
        if (searchTerm.trim() === '') {
          // If search is empty, load all ingredients
          try {
            setIsSearchingIngredients(true);
            const ingredients = await itemPresenter.getAllIngredients();
            setAvailableIngredients(ingredients);
          } catch (error) {
            console.error('Failed to load ingredients:', error);
          } finally {
            setIsSearchingIngredients(false);
          }
        } else {
          // Search for ingredients
          try {
            setIsSearchingIngredients(true);
            const ingredients = await itemPresenter.searchIngredients(searchTerm);
            setAvailableIngredients(ingredients);
          } catch (error) {
            console.error('Failed to search ingredients:', error);
          } finally {
            setIsSearchingIngredients(false);
          }
        }
      }, 300); // 300ms debounce delay
    },
    [itemPresenter]
  );

  const handleInputChange = (field: keyof ItemFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIngredientChange = (index: number, field: keyof FormIngredient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => (i === index ? { ...ingredient, [field]: value } : ingredient)),
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientName: '', ingredientDose: '' }],
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const handlePreviewImage = () => {
    setPreviewImage(formData.image);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Use the presenter's createItemFromForm method which includes validation
      const createdItem = await toast.promise(itemPresenter.createItemFromForm(formData), {
        loading: 'Menambahkan makanan...',
        success: 'Makanan berhasil ditambahkan!',
        error: (err) => err.message || 'Gagal menambahkan makanan',
      });

      // Reset form on success
      setFormData({
        name: '',
        nation: '',
        image: '',
        category: '',
        description: '',
        origin: '',
        ingredients: [{ ingredientName: '', ingredientDose: '' }],
      });
      setPreviewImage('');

      // Call onSuccess callback with the created item
      if (onSuccess) {
        onSuccess(createdItem);
      }
    } catch (error) {
      // Error is already handled by toast.promise and presenter
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      nation: '',
      image: '',
      category: '',
      description: '',
      origin: '',
      ingredients: [{ ingredientName: '', ingredientDose: '' }],
    });
    setPreviewImage('');

    // Call onCancel callback
    if (onCancel) {
      onCancel();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Makanan *</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Masukkan nama makanan" required disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nation">Negara *</Label>
          <Select value={formData.nation} onValueChange={(value) => handleInputChange('nation', value)} disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Negara" />
            </SelectTrigger>
            <SelectContent>
              {NATIONS.map((nation) => (
                <SelectItem key={nation} value={nation}>
                  {nation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} disabled={isLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Daerah Asal</Label>
          <Input id="origin" value={formData.origin} onChange={(e) => handleInputChange('origin', e.target.value)} placeholder="Masukkan daerah asal" disabled={isLoading} />
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="image">Link URL Gambar</Label>
        <div className="flex gap-2">
          <Input id="image" value={formData.image} onChange={(e) => handleInputChange('image', e.target.value)} placeholder="https://example.com/image.jpg" type="url" className="flex-1" disabled={isLoading} />
          <Button type="button" onClick={handlePreviewImage} disabled={isLoading || !formData.image} variant="outline">
            Preview
          </Button>
        </div>
        <div className="mt-4">
          <Label className="text-sm text-gray-600 mb-2 block">Preview Gambar:</Label>
          <div className="relative">
            <Image
              src={previewImage}
              alt="Food preview"
              width={600}
              height={400}
              className="w-full max-w-md h-64 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) errorDiv.style.display = 'block';
              }}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'block';
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) errorDiv.style.display = 'none';
              }}
            />
            <div className="w-full max-w-md h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-sm" style={{ display: previewImage ? 'none' : 'flex' }}>
              <div className="text-center">
                <p className="font-medium">Preview Gambar</p>
                <p className="text-xs mt-1">Masukkan URL yang valid dan klik Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi *</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Masukkan deskripsi makanan" rows={4} required disabled={isLoading} />
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Bahan-Bahan *</Label>
          <Button type="button" onClick={addIngredient} variant="outline" size="sm" className="flex items-center gap-2" disabled={isLoading}>
            <Plus className="h-4 w-4" />
            Tambah Bahan
          </Button>
        </div>

        <div className="space-y-3">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
              {' '}
              <div className="flex-1">
                <Label className="text-sm text-gray-600">Nama Bahan</Label>{' '}
                <Combobox
                  options={availableIngredients.map((ing) => ing.IngredientId)}
                  value={ingredient.ingredientName}
                  onValueChange={(value) => handleIngredientChange(index, 'ingredientName', value)}
                  placeholder={isLoadingIngredients ? 'Memuat bahan...' : 'Cari atau ketik nama bahan...'}
                  className="mt-1"
                  onSearch={debouncedSearch}
                  isLoading={isSearchingIngredients}
                />
              </div>
              <div className="w-32">
                <Label className="text-sm text-gray-600">Takaran (gram)</Label>
                <Input
                  type="number"
                  value={ingredient.ingredientDose}
                  onChange={(e) => handleIngredientChange(index, 'ingredientDose', e.target.value)}
                  placeholder="250"
                  className="mt-1"
                  min="0"
                  step="1"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    // Prevent negative numbers and the negative sign (-)
                    if (e.key === '-' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              {formData.ingredients.length > 1 && (
                <Button type="button" onClick={() => removeIngredient(index)} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" disabled={isLoading}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" onClick={handleCancel} variant="outline" disabled={isLoading}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading} className="px-8">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isLoading ? 'Menambahkan...' : 'Tambah Makanan'}
        </Button>
      </div>
    </form>
  );
}
