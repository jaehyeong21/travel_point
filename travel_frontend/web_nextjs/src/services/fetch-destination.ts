// src/services/fetch-destination.ts
import {
  fetchDestinationDetailProps,
  FetchDestinationProps,
  fetchThemeDestinationByCatProps,
  themeCategories,
} from "@/types/destination-fetch-props";
import {
  DestinationDetailType,
  DestinationType,
  FestivalType,
} from "@/types/destination-types";
import { fetchFromApi } from "@/services/fetch-api";

export async function fetchDestination({
  areaName,
  count = "10",
  page = "1",
}: FetchDestinationProps): Promise<DestinationType[]> {
  return fetchFromApi("/api/destination/location", { areaName, count, page });
}

export async function fetchDestinationById({
  contentId,
  contentTypeId = '12',
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
}: fetchThemeDestinationByCatProps): Promise<DestinationType[]> {
  const { cat1, cat2 } = themeCategories[theme];
  return fetchFromApi("/api/theme/type", { areaName, count, page, cat1, cat2 });
}

export async function fetchFestivals({
  areaName,
  count = "16",
  page = "1",
  sort,
}: FetchDestinationProps): Promise<FestivalType[]> {
  return fetchFromApi("/api/festival/location", { areaName, count, page, sort });
}
