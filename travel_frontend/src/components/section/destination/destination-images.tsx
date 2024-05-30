/* eslint-disable @next/next/no-img-element */
'use client';

import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { placeholderImageBase64 } from "@/data/data";

interface DestinationCarouselProps {
  images: string[];
  title?: string;
}

export default function DestinationCarousel({ images, title }: DestinationCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selected = api.selectedScrollSnap();
      setSelectedIndex(selected);
      if (emblaThumbsApi) {
        emblaThumbsApi.scrollTo(selected);
      }
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, emblaThumbsApi]);

  const onThumbClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div>
      <Carousel
        opts={{ loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="flex">
          {images.map((src, index) => (
            <CarouselItem key={index} className="relative w-full">
              <Image
                src={src}
                alt={`${title} Image ${index}`}
                width={800}
                height={550}
                className="object-cover w-full aspect-[16/11]"
                sizes="(max-width: 640px) 500px, (max-width: 1200px) 800px, 760px"
                priority
                placeholder='blur'
                blurDataURL={placeholderImageBase64}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 &&
        <>
          <CarouselPrevious />
          <CarouselNext /></>
        }

      </Carousel>
      <div ref={emblaThumbsRef} className="hidden md:flex justify-center space-x-4 mt-4">
        {images.length > 1 ? images.map((src, index) => (
          <div
            key={index}
            onClick={() => onThumbClick(index)}
            className={`cursor-pointer p-1 ${index === selectedIndex ? 'ring-2 ring-offset-2 ring-slate-500' : ''}`}
          >
            <Image
              sizes="(min-width: 1200px) 96px, 96px"
              width={96}
              height={64}
              src={src}
              alt={`${title} Thumbnail ${index}`}
              className="object-cover aspect-[16/11] w-24 h-16"
              quality={40}
              priority
              placeholder='blur'
              blurDataURL={placeholderImageBase64}
            />
          </div>
        )) : <div></div>}
      </div>
    </div>
  );
}
