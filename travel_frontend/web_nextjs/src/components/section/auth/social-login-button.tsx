'use client';

import React, { useEffect, useState } from 'react';

export default function SocialLoginButton({ provider }: { provider: 'Naver' | 'Google' }) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(encodeURIComponent(window.location.href));
    }
  }, []);

  const oauthUrl =
    provider === 'Naver'
      ? `${process.env.NEXT_PUBLIC_OAUTH_NAVER_URL}?redirect_uri=${currentUrl}`
      : `${process.env.NEXT_PUBLIC_OAUTH_GOOGLE_URL}?redirect_uri=${currentUrl}`;

  return (
    <a href={oauthUrl} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none">
      <div className={`${provider === 'Naver' ? 'size-[22px]' : 'size-5'} mr-2`}>
        {provider === 'Naver' ? (
          <svg viewBox="-32 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#3aa678">
            <path fill="#03CB5C" d="M16 32C11.8333 32 8.125 33.5833 4.875 36.75C1.625 39.9167 0 43.6667 0 48V464C0 468.333 1.625 472.083 4.875 475.25C8.125 478.417 11.8333 480 16 480H432C436.167 480 439.875 478.417 443.125 475.25C446.375 472.083 448 468.333 448 464V48C448 43.6667 446.375 39.9167 443.125 36.75C439.875 33.5833 436.167 32 432 32H16ZM100.25 144H186.5L261.5 256V144H347.75V368H261.5L186.5 256V368H100.25V144Z"></path>
          </svg>
        ) : (          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" id="google">
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
          </svg>
        )}
      </div>
      <span className="pb-0.5">{provider}</span>
    </a>
  );
}
