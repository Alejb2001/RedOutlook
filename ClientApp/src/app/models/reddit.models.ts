export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selfText: string;
  url: string;
  permalink: string;
  score: number;
  numComments: number;
  createdUtc: string;
  thumbnail: string;
  isRead: boolean;
}

export interface SubredditInfo {
  name: string;
  displayName: string;
  icon: string;
  subscribers: number;
}
