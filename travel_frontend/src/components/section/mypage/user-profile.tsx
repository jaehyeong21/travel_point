import { Camera } from "lucide-react";
import Image from "next/image";
import EditCharacter from "./edit-character";

// 사용자 프로필 섹션을 렌더링하는 함수
export function UserProfile({ params }: { params: { slug: string } }) {
  return (
    <div className='flex flex-col justify-center items-center my-16'>
      <Image src={'/assets/image/characters/m1.png'} alt='character image' width={128} height={128} className='rounded-full border' />
      <div className='flex justify-center py-8 space-x-4'>
        <label className='border w-40 h-10 flex justify-center items-center space-x-2' htmlFor='inputImage'>
          <Camera className='size-6' strokeWidth={1} />
          <span>사진 변경하기</span>
          <input id='inputImage' type="file" className='hidden' />
        </label>
        <EditCharacter />
      </div>
      <div>조인환</div>
      <div>asdfsdf@naver.com</div>
    </div>
  );
}