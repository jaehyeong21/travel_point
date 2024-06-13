import CommentItem from '@/components/common/comment-item';
import { Plus } from 'lucide-react';
import React from 'react';

export default function Comments() {
  return (
    <div className='py-4'>
      <p className='pl-3 font-medium pb-1'>댓글 2</p>
      <div className='border-t-2 flex flex-col'>
        <ul>
          {[...Array(2)].map((item, i) => (
            <CommentItem key={i} className='' />
          ))}
        </ul>
        <div className='border-t'>
          <p className='flex justify-center items-center py-3.5'>
            댓글 더보기
            <Plus className='size-4 ml-2' />
          </p>
        </div>
      </div>
    </div>
  );
}
