import HeroSection from '@/components/common/hero-section';
import PageLayout from '@/components/layout/page-layout';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import { AdminContent } from './admin-content';


export const metadata: Metadata = {
  title: '관리자 페이지',
  description: 'admin page'
};

export default async function AdminPage() {
  return (
    <main>
      <HeroSection page='mypage' title='관리자 페이지' subtitle='환영합니다' />
      <PageLayout className='px-0 sm:px-6 xl:px-0' option='70dvh'>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminContent />
        </Suspense>
      </PageLayout>      
    </main>
  );
}