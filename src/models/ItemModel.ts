// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Item, CreateItemRequest, Ingredient, DiseaseRate, ItemResponse, ItemListResponse, ApiResponse, IngredientListResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';
import { offlineApiClient } from '@/lib/offlineApiClient';

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
      // Try the offline-capable API client first
      const response = await offlineApiClient.get<ItemListResponse>(`/random-items`);

      // Cache successful responses for offline use
      if (response && response.data) {
        await this.cacheRandomItems(response);
      }

      return response;
    } catch {
      // Fallback to regular API client
      try {
        const response = await apiClient.get<ItemListResponse>(`/random-items`);

        // Cache successful responses
        if (response && response.data) {
          await this.cacheRandomItems(response);
        }

        return response;
      } catch {
        // If both fail and we're offline, return cached data
        if (!navigator.onLine) {
          return this.getOfflineRandomItems();
        }
        throw new Error('Unable to fetch random items');
      }
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
  } // New offline support methods
  private async getOfflineRandomItems(): Promise<ItemListResponse> {
    try {
      // Try to get data from localStorage
      const cachedData = localStorage.getItem('nutrify-random-items');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Check if data is not too old (24 hours)
        const now = Date.now();
        if (now - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return {
            status: 'success',
            message: 'Retrieved cached random items',
            data: parsed.data,
          };
        }
      }
    } catch {
      console.error('Error getting offline random items');
    }

    // Return empty response as last resort
    return {
      status: 'error',
      message: 'No cached data available',
      data: [],
    };
  }
  async cacheRandomItems(data: ItemListResponse): Promise<void> {
    try {
      const cacheData = {
        data: data.data,
        timestamp: Date.now(),
      };
      localStorage.setItem('nutrify-random-items', JSON.stringify(cacheData));
    } catch {
      console.error('Error caching random items');
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
