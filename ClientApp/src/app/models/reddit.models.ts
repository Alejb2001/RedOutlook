export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selfText: string;
  selfTextHtml?: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  createdUtc: string;
  thumbnail: string;
  isRead: boolean;
  type: PostType;
  hasAttachment: boolean;
  domain?: string;
  flair?: string;
  isImportant: boolean;
}

export enum PostType {
  Text = 0,
  Link = 1,
  Image = 2,
  Video = 3,
  Gallery = 4
}

export interface SubredditInfo {
  name: string;
  displayName: string;
  icon: string;
  subscribers: number;
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  after?: string;
  before?: string;
  hasMore: boolean;
}
