import { Item, ItemResponse, ItemListResponse } from '@/types/index';
import { ItemModel } from '@/models/ItemModel';

export class ItemPresenter {
  private itemModel: ItemModel;

  constructor() {
    this.itemModel = new ItemModel();
  }

  async getAllItems(): Promise<ItemResponse> {
    try {
      return await this.itemModel.getItem();
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<ItemResponse> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Item ID is required');
      }
      return await this.itemModel.getItemById(id);
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw error;
    }
  }

  async getRandomItems(): Promise<ItemListResponse> {
    try {
      return await this.itemModel.getRandom10Items();
    } catch (error) {
      console.error('Error fetching random items:', error);
      throw error;
    }
  }
  async createNewItem(item: Item): Promise<ItemResponse> {
    try {
      if (!item || !item.name) {
        throw new Error('Item name is required');
      }
      return await this.itemModel.createItem(item);
    } catch (error) {
      console.error('Error creating new item:', error);
      throw error;
    }
  }
}
