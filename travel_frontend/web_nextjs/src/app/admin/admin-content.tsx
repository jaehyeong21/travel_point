/* eslint-disable @next/next/no-img-element */
'use client';
import { Separator } from "@/components/ui/separator";
import { placeholderImageBase64 } from "@/data/data";
import { checkReports, deleteReport } from "@/services/fetch-admin";
import { deleteReview } from "@/services/fetch-review";
import { useUserStore } from "@/store/userStore";
import { Comment } from "@/types/comment-type";
import { User } from "@/types/user-type";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";

interface ReportType {
  id: number;
  content: string;
  createDate: string;
  reportType: string;
  member: User;
  review: Comment;
}

export function AdminContent() {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const delayedCheck = setTimeout(() => {      
      if (!user || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN')) {
        router.push('/');
      } else {
        const fetchReports = async () => {
          try {
            const response = await checkReports();
            if (response.response) {
              setReports(response.result);
            } else {
              setError(response.message || 'Failed to fetch reports');
            }
          } catch (error) {
            setError('Failed to fetch reports');
          } finally {
            setLoading(false);
          }
        };

        fetchReports();
      }
    }, 100);

    return () => clearTimeout(delayedCheck);
  }, [router, user]);

  const deleteWithReview = async (id: number) => {
    try {
      const res = await deleteReview(id);
      console.log(res);
      if (res) {
        setReports(reports.filter(report => report.review.id !== id));
      } else {
        console.log('삭제 실패');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const deleteOnlyReport = async (id: number) => {
    try {
      const res = await deleteReport(id);
      if (res) {
        setReports(reports.filter(report => report.id !== id));
      } else {
        console.log('리포트 삭제 실패');
      }
    } catch (error) {
      console.error('Failed to pass report:', error);
    }
  };

  // 로딩 상태 처리
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <div className='flex flex-col justify-center items-center my-8 sm:my-14 space-y-4'>
        {user && user.userImgUrl ? (
          <img src={user.userImgUrl} alt={`${user.username}'s profile`} className="rounded-full w-24 h-24" />
        ) : (
          <img src={'/assets/image/characters/anonymous.png'} alt='character image' width={128} height={128} className='rounded-full border' />
        )}
        <div>{user && user.username}</div>
        <div>{user && user.email}</div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {error ? (
          <p>Error: {error}</p>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            (
              <div key={report.id} className="border p-4">
                <h3 className="font-semibold">신고 유형: {report.reportType}</h3>
                <p className="text-sm">신고 내용: {report.content}</p>
                <Separator className="my-2" />
                <section>
                  <Link href={`/destinations/${report.review.destination.contentId}`}>
                    <span className="font-semibold">여행지: </span>{report.review.destination.title}
                  </Link>
                  <div className="mt-2 space-y-1.5">
                    <div className='flex items-center'>
                      {[...Array(5)].map((_, index) => (
                        index < report.review.rate
                          ? <FaStar key={index} className="text-yellow-500" />
                          : <FaRegStar key={index} className="text-gray-300" />
                      ))}
                    </div>
                    <p className="text-sm">{report.review.content}</p>
                    {report.review.imageUrl && (
                      <img
                        width={420}
                        height={260}
                        src={report.review.imageUrl}
                        alt='댓글 이미지'
                        className='max-h-[260px]'
                        onError={(e) => (e.currentTarget.src = placeholderImageBase64)}
                      />
                    )}
                  </div>
                </section>
                <div className="mt-4 flex justify-end text-sm font-medium">
                  <div className="flex gap-x-2">
                    <button
                      onClick={() => deleteOnlyReport(report.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      신고만 삭제
                    </button>
                    <button
                      onClick={() => deleteWithReview(report.review.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      신고와 리뷰를 함께 삭제
                    </button>
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          <p>No reports found</p>
        )}
      </div>
    </section>
  );
}
