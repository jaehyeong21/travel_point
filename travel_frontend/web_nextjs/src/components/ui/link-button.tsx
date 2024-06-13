import React from 'react';
import { cn } from "@/libs/utils";
import Link from 'next/link';


interface LinkButtonProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export default function LinkButton({ children, className, href, ...props }: LinkButtonProps) {
  return (
    <Link {...props} href={href} className={cn('rounded-full border px-4 py-1 text-sm hover:ring-2 ring-offset-1 transition-all', className)}>
      {children}
    </Link>
  );
}
