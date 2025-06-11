'use client';

import React, { useState, FormEvent } from 'react';
import { getPredictionFromML, PredictionResponse } from '@/server/apiPredictions';

interface IngredientInput {
  ingredient: string;
  dose: number;
}

const PredictionForm: React.FC = () => {
  const [foodList, setFoodList] = useState<IngredientInput[]>([
    { ingredient: '', dose: 0 },
  ]);
  const [result, setResult] = useState<PredictionResponse['predict'] | null>(null);
  const [error, setError] = useState('');

  const handleChange = (
    index: number,
    field: keyof IngredientInput,
    value: string | number
  ) => {
    const updated = [...foodList];
    updated[index] = {
      ...updated[index],
      [field]: field === 'dose' ? Number(value) : value,
    };
    setFoodList(updated);
  };

  const addFoodInput = () => {
    setFoodList([...foodList, { ingredient: '', dose: 0 }]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    setError('');

    try {
      const data: PredictionResponse = await getPredictionFromML({ food: foodList });
      console.log('Prediction result:', data);
      setResult(data.predict);
    } catch (err) {
      console.error('Prediction error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Prediksi Makanan</h2>
        {foodList.map((food, index) => (
          <div key={index} className="space-y-2 border-b pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bahan #{index + 1}
              </label>
              <input
                type="text"
                value={food.ingredient}
                onChange={(e) => handleChange(index, 'ingredient', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                placeholder="Contoh: Gula"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosis (gram)
              </label>
              <input
                type="number"
                value={food.dose}
                onChange={(e) => handleChange(index, 'dose', e.target.value)}
                className="mt-1 block w-full px-4 py-2 border rounded-md"
                placeholder="Contoh: 50"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFoodInput}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
        >
          + Tambah Bahan
        </button>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Prediksi
        </button>

        {/* Hasil prediksi */}
        {result && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md space-y-4 mt-4">
            <h3 className="text-lg font-semibold text-green-800 text-center">Hasil Prediksi</h3>

            <div>
              <h4 className="font-medium text-gray-700 mb-2 mt-4">Total Nutrisi:</h4>
              <div className="overflow-x-auto max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                <table className="min-w-full text-sm text-left table-auto">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="border px-3 py-2">Nutrisi</th>
                      <th className="border px-3 py-2">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.total_nutrition).map(([key, value], idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border px-3 py-1 capitalize">{key.replace(/_/g, ' ')}</td>
                        <td className="border px-3 py-1">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            <div>
              <h4 className="font-medium text-gray-700 mb-2 mt-4">Tingkat Risiko Penyakit:</h4>
              <ul className="space-y-2 text-sm text-gray-800 max-h-64 overflow-y-auto">
                {result.disease_rate.map((disease, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col border p-2 rounded-md bg-white shadow-sm"
                  >
                    <span className="font-semibold text-gray-700">{disease.disease.replace(/_/g, ' ')}</span>
                    <div className="text-xs mt-1">
                      Status: <span className={`font-medium ${disease.status === 'Warning' ? 'text-red-600' : 'text-green-600'}`}>{disease.status}</span><br />
                      Level: <span className="text-gray-600">{disease.level}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center mt-2">
            Error: {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default PredictionForm;
