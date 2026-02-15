export interface Category {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface News {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  category_id: number;
  author_id: number;
  created_at?: Date;
}

export interface Comment {
  id: number;
  text: string;
  news_id: number;
  user_id: number;
  username: string;
  created_at?: Date;
}   