
export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
}

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  status: string;
  created_at: string;
  follower?: User;
  following?: User;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: User;
}
