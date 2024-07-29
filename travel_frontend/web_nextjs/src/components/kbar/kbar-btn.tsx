'use client';

import { useKBar } from 'kbar';
import { cn } from '@/libs/utils';
import { LiaSearchSolid } from "react-icons/lia";

interface KBarButtonProps {
  isMobile?: boolean
}

export default function KBarButton({ isMobile = false }: KBarButtonProps) {
  const { query } = useKBar();

  return (
    <>
      {isMobile ?
        <button data-test='smallView-search-btn' onClick={() => query.toggle()} className="flex flex-col items-center justify-center flex-1">
          <span className="sr-only">Mobile search button</span>
          <LiaSearchSolid className='h-6 w-6 mb-1' />
          <span className="text-sm">검색</span>
        </button>
        :
        <>
          <button
            data-test='search-btn'
            className={cn(
              'hidden sm:flex cursor-pointer items-center rounded-lg p-1 text-xs border-[0.5px] border-slate-200/60',
              'bg-secondary transition-colors dark:bg-slate-800 dark:hover:bg-slate-800/70 hover:bg-slate-200/80',
            )}
            onClick={() => query.toggle()}
          >
            <span className="sr-only">Search button</span>
            <span className="px-3">Search...</span>
            <div
              className={cn(
                'ml-auto rounded-lg px-2 py-1 text-nowrap',
                'bg-slate-300/80 dark:bg-slate-700 border transition-colors dark:border-neutral-800',
              )}
            >
              ⌘ + K
            </div>
          </button>

        </>
      }
    </>
  );
}