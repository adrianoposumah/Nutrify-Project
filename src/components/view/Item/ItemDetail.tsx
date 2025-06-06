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
import { decodeItemNameFromUrl } from '@/utils/urlFormatter';

export default function ItemDetail() {
  const params = useParams();
  const itemId = typeof params.id === 'string' ? params.id : '';

  // Use the URL formatter utility for consistency
  const itemName = decodeItemNameFromUrl(itemId);

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
        const success = await itemPresenter.getItemByName(itemName);

        if (!success) {
          notFound();
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        notFound();
      }
    };

    if (itemName) {
      fetchItemDetail();
    }
  }, [itemName]);

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
                  </div>{' '}
                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Informasi nutrisi per 100g sajian.</div>
                    {food.nutrition_total ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Kalori</span>
                          <span>{food.nutrition_total.calories} kkal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span>{food.nutrition_total.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lemak</span>
                          <span>{food.nutrition_total.fat}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Karbohidrat</span>
                          <span>{food.nutrition_total.carbohydrates}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Serat</span>
                          <span>{food.nutrition_total.fiber}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gula</span>
                          <span>{food.nutrition_total.sugar}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Natrium</span>
                          <span>{food.nutrition_total.sodium}mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kolesterol</span>
                          <span>{food.nutrition_total.cholesterol}mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Air</span>
                          <span>{food.nutrition_total.water}g</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Informasi nutrisi tidak tersedia.</div>
                    )}

                    {food.nutrition_total?.vitamins && (
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-medium mb-2">Vitamin</h3>
                        <div className="space-y-1 text-sm">
                          {Object.entries(food.nutrition_total.vitamins).map(
                            ([key, value]) =>
                              value > 0 && (
                                <div key={key} className="flex justify-between">
                                  <span>{formatVitaminName(key)}</span>
                                  <span>{formatVitaminValue(key, value)}</span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}

                    {food.nutrition_total?.minerals && (
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-medium mb-2">Mineral</h3>
                        <div className="space-y-1 text-sm">
                          {Object.entries(food.nutrition_total.minerals).map(
                            ([key, value]) =>
                              value > 0 && (
                                <div key={key} className="flex justify-between">
                                  <span>{formatMineralName(key)}</span>
                                  <span>{value}mg</span>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
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

function formatVitaminName(key: string): string {
  const vitaminNames: Record<string, string> = {
    vitamin_A: 'Vitamin A',
    vitamin_B1: 'Vitamin B1',
    vitamin_B2: 'Vitamin B2',
    vitamin_B3: 'Vitamin B3',
    vitamin_B5: 'Vitamin B5',
    vitamin_B6: 'Vitamin B6',
    vitamin_B9: 'Vitamin B9',
    vitamin_B12: 'Vitamin B12',
    vitamin_C: 'Vitamin C',
    vitamin_D: 'Vitamin D',
    vitamin_E: 'Vitamin E',
    vitamin_K: 'Vitamin K',
  };
  return vitaminNames[key] || key;
}

function formatVitaminValue(key: string, value: number): string {
  // Some vitamins are measured in different units
  const microGramVitamins = ['vitamin_B9', 'vitamin_B12', 'vitamin_D', 'vitamin_K'];

  if (microGramVitamins.includes(key)) {
    return `${value}μg`;
  }
  return `${value}mg`;
}

function formatMineralName(key: string): string {
  const mineralNames: Record<string, string> = {
    calcium: 'Kalsium',
    iron: 'Besi',
    magnesium: 'Magnesium',
    phosphorus: 'Fosfor',
    potassium: 'Kalium',
    zinc: 'Seng',
  };
  return mineralNames[key] || key;
}

function getStatusBadgeVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' | 'success' {
  switch (status.toUpperCase()) {
    case 'CAUTION':
    case 'HIGH RISK':
    case 'WASPADA':
    case 'ALERT':
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
