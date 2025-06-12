// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Item, CreateItemRequest, Ingredient, DiseaseRate, ItemResponse, ItemListResponse, ApiResponse, IngredientListResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class ItemModel {
  async getAllItems(page?: number, limit?: number): Promise<ItemListResponse> {
    try {
      let url = '/items';
      const params = new URLSearchParams();

      if (page !== undefined) params.append('page', page.toString());
      if (limit !== undefined) params.append('limit', limit.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiClient.get<ItemListResponse>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getItem(): Promise<ItemResponse> {
    try {
      const response = await apiClient.get<ItemResponse>(`/items/`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getItemByName(name: string): Promise<ItemResponse> {
    try {
      const response = await apiClient.get<ItemResponse>(`/items/${name}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getItemById(id: string): Promise<ItemResponse> {
    try {
      const response = await apiClient.get<ItemResponse>(`/items/id/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRandom10Items(): Promise<ItemListResponse> {
    try {
      const response = await apiClient.get<ItemListResponse>(`/random-items`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async createItem(item: CreateItemRequest): Promise<ItemResponse> {
    try {
      const response = await apiClient.post<ItemResponse>(`/items`, item);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllIngredients(): Promise<IngredientListResponse> {
    try {
      const response = await apiClient.get<IngredientListResponse>(`/display-ingredients`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchIngredients(search: string): Promise<IngredientListResponse> {
    try {
      const response = await apiClient.get<IngredientListResponse>(`/display-ingredients?search=${encodeURIComponent(search)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
