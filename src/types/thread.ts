export interface User {
  id: number;
  username: string;
  name: string;
  profile_picture: string | null;
}

export interface Thread {
  id: number;
  content: string;
  user: User;
  created_at: string;
  likes: number;
  replies: number;
  liked: boolean;
}

export interface LikeUpdatePayload {
  threadId: number;
  likeCount: number;
  liked?: boolean;
}
