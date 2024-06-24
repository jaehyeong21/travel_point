// components/auth/AuthForm.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import RegisterSection from '@/components/section/auth/register-section';
import LoginSection from '@/components/section/auth/login-section';
import { AuthPageProps } from './auth-page';

export default function AuthForm({ isModal }: AuthPageProps) {
  const { isRegister, toggleForm } = useAuthStore();

  return (
    <div className="space-y-6">
      {isRegister ? (
        <RegisterSection toggleForm={toggleForm} isModal={isModal}/>
      ) : (
        <LoginSection toggleForm={toggleForm} isModal={isModal}/>
      )}
    </div>
  );
}
