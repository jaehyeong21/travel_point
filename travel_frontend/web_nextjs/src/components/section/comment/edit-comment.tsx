/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { uploadImageToCF } from '@/services/img-upload-to-cf';
import { modifyReview } from '@/services/fetch-review';
import { useToast } from '@/components/ui/use-toast';
import { Comment } from '@/types/comment-type';

interface EditCommentProps {
  comment: Comment;
  editContent: string;
  setEditContent: (content: string) => void;
  editRating: number;
  setEditRating: (rating: number) => void;
  editImage: File | null;
  setEditImage: (file: File | null) => void;
  fetchComments: () => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export default function EditComment({
  comment,
  editContent,
  setEditContent,
  editRating,
  setEditRating,
  editImage,
  setEditImage,
  fetchComments,
  setIsEditing,
}: EditCommentProps) {
  const { toast } = useToast();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleEdit = async () => {
    try {
      const reviewData: Record<string, any> = {
        content: editContent,
        rate: editRating,
      };

      if (editImage) {
        const imageUrl = await uploadImageToCF(editImage, 'reviewPhoto');
        if (imageUrl) {
          reviewData.imageUrl = imageUrl;
        } else {
          toast({ title: '이미지 업로드 실패', description: '이미지 업로드 중 오류가 발생했습니다.' });
          return;
        }
      } else {
        reviewData.imageUrl = comment.imageUrl;
      }

      await modifyReview(comment.id, reviewData);
      toast({ title: '리뷰 수정 완료', description: '리뷰가 성공적으로 수정되었습니다.' });
      setIsEditing(false);
      await fetchComments();
    } catch (error) {
      toast({ title: '리뷰 수정 실패', description: '리뷰 수정 중 오류가 발생했습니다.' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEditImage(file);
    }
  };

  return (
    <div>
      <textarea
        ref={textAreaRef}
        className='w-full border p-2 rounded-sm text-sm'
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        style={{ overflow: 'hidden' }}
      />
      <div className='flex items-center'>
        {[...Array(5)].map((_, index) => (
          <span key={index} onClick={() => setEditRating(index + 1)} className='cursor-pointer'>
            {index + 1 <= editRating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-300" />}
          </span>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {comment.imageUrl && !editImage && (
        <div className='py-2'>
          <img
            width={420}
            height={260}
            src={comment.imageUrl}
            alt='댓글 이미지'
            className='max-h-[260px]'
          />
        </div>
      )}
      <button onClick={handleEdit} className='bg-blue-500 text-white px-4 py-2 mt-2 rounded text-sm'>
        수정 완료
      </button>
      <button onClick={() => setIsEditing(false)} className='bg-gray-500 text-white px-4 py-2 mt-2 ml-2 rounded text-sm'>
        취소
      </button>
    </div>
  );
}
