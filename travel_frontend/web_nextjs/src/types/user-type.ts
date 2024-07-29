export interface User {
  id: string;
  email: string;
  role?: string;
  userImgUrl?: string;
  username?: string;
  createDate?: string;
  provider?:string;
}

export interface AccessUserType {
  id: number;
  email: string;
  auth: string;
  userImgUrl: string;
  createDate: number;
  exp: number;
  sub?: string; //Oauth이메일
  provider?: string;
}
