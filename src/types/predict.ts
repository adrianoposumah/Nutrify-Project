export interface PredictionRequest {
  food: {
    ingredient: string;
    dose: number;
  }[];
}

export interface PredictionResponse {
  status: number;
  message: string;
  predict: {
    food: { ingredient: string; dose: number }[];
    total_nutrition: Record<string, number>;
    disease_rate: {
      disease: string;
      status: string;
      level: string;
    }[];
  };
}
