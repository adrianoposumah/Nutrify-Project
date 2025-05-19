'use client';
import React, { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, ItemCard } from '@/components';
import { Food, getFoodRecommendations } from '@/server/api';

const RecommendationFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoodRecommendations();
        setFoods(data);
      } catch (err) {
        setError('Failed to fetch food recommendations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-10 lg:py-20 text-center">
        <h1>Jelajahi Makanan</h1>
        <p className="mt-3 mx-auto">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10 lg:py-20 text-center">
        <h1>Jelajahi Makanan</h1>
        <p className="mt-3 mx-auto text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 lg:py-20 text-center">
      <h1>Jelajahi Makanan</h1>
      <p className="mt-3 mx-auto">Temukan informasi makanan yang sesuai dengan kebutuhanmu</p>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full mt-4"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {foods.map((food) => (
            <CarouselItem key={food.id} className="pl-4 md:basis-1/2 lg:basis-1/4 text-left">
              <ItemCard id={food.id.toString()} image={food.image} name={food.name} nation={food.nation} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default RecommendationFood;
