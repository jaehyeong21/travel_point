'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { headerMenus } from '@/config/site-config';
import KBarButton from '@/components/kbar/kbar-btn';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex md:hidden pl-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className='' asChild>
          <Button variant="outline" className="w-10 px-0 sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right'>
          <MobileLink
            onOpenChange={setOpen}
            href="/"
            className="flex items-center font-semibold pb-3"
          >
            <span className=" underline-link hover:text-slate-700/95 transition-all">Travel Point</span>
          </MobileLink>
          <nav className="flex flex-col gap-3.5 mt-6">
            {headerMenus.map((menu) => (
              <MobileLink onOpenChange={setOpen} href={`${menu.path}?region=all&page=1`} key={menu.name}>
                <span className="underline-link hover:font-semibold transition-all">{menu.name}</span>
              </MobileLink>
            ))}
            <KBarButton isMobile/>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}


interface MobileLinkProps extends LinkProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function MobileLink({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
