export type PostType =
  | "donation"
  | "video"
  | "event"
  | "adoption"
  | "news"
  | "lottery"
  | "collaboration"
  | "update"
  | "other";

export type Channel = "tiktok" | "facebook" | "instagram";

export interface Post {
  id: string;
  team: string;
  title: string;
  type: PostType;
  datetime: string;
  time: string;
  owner?: string;
  channels: Channel[];
  notes?: string;
  copy?: string;
  materials?: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: Post[];
}

export interface WeekGroup {
  weekNumber: number;
  year: number;
  dateRange: string;
  posts: Post[];
}

// Form data types
export interface PostFormData {
  title: string;
  type: PostType;
  datetime: string;
  time: string;
  owner?: string;
  channels: Channel[];
  notes?: string;
  copy?: string;
  materials?: string;
}
