import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, PendingItemList } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permintaan Item | Nutrify',
  description: 'Halaman permintaan item yang menampilkan daftar item yang sedang menunggu persetujuan.',
};

export default function PendingItemsPage() {
  return (
    <div className="dashboard-container w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Permintaan Item</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingItemList />
        </CardContent>
      </Card>
    </div>
  );
}
