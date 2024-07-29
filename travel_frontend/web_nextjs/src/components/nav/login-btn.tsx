/* eslint-disable @next/next/no-img-element */
'use client';
import { LiaSpinnerSolid } from "react-icons/lia";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUserStore } from "@/store/userStore";
import { getCookie, deleteCookie } from '@/libs/cookie';
import { jwtDecode } from "@/libs/utils";
import { deleteRefreshToken } from "@/services/fetch-auth";

export default function LoginBtn() {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      const user = jwtDecode(accessToken);
      if (user) {
        setUser(user);
      }
    }
    setLoading(false);
  }, [setUser]);

  const openModal = () => {
    router.push('/auth');
  };

  const handleMyPageClick = () => {
    setPopoverOpen(false);
    router.push(`/mypage`);
  };

  const handleLogout = async () => {
    try {
      const logout = await deleteRefreshToken();
      console.log(logout);
      if (logout.response) {
        clearUser();
        deleteCookie('accessToken');
        // deleteCookie('refreshToken');
        setPopoverOpen(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return (
      <div
        className='sm:mx-0 flex border-[0.5px] border-slate-200/60 cursor-pointer items-center rounded-lg py-[6px] px-3 text-xs bg-secondary transition-colors hover:bg-slate-200/80'>
        <div className="flex items-center">
          <LiaSpinnerSolid className="animate-spin-slow size-4 sm:size-5 mr-1.5 text-slate-500" />
          <span className="text-[8px] md:text-[10px]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger className='focus-visible:outline-none'>
            <img data-test="navbar-user-image" src={user.userImgUrl || '/assets/image/characters/anonymous.png'} alt='character image' width={42} height={42} className='bg-white size-[42px] min-w-[42px] rounded-full border outline-none' />
          </PopoverTrigger>
          <PopoverContent className='mt-2 mx-2 bg-slate-100/90 relative'>
            <PopoverClose className='absolute top-2.5 right-2.5 focus-visible:outline-none'>
              <X className='size-4' />
            </PopoverClose>
            <div className='flex justify-center flex-col items-center space-y-4'>
              <p>{user.email}</p>
              <img src={user.userImgUrl || '/assets/image/characters/anonymous.png'} alt='character image' width={72} height={72} className='bg-white rounded-full size-[72px] min-w-[72px]' />
              <p>안녕하세요</p>
              <div className='flex justify-evenly w-full'>
                <Button variant='outline' className='rounded-full' onClick={handleMyPageClick}>
                  마이 페이지
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button data-test="main-logout-btn" variant="outline" className='rounded-full'>로그 아웃</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 로그아웃을 하겠습니까?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-test="main-logout-no">아니오</AlertDialogCancel>
                      <AlertDialogAction data-test="main-logout-yes" className='bg-red-600/80 hover:bg-red-600' onClick={handleLogout}>예</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <button onClick={openModal} data-test="nav-login-btn"
          className='sm:mx-0 flex border-[0.5px] border-slate-200/60 cursor-pointer items-center rounded-lg py-[9px] px-3 text-xs bg-secondary transition-colors hover:bg-slate-200/80'>
          Login
        </button>
      )}
    </>
  );
}
