/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogContent, Dialog } from "@/components/ui/dialog";
import { Sticker } from "lucide-react";
import { uploadImage } from "@/services/fetch-auth";
import { CharacterIconData } from "@/data/data";
import { useUserStore } from "@/store/userStore";
import { setCookie } from "@/libs/cookie";
import { useToast } from "@/components/ui/use-toast";

export default function EditCharacter() {
  const { user, updateUserImage } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleSaveChanges = async () => {
    if (selectedImage) {
      try {
        const responseData = await uploadImage(selectedImage);
        const accessToken = responseData.result.accessToken;

        if (responseData.response) {
          toast({
            title: "변경되었습니다.",
            description: "캐릭터 이미지가 성공적으로 변경되었습니다.",
          });
          if (user) {
            setCookie({ name: 'accessToken', value: accessToken, hours: 2, secure: true });
            updateUserImage(selectedImage);
          }
          setIsOpen(false);
        } else {
          toast({
            title: "오류 발생",
            description: responseData.message,
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "오류 발생",
          description: "이미지 업로드 중 오류가 발생했습니다.",
        });
      }
    } else {
      toast({
        title: "캐릭터 선택",
        description: "캐릭터를 선택해주세요.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='border w-40 h-10 flex justify-center items-center space-x-2'>
          <Sticker className='size-6' strokeWidth={1} />
          <span>캐릭터 변경</span>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[800px] w-[80%] sm:w-full">
        <DialogHeader>
          <DialogTitle>캐릭터 변경하기</DialogTitle>
          <DialogDescription>마음에 드는 캐릭터를 선택해보세요.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-3 py-4">
          {CharacterIconData.map((image, index) => (
            <img
              src={image}
              key={index}
              width={128}
              height={128}
              alt="character image icon"
              className={`cursor-pointer ${selectedImage === image ? 'border-2 rounded-full border-slate-600' : ''}`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant='destructive' className="font-semibold" onClick={() => setIsOpen(false)}>취소</Button>
          <Button type="button" className="font-semibold" onClick={handleSaveChanges}>변경</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
