import { Link } from 'next-view-transitions';
import Image from 'next/image';
import React from 'react';

export default function Logo() {
  return (
    <div className="items-center relative flex">
      <Link className="text-blue-800/90 md:pr-12 flex" href="/">
        <span className="sr-only">Home with logo image</span>
        <Image width={36} height={36} src={'/assets/favicons/apple-touch-icon.png'} alt='logo image' priority className='absolute mr-2 -top-1.5 -left-3'/>
        <h1 className="md:text-xl font-semibold tracking-wide text-base pl-6 text-nowrap">Travel Point</h1>
      </Link>
    </div>
  );
}
