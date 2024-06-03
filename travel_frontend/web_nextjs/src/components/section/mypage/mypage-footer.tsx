import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function MypageFooter() {
  return (
    <div className='flex justify-between items-start pt-5 px-6'>
      <div className='flex flex-col space-y-2'>
        <AlertDialog>
          <AlertDialogTrigger asChild className='max-w-[70px]'>
            <Button variant="outline" size={'sm'}>회원 탈퇴</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말로 회원 탈퇴를 하겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                Travel-Point에서 회원 탈퇴 후에는 복구가 불가능하니 유의해 주세요.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>아니오</AlertDialogCancel>
              <AlertDialogAction className='bg-red-600/80 hover:bg-red-600'>예</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className='text-xs'>탈퇴 후에는 복구가 불가능하니 유의해 주세요.</p>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild className='max-w-[70px]'>
          <Button variant="outline" size={'sm'}>로그 아웃</Button>
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
  );
}
