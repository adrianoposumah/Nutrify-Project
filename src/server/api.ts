import foodData from './data.json';

export interface Food {
  id: number;
  name: string;
  nation: string;
  image: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface DiseaseRate {
  disease: string;
  warning: string;
  note: string;
}

export interface FoodDetail extends Food {
  description: string;
  ingredients: Ingredient[];
  disease_rate: DiseaseRate[];
}

export const getFoodRecommendations = async (): Promise<Food[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return foodData.food;
};

export const getFoodByName = async (name: string): Promise<FoodDetail | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const food = foodData.food.find((item) => item.name.toLowerCase() === name.toLowerCase());

  return food || null;
};
