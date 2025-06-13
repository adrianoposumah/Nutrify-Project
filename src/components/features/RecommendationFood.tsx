'use client';
import React, { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, ItemCard } from '@/components';
import { Item } from '@/types/index';
import { ItemPresenter, ItemView } from '@/presenters/ItemPresenter';

const RecommendationFood = () => {
  const [foods, setFoods] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setError(null);

        // Implement ItemView interface
        const itemView: ItemView = {
          showLoading: (loading: boolean) => setLoading(loading),
          showSuccess: (message: string) => {
            console.log('Success:', message);
          },
          showError: (message: string) => {
            setError(message);
            console.error('Error:', message);
          },
          setItems: (items: Item[]) => {
            const validFoods = items.filter((food) => food && food._id);
            setFoods(validFoods);
          },
          setItem: () => {
            // Not used in this component
          },
        };
        const itemPresenter = new ItemPresenter(itemView);
        const success = await itemPresenter.getRandomItems();

        // If failed and we're offline, show appropriate message
        if (!success && !navigator.onLine) {
          setError('You are offline. Showing cached data if available.');
        }
      } catch (err) {
        const errorMessage = !navigator.onLine ? 'You are offline. Some features may not be available.' : 'Failed to fetch food recommendations';
        setError(errorMessage);
        console.error(err);
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
    <section className="container mx-auto px-8 py-10 lg:py-20 text-center">
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
        {' '}
        <CarouselContent className="-ml-2 md:-ml-4">
          {foods.map((food) => (
            <CarouselItem key={food._id} className="pl-4 md:basis-1/2 lg:basis-1/4 text-left">
              <ItemCard image={food.image} name={food.name} nation={food.nation} />
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
