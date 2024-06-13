export interface BlogPost {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

export interface BlogData {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: BlogPost[];
}