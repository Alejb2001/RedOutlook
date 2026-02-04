import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedditPost, SubredditInfo } from '../models/reddit.models';

@Injectable({
  providedIn: 'root'
})
export class RedditService {
  private apiUrl = '/api/reddit';
  private selectedPostSubject = new BehaviorSubject<RedditPost | null>(null);
  private readPostsSubject = new BehaviorSubject<Set<string>>(new Set());

  selectedPost$ = this.selectedPostSubject.asObservable();
  readPosts$ = this.readPostsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadReadPosts();
  }

  getPosts(subreddit: string = 'all', limit: number = 25, after?: string): Observable<RedditPost[]> {
    let params = new HttpParams()
      .set('subreddit', subreddit)
      .set('limit', limit.toString());

    if (after) {
      params = params.set('after', after);
    }

    return this.http.get<RedditPost[]>(`${this.apiUrl}/posts`, { params });
  }

  getPost(subreddit: string, postId: string): Observable<RedditPost> {
    return this.http.get<RedditPost>(`${this.apiUrl}/posts/${subreddit}/${postId}`);
  }

  getPopularSubreddits(limit: number = 10): Observable<SubredditInfo[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<SubredditInfo[]>(`${this.apiUrl}/subreddits/popular`, { params });
  }

  selectPost(post: RedditPost): void {
    this.markAsRead(post.id);
    this.selectedPostSubject.next(post);
  }

  markAsRead(postId: string): void {
    const readPosts = this.readPostsSubject.value;
    readPosts.add(postId);
    this.readPostsSubject.next(readPosts);
    this.saveReadPosts();
  }

  isRead(postId: string): boolean {
    return this.readPostsSubject.value.has(postId);
  }

  private loadReadPosts(): void {
    const stored = localStorage.getItem('readPosts');
    if (stored) {
      const ids = JSON.parse(stored) as string[];
      this.readPostsSubject.next(new Set(ids));
    }
  }

  private saveReadPosts(): void {
    const ids = Array.from(this.readPostsSubject.value);
    localStorage.setItem('readPosts', JSON.stringify(ids));
  }
}
