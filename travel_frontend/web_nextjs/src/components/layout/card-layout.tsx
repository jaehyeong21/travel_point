import { cn } from '@/libs/utils';
import React from 'react';

interface CardLayoutProps {
  children: React.ReactNode,
  className?: string
  isTwo?: boolean;
}

export default function CardLayout({ children, isTwo = false, className }: CardLayoutProps) {
  return (
    <div className={`${cn(`w-full ${isTwo ? 'flex justify-between' : 'grid grid-cols-2 sm:grid-cols-4'}`, className)}`}>
      {children}
    </div>
  );
}
