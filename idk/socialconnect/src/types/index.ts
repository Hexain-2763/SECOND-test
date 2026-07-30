export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  likedPosts: string[];
  createdAt: Date;
}

export interface IPost {
  _id: string;
  author: IUser;
  content: string;
  image?: string;
  likes: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  post: string;
  author: IUser;
  content: string;
  createdAt: Date;
}
