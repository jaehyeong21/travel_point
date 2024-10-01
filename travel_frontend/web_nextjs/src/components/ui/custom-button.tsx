'use client';
import React from 'react';
import { cn } from "@/libs/utils";

interface CustomButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function CustomButton({ children, className, ...props }: CustomButtonProps) {

  return (
    <button
      {...props}
      className={cn(
        'rounded-full text-sm border px-4 py-1 hover:ring-2 ring-slate-700/80 ring-offset-1 transition-all active:ring-blue-500/30', // active 상태 스타일 추가
        className
      )}      
    >
      {children}
    </button>
  );
}
