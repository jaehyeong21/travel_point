import { DestinationDetailType } from "@/types/destination-types";
import { User } from "@/types/user-type";

export interface Comment {
  id: number;
  content: string;
  rate: number;
  destinationId: number;
  imageUrl: string;
  memberEmail: string;
  reviewCount: number;
  modifyDate: string;
  user: User;
  createDate: string;
  destination: DestinationDetailType;
}