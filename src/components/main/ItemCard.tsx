import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatItemNameForUrl } from '@/utils/urlFormatter';

interface ItemCardProps {
  image: string;
  name: string;
  nation: string;
  className?: string;
}

const ItemCard = ({ image, name, nation, className = 'pl-4 md:basis-1/2 lg:basis-1/4 text-left' }: ItemCardProps) => {
  // Use the URL formatter utility for consistency
  const encodedName = formatItemNameForUrl(name);

  return (
    <Link href={`/item/${encodedName}`} className={className}>
      <div className="cursor-pointer transition-transform hover:scale-105">
        <div className="relative h-50 w-full overflow-hidden rounded-md">
          <Image src={image} alt={name} sizes="100" fill className="object-cover" />
        </div>
        <h2 className="text-lg font-semibold mt-4">{name}</h2>
        <p className="text-gray-500">{nation}</p>
      </div>
    </Link>
  );
};

export default ItemCard;
