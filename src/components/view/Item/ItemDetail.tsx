'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { ItemPresenter } from '@/presenters/ItemPresenter';
import { Item } from '@/types/index';
import LoadingItemDetail from '@/app/(home)/item/[id]/loading';

// Mock component for recommendations
const RecommendationFood = () => (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Recommended Foods</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item} className="overflow-hidden">
          <div className="h-48 bg-muted"></div>
          <CardContent className="p-4">
            <h3 className="font-medium">Similar Food {item}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function ItemDetail() {
  const params = useParams();
  const itemId = typeof params.id === 'string' ? params.id : '';

  const [food, setFood] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const itemPresenter = new ItemPresenter();
        const response = await itemPresenter.getItemById(itemId);
        setFood(response.data);
      } catch (err) {
        setError('Failed to fetch item detail');
        console.error('Error fetching item:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetail();
    }
  }, [itemId]);

  if (isLoading) {
    return <LoadingItemDetail />;
  }

  if (error || !food) {
    return (
      <div className="container mx-auto px-4 py-10 lg:py-20">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-xl text-red-500">{error || 'Item not found'}</p>
          <Link href="/" className="mt-4 text-blue-500 hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 lg:py-20">
      <main className="mt-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
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
            </div>{' '}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Ingredients:</h2>
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
              <h2 className="text-xl font-bold mb-4">Health Considerations:</h2>
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
                <h2 className="text-xl font-bold mb-4">Nutrition Facts</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground capitalize">{food.category}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-muted-foreground mb-2">Nutritional information varies based on preparation method and portion size.</div>

                    {/* Example nutrition facts - in a real app, these would come from the API */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Protein</span>
                        <span>High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat</span>
                        <span>Medium-High</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates</span>
                        <span>Low</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sodium</span>
                        <span>Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Cooking Tips</h3>
                <p className="text-sm text-muted-foreground">For authentic rendang, slow cook for at least 4 hours until the meat is tender and the sauce has thickened and darkened.</p>
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
