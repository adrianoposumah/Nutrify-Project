/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PredictModel } from '@/models/PredictModel';
import { PredictionRequest, PredictionResponse } from '@/types/predict';

export interface PredictView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  setPredictionResult: (result: PredictionResponse | null) => void;
  refreshData?: () => void;
}

export class PredictPresenter {
  private model: PredictModel;
  private view: PredictView;

  constructor(view: PredictView) {
    this.model = new PredictModel();
    this.view = view;
  }

  async makePrediction(ingredients: { ingredient: string; dose: number }[]): Promise<PredictionResponse> {
    // Validate ingredients before making request
    if (!ingredients || ingredients.length === 0) {
      const errorMessage = 'Minimal satu bahan harus dimasukkan';
      this.view.showError(errorMessage);
      throw new Error(errorMessage);
    }

    // Validate each ingredient
    for (const ingredient of ingredients) {
      if (!ingredient.ingredient || ingredient.ingredient.trim() === '') {
        const errorMessage = 'Nama bahan tidak boleh kosong';
        this.view.showError(errorMessage);
        throw new Error(errorMessage);
      }
      if (!ingredient.dose || ingredient.dose <= 0) {
        const errorMessage = 'Takaran harus berupa angka positif';
        this.view.showError(errorMessage);
        throw new Error(errorMessage);
      }
    }

    const payload: PredictionRequest = {
      food: ingredients.map((ing) => ({
        ingredient: ing.ingredient.trim(),
        dose: Number(ing.dose),
      })),
    };

    try {
      this.view.showLoading(true);
      const response = await this.model.predict(payload);

      // Validate response structure
      if (!response.predict) {
        const errorMessage = 'Response tidak valid dari server';
        this.view.showError(errorMessage);
        throw new Error(errorMessage);
      }

      this.view.setPredictionResult(response);
      this.view.showSuccess('Prediksi berhasil dibuat!');

      if (this.view.refreshData) {
        this.view.refreshData();
      }

      return response;
    } catch (error: any) {
      console.error('Presenter error:', error);
      this.view.showError(error.message || 'Gagal membuat prediksi. Silakan coba lagi.');
      throw error; // Re-throw to let the component handle it
    } finally {
      this.view.showLoading(false);
    }
  }

  resetPrediction(): void {
    this.view.setPredictionResult(null);
  }

  formatNutritionData(nutrition: Record<string, number>) {
    if (!nutrition) return [];

    return Object.entries(nutrition)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => ({
        name: this.formatNutrientName(key),
        value: Number(value) || 0,
        unit: this.getNutritionUnit(key),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getHighRiskDiseases(diseases: { disease: string; status: string; level: string }[]) {
    if (!diseases) return [];
    return diseases.filter((disease) => disease.level === 'high' && disease.status === 'Warning');
  }

  getNormalDiseases(diseases: { disease: string; status: string; level: string }[]) {
    if (!diseases) return [];
    return diseases.filter((disease) => disease.level === 'normal');
  }

  getMediumRiskDiseases(diseases: { disease: string; status: string; level: string }[]) {
    if (!diseases) return [];
    return diseases.filter((disease) => disease.level === 'medium');
  }

  private formatNutrientName(key: string): string {
    const nameMap: Record<string, string> = {
      vitamin_A: 'Vitamin A',
      vitamin_C: 'Vitamin C',
      vitamin_B1: 'Vitamin B1',
      vitamin_B2: 'Vitamin B2',
      vitamin_B3: 'Vitamin B3',
      vitamin_B5: 'Vitamin B5',
      vitamin_B6: 'Vitamin B6',
      vitamin_B11: 'Vitamin B11',
      vitamin_B12: 'Vitamin B12',
      vitamin_D: 'Vitamin D',
      vitamin_E: 'Vitamin E',
      vitamin_K: 'Vitamin K',
    };

    if (nameMap[key]) {
      return nameMap[key];
    }

    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private getNutritionUnit(nutrient: string): string {
    const units: Record<string, string> = {
      sugar: 'g',
      fiber: 'g',
      protein: 'g',
      fat: 'g',
      carbohydrate: 'g',
      vitamin_A: 'IU',
      vitamin_C: 'mg',
      iron: 'mg',
      calcium: 'mg',
      sodium: 'mg',
      magnesium: 'mg',
      cholesterol: 'mg',
      calories: 'kcal',
      phosphorus: 'mg',
      potassium: 'mg',
      zinc: 'mg',
      water: 'ml',
      vitamin_B1: 'mcg',
      vitamin_B11: 'mcg',
      vitamin_B12: 'mcg',
      vitamin_B2: 'mg',
      vitamin_B3: 'mg',
      vitamin_B5: 'mg',
      vitamin_B6: 'mcg',
      vitamin_D: 'IU',
      vitamin_E: 'IU',
      vitamin_K: 'mcg',
    };
    return units[nutrient] || '';
  }

  formatDiseaseName(disease: string): string {
    return disease.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
