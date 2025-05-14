"use client";
import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components";

const food = [
  {
    id: 1,
    name: "Rendang",
    nation: "Indonesia",
    image: "/rendang.jpg",
  },
  {
    id: 2,
    name: "Hamburger",
    nation: "USA",
    image: "/hamburger.jpg",
  },
  {
    id: 3,
    name: "Pizza",
    nation: "Italy",
    image: "/pizza.jpg",
  },
  {
    id: 4,
    name: "Pisang Goreng",
    nation: "Indonesia",
    image: "/pisanggoreng.jpeg",
  },
  {
    id: 5,
    name: "Pisang Goreng",
    nation: "Indonesia",
    image: "/pisanggoreng.jpeg",
  },
  {
    id: 6,
    name: "Pisang Goreng",
    nation: "Indonesia",
    image: "/pisanggoreng.jpeg",
  },
  {
    id: 7,
    name: "Pisang Goreng",
    nation: "Indonesia",
    image: "/pisanggoreng.jpeg",
  },
];

const RecommendationFood = () => {
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
          {Array.from({ length: food.length }).map((_, index) => (
            <CarouselItem key={food[index].id} className="pl-4 md:basis-1/2 lg:basis-1/4 text-left">
              <div className="relative h-50 w-full overflow-hidden">
                <Image src={food[index].image} alt={food[index].name} sizes="100" fill className="object-cover" />
              </div>
              <h2 className="text-lg font-semibold mt-4">{food[index].name}</h2>
              <p className="text-gray-500">{food[index].nation}</p>
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
