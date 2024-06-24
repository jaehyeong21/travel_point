// src/hooks/useFetchDestination.ts
import {
  fetchDestination,
  fetchDestinationById,
  fetchFestival,
  fetchFestivalDetail,
  fetchNearby,
  fetchThemeDestinationByCat,
} from "@/services/fetch-destination";
import {
  fetchDestinationDetailProps,
  FetchDestinationProps,
  fetchNearbyProps,
  fetchThemeDestinationByCatProps,
} from "@/types/destination-fetch-props";
import {
  DestinationDetailType,
  DestinationResultType,
  DestinationType,
  FestivalDetailType,
  FestivalResultType,
} from "@/types/destination-types";
import { useQuery } from "@tanstack/react-query";

export function useFetchDestination({
  areaName,
  count,
  page,
  random
}: FetchDestinationProps) {
  return useQuery<DestinationResultType, Error>({
    queryKey: ["destinationData", { areaName, count, page, random }],
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
  random = 'false',
}: fetchThemeDestinationByCatProps) {
  return useQuery<DestinationResultType, Error>({
    queryKey: ["themedestinationData", { areaName, count, page, theme, random }],
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
  sort,
}: FetchDestinationProps) {
  return useQuery<FestivalResultType, Error>({
    queryKey: ["festivalData", { areaName, count, page, sort }],
    queryFn: ({ queryKey }) =>
      fetchFestival(queryKey[1] as FetchDestinationProps),
  });
}

export function useFetchFestivalbyId({
  contentId,
  contentTypeId,
}: fetchDestinationDetailProps) {
  return useQuery<FestivalDetailType, Error>({
    queryKey: ["festivalDetail", { contentId, contentTypeId }],
    queryFn: ({ queryKey }) =>
      fetchFestivalDetail(queryKey[1] as fetchDestinationDetailProps),
  });
}

export function useFetchNearby({ latitude, longitude, areaCode, count, contentId, random }: fetchNearbyProps) {
  return useQuery<DestinationType[], Error>({
    queryKey: [
      "nearbyData",
      { latitude, longitude, areaCode, count, contentId, random : true},
    ],
    queryFn: ({ queryKey }) => fetchNearby(queryKey[1] as fetchNearbyProps),
  });
}
