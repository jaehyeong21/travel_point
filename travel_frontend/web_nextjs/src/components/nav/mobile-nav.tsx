'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerMenus } from '@/config/site-config';
import KBarButton from '@/components/kbar/kbar-btn';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 flex justify-between pt-3 pb-4 items-center bg-white border-t border-gray-300 z-50">
      {headerMenus.map(({ name, path, icon: Icon }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={name}
            href={`${path}?region=all&page=1`}
            className={`flex flex-col items-center justify-center flex-1 ${isActive ? 'text-blue-500' : ''}`}
          >
            {Icon && <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-blue-500' : ''}`} />}
            <span className={`text-sm ${isActive ? 'font-bold' : ''}`}>{name}</span>
          </Link>
        );
      })}
      <KBarButton isMobile />
    </nav>
  );
}
