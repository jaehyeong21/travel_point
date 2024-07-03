
import React from 'react';
import SocialLoginButton from '@/components/section/auth/social-login-button';

export default function OauthOptions() {
  return (
    <>
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-300" />
        <span className="flex-shrink mx-4 text-gray-500">또는 다음으로 계속</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SocialLoginButton provider="Google" />
        <SocialLoginButton provider="Naver" />
        {/* <SocialLoginButton provider="KaKao" /> */}
      </div>
    </>
  );
}
