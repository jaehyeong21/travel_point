/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { IoMdHeartEmpty, IoMdHeart, IoMdCreate } from "react-icons/io";
import { cn, maskEmail } from '@/libs/utils';
import StarRating from '@/components/common/star-rating';
import { getLiked, checkLiked } from '@/services/fetch-review';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Comment } from '@/types/comment-type';
import { placeholderImageBase64 } from '@/data/data';
import EditComment from '@/components/section/comment/edit-comment';
import ReportDialog from '@/components/section/comment/report-dialog';
import DeleteButton from '@/components/section/comment/delete-button';
import { ToastAction } from '@/components/ui/toast';

interface CommentItemProps {
  className?: string;
  comment: Comment;
  fetchComments: () => Promise<void>;
  destinationId: string;
}

export default function CommentItem({ className, comment, fetchComments, destinationId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editRating, setEditRating] = useState(comment.rate);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  useEffect(() => {
    const fetchIsLiked = async () => {
      try {
        const response = await checkLiked(comment.id);
        if (response) {
          setIsLiked(response.result);
        }
      } catch (error) {
        console.error('Failed to fetch liked status:', error);
      }
    };
    if (user) {
      fetchIsLiked();
    }
  }, [comment.id, user]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
        action: <ToastAction altText="Goto auth page" onClick={() => { router.push('/auth'); }}>로그인 페이지 이동</ToastAction>,
      });
      return;
    }
    try {
      const response = await getLiked(comment.id);
      if (response.result) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      toast({ title: '좋아요 실패', description: '좋아요 처리 중 오류가 발생했습니다.' });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <li className={`${cn('border-t relative list-none', className)}`}>
      <div className='absolute top-0 left-0'>
        <img src={comment.user.userImgUrl} alt='character image' width={46} height={46} className='rounded-full p-1'/>
      </div>
      <div className='w-full py-2 pl-[50px]'>
        <div className='flex justify-between'>
          <div className='flex flex-col sm:flex-row gap-x-3 gap-y-0.5 text-sm text-slate-600'>
            <span className='sm:pl-1 flex items-center'>
              <StarRating rating={comment.rate} />
            </span>
            <div className='flex sm:items-start gap-x-3'>
              <p className='text-xs'>{maskEmail(comment.memberEmail)}</p>
              <p className='text-xs hidden xsm:flex'>
                <span className='text-[11px] mr-2'>|</span> {new Date(comment.modifyDate).toLocaleDateString()}
              </p>
            </div>
            <p className='text-xs flex xsm:hidden'>{new Date(comment.modifyDate).toLocaleDateString()}</p>
          </div>
          <div className='flex gap-2 sm:gap-3 pr-1.5'>
            {user && user.email !== comment.memberEmail && (
              <ReportDialog comment={comment} />
            )}
            <span className='flex items-start' onClick={handleLike}>
              {isLiked ? (
                <IoMdHeart className='size-4 cursor-pointer text-red-600' />
              ) : (
                <IoMdHeartEmpty className='size-4 cursor-pointer' />
              )}
              <span className='text-xs mx-1'>({likeCount})</span>
            </span>
            {user && user.email === comment.memberEmail && (
              <>
                <IoMdCreate className='size-4 cursor-pointer' onClick={handleEditToggle} />
                <DeleteButton comment={comment} fetchComments={fetchComments} />
              </>
            )}
          </div>
        </div>
        <div className='pt-2.5'>
          {isEditing ? (
            <EditComment
              comment={comment}
              editContent={editContent}
              setEditContent={setEditContent}
              editRating={editRating}
              setEditRating={setEditRating}
              editImage={editImage}
              setEditImage={setEditImage}
              fetchComments={fetchComments}
              setIsEditing={setIsEditing}
            />
          ) : (
            <>
              <p className='text-sm'>{comment.content}</p>
              {comment.imageUrl && (
                <div className='py-2'>
                  <img
                    width={420}
                    height={260}
                    src={comment.imageUrl}
                    alt='댓글 이미지'
                    className='max-h-[260px]'
                    onError={(e) => (e.currentTarget.src = placeholderImageBase64)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
}
