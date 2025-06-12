/* eslint-disable @typescript-eslint/no-explicit-any */
import { mlApiClient } from '@/lib/apiClient';
import { PredictionRequest, PredictionResponse } from '@/types/predict';

export class PredictModel {
  async predict(payload: PredictionRequest): Promise<PredictionResponse> {
    try {
      console.log('Making prediction request with payload:', payload);
      console.log('ML API Base URL:', process.env.NEXT_PUBLIC_API_ML_URL);

      const response = await mlApiClient.post<PredictionResponse>('/predict', payload);

      console.log('Prediction response:', response);
      return response;
    } catch (error: any) {
      console.error('Prediction error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      // Provide more specific error messages
      if (error.response?.status === 400) {
        throw new Error('Data yang dikirim tidak valid. Pastikan semua bahan dan takaran sudah benar.');
      } else if (error.response?.status === 500) {
        throw new Error('Terjadi kesalahan pada server prediksi. Silakan coba lagi nanti.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        throw new Error('Tidak dapat terhubung ke server prediksi. Periksa koneksi internet Anda.');
      } else {
        throw new Error(error.response?.data?.message || 'Gagal membuat prediksi. Silakan coba lagi.');
      }
    }
  }
}
