/* eslint-disable @next/next/no-img-element */
'use client';

import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface DestinationCarouselProps {
  images?: string[];
  title?: string;
}

export default function DestinationCarousel({ images, title }: DestinationCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  },[]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full aspect-[16/11] animate-pulse">
          <div className="w-full h-full bg-gray-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Carousel
        opts={{ loop: true, duration: 30, inViewThreshold: 0.8 }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="flex">
          {images && images.map((src, index) => (
            <CarouselItem key={index} className="relative w-full">
              <div className="relative w-full h-full">
                <img
                  src={`${src}/firstimageLarge`}
                  alt={title ? `${title} ${index}` : '여행지 이미지'}
                  width={800}
                  height={550}
                  className="object-cover w-full aspect-[16/11]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images && images.length > 1 &&
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        }
      </Carousel>
      <div ref={emblaThumbsRef} className={`hidden md:flex justify-center space-x-4 mt-4 ${images && images.length > 1 ? 'h-[74px]' : ''}`}>
        {images && images.length > 1 ? images.map((src, index) => (
          <div
            key={index}
            onClick={() => onThumbClick(index)}
            className={`cursor-pointer p-1 ${index === selectedIndex ? 'ring-2 ring-offset-2 ring-slate-500' : ''}`}
          >
            <div className="relative w-full h-full">
              <img
                src={`${src}/images`}
                alt={'여행지 썸네일 이미지'}
                width={96}
                height={64}
                className="object-cover w-full aspect-[16/11]"
              />
            </div>
          </div>
        )) : <div></div>}
      </div>
    </div>
  );
}
