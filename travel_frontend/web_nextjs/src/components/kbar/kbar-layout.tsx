'use client';

import React, { lazy, Suspense } from 'react';
import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch, KBarProvider } from "kbar";
import RenderResults from "@/components/kbar/kbar-result";

const KbarContent = lazy(() => import('@/components/kbar/kbar-content'));

export default function KbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <KBarProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <KbarContent>
          <KBarPortal>
            <KBarPositioner className="fixed left-0 right-0 h-full w-full bg-white/60 backdrop-blur-sm z-20">
              <KBarAnimator className="max-w-3xl w-full sm:w-1/2 overflow-hidden rounded-lg shadow-xl border bg-slate-100 "
                style={{ boxShadow: '0 16px 70px rgb(0 0 0 / 20%)' }}>
                <KBarSearch defaultPlaceholder="검색어를 입력하세요." className="bg-slate-100 w-full border-none px-6 py-4 text-slate-600 outline-none placeholder:text-slate-400" />
                <div className="kbar-scrollbar pb-4 mt-2">
                  <RenderResults />
                </div>
              </KBarAnimator>
            </KBarPositioner>
          </KBarPortal>
          {children}
        </KbarContent>
      </Suspense>
    </KBarProvider>
  );
}
