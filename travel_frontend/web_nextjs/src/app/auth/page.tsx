

import AuthPage from '@/components/section/auth/auth-page';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '로그인/회원가입',
  description: '로그인 및 회원가입 페이지입니다'
};

export default function RegisterPage() {
  return (
    <section className='max-w-4xl xl:max-w-5xl px-4 sm:px-6 xl:px-0 mx-auto min-h-dvh'>
      <div className="flex flex-col flex-1 ">
        <AuthPage isModal={false} />
      </div >
    </section>
  );
}
