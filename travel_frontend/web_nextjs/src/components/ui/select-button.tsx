import React from 'react';
import { cn } from "@/libs/utils";


interface SelectButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function SelectButton({ children, className, ...props }: SelectButtonProps) {
  return (
    <button {...props}
      className={cn('rounded-full border px-4 py-1 hover:ring-2 ring-slate-700/80 ring-offset-1 transition-all', className)}>
      {children}
    </button>
  );
}
