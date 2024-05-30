'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Sticker } from "lucide-react";
import Image from "next/image";

const CharacterIconData = [
  '/assets/image/characters/m1.png', '/assets/image/characters/m2.png', '/assets/image/characters/m3.png', '/assets/image/characters/m4.png', '/assets/image/characters/m5.png',
  '/assets/image/characters/w1.png', '/assets/image/characters/w2.png', '/assets/image/characters/w3.png', '/assets/image/characters/w4.png', '/assets/image/characters/w5.png',
];

export default function EditCharacter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleSaveChanges = () => {    
    if (selectedImage) {
      console.log("Updating profile image to:", selectedImage);
    
      setIsOpen(false);
    } else {
      alert("캐릭터를 선택해주세요.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
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
            <Image 
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
