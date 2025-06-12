'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components';
import ItemForm from '@/components/view/Item/ItemForm';
import { Item } from '@/types';
import { formatItemNameForUrl } from '@/utils/urlFormatter';

export default function AddItemPage() {
  const router = useRouter();

  const handleSuccess = (createdItem?: Item) => {
    if (createdItem && createdItem.name) {
      const formattedName = formatItemNameForUrl(createdItem.name);
      router.push(`/item/${formattedName}`);
    }
  };

  return (
    <div className="dashboard-container w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tambahkan Makanan</CardTitle>
          <CardDescription>Masukkan detail makanan baru</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
