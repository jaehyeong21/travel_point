'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { jwtDecode } from '@/libs/utils';
import { setCookie } from '@/libs/cookie';
import { LiaSpinnerSolid } from 'react-icons/lia';

const OauthSuccess = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      const user = jwtDecode(token);
      if (user) {
        setCookie({ name: 'accessToken', value: token, hours: 2, secure: true });
        setUser(user);
        router.push('/');
      }
    }
  }, [router, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100/80">
      <div className="text-center">
        <LiaSpinnerSolid className="animate-spin-slow text-6xl mb-4" />
        <span className="text-xl font-semibold">로그인 중...</span>
      </div>
    </div>
  );
};

export default OauthSuccess;
