/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Combobox } from '@/components';
import { PredictPresenter, PredictView } from '@/presenters/PredictPresenter';
import { ItemPresenter } from '@/presenters/ItemPresenter';
import { PredictionResponse } from '@/types/predict';
import { IngredientSearchResult } from '@/types';

interface IngredientInput {
  ingredient: string;
  dose: string;
}

interface PredictFormProps {
  onSuccess?: (result: PredictionResponse) => void;
}

export default function PredictForm({ onSuccess }: PredictFormProps) {
  const [ingredients, setIngredients] = useState<IngredientInput[]>([{ ingredient: '', dose: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<IngredientSearchResult[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isSearchingIngredients, setIsSearchingIngredients] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a view object for the presenter
  const predictView: PredictView = {
    showLoading: (loading: boolean) => setIsLoading(loading),
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    setPredictionResult: (result: PredictionResponse | null) => setPredictionResult(result),
    refreshData: () => {
      if (onSuccess && predictionResult) {
        onSuccess(predictionResult);
      }
    },
  };

  const [predictPresenter] = useState(() => new PredictPresenter(predictView));
  const [itemPresenter] = useState(
    () =>
      new ItemPresenter({
        showLoading: () => {},
        showSuccess: () => {},
        showError: () => {},
        setItems: () => {},
        setItem: () => {},
        refreshData: () => {},
      })
  );

  // Load ingredients on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoadingIngredients(true);
        const ingredientsList = await itemPresenter.getAllIngredients();
        setAvailableIngredients(ingredientsList);
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
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (searchTerm.trim() === '') {
          try {
            setIsSearchingIngredients(true);
            const ingredientsList = await itemPresenter.getAllIngredients();
            setAvailableIngredients(ingredientsList);
          } catch (error) {
            console.error('Failed to load ingredients:', error);
          } finally {
            setIsSearchingIngredients(false);
          }
        } else {
          try {
            setIsSearchingIngredients(true);
            const ingredientsList = await itemPresenter.searchIngredients(searchTerm);
            setAvailableIngredients(ingredientsList);
          } catch (error) {
            console.error('Failed to search ingredients:', error);
          } finally {
            setIsSearchingIngredients(false);
          }
        }
      }, 300);
    },
    [itemPresenter]
  );

  const handleIngredientChange = (index: number, field: keyof IngredientInput, value: string) => {
    setIngredients((prev) => prev.map((ingredient, i) => (i === index ? { ...ingredient, [field]: value } : ingredient)));
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { ingredient: '', dose: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    const validIngredients = ingredients.filter((ing) => ing.ingredient && ing.dose);
    if (validIngredients.length === 0) {
      toast.error('Mohon masukkan minimal satu bahan dengan takaran');
      return;
    }

    // Check for invalid doses
    const hasInvalidDose = validIngredients.some((ing) => {
      const dose = parseFloat(ing.dose);
      return isNaN(dose) || dose <= 0;
    });

    if (hasInvalidDose) {
      toast.error('Mohon masukkan takaran yang valid (angka positif)');
      return;
    }

    try {
      const formattedIngredients = validIngredients.map((ing) => ({
        ingredient: ing.ingredient,
        dose: parseFloat(ing.dose),
      }));

      await predictPresenter.makePrediction(formattedIngredients);
    } catch (error: any) {
      console.error('Prediction error:', error);
      // Error handling is now done by the presenter through the view
    }
  };

  const resetForm = () => {
    setIngredients([{ ingredient: '', dose: '' }]);
    predictPresenter.resetPrediction();
  };

  const formatNutritionData = (nutrition: Record<string, number>) => {
    return predictPresenter.formatNutritionData(nutrition);
  };

  const getStatusIcon = (status: string, level: string) => {
    if (level === 'high' && status === 'Warning') {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (level === 'normal') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <Info className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string, level: string) => {
    if (level === 'high' && status === 'Warning') {
      return 'border-red-200 bg-red-50 dark:border-red-500 dark:bg-red-400';
    } else if (level === 'normal') {
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
    } else {
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Prediction Form */}
      <Card>
        <CardHeader>
          <CardTitle>Prediksi Nutrisi & Risiko Kesehatan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ingredients Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Bahan-Bahan *</Label>
                <Button type="button" onClick={addIngredient} variant="outline" size="sm" className="flex items-center gap-2" disabled={isLoading}>
                  <Plus className="h-4 w-4" />
                  Tambah Bahan
                </Button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg ">
                    <div className="flex-1">
                      <Label className="text-sm ">Nama Bahan</Label>
                      <Combobox
                        options={availableIngredients.map((ing) => ing.IngredientId)}
                        value={ingredient.ingredient}
                        onValueChange={(value) => handleIngredientChange(index, 'ingredient', value)}
                        placeholder={isLoadingIngredients ? 'Memuat bahan...' : 'Cari atau ketik nama bahan...'}
                        className="mt-1"
                        onSearch={debouncedSearch}
                        isLoading={isSearchingIngredients}
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-sm ">Takaran (gram)</Label>
                      <Input
                        type="number"
                        value={ingredient.dose}
                        onChange={(e) => handleIngredientChange(index, 'dose', e.target.value)}
                        placeholder="250"
                        className="mt-1"
                        min="0"
                        step="1"
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    {ingredients.length > 1 && (
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
              <Button type="button" onClick={resetForm} variant="outline" disabled={isLoading}>
                Reset
              </Button>
              <Button type="submit" disabled={isLoading} className="px-8">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Memproses...' : 'Prediksi Sekarang'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionResult && (
        <div className="space-y-6">
          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Nutrisi Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formatNutritionData(predictionResult.predict.total_nutrition).map((nutrient, index) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">{nutrient.name}</div>
                    <div className="text-lg font-bold text-blue-700">
                      {nutrient.value.toFixed(1)} {nutrient.unit}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* High Risk Diseases */}
          {predictPresenter.getHighRiskDiseases(predictionResult.predict.disease_rate).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Peringatan Risiko Tinggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {predictPresenter.getHighRiskDiseases(predictionResult.predict.disease_rate).map((disease, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getStatusColor(disease.status, disease.level)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(disease.status, disease.level)}
                          <span className="font-medium">{predictPresenter.formatDiseaseName(disease.disease)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {disease.status} - {disease.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Disease Classifications */}
          <Card>
            <CardHeader>
              <CardTitle>Klasifikasi Risiko Penyakit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {predictionResult.predict.disease_rate.map((disease, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getStatusColor(disease.status, disease.level)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(disease.status, disease.level)}
                        <span className="font-medium">{predictPresenter.formatDiseaseName(disease.disease)}</span>
                      </div>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            disease.level === 'high' && disease.status === 'Warning' ? 'bg-red-100 text-red-800' : disease.level === 'normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {disease.status} - {disease.level}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
