'use client';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Badge,
  Card,
  CardContent,
  RecommendationFood,
} from '@/components/index';
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { ItemPresenter, ItemView } from '@/presenters/ItemPresenter';
import { Item } from '@/types/index';
import LoadingItemDetail from '@/app/(home)/item/[id]/loading';

export default function ItemDetail() {
  const params = useParams();
  const itemId = typeof params.id === 'string' ? params.id : '';

  const [food, setFood] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        setError(null);

        // Implement ItemView interface
        const itemView: ItemView = {
          showLoading: (loading: boolean) => setIsLoading(loading),
          showSuccess: (message: string) => {
            // Could add toast notification here if needed
            console.log('Success:', message);
          },
          showError: (message: string) => {
            setError(message);
            console.error('Error:', message);
          },
          setItems: () => {
            // Not used in this component
          },
          setItem: (item: Item | null) => setFood(item),
        };

        const itemPresenter = new ItemPresenter(itemView);
        const success = await itemPresenter.getItemById(itemId);

        if (!success) {
          notFound();
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        notFound();
      }
    };

    if (itemId) {
      fetchItemDetail();
    }
  }, [itemId]);

  // Set document title based on food name
  useEffect(() => {
    if (food?.name) {
      document.title = `${food.name} | Nutrify`;
    } else if (isLoading) {
      document.title = 'Loading... - Nutrify';
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Nutrify';
    };
  }, [food?.name, isLoading]);
  if (isLoading) {
    return <LoadingItemDetail />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 lg:py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!food) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 lg:py-20">
      <main className="mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Beranda</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/category">Makanan</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{food.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="md:hidden mt-6 mb-8">
          <Image src={food.image || '/placeholder.svg'} alt={food.name} width={600} height={400} className="w-full h-auto rounded-lg object-cover shadow-md" />
        </div>

        <div className="grid md:grid-cols-6 gap-7 mt-10">
          <div className="col-span-full md:col-span-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{food.nation}</span>
              </div>
            </div>
            <div className="mb-8 text-pretty">
              <p className="leading-relaxed">{food.description}</p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Bahan-bahan:</h2>
              {food.ingredients && food.ingredients.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  {food.ingredients.map((ingredient, index) => (
                    <div key={index} className={`flex justify-between py-3 px-4 ${index < food.ingredients!.length - 1 ? 'border-b' : ''}`}>
                      <span className="font-medium">{ingredient.ingredientName}</span>
                      <span className="text-muted-foreground">{ingredient.ingredientDose}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No ingredients information available.</p>
              )}
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Pertimbangan Kesehatan:</h2>
              {food.disease_rate && food.disease_rate.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {food.disease_rate.map((diseaseItem, index) => (
                    <AccordionItem key={index} value={`disease-${index}`}>
                      <AccordionTrigger>
                        <div className="flex w-full justify-between items-center">
                          <span className="font-medium text-base">{diseaseItem.disease}</span>
                          <Badge variant={getStatusBadgeVariant(diseaseItem.status)} className="ml-2">
                            {diseaseItem.status}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{diseaseItem.level}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No health considerations information available.</p>
              )}
            </div>
          </div>

          <div className="col-span-full md:col-span-2">
            <div className="hidden md:block mb-8">
              <Image src={food.image || '/placeholder.svg'} alt={food.name} width={600} height={400} className="w-full h-auto rounded-lg object-cover shadow-md" />
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Fakta Nutrisi</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Kategori</span>
                    <span className="text-muted-foreground capitalize">{food.category}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Informasi nutrisi per 100g sajian.</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Kalori</span>
                        <span>61 kkal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span>0,3g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lemak</span>
                        <span>0,2g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Karbohidrat</span>
                        <span>14,9g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Serat</span>
                        <span>0,5g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gula</span>
                        <span>6g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Natrium</span>
                        <span>1mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kolesterol</span>
                        <span>0mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Air</span>
                        <span>84g</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Vitamin</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Vitamin B1</span>
                          <span>0,01mg</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Mineral</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Kalsium</span>
                          <span>27mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Besi</span>
                          <span>0,6mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Magnesium</span>
                          <span>10mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fosfor</span>
                          <span>13mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kalium</span>
                          <span>10mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seng</span>
                          <span>0,1mg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <RecommendationFood />
        </div>
      </main>
    </div>
  );
}

function getStatusBadgeVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' | 'success' {
  switch (status.toUpperCase()) {
    case 'CAUTION':
    case 'HIGH RISK':
    case 'WASPADA':
      return 'destructive';
    case 'MODERATE CONSUMPTION':
    case 'KONSUMSI WAJAR':
      return 'secondary';
    case 'SAFE':
    case 'AMAN':
    case 'BENEFICIAL':
      return 'success';
    default:
      return 'outline';
  }
}
