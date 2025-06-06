// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Item, Ingredient, DiseaseRate, ItemResponse, ItemListResponse, ApiResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class ItemModel {
  async getItem(): Promise<ItemResponse> {
    try {
      const response = await apiClient.get<ItemResponse>(`/items/`);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getItemById(id: string): Promise<ItemResponse> {
    try {
      const response = await apiClient.get<ItemResponse>(`/items/${id}`);
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
  async createItem(item: Item): Promise<ItemResponse> {
    try {
      const response = await apiClient.post<ItemResponse>(`/items/`, item);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
