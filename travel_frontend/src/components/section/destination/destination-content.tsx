'use client';
import { useFetchDestinationById } from "@/hooks/use-fetch-destination";
import { useSearchParams } from "next/navigation";
import DestinationHeader from "./destination-header";
import DestinationBody from "./destination-body";

export default function DestinationContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const { data, isError, isLoading } = useFetchDestinationById({ contentId: slug });

  const title = searchParams.get('title');
  const location = searchParams.get('location');
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
            <DestinationHeader title={data.title} location={data.location} />
            <DestinationBody data={data} />
          </>
        )
      )}
    </>
  );
}
