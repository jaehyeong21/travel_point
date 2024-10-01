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
import { MdError } from "react-icons/md";

interface DestinationCarouselProps {
  image?: string;
  images?: string[];
  title?: string;
}

interface ImageRenderingProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function DestinationCarousel({ image, images, title }: DestinationCarouselProps) {
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

  const ImageRendering = ({ src, alt, width, height }: ImageRenderingProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
      <div className="relative w-full h-full">
        {loading && !error && (
          <div className={'flex-1 animate-pulse'}>
            <div className='relative bg-gray-300 aspect-[16/11] w-full rounded-sm'></div>
          </div>
        )}
        {error && (
          <div className='flex-1 animate-pulse-slow'>
            <div className='relative bg-gray-300 aspect-[16/11] w-full rounded-sm'>
              <div className='p-2 sm:p-2.5'>
                <MdError className='text-red-500 size-4.5' />
                <p className='mt-2 text-sm font-semibold text-red-600'>Error</p>
                <p className='mt-1 text-xs text-red-500 mb-0.5'>문제가 발생했습니다.</p>
                <p className='text-xs text-red-500 text-nowrap'>잠시 후 다시 시도해주세요.</p>
              </div>
            </div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover w-full aspect-[16/11] ${loading || error ? 'hidden' : 'block'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <Carousel
        opts={{ loop: true }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="flex">
          {image && (
            <Image
              src={`${image}/firstimageLarge`}
              alt={`${title} Image`}
              width={800}
              height={550}
              className="object-cover w-full aspect-[16/11]"
              sizes="(max-width: 640px) 500px, (max-width: 1200px) 800px, 760px"
              priority
              placeholder='blur'
              blurDataURL={placeholderImageBase64}
            />
          )}
          {images && images.map((src, index) => (
            <CarouselItem key={index} className="relative w-full">
              <ImageRendering
                src={`${src}/firstimageLarge`}
                alt={`${title} Image ${index}`}
                width={800}
                height={550}
              />
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
      <div ref={emblaThumbsRef} className="hidden md:flex justify-center space-x-4 mt-4">
        {images && images.length > 1 ? images.map((src, index) => (
          <div
            key={index}
            onClick={() => onThumbClick(index)}
            className={`cursor-pointer p-1 ${index === selectedIndex ? 'ring-2 ring-offset-2 ring-slate-500' : ''}`}
          >
            <ImageRendering
              src={`${src}/images`}
              alt={`${title} Thumbnail ${index}`}
              width={96}
              height={64}
            />
          </div>
        )) : <div></div>}
      </div>
    </div>
  );
}
