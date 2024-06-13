import { REGIONS } from "@/data/data";

const regionNames = REGIONS.map((region) => region.name);
export type RegionName = typeof regionNames[number] | 'all';