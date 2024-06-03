import { ImGithub } from "react-icons/im";

import React from 'react';

export default function SiteFooter() {
  return (
    < footer className="bg-gray-50/40 shadow" >
      <div className="mx-auto px-4 pb-6 sm:px-6 lg:px-8">
        <div className="border-t border-gray-100 pt-6">
          <div className="text-center flex justify-between max-w-screen-lg mx-auto px-2 sm:px-5">
            <p className="text-xs text-gray-600 ">
              Copyright © {new Date().getFullYear()}{' '}
              <a href="https://travel-point-umber.vercel.app/" className="underline">
                Travel Point
              </a>{' '}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/jaehyeong21/travel_point" target="_blank">
                <ImGithub className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
}
