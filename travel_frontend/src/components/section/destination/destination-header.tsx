'use client';
import React from 'react';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/common/star-rating';
import { Siren, Bookmark } from 'lucide-react';
import { GoCopy } from 'react-icons/go';
import { ToastProvider } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

interface DestinationHeaderProps {
  title: string;
  location: string;
}

const rating = 3.7;
const hashtags = ['걷기좋은길', '봄여행', '공원'];

export default function DestinationHeader({ title, location }: DestinationHeaderProps) {
  return (
    <ToastProvider>
      <HeaderContent title={title} location={location} />
    </ToastProvider>
  );
}

function HeaderContent({ title, location }: DestinationHeaderProps) {
  const { toast } = useToast();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'URL 복사되었습니다',
        description: 'URL이 클립보드에 복사되었습니다.',
      });
    } catch (err) {
      toast({
        title: '복사 실패',
        description: 'URL 복사에 실패했습니다.',
      });
    }
  };

  return (
    <header className='py-8'>
      <Separator className='my-4' />
      <div className='max-w-[900px] mx-auto'>
        <div className='flex justify-between'>
          <div className='flex gap-2 items-end'>
            <h2 className='sm:text-xl font-bold'>{title}</h2>
            <StarRating className='ml-1.5' rating={rating} numPeoPle={323} />
          </div>
          <nav className='flex space-x-2 sm:space-x-4'>
            <div className='mini-icon'><Bookmark className='size-[18px]' /></div>
            <div className='mini-icon'><Siren className='size-[18px]' /></div>
            <div className='mini-icon' onClick={handleCopyClick}>
              <GoCopy className='size-[18px]' />
            </div>
          </nav>
        </div>
        <div className='pt-2'>
          <p className='text-sm'>{location}</p>
        </div>
      </div>
      <Separator className='my-4' />
      <div className='max-w-screen-sm flex justify-center mx-auto'>
        {hashtags.map((tag, index) => (
          <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #{tag}
          </span>
        ))}
      </div>
    </header>
  );
}
