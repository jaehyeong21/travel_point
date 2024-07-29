import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";

export const CommentGuidelines = () => (
  <p className="flex items-center text-[10px] sm:text-xs text-slate-600">댓글 작성 시 유의사항
    <Popover>
      <PopoverTrigger aria-label="댓글 작성 시 유의사항 보기">
        <CircleHelp className='size-3 sm:size-4 ml-1 sm:ml-2' />
      </PopoverTrigger>
      <PopoverContent className="text-xs">
        보다 건전한 인터넷 문화 정착과 커뮤니티 조성을 위해 이용정책에 어긋난 게시물은 삭제 및 작성 권한 제한 조치가 가해질 수 있습니다. 모두가 즐거운 문화 만들기에 동참해주세요!
      </PopoverContent>
    </Popover>
  </p>
);

export const ImageUploadGuidelines = () => (
  <p className='flex text-[10px] sm:text-xs items-center'>이미지 첨부 기준
    <Popover>
      <PopoverTrigger aria-label="이미지 첨부 기준 보기">
        <CircleHelp className='size-3 sm:size-4 ml-1 sm:ml-2' />
      </PopoverTrigger>
      <PopoverContent className="text-xs">
        댓글에도 이미지를 첨부할 수 있습니다. 댓글을 작성하시고, ‘이미지 첨부’ Button을 클릭하여 내 컴퓨터에 저장되어 있는 10MB 이하의 이미지 파일(.jpg, .jpeg, .gif, .png)을 찾아 첨부 해 주세요.
      </PopoverContent>
    </Popover>
  </p>
);
