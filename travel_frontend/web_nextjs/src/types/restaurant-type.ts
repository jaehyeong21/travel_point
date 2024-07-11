export interface Restaurant {
  id: number;
  ranking: number;
  title: string;
  province: string;
  city: string;
  location: string;
  cat2: string;
  cat3: string;
  visitors: number;
  latitude?: number;
  longitude?: number;
  url?: string;
  phone?: string;
}