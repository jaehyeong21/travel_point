'use client';
import { useEffect, useRef, useState } from 'react';
import MainNav from '@/components/nav/main-nav';
import Logo from '@/components/nav/logo';
import LoginBtn from '@/components/nav/login-btn';
import KBarButton from '@/components/kbar/kbar-btn';
import { throttleHelper } from '@/libs/utils';

export default function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollPos = useRef(0);

  useEffect(() => {
    const handleScroll = throttleHelper(() => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos.current > currentScrollPos;

      setIsVisible(isScrollingUp || currentScrollPos < 50);
      prevScrollPos.current = currentScrollPos;
    }, 200);

    const handleResize = () => {
      const mediaQuery = window.matchMedia('(max-width: 640px)'); // sm 이하만 적용

      if (mediaQuery.matches) {
        window.addEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };

    handleResize(); // 초기 실행 시 한 번 호출하여 초기 상태 설정
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
    };
  }, []);

  return (
    <header className={`bg-white/70 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-between sm:mx-0 mx-2">
          <Logo />
          <MainNav />
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex gap-6 items-center">
              <KBarButton />
              <LoginBtn />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}