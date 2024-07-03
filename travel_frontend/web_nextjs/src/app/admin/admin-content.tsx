/* eslint-disable @next/next/no-img-element */
'use client';
import { checkReports } from "@/services/fetch-admin";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Report {
  id: number;
  content: string;
  createDate: string;
  reportType: string;
  member: {
    id: number;
    email: string;
    username: string | null;
    userImgUrl: string;
  };
  review: {
    id: number;
    content: string;
    createDate: string;
    modifyDate: string;
    likeCount: number;
    imageUrl: string;
    rate: number;
    destination: {
      destinationId: number;
      location: string;
    };
  };
}

export function AdminContent() {
  const user = useUserStore((state) => state.user);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await checkReports();
        console.log(response);
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
  }, []);

  // if (user?.role !== "ADMIN") {
  //   router.push('/');
  // }

  return (
    <section>
      <div className='flex flex-col justify-center items-center my-8 sm:my-14'>
        {user && user.userImgUrl ? (
          <img src={user.userImgUrl} alt={`${user.username}'s profile`} className="rounded-full w-24 h-24" />
        ) : (
          <img src={'/assets/image/characters/anonymous.png'} alt='character image' width={128} height={128} className='rounded-full border' />
        )}        
        <div>{user && user.username}</div>
        <div>{user && user.email}</div>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : reports.length > 0 ? (
          <ul>
            {reports.map((report) => (
              <li key={report.id} className="border p-4 mb-2">
                <h3 className="font-semibold">Reason: {report.reportType}</h3>
                <p>Details: {report.content}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Review:</h4>
                  <p>{report.review.content}</p>
                  {report.review.imageUrl && (
                    <img src={report.review.imageUrl} alt="Review image" className="mt-2" />
                  )}
                  <p>Location: {report.review.destination.location}</p>
                  <p>Rate: {report.review.rate}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports found</p>
        )}
      </div>
    </section>
  );
}
