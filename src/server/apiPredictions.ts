// src/server/apiPredictions.ts

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


// fungsi getPredictionFromML tetap seperti biasa
export async function getPredictionFromML(input: {
  food: { ingredient: string; dose: number }[];
}): Promise<PredictionResponse> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to get prediction');
  }

  return await response.json();
}
