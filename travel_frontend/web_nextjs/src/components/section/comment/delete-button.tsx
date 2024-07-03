import React from 'react';
import { IoMdTrash } from "react-icons/io";
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
import { useToast } from '@/components/ui/use-toast';
import { deleteReview } from '@/services/fetch-review';
import { Comment } from '@/types/comment-type';

interface DeleteButtonProps {
  comment: Comment;
  fetchComments: () => Promise<void>;
}

export default function DeleteButton({ comment, fetchComments }: DeleteButtonProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteReview(comment.id);
      toast({ title: '리뷰 삭제 완료', description: '리뷰가 성공적으로 삭제되었습니다.' });
      await fetchComments();
    } catch (error) {
      toast({ title: '리뷰 삭제 실패', description: '리뷰 삭제 중 오류가 발생했습니다.' });
    }
  };

  return (
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
  );
}
