export const themeCategories = {
  '역사': { cat1: "A02", cat2: "A0201" },
  '힐링': { cat1: "A02", cat2: "A0202" },
  '자연': { cat1: "A01", cat2: "A0101" },
  '체험': { cat1: "A02", cat2: "A0203" },
  '엑티비티': { cat1: "A03", cat2: "A0303" },
  all: { cat1: "", cat2: "" },
};

export interface FetchDestinationProps {
  areaName?: string;
  count?: string;
  page?: string;
  sort?: string;
}

export interface fetchThemeDestinationByCatProps {
  areaName?: string;
  count: string;
  page: string;
  theme: keyof typeof themeCategories;
}

export interface fetchDestinationDetailProps{
  contentId: string;
  contentTypeId?: string
}

