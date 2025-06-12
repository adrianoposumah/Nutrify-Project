import { PendingItem, ApiError } from '@/types/index';
import { PendingItemModel } from '@/models/PendingItemModel';

export interface PendingItemView {
  showLoading: (loading: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  setPendingItems: (items: PendingItem[]) => void;
  setPendingItem: (item: PendingItem | null) => void;
  refreshData?: () => void;
  closeDialog?: () => void;
}

export class PendingItemPresenter {
  private pendingItemModel: PendingItemModel;
  private view: PendingItemView;

  constructor(view: PendingItemView) {
    this.pendingItemModel = new PendingItemModel();
    this.view = view;
  }

  async getAllPendingItems(): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.pendingItemModel.getAllPendingItems();
      this.view.setPendingItems(response.data || []);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to fetch pending items');
      console.error('Error fetching pending items:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async getPendingItemDetail(id: string): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.pendingItemModel.getPendingItemDetail(id);
      this.view.setPendingItem(response.data);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to fetch pending item detail');
      console.error('Error fetching pending item detail:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async approvePendingItem(id: string): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.pendingItemModel.approvePendingItem(id);
      this.view.showSuccess(response.message || 'Item approved successfully');
      if (this.view.refreshData) {
        this.view.refreshData();
      }
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to approve item');
      console.error('Error approving item:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }

  async rejectPendingItem(id: string, rejectionReason?: string): Promise<boolean> {
    try {
      this.view.showLoading(true);
      const response = await this.pendingItemModel.rejectPendingItem(id, rejectionReason);
      this.view.showSuccess(response.message || 'Item rejected successfully');
      if (this.view.refreshData) {
        this.view.refreshData();
      }
      if (this.view.closeDialog) {
        this.view.closeDialog();
      }
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.view.showError(apiError.message || 'Failed to reject item');
      console.error('Error rejecting item:', error);
      return false;
    } finally {
      this.view.showLoading(false);
    }
  }
}
