export interface DestinationType {
  location: string;
  title: string;
  firstImage: string;
  destinationDescription: string;
  contentId: string;
  contentTypeId: string;
  areaCode: string;
}

export interface DestinationResultType {
  totalData: string;
  destinations: DestinationType[];
  totalPages: string;
  currentPage: string;
}

export interface DestinationDetailType extends DestinationType {
  destinationId: string;
  cat1: string;
  cat2: string;
  cat3: string;
  firstImage2: string;
  firstImage3: string;
  firstImage4: string;
  firstImage5: string;
  locationNumber: string;
  mapX: string;
  mapY: string;
  homepage: string;
  parking: string;
  use_time: string;
  tel: string;
}

export interface FestivalType extends DestinationType{  
  startDate: string;
  endDate: string;
}

export interface FestivalResultType {
  totalData: string;
  destinations: FestivalType[];
  totalPages: string;
  currentPage: string;
}

export interface FestivalDetailType {
  contentId: string;
  title: string;
  tel: string;
  areaCode: string;
  location: string;
  mapX: string;
  mapY: string;
  firstImage: string;
  homepage: string;
  introduction: string;
  startDate: string;
  endDate: string;
  useTime: string;
  charge: string;
  destinationDescription: string;
}