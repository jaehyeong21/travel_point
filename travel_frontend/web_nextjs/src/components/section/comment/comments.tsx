'use client';

import { Comment } from '@/types/comment-type';
import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getReviewsByDestinationRateDesc, getReviewsByDestinationRateAsc } from '@/services/fetch-review';
import { useFilterStore } from '@/store/reviewStore';
import CommentItem from '@/components/section/comment/comment-item';

interface CommentsProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  fetchComments: () => Promise<void>;
  destinationId: string;
}

export default function Comments({ comments, setComments, fetchComments, destinationId }: CommentsProps) {
  const [visibleComments, setVisibleComments] = useState(2);
  const { filter, setFilter } = useFilterStore();

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  const fetchFilteredComments = async () => {
    switch (filter) {
    case 'latest':
      await fetchComments();
      break;
    case 'rate-desc':
      const descResponse = await getReviewsByDestinationRateDesc(Number(destinationId));
      setComments(descResponse.result);
      break;
    case 'rate-asc':
      const ascResponse = await getReviewsByDestinationRateAsc(Number(destinationId));
      setComments(ascResponse.result);
      break;
    case 'oldest':
      await fetchComments();
      setComments((prevComments) => [...prevComments].reverse());
      break;
    default:
      await fetchComments();
      break;
    }
  };

  useEffect(() => {
    fetchFilteredComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className='py-4'>
      <div className='flex justify-between'>
        <p className='pl-3 font-medium pb-1'>댓글 {comments.length}</p>
        <div className='flex space-x-1.5 text-xs '>
          <button onClick={() => setFilter('latest')} className={`px-2 py-1 ${filter === 'latest' ? 'font-bold' : ''}`}>최신순</button>
          <button onClick={() => setFilter('oldest')} className={`px-2 py-1 ${filter === 'oldest' ? 'font-bold' : ''}`}>오래된순</button>
          <button onClick={() => setFilter('rate-desc')} className={`px-2 py-1 ${filter === 'rate-desc' ? 'font-bold' : ''}`}>별점순</button>
          <button onClick={() => setFilter('rate-asc')} className={`px-2 py-1 ${filter === 'rate-asc' ? 'font-bold' : ''}`}>별점역순</button>
        </div>
      </div>
      <div className='border-t-2 flex flex-col'>
        <ul>
          {comments.slice(0, visibleComments).map((comment) => (
            <CommentItem key={comment.id} comment={comment} fetchComments={fetchComments} destinationId={destinationId} className='last:border-b' />
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
