// src/hooks/useFetchDestination.ts
import {
  fetchDestination,
  fetchDestinationById,
  fetchFestivals,
  fetchThemeDestinationByCat,
} from "@/services/fetch-destination";
import {
  fetchDestinationDetailProps,
  FetchDestinationProps,
  fetchThemeDestinationByCatProps,
} from "@/types/destination-fetch-props";
import {
  DestinationDetailType,
  DestinationType,
  FestivalType,
} from "@/types/destination-types";
import { useQuery } from "@tanstack/react-query";

export function useFetchDestination({
  areaName,
  count,
  page,
}: FetchDestinationProps) {
  return useQuery<DestinationType[], Error>({
    queryKey: ["destinationData", { areaName, count, page }],
    queryFn: ({ queryKey }) =>
      fetchDestination(queryKey[1] as FetchDestinationProps),
  });
}

export function useFetchDestinationById({
  contentId,
  contentTypeId,
}: fetchDestinationDetailProps) {
  return useQuery<DestinationDetailType, Error>({
    queryKey: ["destinationDetail", { contentId, contentTypeId }],
    queryFn: ({ queryKey }) =>
      fetchDestinationById(queryKey[1] as fetchDestinationDetailProps),
  });
}

export function useFetchThemeDestinationByCat({
  areaName,
  count,
  page,
  theme,
}: fetchThemeDestinationByCatProps) {
  return useQuery<DestinationType[], Error>({
    queryKey: ["themedestinationData", { areaName, count, page, theme }],
    queryFn: ({ queryKey }) =>
      fetchThemeDestinationByCat(
        queryKey[1] as fetchThemeDestinationByCatProps
      ),
  });
}

export function useFetchFestival({
  areaName,
  count,
  page,
  sort
}: FetchDestinationProps) {
  return useQuery<FestivalType[], Error>({
    queryKey: ["festivalData", { areaName, count, page, sort }],
    queryFn: ({ queryKey }) =>
      fetchFestivals(queryKey[1] as FetchDestinationProps),
  });
}
