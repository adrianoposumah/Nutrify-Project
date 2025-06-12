import { PendingItemListResponse, PendingItemDetailResponse, ApproveRejectResponse } from '@/types/index';
import { apiClient } from '@/lib/apiClient';

export class PendingItemModel {
  async getAllPendingItems(): Promise<PendingItemListResponse> {
    try {
      const response = await apiClient.get<PendingItemListResponse>(`/pending-items`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPendingItemDetail(id: string): Promise<PendingItemDetailResponse> {
    try {
      const response = await apiClient.get<PendingItemDetailResponse>(`/pending-items/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async approvePendingItem(id: string): Promise<ApproveRejectResponse> {
    try {
      const response = await apiClient.patch<ApproveRejectResponse>(`/pending-items/${id}/approve`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async rejectPendingItem(id: string, rejectionReason?: string): Promise<ApproveRejectResponse> {
    try {
      const body = rejectionReason ? { rejectionReason } : {};
      const response = await apiClient.patch<ApproveRejectResponse>(`/pending-items/${id}/reject`, body);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
