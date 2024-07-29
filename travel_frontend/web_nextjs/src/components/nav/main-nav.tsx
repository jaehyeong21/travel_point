'use client';
import { headerMenus } from '@/config/site-config';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation menus" className="hidden sm:flex items-center sm:space-x-6 md:space-x-16 md:pr-10 lg:pr-20 " >
      {headerMenus.map((menu) => (
        <Link key={menu.path} href={`${menu.path}?region=all&page=1`} className={`text-slate-800 ${pathname === menu.path ? '' : 'underline-link'} text-sm text-nowrap`}>
          <span className={`${pathname === menu.path ? 'underline-link-active' : ''}`}>{menu.name}</span>
        </Link>
      ))}
    </nav>
  );
}