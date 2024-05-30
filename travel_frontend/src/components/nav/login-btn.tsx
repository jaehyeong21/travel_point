'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';

export default function LoginBtn() {
  const token = true;
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const openModal = () => {
    router.push('/auth');
  };

  const handleMyPageClick = () => {
    setPopoverOpen(false);
    router.push(`/mypage/${'abcd'}`);
  };

  return (
    <>
      {token ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger className='focus-visible:outline-none'>
            <Image src={'/assets/image/characters/m1.png'} alt='character image' width={42} height={42} className='bg-white rounded-full border outline-none' />
          </PopoverTrigger>
          <PopoverContent className='mt-2 mx-2 bg-slate-100/90 relative'>
            <PopoverClose className='absolute top-2.5 right-2.5 focus-visible:outline-none'>
              <X className='size-4' />
            </PopoverClose>
            <div className='flex justify-center flex-col items-center space-y-4 '>
              <p>asdfasdf@naver.com</p>
              <Image src={'/assets/image/characters/m1.png'} alt='character image' width={72} height={72} className='bg-white rounded-full' />
              <p>안녕하세요, 인환님.</p>
              <div className='flex justify-evenly w-full'>
                <Button variant='outline' className='rounded-full' onClick={handleMyPageClick}>
                  마이 페이지
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className='rounded-full'>로그 아웃</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 로그아웃을 하겠습니까?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>아니오</AlertDialogCancel>
                      <AlertDialogAction className='bg-red-600/80 hover:bg-red-600'>예</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button onClick={openModal}>Login</Button>
      )}
    </>
  );
}
