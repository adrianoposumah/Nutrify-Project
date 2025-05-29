'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, RecommendationFood, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Badge } from '@/components';
import { getFoodByName, FoodDetail } from '@/server/api';

import { MapPin } from 'lucide-react';
import LoadingItemDetail from './loading';

export default function ItemDetail() {
  const params = useParams();
  const foodName = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';

  const [food, setFood] = useState<FoodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getFoodByName(foodName);
        setFood(data);
        if (!data) {
          setError('Food not found');
        }
      } catch (err) {
        setError('Failed to fetch food detail');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (foodName) {
      fetchFoodDetail();
    }
  }, [foodName]);

  if (isLoading) {
    return <LoadingItemDetail />;
  }

  if (error || !food) {
    return (
      <div className="container mx-auto px-4 py-10 lg:py-20">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-xl text-red-500">{error || 'Food not found'}</p>
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
              <BreadcrumbLink>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
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
          <Image src={food.image} alt={food.name} width={600} height={400} className="w-full h-auto rounded-lg object-cover" />
        </div>

        <div className="grid md:grid-cols-6 gap-7 mt-10">
          <div className="col-span-full md:col-span-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{food.name}</h1>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{food.nation}</span>
              </div>
            </div>

            <p className="mb-8">{food.description}</p>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Bahan:</h2>
              <div className="border-t">
                {food.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between py-3 border-b">
                    <span>{ingredient.name}</span>
                    <span>{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Diseases Rate:</h2>
              <Accordion type="single" collapsible className="w-full">
                {food.disease_rate.map((disease, index) => (
                  <AccordionItem key={index} value={`disease-${index}`}>
                    <AccordionTrigger>
                      <div className="flex w-full justify-between">
                        <span className="font-medium text-base">{disease.disease}</span>
                        <Badge variant={getWarningBadgeVariant(disease.warning)}>{disease.warning}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{disease.note}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="col-span-full md:col-span-2">
            <div className="hidden md:block mb-8">
              <Image src={food.image} alt={food.name} width={600} height={400} className="w-full h-auto rounded-lg object-cover" />
            </div>

            <div className="rounded-lg p-6 border">
              <h2 className="text-xl font-bold mb-4">Nutrisi dari {food.name}</h2>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div key={item} className="flex justify-between py-3 border-b">
                  <div className="flex items-center">
                    <span className="font-medium text-base">Protein</span>
                    {item <= 2 && <span className="text-sm text-gray-500 ml-2">15g</span>}
                  </div>
                  <span className="font-medium">20%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <RecommendationFood />
        </div>
      </main>
    </div>
  );
}

function getWarningBadgeVariant(warning: string): 'destructive' | 'default' | 'secondary' | 'outline' | 'success' {
  switch (warning.toUpperCase()) {
    case 'CAUTION':
    case 'WASPADA':
    case 'HIGH RISK':
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
