export interface Ingredient {
  ingredientAlias: string;
  ingredientName: string;
  ingredientDose: string;
}

export interface DiseaseRate {
  disease: string;
  status: string;
  level: string;
}

export interface Item {
  _id: string;
  name: string;
  nation: string;
  category: string;
  description: string;
  image: string;
  origin?: string;
  ingredients?: Ingredient[];
  disease_rate?: DiseaseRate[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ItemResponse {
  status: string;
  message: string;
  data: Item;
}

export interface ItemListResponse {
  success: boolean;
  data: Item[];
}
