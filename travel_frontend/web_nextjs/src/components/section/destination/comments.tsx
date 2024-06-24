'use client';
import CommentItem from '@/components/common/comment-item';
import { Comment } from '@/types/comment-type';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

interface CommentsProps {
  comments : Comment[];
  fetchComments: () => Promise<void>;
}

export default function Comments({ comments, fetchComments }: CommentsProps) {
  const [visibleComments, setVisibleComments] = useState(2);

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  return (
    <div className='py-4'>
      <p className='pl-3 font-medium pb-1'>댓글 {comments.length}</p>
      <div className='border-t-2 flex flex-col'>
        <ul>
          {comments.slice(0, visibleComments).map((comment) => (
            <CommentItem key={comment.id} comment={comment} fetchComments={fetchComments} className='last:border-b'/>
          ))}
        </ul>
        {comments.length > visibleComments && (
          <div className='border-t'>
            <p className='flex justify-center items-center py-3.5 cursor-pointer' onClick={showMoreComments}>
              댓글 더보기
              <Plus className='size-4 ml-2' />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
