'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Camera } from "lucide-react";
import { LiaSpinnerSolid } from "react-icons/lia";
import EditCharacter from "@/components/section/mypage/edit-character";
import { useUserStore } from "@/store/userStore";
import { setCookie } from "@/libs/cookie";
import { useToast } from "@/components/ui/use-toast";
import { uploadImage } from "@/services/fetch-auth";
import { uploadImageToCF } from "@/services/img-upload-to-cf";

export function UserProfile() {  
  const { user, updateUserImage } = useUserStore();
  const [loading, setLoading] = useState(false);  
  const { toast } = useToast();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    const VARIANT = 'profile';
    try {
      const imageUrl = await uploadImageToCF(files[0], VARIANT);
      if (imageUrl) {
        const responseData = await uploadImage(imageUrl);
        if (responseData.response) {
          const accessToken = responseData.result.accessToken;
          if (user) {
            updateUserImage(imageUrl);            
            setCookie({ name: 'accessToken', value: accessToken, hours: 2, secure: true });
          }
          event.target.value = '';
          toast({
            title: "성공",
            description: "프로필 이미지가 성공적으로 변경되었습니다.",
          });
        } else {
          toast({
            title: "오류",
            description: responseData.message,
          });
        }
      } else {
        toast({
          title: "오류",
          description: "이미지 업로드에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: "오류",
        description: "이미지 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center my-8 sm:my-14'>
      {user && user.userImgUrl ? (
        <img src={user.userImgUrl} alt={`${user.username}'s profile`} className="rounded-full w-24 h-24" />
      ) : (
        <img src={'/assets/image/characters/anonymous.png'} alt='character image' width={128} height={128} className='rounded-full border' />
      )}

      <div className='flex justify-center py-8 space-x-4'>
        <label className='border w-40 h-10 flex justify-center items-center space-x-2' htmlFor='inputImage'>
          {loading ? (
            <div className="flex items-center">
              <LiaSpinnerSolid className="animate-spin-slow size-5 mr-1.5 text-slate-500" />
              <span className="text-[10px]">Loading...</span>
            </div>
          ) : (
            <>
              <Camera className='size-6' strokeWidth={1} />
              <span>사진 변경하기</span>
              <input id='inputImage' type="file" className='hidden' onChange={handleImageChange} />
            </>
          )}
        </label>
        <EditCharacter />
      </div>
      <div>{user && user.username}</div>
      <div>{user && user.email}</div>
    </div>
  );
}
