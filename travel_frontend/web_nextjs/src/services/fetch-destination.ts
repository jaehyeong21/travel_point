// src/services/fetch-destination.ts
import {
  fetchDestinationDetailProps,
  FetchDestinationProps,
  fetchNearbyProps,
  fetchThemeDestinationByCatProps,
  themeCategories,
} from "@/types/destination-fetch-props";
import {
  DestinationDetailType,
  DestinationResultType,
  DestinationType,
  FestivalDetailType,
  FestivalResultType,
} from "@/types/destination-types";
import { fetchFromApi } from "@/services/fetch-api";

export async function fetchDestination({
  areaName,
  count = "10",
  page = "1",
}: FetchDestinationProps): Promise<DestinationResultType> {
  return fetchFromApi("/api/destination/location", { areaName, count, page });
}

export async function fetchDestinationById({
  contentId,
  contentTypeId,
}: fetchDestinationDetailProps): Promise<DestinationDetailType> {
  return fetchFromApi(`/api/destination/contentId`, {
    contentId,
    contentTypeId,
  });
}

export async function fetchThemeDestinationByCat({
  areaName,
  count = "8",
  page = "1",
  theme,
  random = 'false'
}: fetchThemeDestinationByCatProps): Promise<DestinationResultType> {
  const { cat1, cat2 } = themeCategories[theme];
  
  return fetchFromApi("/api/type", { areaName, count, page, cat1, cat2, random });
}

export async function fetchFestival({
  areaName,
  count = "16",
  page = "1",
  sort,
}: FetchDestinationProps): Promise<FestivalResultType> {
  return fetchFromApi("/api/festival/location", {
    areaName,
    count,
    page,
    sort,
  });
}

export async function fetchFestivalDetail({
  contentId,
  contentTypeId = "15",
}: fetchDestinationDetailProps): Promise<FestivalDetailType> {
  return fetchFromApi("/api/festival/contentId", {
    contentId,
    contentTypeId,
  });
}

export async function fetchNearby({
  latitude,
  longitude,
  areaCode,
  count = "4",
  contentId,
}: fetchNearbyProps): Promise<DestinationType[]> {
  return fetchFromApi("/api/destination/nearby", {
    latitude,
    longitude,
    areaCode,
    count,
    contentId,
  });
}
