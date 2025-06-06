/* eslint-disable @typescript-eslint/no-unused-vars */
import { Item, CreateItemRequest, ApiError, Ingredient, IngredientSearchResult } from '@/types/index';
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

// Form data interface for the presenter (simplified form structure)
export interface FormIngredient {
  ingredientName: string;
  ingredientDose: string;
}

export interface ItemFormData {
  name: string;
  nation: string;
  image: string;
  category: string;
  description: string;
  origin: string;
  ingredients: FormIngredient[];
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
      const response = await this.itemModel.getAllItems();
      this.view.setItems(response.data || []);
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
  async createNewItem(item: CreateItemRequest): Promise<boolean> {
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
  async createNewItemWithThrow(item: CreateItemRequest): Promise<Item> {
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

  // Validation methods
  validateItemForm(formData: ItemFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Nama makanan wajib diisi');
    }

    if (!formData.nation) {
      errors.push('Negara wajib dipilih');
    }

    if (!formData.category) {
      errors.push('Kategori wajib dipilih');
    }

    if (!formData.description.trim()) {
      errors.push('Deskripsi wajib diisi');
    }

    const validIngredients = formData.ingredients.filter((ing) => ing.ingredientName.trim() && ing.ingredientDose.trim());

    if (validIngredients.length === 0) {
      errors.push('Minimal satu bahan harus diisi');
    }

    // Validate ingredient doses are valid numbers
    const invalidDoses = formData.ingredients.filter((ing) => ing.ingredientName.trim() && ing.ingredientDose.trim() && (isNaN(Number(ing.ingredientDose)) || Number(ing.ingredientDose) <= 0));

    if (invalidDoses.length > 0) {
      errors.push('Takaran bahan harus berupa angka yang valid dan lebih besar dari 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  } // Transform form data to CreateItemRequest format (without _id)
  transformFormDataToItem(formData: ItemFormData): CreateItemRequest {
    // Filter out empty ingredients
    const validIngredients = formData.ingredients.filter((ing) => ing.ingredientName.trim() && ing.ingredientDose.trim()); // Transform to API format using the Ingredient interface from types
    const apiIngredients: Ingredient[] = validIngredients.map((ing) => ({
      ingredientName: ing.ingredientName,
      ingredientDose: ing.ingredientDose,
    }));

    // Create CreateItemRequest object without _id (will be generated by backend)
    const item: CreateItemRequest = {
      name: formData.name.trim(),
      nation: formData.nation,
      category: formData.category,
      description: formData.description.trim(),
      image: formData.image.trim() || '/default.png', // Fallback to default image
      origin: formData.origin.trim() || undefined,
      ingredients: apiIngredients,
    };

    return item;
  }

  // Simplified create method for forms
  async createItemFromForm(formData: ItemFormData): Promise<Item> {
    // Validate form data
    const validation = this.validateItemForm(formData);

    if (!validation.isValid) {
      // Show the first error
      this.view.showError(validation.errors[0]);
      throw new Error(validation.errors[0]);
    }

    this.view.showLoading(true);

    try {
      // Transform and create item
      const itemData = this.transformFormDataToItem(formData);
      const response = await this.itemModel.createItem(itemData);

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

  // Ingredient methods
  async getAllIngredients(): Promise<IngredientSearchResult[]> {
    try {
      const response = await this.itemModel.getAllIngredients();
      return response.data || [];
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error fetching ingredients:', error);
      throw new Error(apiError.message || 'Failed to fetch ingredients');
    }
  }

  async searchIngredients(search: string): Promise<IngredientSearchResult[]> {
    try {
      if (!search || search.trim() === '') {
        return await this.getAllIngredients();
      }
      const response = await this.itemModel.searchIngredients(search.trim());
      return response.data || [];
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error searching ingredients:', error);
      throw new Error(apiError.message || 'Failed to search ingredients');
    }
  }
}
