interface CategoryDetails {
  [key: string]: string;
}

interface SubCategory {
  name: string;
  details: CategoryDetails;
}

interface Category {
  name: string;
  subCategories: {
    [key: string]: SubCategory;
  };
}

export interface CategoryMapping {
  [key: string]: Category;
}

export interface CategoryName {
  // cat1?: string;
  cat2?: string;
  cat3?: string;
}