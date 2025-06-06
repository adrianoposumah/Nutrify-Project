'use client';

import type React from 'react';

import Image from 'next/image';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Combobox } from '@/components';

// Mock ingredient database
const INGREDIENT_DATABASE = [
  'Lean beef',
  'Coconut milk',
  'Red chili',
  'Shallots',
  'Garlic',
  'Lemongrass',
  'Galangal',
  'Ginger',
  'Turmeric',
  'Kaffir lime leaves',
  'Turmeric leaves',
  'Asam kandis',
  'Salt',
  'Black pepper',
  'Onion',
  'Tomato',
  'Carrot',
  'Potato',
  'Chicken breast',
  'Fish sauce',
  'Soy sauce',
  'Sugar',
  'Lime',
  'Basil',
  'Cilantro',
  'Mint',
  'Rice',
  'Noodles',
  'Egg',
  'Flour',
  'Oil',
  'Butter',
];

const NATIONS = ['Indonesia', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Philippines', 'China', 'Japan', 'Korea', 'India', 'Italy', 'France', 'Mexico', 'USA'];

const CATEGORIES = ['food', 'beverage', 'dessert', 'appetizer', 'main course', 'side dish'];

interface Ingredient {
  name: string;
  amount: string;
}

interface FoodData {
  name: string;
  nation: string;
  image: string;
  category: string;
  description: string;
  origin: string;
  ingredients: Ingredient[];
}

export default function FoodReceiptForm() {
  const [formData, setFormData] = useState<FoodData>({
    name: '',
    nation: '',
    image: '',
    category: '',
    description: '',
    origin: '',
    ingredients: [{ name: '', amount: '' }],
  });

  const [previewImage, setPreviewImage] = useState<string>('');

  const handleInputChange = (field: keyof FoodData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => (i === index ? { ...ingredient, [field]: value } : ingredient)),
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }],
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Generate ID (in real app, this would be handled by backend)
    const foodReceipt = {
      id: Date.now(),
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.name && ing.amount),
    };

    console.log('Food Receipt Data:', foodReceipt);
    alert('Food receipt submitted successfully! Check console for data.');
  };

  const handlePreviewImage = () => {
    setPreviewImage(formData.image);
  };

  return (
    <div className="dashboard-container w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tambahkan Makanan</CardTitle>
          <CardDescription>Masukkan detail makanan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Makanan *</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Isi nama makanan disini" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nation">Negara *</Label>
                <Select value={formData.nation} onValueChange={(value) => handleInputChange('nation', value)}>
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
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" value={formData.origin} onChange={(e) => handleInputChange('origin', e.target.value)} placeholder="isi Daerah asal disini" />
              </div>
            </div>

            {/* Image Upload */}
            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Link URL Gambar</Label>
              <div className="flex gap-2">
                <Input id="image" value={formData.image} onChange={(e) => handleInputChange('image', e.target.value)} placeholder="https://exampleurl.com" type="url" className="flex-1" />
                <Button type="button" onClick={handlePreviewImage}>
                  Preview
                </Button>
              </div>
              <div className="mt-4">
                <Label className="text-sm text-gray-600 mb-2 block">Image Preview:</Label>
                <div className="relative">
                  <Image
                    src={previewImage || '/not-found.png'}
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
                      <p className="text-xs mt-1">Masukkan URL yang benar dan klik Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Isi deskripsi makanan disini" rows={4} required />
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Bahan *</Label>
                <Button type="button" onClick={addIngredient} variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Bahan
                </Button>
              </div>

              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <Label className="text-sm text-gray-600">Bahan</Label>
                      <Combobox options={INGREDIENT_DATABASE} value={ingredient.name} onValueChange={(value) => handleIngredientChange(index, 'name', value)} placeholder="Cari Bahan..." className="mt-1" />
                    </div>
                    <div className="w-32">
                      <Label className="text-sm text-gray-600">takaran (grams)</Label>
                      <Input
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        placeholder="250"
                        className="mt-1"
                        min="0"
                        onKeyDown={(e) => {
                          // Prevent negative numbers and the negative sign (-)
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <Button type="button" onClick={() => removeIngredient(index)} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button type="submit" className="px-8">
                Submit Food Receipt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
