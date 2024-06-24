/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { IoMdHeartEmpty, IoMdTrash, IoMdCreate } from "react-icons/io";
import { PiSirenFill } from "react-icons/pi";
import { cn } from '@/libs/utils';
import StarRating from '@/components/common/star-rating';
import { modifyReview, deleteReview } from '@/services/fetch-review';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/userStore';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FaRegStar, FaStar } from 'react-icons/fa6';
import { uploadImageToCF } from '@/services/img-upload-to-cf';
import { Comment } from '@/types/comment-type';

interface CommentItemProps {
  className?: string;
  comment: Comment;
  fetchComments: () => Promise<void>;
}

export default function CommentItem({ className, comment, fetchComments }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editRating, setEditRating] = useState(comment.rate);
  const [editImage, setEditImage] = useState<File | null>(null);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
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

  const handleDelete = async () => {
    try {
      await deleteReview(comment.id);
      toast({ title: '리뷰 삭제 완료', description: '리뷰가 성공적으로 삭제되었습니다.' });
      await fetchComments();
    } catch (error) {
      toast({ title: '리뷰 삭제 실패', description: '리뷰 삭제 중 오류가 발생했습니다.' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setEditImage(file);
    }
  };

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  return (
    <li className={`${cn('border-t relative list-none', className)}`}>
      <div className='absolute top-0 left-0'>
        <img src={comment.user.userImgUrl} alt='character image' width={46} height={46} />
      </div>
      <div className='w-full py-2 pl-[50px]'>
        <div className='flex justify-between'>
          <div className='flex flex-col sm:flex-row gap-x-3 gap-y-0.5 text-sm text-slate-600'>
            <span className='sm:pl-1 flex items-center'>
              <StarRating rating={comment.rate} />
            </span>
            <div className='flex sm:items-start gap-x-3'>
              <p className='text-xs'>{comment.memberEmail}</p>
              <p className='text-xs hidden xsm:flex'>{comment.modifyDate.slice(0,10)}</p>
            </div>
            <p className='text-xs flex xsm:hidden'>{comment.modifyDate.slice(0,10)}</p>
          </div>
          <div className='flex gap-2 sm:gap-3 pr-1.5'>
            <PiSirenFill className='size-4 cursor-pointer' />
            <span className='flex items-start'>
              <IoMdHeartEmpty className='size-4 cursor-pointer' />
              <span className='text-xs mx-1'>({0})</span>
            </span>
            {user && user.email === comment.memberEmail && (
              <>
                <IoMdCreate className='size-4 cursor-pointer' onClick={handleEditToggle} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className='flex '><IoMdTrash className='size-4 cursor-pointer' /></button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 삭제를 하겠습니까?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>아니오</AlertDialogCancel>
                      <AlertDialogAction className='bg-red-600/80 hover:bg-red-600' onClick={handleDelete}>예</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
        <div className='pt-2.5'>
          {isEditing ? (
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
                  <img width={420} height={260} src={comment.imageUrl} alt='댓글 이미지' className='max-h-[260px]' />
                </div>
              )}
              <button onClick={handleEdit} className='bg-blue-500 text-white px-4 py-2 mt-2 rounded text-sm'>
                수정 완료
              </button>
              <button onClick={handleEditToggle} className='bg-gray-500 text-white px-4 py-2 mt-2 ml-2 rounded text-sm'>
                취소
              </button>
            </div>
          ) : (
            <>
              <p className='text-sm'>{comment.content}</p>
              {comment.imageUrl && (
                <div className='py-2'>
                  <img width={420} height={260} src={comment.imageUrl} alt='댓글 이미지' className='max-h-[260px]' />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
}
