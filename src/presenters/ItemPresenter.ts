/* eslint-disable @typescript-eslint/no-unused-vars */
import { Item, ApiError } from '@/types/index';
import { ItemModel } from '@/models/ItemModel';

export interface ItemView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  setItems: (items: Item[]) => void;
  setItem: (item: Item | null) => void;
  navigateToItem?: (itemId: string) => void;
  refreshData?: () => void;
}

export class ItemPresenter {
  private itemModel: ItemModel;
  private view: ItemView;

  constructor(view: ItemView) {
    this.itemModel = new ItemModel();
    this.view = view;
  }

  async getAllItems(): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.itemModel.getItem();
      this.view.setItems(response.data ? [response.data] : []);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to fetch items');
      console.error('Error fetching all items:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async getItemByName(name: string): Promise<boolean> {
    try {
      if (!name || name.trim() === '') {
        this.view.showError('Item name is required');
        return false;
      }

      this.view.showLoading(true);
      // Convert to lowercase and replace spaces with %20 for URL encoding
      const formattedName = name.toLowerCase().replace(/ /g, '%20');
      const response = await this.itemModel.getItemByName(formattedName);
      this.view.setItem(response.data);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || `Failed to fetch item with name ${name}`);
      console.error(`Error fetching item with name ${name}:`, error);
      this.view.setItem(null);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async getRandomItems(): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.itemModel.getRandom10Items();
      this.view.setItems(response.data || []);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to fetch random items');
      console.error('Error fetching random items:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async createNewItem(item: Item): Promise<boolean> {
    try {
      if (!item || !item.name) {
        this.view.showError('Item name is required');
        return false;
      }

      this.view.showLoading(true);
      const response = await this.itemModel.createItem(item);
      this.view.showSuccess('Item created successfully!');

      // Refresh data if the view supports it
      if (this.view.refreshData) {
        await this.view.refreshData();
      }

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to create item');
      console.error('Error creating new item:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  // Alternative method that throws errors instead of returning boolean - better for toast.promise
  async getItemByIdWithThrow(id: string): Promise<Item> {
    this.view.showLoading(true);

    try {
      if (!id || id.trim() === '') {
        throw new Error('Item ID is required');
      }

      const response = await this.itemModel.getItemById(id);
      this.view.setItem(response.data);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.setItem(null);
      throw new Error(apiError.message || `Failed to fetch item with ID ${id}`);
    } finally {
      this.view.showLoading(false);
    }
  }

  // Alternative method that throws errors instead of returning boolean - better for toast.promise
  async createNewItemWithThrow(item: Item): Promise<Item> {
    this.view.showLoading(true);

    try {
      if (!item || !item.name) {
        throw new Error('Item name is required');
      }

      const response = await this.itemModel.createItem(item);

      // Refresh data if the view supports it
      if (this.view.refreshData) {
        await this.view.refreshData();
      }

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to create item');
    } finally {
      this.view.showLoading(false);
    }
  }
}
