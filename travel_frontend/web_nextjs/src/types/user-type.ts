
export interface User {
  id: string;
  email: string;
  role?: string;
  userImgUrl?: string;
  username?: string;
  createDate?: string;
}

export interface AccessUserType {
  id: number;
  email: string;
  auth: string;
  userImgUrl: string;
  createDate: number;
  exp: number;
}