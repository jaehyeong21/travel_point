import React from 'react';
import LinkButton from '@/components/ui/link-button';
import { pageColors, REGIONS } from '@/data/data';
import { RegionName } from '@/types/region-type';
import { cn } from '@/libs/utils';

type PageName = keyof typeof pageColors;

interface RegionSelectionProps {
  page: PageName;
  title: string;
  activeRegion?: RegionName;
  onRegionChange?: (region: string) => void;
  className?: string;
}

export function getStyles(page: PageName, active: boolean) {
  const { bg, ring } = pageColors[page];
  if (!bg || !ring) return '';

  const baseRing = ring === 'ring-0' ? 'ring-0' : `${ring} ring-2 ring-offset-1`;
  return active ? `font-medium ${bg} ${baseRing} hover:${ring}` : ring;
}

export default function RegionSelection({ className, page, title, activeRegion, onRegionChange }: RegionSelectionProps) {
  return (
    <nav className={cn('mt-4 sm:mt-10 max-w-screen-md mx-auto phone-container', className)} id='regionSelection'>
      <h2 className="text-center py-8 font-semibold">{title}</h2>
      <ul className="flex flex-wrap justify-center gap-4">
        {page === 'mainpage' ? (
          REGIONS.map((item, index) => (
            <li key={index}>
              <LinkButton href={`/regions?region=${item.name}`} className="hover:ring-slate-500/80">
                {item.name}
              </LinkButton>
            </li>
          ))
        ) : page === 'recommended' ? (
          <>
            <li>
              <button
                className={`text-sm ${getStyles(page, activeRegion === 'all')} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                onClick={() => onRegionChange && onRegionChange('all')}
              >
                전체
              </button>
            </li>
            {REGIONS.map((item, index) => (
              <li key={index}>
                <button
                  className={`text-sm ${getStyles(page, item.name === activeRegion)} rounded-full border px-4 py-1 hover:ring-2 ring-offset-1 transition-all`}
                  onClick={() => onRegionChange && onRegionChange(item.name)}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </>
        ) : (
          <>
            <li>
              <LinkButton
                href={`/${page}?region=all&page=1`}
                className={`${getStyles(page, activeRegion === 'all')}`}
              >
                전체
              </LinkButton>
            </li>
            {REGIONS.map((item, index) => (
              <li key={index}>
                <LinkButton
                  href={`/${page}?region=${item.name}&page=1`}
                  className={`${getStyles(page, item.name === activeRegion)}`}
                >
                  {item.name}
                </LinkButton>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
}
