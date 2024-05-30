'use client';
import React, { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AuthForm from '@/components/section/auth/auth-form';

interface AuthPageProps {
  isModal?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isModal = true }) => {
  const router = useRouter();

  const backbtn = useCallback(() => {
    router.back();
  }, [router]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        backbtn();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        backbtn();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [backbtn, isModal]);

  return (
    <div className={`w-full h-full ${isModal ? 'fixed z-50 bg-opacity-70 backdrop-blur-sm overflow-auto bg-gray-500' : 'py-20'} `}>
      <div className={`${isModal ? 'sticky top-40' : ''} flex justify-center`}>
        <div
          className={`max-w-md w-full h-auto flex flex-col text-gray-900 space-y-8 bg-white rounded-lg p-8 ${isModal ? 'shadow-lg' : ''}`}
          ref={modalRef}
        >
          <div className='relative'>
            <button className={`${isModal ? 'absolute top-2 right-0' : 'hidden'}`} onClick={backbtn}>
              <X className="size-5 text-gray-900" />
            </button>
            <AuthForm />
          </div>
        </div>
      </div>
      {isModal ? '' : <Separator className='my-10 sm:my-20' />}
    </div>
  );
};

export default AuthPage;
