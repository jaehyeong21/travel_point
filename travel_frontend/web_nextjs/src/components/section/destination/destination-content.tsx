'use client';
import { useFetchDestinationById } from "@/hooks/use-fetch-destination";
import { useSearchParams } from "next/navigation";
import DestinationHeader from "@/components/section/destination/destination-header";
import DestinationBody from "@/components/section/destination/destination-body";
import { getCategoryName } from "@/libs/utils";

export default function DestinationContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const { data, isError, isLoading } = useFetchDestinationById({ contentId: slug });

  const title = searchParams.get('title');
  const location = searchParams.get('location');
  
  if (data) {
    const categoryNames = getCategoryName(data.cat1, data.cat2, data.cat3);
    data.cat2 = categoryNames.cat2 || data.cat2;
    data.cat3 = categoryNames.cat3 || data.cat3;
  }
  return (
    <>
      {isLoading ? (
        <>
          <DestinationHeader title={title || 'Loading...'} location={location || 'Loading...'} />
          <DestinationBody isLoading />
        </>
      ) : isError ? (
        <>
          <DestinationHeader title={title || 'Loading...'} location={location || 'Loading...'} />
          <DestinationBody isError />
        </>
      ) : (
        data && (
          <>
            <DestinationHeader title={data.title} location={data.location} tags={[data.cat2,data.cat3]}/>
            <DestinationBody data={data} />
          </>
        )
      )}
    </>
  );
}
