'use client';

import { useKBar } from 'kbar';
import { Search } from 'lucide-react';
import { cn } from '@/libs/utils';

interface KBarButtonProps {
  isMobile?: boolean
}

export default function KBarButton({ isMobile = false }: KBarButtonProps) {
  const { query } = useKBar();

  return (
    <>
      {isMobile ?
        <button onClick={query.toggle} className='flex'>
          <span className="sr-only">Mobile search button</span>
          <span className="underline-link hover:font-semibold transition-all flex items-center"><Search className="size-4 mr-1.5" />검색</span>
        </button>
        :
        <>
          <button
            className={cn(
              'hidden sm:flex cursor-pointer items-center rounded-lg p-1 text-xs ',
              'bg-secondary transition-colors dark:bg-slate-800 dark:hover:bg-slate-800/70 hover:bg-slate-200/80',
            )}
            onClick={query.toggle}
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