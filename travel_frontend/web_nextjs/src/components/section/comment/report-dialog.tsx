import React, { useState } from 'react';
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
import { PiSirenFill } from "react-icons/pi";
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { reportReview, ReportType } from '@/services/fetch-admin';
import { Comment } from '@/types/comment-type';
import { ToastAction } from '@/components/ui/toast';
import { useUserStore } from '@/store/userStore';

interface ReportDialogProps {
  comment: Comment;
}

export default function ReportDialog({ comment }: ReportDialogProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportType, setReportType] = useState<ReportType>(ReportType.SPAM);
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleReport = async () => {
    if (!user) {
      toast({
        title: '로그인이 필요합니다',
        description: '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
        action: <ToastAction altText="Goto auth page" onClick={() => { router.push('/auth'); }}>로그인 페이지 이동</ToastAction>
      });
      return;
    }
    try {
      if (!reportContent) {
        toast({ title: '신고 내용 작성 필요', description: '신고 내용을 작성해주세요.' });
        return;
      }

      await reportReview({
        reviewId: comment.id,
        content: reportContent,
        reportType,
      });

      toast({ title: '신고 완료', description: '신고가 성공적으로 접수되었습니다.' });
      setIsReportDialogOpen(false);
      setReportContent('');
      setReportType(ReportType.SPAM);
    } catch (error) {
      toast({ title: '신고 실패', description: '신고 처리 중 오류가 발생했습니다.' });
    }
  };

  return (
    <AlertDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
      <AlertDialogTrigger asChild>
        <button><PiSirenFill className='size-4 cursor-pointer' /></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>신고하기</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as unknown as ReportType)}
            className="p-2 border rounded"
          >
            <option value={ReportType.SPAM}>스팸</option>
            <option value={ReportType.INAPPROPRIATE_CONTENT}>부적절한 내용</option>
            <option value={ReportType.HARASSMENT}>괴롭힘</option>
            <option value={ReportType.HATE_SPEECH}>혐오 발언</option>
            <option value={ReportType.FALSE_INFORMATION}>허위 정보</option>
            <option value={ReportType.OFFENSIVE_LANGUAGE}>모욕적인 언어</option>
            <option value={ReportType.OTHER}>기타</option>
          </select>
          <textarea
            className="p-2 border rounded"
            placeholder="신고 내용을 작성해주세요"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600/80 hover:bg-red-600' onClick={handleReport}>신고하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
