import { DestinationDetailType } from "@/types/destination-types";
import { User } from "@/types/user-type";

export interface Comment {
  id: number;
  content: string;
  rate: number;
  destinationId: number;
  imageUrl: string;
  memberEmail: string;
  likeCount: number;
  modifyDate: string;
  createDate: string;
  user: User;
  destination: DestinationDetailType;
}

export interface MyReviewType {
  id: number;
  content: string;
  createDate: string;
  imageUrl: string;
  likeCount: number;
  rate: number;
  destination: DestinationDetailType
  member: User
}