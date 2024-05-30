import PageLayout from '@/components/layout/page-layout';
import AuthPage from '@/components/section/auth/authpage';
import React from 'react';

export default function RegisterPage() {
  return (
    <PageLayout>
      <AuthPage isModal={false}/>
    </PageLayout>
  );
}
