// components/section/mypage/mypage-content.tsx
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { UserProfile } from '@/components/section/mypage/user-profile';
import MypageTabSection from '@/components/section/mypage/mypage-tab-section';



export default function MyPageContent() {
  return (
    <>
      {/* 유저 프로필 정보 */}
      <UserProfile  />
      {/* 유저 탭 섹션 */}
      <MypageTabSection />
      <Separator />
    </>
  );
}
