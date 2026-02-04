import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RedditPost, RedditComment, SubredditInfo, PaginatedResponse } from '../models/reddit.models';

@Injectable({
  providedIn: 'root'
})
export class RedditService {
  private apiUrl = '/api/reddit';
  private selectedPostSubject = new BehaviorSubject<RedditPost | null>(null);
  private readPostsSubject = new BehaviorSubject<Set<string>>(new Set());
  private currentPaginationSubject = new BehaviorSubject<{ after?: string; before?: string }>({});

  selectedPost$ = this.selectedPostSubject.asObservable();
  readPosts$ = this.readPostsSubject.asObservable();
  currentPagination$ = this.currentPaginationSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadReadPosts();
  }

  getPosts(
    subreddit: string = 'all',
    limit: number = 25,
    after?: string,
    before?: string,
    sort: string = 'hot'
  ): Observable<PaginatedResponse<RedditPost>> {
    let params = new HttpParams()
      .set('subreddit', subreddit)
      .set('limit', limit.toString())
      .set('sort', sort);

    if (after) {
      params = params.set('after', after);
    }
    if (before) {
      params = params.set('before', before);
    }

    return this.http.get<PaginatedResponse<RedditPost>>(`${this.apiUrl}/posts`, { params })
      .pipe(
        map(response => {
          this.currentPaginationSubject.next({
            after: response.after,
            before: response.before
          });
          return response;
        })
      );
  }

  getPost(subreddit: string, postId: string): Observable<RedditPost> {
    return this.http.get<RedditPost>(`${this.apiUrl}/posts/${subreddit}/${postId}`);
  }

  getPopularSubreddits(limit: number = 15): Observable<SubredditInfo[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<SubredditInfo[]>(`${this.apiUrl}/subreddits/popular`, { params });
  }

  getComments(subreddit: string, postId: string, limit: number = 50, sort: string = 'best'): Observable<RedditComment[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('sort', sort);
    return this.http.get<RedditComment[]>(`${this.apiUrl}/posts/${subreddit}/${postId}/comments`, { params });
  }

  selectPost(post: RedditPost): void {
    this.markAsRead(post.id);
    this.selectedPostSubject.next(post);
  }

  clearSelectedPost(): void {
    this.selectedPostSubject.next(null);
  }

  markAsRead(postId: string): void {
    const readPosts = this.readPostsSubject.value;
    readPosts.add(postId);
    this.readPostsSubject.next(new Set(readPosts));
    this.saveReadPosts();
  }

  markAsUnread(postId: string): void {
    const readPosts = this.readPostsSubject.value;
    readPosts.delete(postId);
    this.readPostsSubject.next(new Set(readPosts));
    this.saveReadPosts();
  }

  isRead(postId: string): boolean {
    return this.readPostsSubject.value.has(postId);
  }

  private loadReadPosts(): void {
    try {
      const stored = localStorage.getItem('outlookReddit_readPosts');
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        // Mantener solo los últimos 500 posts leídos
        const trimmedIds = ids.slice(-500);
        this.readPostsSubject.next(new Set(trimmedIds));
      }
    } catch {
      this.readPostsSubject.next(new Set());
    }
  }

  private saveReadPosts(): void {
    const ids = Array.from(this.readPostsSubject.value).slice(-500);
    localStorage.setItem('outlookReddit_readPosts', JSON.stringify(ids));
  }
}
