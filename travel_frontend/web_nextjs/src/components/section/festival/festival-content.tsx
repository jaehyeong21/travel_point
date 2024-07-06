'use client';
import { useFetchFestivalbyId } from "@/hooks/use-fetch-destination";
import { useSearchParams } from "next/navigation";
import DestinationHeader from "@/components/section/destination/destination-header";
import FestivalBody from "@/components/section/festival/festival-body";

export default function FestivalContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const { data, isError, isLoading } = useFetchFestivalbyId({ contentId: slug });

  const title = searchParams.get('title');
  const location = searchParams.get('location');
  
  return (
    <>
      {isLoading ? (
        <>
          <DestinationHeader title={title || 'Loading...'} location={location || 'Loading...'} />
          <FestivalBody isLoading />
        </>
      ) : isError ? (
        <>
          <DestinationHeader title={title || 'Loading...'} location={location || 'Loading...'} />
          <FestivalBody isError />
        </>
      ) : (
        data && (
          <>
            <DestinationHeader title={data.title} location={data.location} isFestival/>
            <FestivalBody data={data} />
          </>
        )
      )}
    </>
  );
}
