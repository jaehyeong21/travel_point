// components/auth/AuthForm.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import RegisterSection from '@/components/section/auth/register-section';
import LoginSection from '@/components/section/auth/login-section';

export default function AuthForm() {
  const { isRegister, toggleForm } = useAuthStore();

  return (
    <div className="space-y-6">
      {isRegister ? (
        <RegisterSection toggleForm={toggleForm} />
      ) : (
        <LoginSection toggleForm={toggleForm} />
      )}
    </div>
  );
}
